const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bannit un membre du serveur")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((opt) => opt.setName("membre").setDescription("Le membre à bannir").setRequired(true))
    .addStringOption((opt) => opt.setName("raison").setDescription("Raison du bannissement").setRequired(false))
    .addIntegerOption((opt) =>
      opt
        .setName("jours-de-messages")
        .setDescription("Supprimer les messages des X derniers jours (0-7)")
        .setMinValue(0)
        .setMaxValue(7)
        .setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getMember("membre");
    const user = interaction.options.getUser("membre");
    const reason = interaction.options.getString("raison") || "Aucune raison fournie";
    const deleteDays = interaction.options.getInteger("jours-de-messages") || 0;

    if (target && !target.bannable) {
      return interaction.reply({
        content: "❌ Je ne peux pas bannir ce membre (rôle trop élevé ou permissions manquantes).",
        ephemeral: true,
      });
    }

    await interaction.guild.members.ban(user.id, {
      reason,
      deleteMessageSeconds: deleteDays * 24 * 60 * 60,
    });

    const embed = new EmbedBuilder()
      .setTitle("🔨 Membre banni")
      .setDescription(`**${user.tag}** a été banni.\n**Raison :** ${reason}`)
      .setColor(0xef4444)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
