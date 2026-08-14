const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { getConfig, updateConfig } = require("../store");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("whitelist")
    .setDescription("Gère les rôles jamais impactés par les actions anti-raid")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((sub) =>
      sub
        .setName("add")
        .setDescription("Ajoute un rôle à la liste blanche")
        .addRoleOption((opt) => opt.setName("role").setDescription("Le rôle à exempter").setRequired(true))
    )
    .addSubcommand((sub) =>
      sub
        .setName("remove")
        .setDescription("Retire un rôle de la liste blanche")
        .addRoleOption((opt) => opt.setName("role").setDescription("Le rôle à retirer").setRequired(true))
    )
    .addSubcommand((sub) => sub.setName("list").setDescription("Affiche les rôles en liste blanche")),

  async execute(interaction) {
    const guildId = interaction.guildId;
    const sub = interaction.options.getSubcommand();
    const cfg = getConfig(guildId);

    if (sub === "add") {
      const role = interaction.options.getRole("role");
      if (!cfg.whitelistRoleIds.includes(role.id)) {
        cfg.whitelistRoleIds.push(role.id);
        updateConfig(guildId, { whitelistRoleIds: cfg.whitelistRoleIds });
      }
      return interaction.reply({ content: `✅ Rôle ${role} ajouté à la liste blanche.`, ephemeral: true });
    }

    if (sub === "remove") {
      const role = interaction.options.getRole("role");
      const updated = cfg.whitelistRoleIds.filter((id) => id !== role.id);
      updateConfig(guildId, { whitelistRoleIds: updated });
      return interaction.reply({ content: `✅ Rôle ${role} retiré de la liste blanche.`, ephemeral: true });
    }

    if (sub === "list") {
      const list = cfg.whitelistRoleIds.length
        ? cfg.whitelistRoleIds.map((r) => `<@&${r}>`).join(", ")
        : "Aucun rôle en liste blanche.";
      return interaction.reply({ content: list, ephemeral: true });
    }
  },
};
