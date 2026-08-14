const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { getConfig, updateConfig } = require("../store");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("antiraid")
    .setDescription("Configure la protection anti-raid de ce serveur")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((sub) => sub.setName("status").setDescription("Affiche la configuration actuelle"))
    .addSubcommand((sub) => sub.setName("enable").setDescription("Active la protection anti-raid"))
    .addSubcommand((sub) => sub.setName("disable").setDescription("Désactive la protection anti-raid"))
    .addSubcommand((sub) =>
      sub
        .setName("threshold")
        .setDescription("Définit le seuil de détection de raid")
        .addIntegerOption((opt) =>
          opt.setName("joins").setDescription("Nombre de membres rejoignant").setRequired(true).setMinValue(2)
        )
        .addIntegerOption((opt) =>
          opt.setName("secondes").setDescription("Fenêtre de temps en secondes").setRequired(true).setMinValue(1)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("action")
        .setDescription("Action déclenchée quand un raid est détecté")
        .addStringOption((opt) =>
          opt
            .setName("type")
            .setDescription("Type d'action")
            .setRequired(true)
            .addChoices(
              { name: "Verrouiller les salons (lockdown)", value: "lockdown" },
              { name: "Kick les nouveaux comptes suspects", value: "kick" },
              { name: "Ban les nouveaux comptes suspects", value: "ban" },
              { name: "Alerter seulement (aucune action auto)", value: "alert" }
            )
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("account-age")
        .setDescription("Âge minimum de compte (en jours) avant d'être jugé suspect")
        .addIntegerOption((opt) =>
          opt.setName("jours").setDescription("Nombre de jours").setRequired(true).setMinValue(0)
        )
    ),

  async execute(interaction) {
    const guildId = interaction.guildId;
    const sub = interaction.options.getSubcommand();

    if (sub === "status") {
      const cfg = getConfig(guildId);
      const embed = new EmbedBuilder()
        .setTitle("🛡️ Configuration anti-raid")
        .setColor(cfg.enabled ? 0x22c55e : 0x6b7280)
        .addFields(
          { name: "État", value: cfg.enabled ? "✅ Activé" : "❌ Désactivé", inline: true },
          { name: "Verrouillage actif", value: cfg.lockedDown ? "🔒 Oui" : "🔓 Non", inline: true },
          { name: "Seuil de détection", value: `${cfg.joinThreshold} joins / ${cfg.windowSeconds}s`, inline: false },
          { name: "Action en cas de raid", value: cfg.action, inline: true },
          { name: "Âge minimum de compte", value: `${cfg.minAccountAgeDays} jours`, inline: true },
          {
            name: "Salon de logs",
            value: cfg.logChannelId ? `<#${cfg.logChannelId}>` : "Non défini",
            inline: false,
          },
          {
            name: "Rôles en liste blanche",
            value: cfg.whitelistRoleIds.length ? cfg.whitelistRoleIds.map((r) => `<@&${r}>`).join(", ") : "Aucun",
            inline: false,
          }
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (sub === "enable") {
      updateConfig(guildId, { enabled: true });
      return interaction.reply({ content: "✅ Protection anti-raid **activée**.", ephemeral: true });
    }

    if (sub === "disable") {
      updateConfig(guildId, { enabled: false });
      return interaction.reply({ content: "❌ Protection anti-raid **désactivée**.", ephemeral: true });
    }

    if (sub === "threshold") {
      const joins = interaction.options.getInteger("joins");
      const seconds = interaction.options.getInteger("secondes");
      updateConfig(guildId, { joinThreshold: joins, windowSeconds: seconds });
      return interaction.reply({
        content: `✅ Seuil mis à jour : **${joins} joins en ${seconds}s** déclenchera une alerte.`,
        ephemeral: true,
      });
    }

    if (sub === "action") {
      const type = interaction.options.getString("type");
      updateConfig(guildId, { action: type });
      return interaction.reply({ content: `✅ Action anti-raid réglée sur **${type}**.`, ephemeral: true });
    }

    if (sub === "account-age") {
      const days = interaction.options.getInteger("jours");
      updateConfig(guildId, { minAccountAgeDays: days });
      return interaction.reply({
        content: `✅ Les comptes créés il y a moins de **${days} jours** seront jugés suspects pendant un raid.`,
        ephemeral: true,
      });
    }
  },
};
