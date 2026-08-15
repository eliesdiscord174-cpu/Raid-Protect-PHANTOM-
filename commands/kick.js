const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Expulse un membre du serveur")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((opt) => opt.setName("membre").setDescription("Le membre à expulser").setRequired(true))
    .addStringOption((opt) => opt.setName("raison").setDescription("Raison de l'expulsion").setRequired(false)),

  async execute(interaction) {
    const target = interaction.options.getMember("membre");
    const reason = interaction.options.getString("raison") || "Aucune raison fournie";

    if (!target) {
      return interaction.reply({ content: "❌ Membre introuvable sur ce serveur.", ephemeral: true });
    }
    if (!target.kickable) {
      return interaction.reply({
        content: "❌ Je ne peux pas expulser ce membre (rôle trop élevé ou permissions manquantes).",
        ephemeral: true,
      });
    }

    await target.kick(reason);

    const embed = new EmbedBuilder()
      .setTitle("👢 Membre expulsé")
      .setDescription(`**${target.user.tag}** a été expulsé.\n**Raison :** ${reason}`)
      .setColor(0xf59e0b)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
