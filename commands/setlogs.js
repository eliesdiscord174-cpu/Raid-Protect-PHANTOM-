const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const { updateConfig } = require("../store");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setlogs")
    .setDescription("Définit le salon où seront envoyées les alertes anti-raid")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption((opt) =>
      opt
        .setName("salon")
        .setDescription("Le salon de logs")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel("salon");
    updateConfig(interaction.guildId, { logChannelId: channel.id });
    await interaction.reply({ content: `✅ Salon de logs anti-raid défini sur ${channel}.`, ephemeral: true });
  },
};
