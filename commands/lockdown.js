const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const { getConfig, updateConfig } = require("../store");

// Lit l'état actuel du bit "SendMessages" pour un rôle sur un salon, AVANT
// toute modification. Permet de restaurer exactement ce qu'il y avait avant
// le verrouillage, plutôt que de remettre "neutre" par défaut.
function getSendMessagesState(channel, roleId) {
  const overwrite = channel.permissionOverwrites.cache.get(roleId);
  if (!overwrite) return "neutral";
  if (overwrite.allow.has(PermissionFlagsBits.SendMessages)) return "allow";
  if (overwrite.deny.has(PermissionFlagsBits.SendMessages)) return "deny";
  return "neutral";
}

function stateToValue(state) {
  if (state === "allow") return true;
  if (state === "deny") return false;
  return null;
}

// Verrouille les salons et sauvegarde un instantané de l'état précédent de
// chaque salon/rôle (dans la config, donc persistant même après redéploiement)
// pour pouvoir tout restaurer fidèlement avec unlockAllChannels.
async function lockAllChannels(guild, cfg = {}) {
  const targetRoleIds = cfg.lockdownRoleIds && cfg.lockdownRoleIds.length ? cfg.lockdownRoleIds : [guild.roles.everyone.id];
  const whitelistRoleIds = cfg.whitelistRoleIds || [];
  const allRoleIds = [...new Set([...targetRoleIds, ...whitelistRoleIds])];

  const channels = guild.channels.cache.filter((c) => c.type === ChannelType.GuildText);
  const snapshot = {};
  let locked = 0;
  const errors = [];

  for (const [, channel] of channels) {
    try {
      snapshot[channel.id] = {};
      for (const roleId of allRoleIds) {
        snapshot[channel.id][roleId] = getSendMessagesState(channel, roleId);
      }
      for (const roleId of targetRoleIds) {
        await channel.permissionOverwrites.edit(roleId, { SendMessages: false });
      }
      for (const roleId of whitelistRoleIds) {
        await channel.permissionOverwrites.edit(roleId, { SendMessages: true });
      }
      locked++;
    } catch (err) {
      errors.push(`#${channel.name} : ${err.message}`);
    }
  }

  if (locked > 0) {
    updateConfig(guild.id, { lockdownSnapshot: snapshot });
  }

  return { locked, errors };
}

// Restaure l'état exact d'avant le verrouillage (sauvegardé dans
// cfg.lockdownSnapshot). Si aucun instantané n'existe (ex: verrouillage fait
// avant cette mise à jour du bot), retombe sur un simple retrait du blocage.
async function unlockAllChannels(guild, cfg = {}) {
  const snapshot = cfg.lockdownSnapshot || null;
  const targetRoleIds = cfg.lockdownRoleIds && cfg.lockdownRoleIds.length ? cfg.lockdownRoleIds : [guild.roles.everyone.id];
  const whitelistRoleIds = cfg.whitelistRoleIds || [];
  const allRoleIds = [...new Set([...targetRoleIds, ...whitelistRoleIds])];

  const channels = guild.channels.cache.filter((c) => c.type === ChannelType.GuildText);
  let unlocked = 0;
  const errors = [];

  for (const [, channel] of channels) {
    try {
      const channelSnapshot = snapshot ? snapshot[channel.id] : null;
      for (const roleId of allRoleIds) {
        const state = channelSnapshot && channelSnapshot[roleId] !== undefined ? channelSnapshot[roleId] : "neutral";
        await channel.permissionOverwrites.edit(roleId, { SendMessages: stateToValue(state) });
      }
      unlocked++;
    } catch (err) {
      errors.push(`#${channel.name} : ${err.message}`);
    }
  }

  updateConfig(guild.id, { lockdownSnapshot: null });
  return { unlocked, errors };
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lockdown")
    .setDescription("Verrouille manuellement les salons textuels selon la configuration anti-raid")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const cfg = getConfig(interaction.guildId);
    const { locked, errors } = await lockAllChannels(interaction.guild, cfg);

    if (locked === 0) {
      const detail = errors.length ? `\nErreur : ${errors[0]}` : "";
      return interaction.editReply(
        `❌ Aucun salon n'a pu être verrouillé. Vérifie que le bot a bien la permission **Gérer les rôles** sur ce serveur.${detail}`
      );
    }

    updateConfig(interaction.guildId, { lockedDown: true });
    const targetLabel = cfg.lockdownRoleIds && cfg.lockdownRoleIds.length
      ? cfg.lockdownRoleIds.map((r) => `<@&${r}>`).join(", ")
      : "@everyone";
    const warn = errors.length ? `\n⚠️ ${errors.length} salon(s) n'ont pas pu être verrouillés.` : "";
    await interaction.editReply(`🔒 ${locked} salon(s) verrouillé(s) pour : ${targetLabel}. L'état précédent a été sauvegardé pour restauration.${warn}`);
  },

  lockAllChannels,
  unlockAllChannels,
};
