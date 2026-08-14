const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const { updateConfig } = require("../store");

async function lockAllChannels(guild) {
  const channels = guild.channels.cache.filter((c) => c.type === ChannelType.GuildText);
  let locked = 0;
  for (const [, channel] of channels) {
    try {
      await channel.permissionOverwrites.edit(guild.roles.everyone, { SendMessages: false });
      locked++;
    } catch {
      // ignore les salons où le bot n'a pas la permission de modifier
    }
  }
  return locked;
}

async function unlockAllChannels(guild) {
  const channels = guild.channels.cache.filter((c) => c.type === ChannelType.GuildText);
  let unlocked = 0;
  for (const [, channel] of channels) {
    try {
      await channel.permissionOverwrites.edit(guild.roles.everyone, { SendMessages: null });
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
    .setDescription("Verrouille manuellement tous les salons textuels (empêche @everyone d'écrire)")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const locked = await lockAllChannels(interaction.guild);
    updateConfig(interaction.guildId, { lockedDown: true });
    await interaction.editReply(`🔒 Serveur verrouillé. ${locked} salon(s) mis en lecture seule pour @everyone.`);
  },

  lockAllChannels,
  unlockAllChannels,
};
