const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { getConfig, updateConfig } = require("../store");
const { unlockAllChannels } = require("./lockdown");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Déverrouille tous les salons textuels précédemment verrouillés")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const cfg = getConfig(interaction.guildId);
    const { unlocked, errors } = await unlockAllChannels(interaction.guild, cfg);
    updateConfig(interaction.guildId, { lockedDown: false });
    const warn = errors.length ? `\n⚠️ ${errors.length} salon(s) n'ont pas pu être déverrouillés.` : "";
    await interaction.editReply(`🔓 Serveur déverrouillé. ${unlocked} salon(s) rétabli(s).${warn}`);
  },
};
