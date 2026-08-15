const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Met un membre en sourdine (timeout) pendant une durée donnée")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((opt) => opt.setName("membre").setDescription("Le membre à mettre en sourdine").setRequired(true))
    .addIntegerOption((opt) =>
      opt.setName("minutes").setDescription("Durée en minutes (max 40320 = 28 jours)").setRequired(true).setMinValue(1).setMaxValue(40320)
    )
    .addStringOption((opt) => opt.setName("raison").setDescription("Raison du timeout").setRequired(false)),

  async execute(interaction) {
    const target = interaction.options.getMember("membre");
    const minutes = interaction.options.getInteger("minutes");
    const reason = interaction.options.getString("raison") || "Aucune raison fournie";

    if (!target) {
      return interaction.reply({ content: "❌ Membre introuvable sur ce serveur.", ephemeral: true });
    }
    if (!target.moderatable) {
      return interaction.reply({
        content: "❌ Je ne peux pas mettre ce membre en sourdine (rôle trop élevé ou permissions manquantes).",
        ephemeral: true,
      });
    }

    await target.timeout(minutes * 60 * 1000, reason);

    const embed = new EmbedBuilder()
      .setTitle("🔇 Membre mis en sourdine")
      .setDescription(`**${target.user.tag}** est en sourdine pour **${minutes} minute(s)**.\n**Raison :** ${reason}`)
      .setColor(0xf59e0b)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
