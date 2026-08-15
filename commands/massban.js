const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("massban")
    .setDescription("Bannit tous les membres arrivés dans les X dernières minutes (nettoyage post-raid)")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addIntegerOption((opt) =>
      opt
        .setName("minutes")
        .setDescription("Bannir tous ceux arrivés dans les X dernières minutes")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(1440)
    )
    .addStringOption((opt) => opt.setName("raison").setDescription("Raison du bannissement de masse").setRequired(false)),

  async execute(interaction) {
    const minutes = interaction.options.getInteger("minutes");
    const reason = interaction.options.getString("raison") || "Nettoyage anti-raid (massban)";
    const cutoff = Date.now() - minutes * 60 * 1000;

    await interaction.deferReply({ ephemeral: true });

    const members = await interaction.guild.members.fetch();
    const targets = members.filter((m) => m.joinedTimestamp && m.joinedTimestamp >= cutoff && m.bannable);

    if (targets.size === 0) {
      return interaction.editReply(`Aucun membre arrivé dans les ${minutes} dernières minutes n'a été trouvé.`);
    }

    let banned = 0;
    for (const [, member] of targets) {
      try {
        await member.ban({ reason });
        banned++;
      } catch {
        // ignore les échecs individuels et continue
      }
    }

    const embed = new EmbedBuilder()
      .setTitle("🔨 Bannissement de masse effectué")
      .setDescription(
        `**${banned}** membre(s) arrivé(s) dans les **${minutes} dernières minutes** ont été bannis.\n**Raison :** ${reason}`
      )
      .setColor(0xef4444)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
