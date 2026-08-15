const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const { getConfig, updateConfig } = require("../store");

// Verrouille les salons. Si cfg.lockdownRoleIds est vide, bloque @everyone
// (comportement par défaut). Sinon, ne bloque que les rôles choisis.
// Les rôles en liste blanche gardent explicitement le droit d'écrire.
// Retourne { locked, errors } pour que l'appelant sache si ça a vraiment marché.
async function lockAllChannels(guild, cfg = {}) {
  const targetRoleIds = cfg.lockdownRoleIds && cfg.lockdownRoleIds.length ? cfg.lockdownRoleIds : [guild.roles.everyone.id];
  const whitelistRoleIds = cfg.whitelistRoleIds || [];

  const channels = guild.channels.cache.filter((c) => c.type === ChannelType.GuildText);
  let locked = 0;
  const errors = [];
  for (const [, channel] of channels) {
    try {
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
  return { locked, errors };
}

async function unlockAllChannels(guild, cfg = {}) {
  const targetRoleIds = cfg.lockdownRoleIds && cfg.lockdownRoleIds.length ? cfg.lockdownRoleIds : [guild.roles.everyone.id];
  const whitelistRoleIds = cfg.whitelistRoleIds || [];

  const channels = guild.channels.cache.filter((c) => c.type === ChannelType.GuildText);
  let unlocked = 0;
  const errors = [];
  for (const [, channel] of channels) {
    try {
      for (const roleId of targetRoleIds) {
        await channel.permissionOverwrites.edit(roleId, { SendMessages: null });
      }
      for (const roleId of whitelistRoleIds) {
        await channel.permissionOverwrites.edit(roleId, { SendMessages: null });
      }
      unlocked++;
    } catch (err) {
      errors.push(`#${channel.name} : ${err.message}`);
    }
  }
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
    await interaction.editReply(`🔒 ${locked} salon(s) verrouillé(s) pour : ${targetLabel}.${warn}`);
  },

  lockAllChannels,
  unlockAllChannels,
};
