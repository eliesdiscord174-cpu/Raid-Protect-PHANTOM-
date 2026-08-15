const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Affiche des infos sur un membre (âge du compte, date d'arrivée, rôles...)")
    .addUserOption((opt) => opt.setName("membre").setDescription("Le membre à inspecter").setRequired(false)),

  async execute(interaction) {
    const target = interaction.options.getMember("membre") || interaction.member;
    const user = target.user;

    const accountAgeDays = Math.floor((Date.now() - user.createdTimestamp) / (1000 * 60 * 60 * 24));
    const joinAgeDays = target.joinedTimestamp
      ? Math.floor((Date.now() - target.joinedTimestamp) / (1000 * 60 * 60 * 24))
      : null;

    const roles = target.roles.cache
      .filter((r) => r.id !== interaction.guild.id)
      .map((r) => `<@&${r.id}>`)
      .slice(0, 15);

    const suspicious = accountAgeDays < 7;

    const embed = new EmbedBuilder()
      .setTitle(`👤 ${user.tag}`)
      .setThumbnail(user.displayAvatarURL())
      .setColor(suspicious ? 0xef4444 : 0x22c55e)
      .addFields(
        { name: "ID", value: user.id, inline: true },
        {
          name: "Compte créé",
          value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R> (${accountAgeDays} jours)${
            suspicious ? " ⚠️" : ""
          }`,
          inline: true,
        },
        {
          name: "A rejoint le serveur",
          value: target.joinedTimestamp
            ? `<t:${Math.floor(target.joinedTimestamp / 1000)}:R> (${joinAgeDays} jours)`
            : "Inconnu",
          inline: true,
        },
        { name: `Rôles (${target.roles.cache.size - 1})`, value: roles.length ? roles.join(", ") : "Aucun" }
      );

    if (suspicious) {
      embed.setFooter({ text: "⚠️ Compte récent — considéré comme suspect pendant un raid." });
    }

    await interaction.reply({ embeds: [embed] });
  },
};
