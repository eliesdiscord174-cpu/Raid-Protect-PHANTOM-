const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { updateConfig } = require("../store");
const { unlockAllChannels } = require("./lockdown");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Déverrouille tous les salons textuels précédemment verrouillés")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const unlocked = await unlockAllChannels(interaction.guild);
    updateConfig(interaction.guildId, { lockedDown: false });
    await interaction.editReply(`🔓 Serveur déverrouillé. ${unlocked} salon(s) rétabli(s).`);
  },
};
