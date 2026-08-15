const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { getConfig, updateConfig } = require("../store");

const ACTION_CHOICES = [
  { name: "Verrouiller les salons (lockdown)", value: "lockdown" },
  { name: "Kick les nouveaux comptes suspects", value: "kick" },
  { name: "Ban les nouveaux comptes suspects", value: "ban" },
  { name: "Alerter seulement", value: "alert" },
];

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
        .setDescription("Ajoute ou retire une action anti-raid (plusieurs peuvent être actives en même temps)")
        .addStringOption((opt) =>
          opt.setName("operation").setDescription("Ajouter ou retirer").setRequired(true).addChoices(
            { name: "Ajouter", value: "add" },
            { name: "Retirer", value: "remove" }
          )
        )
        .addStringOption((opt) =>
          opt.setName("type").setDescription("Type d'action").setRequired(true).addChoices(...ACTION_CHOICES)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("account-age")
        .setDescription("Âge minimum de compte (en jours) avant d'être jugé suspect")
        .addIntegerOption((opt) =>
          opt.setName("jours").setDescription("Nombre de jours").setRequired(true).setMinValue(0)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("lockdown-roles")
        .setDescription("Choisit quels rôles sont bloqués pendant un lockdown (vide = @everyone par défaut)")
        .addStringOption((opt) =>
          opt.setName("operation").setDescription("Ajouter, retirer ou lister").setRequired(true).addChoices(
            { name: "Ajouter", value: "add" },
            { name: "Retirer", value: "remove" },
            { name: "Lister", value: "list" }
          )
        )
        .addRoleOption((opt) => opt.setName("role").setDescription("Le rôle concerné").setRequired(false))
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
          {
            name: "Actions en cas de raid",
            value: cfg.actions && cfg.actions.length ? cfg.actions.join(", ") : "Aucune",
            inline: true,
          },
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
          },
          {
            name: "Rôles ciblés par le lockdown",
            value: cfg.lockdownRoleIds && cfg.lockdownRoleIds.length
              ? cfg.lockdownRoleIds.map((r) => `<@&${r}>`).join(", ")
              : "@everyone (par défaut)",
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
      const operation = interaction.options.getString("operation");
      const type = interaction.options.getString("type");
      const cfg = getConfig(guildId);
      let actions = cfg.actions || [];

      if (operation === "add") {
        if (!actions.includes(type)) actions = [...actions, type];
      } else {
        actions = actions.filter((a) => a !== type);
      }

      updateConfig(guildId, { actions });
      return interaction.reply({
        content: `✅ Actions anti-raid actuelles : **${actions.length ? actions.join(", ") : "aucune"}**.`,
        ephemeral: true,
      });
    }

    if (sub === "account-age") {
      const days = interaction.options.getInteger("jours");
      updateConfig(guildId, { minAccountAgeDays: days });
      return interaction.reply({
        content: `✅ Les comptes créés il y a moins de **${days} jours** seront jugés suspects pendant un raid.`,
        ephemeral: true,
      });
    }

    if (sub === "lockdown-roles") {
      const operation = interaction.options.getString("operation");
      const role = interaction.options.getRole("role");
      const cfg = getConfig(guildId);
      let roles = cfg.lockdownRoleIds || [];

      if (operation === "list") {
        const label = roles.length ? roles.map((r) => `<@&${r}>`).join(", ") : "Aucun (bloque @everyone par défaut)";
        return interaction.reply({ content: `🔒 Rôles ciblés par le lockdown : ${label}`, ephemeral: true });
      }

      if (!role) {
        return interaction.reply({ content: "❌ Précise un rôle pour cette opération.", ephemeral: true });
      }

      if (operation === "add") {
        if (!roles.includes(role.id)) roles = [...roles, role.id];
      } else {
        roles = roles.filter((r) => r !== role.id);
      }

      updateConfig(guildId, { lockdownRoleIds: roles });
      const label = roles.length ? roles.map((r) => `<@&${r}>`).join(", ") : "@everyone (par défaut)";
      return interaction.reply({ content: `✅ Rôles ciblés par le lockdown : ${label}`, ephemeral: true });
    }
  },
};
