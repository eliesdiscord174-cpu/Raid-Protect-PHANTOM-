const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Définit le mode lent (slowmode) de ce salon")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addIntegerOption((opt) =>
      opt
        .setName("secondes")
        .setDescription("Délai entre chaque message (0 pour désactiver, max 21600 = 6h)")
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(21600)
    ),

  async execute(interaction) {
    const seconds = interaction.options.getInteger("secondes");
    await interaction.channel.setRateLimitPerUser(seconds);

    if (seconds === 0) {
      return interaction.reply({ content: "✅ Mode lent désactivé sur ce salon." });
    }
    await interaction.reply({ content: `🐢 Mode lent réglé sur **${seconds} seconde(s)** entre chaque message.` });
  },
};
