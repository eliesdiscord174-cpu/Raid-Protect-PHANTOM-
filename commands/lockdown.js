const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const { getConfig, updateConfig } = require("../store");

// Verrouille les salons. Si cfg.lockdownRoleIds est vide, bloque @everyone
// (comportement par défaut). Sinon, ne bloque que les rôles choisis.
// Dans tous les cas, les rôles en liste blanche (cfg.whitelistRoleIds) gardent
// explicitement le droit d'écrire, même si @everyone ou leur rôle est bloqué.
async function lockAllChannels(guild, cfg = {}) {
  const targetRoleIds = cfg.lockdownRoleIds && cfg.lockdownRoleIds.length ? cfg.lockdownRoleIds : [guild.roles.everyone.id];
  const whitelistRoleIds = cfg.whitelistRoleIds || [];

  const channels = guild.channels.cache.filter((c) => c.type === ChannelType.GuildText);
  let locked = 0;
  for (const [, channel] of channels) {
    try {
      for (const roleId of targetRoleIds) {
        await channel.permissionOverwrites.edit(roleId, { SendMessages: false });
      }
      for (const roleId of whitelistRoleIds) {
        await channel.permissionOverwrites.edit(roleId, { SendMessages: true });
      }
      locked++;
    } catch {
      // ignore les salons où le bot n'a pas la permission de modifier
    }
  }
  return locked;
}

async function unlockAllChannels(guild, cfg = {}) {
  const targetRoleIds = cfg.lockdownRoleIds && cfg.lockdownRoleIds.length ? cfg.lockdownRoleIds : [guild.roles.everyone.id];
  const whitelistRoleIds = cfg.whitelistRoleIds || [];

  const channels = guild.channels.cache.filter((c) => c.type === ChannelType.GuildText);
  let unlocked = 0;
  for (const [, channel] of channels) {
    try {
      for (const roleId of targetRoleIds) {
        await channel.permissionOverwrites.edit(roleId, { SendMessages: null });
      }
      for (const roleId of whitelistRoleIds) {
        await channel.permissionOverwrites.edit(roleId, { SendMessages: null });
      }
      unlocked++;
    } catch {
      // ignore
    }
  }
  return unlocked;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lockdown")
    .setDescription("Verrouille manuellement les salons textuels selon la configuration anti-raid")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const cfg = getConfig(interaction.guildId);
    const locked = await lockAllChannels(interaction.guild, cfg);
    updateConfig(interaction.guildId, { lockedDown: true });
    const targetLabel = cfg.lockdownRoleIds && cfg.lockdownRoleIds.length
      ? cfg.lockdownRoleIds.map((r) => `<@&${r}>`).join(", ")
      : "@everyone";
    await interaction.editReply(`🔒 ${locked} salon(s) verrouillé(s) pour : ${targetLabel}.`);
  },

  lockAllChannels,
  unlockAllChannels,
};
