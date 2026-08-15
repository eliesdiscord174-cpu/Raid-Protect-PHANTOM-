const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { getConfig, updateConfig } = require("../store");
const { lockAllChannels } = require("./lockdown");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("testraid")
    .setDescription("Simule un raid pour tester ta configuration (sans attendre un vrai afflux de membres)")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption((opt) =>
      opt
        .setName("cible")
        .setDescription("Optionnel : un membre sur qui tester l'action kick/ban (⚠️ action réelle si utilisé)")
        .setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const guild = interaction.guild;
    const cfg = getConfig(guild.id);
    const activeActions = cfg.actions && cfg.actions.length ? cfg.actions : ["alert"];
    const target = interaction.options.getMember("cible");

    const summary = [`🧪 **Simulation de raid lancée.**`, `Actions configurées : **${activeActions.join(", ")}**`];

    if (!cfg.logChannelId) {
      summary.push("⚠️ Aucun salon de logs défini (`/setlogs`) — les alertes ne seront pas envoyées.");
    }

    if (activeActions.includes("lockdown")) {
      if (cfg.lockedDown) {
        summary.push("🔒 Lockdown déjà actif, pas de nouveau verrouillage déclenché.");
      } else {
        const locked = await lockAllChannels(guild, cfg);
        updateConfig(guild.id, { lockedDown: true });
        summary.push(`🔒 Lockdown simulé : ${locked} salon(s) verrouillé(s).`);
      }
    }

    const memberAction = activeActions.includes("ban") ? "ban" : activeActions.includes("kick") ? "kick" : null;
    if (memberAction) {
      if (!target) {
        summary.push(
          `👢 Action **${memberAction}** configurée, mais aucune cible fournie — rien n'a été exécuté. Relance avec l'option \`cible\` pour tester réellement dessus.`
        );
      } else {
        try {
          if (memberAction === "kick") await target.kick("Test anti-raid (/testraid)");
          else await target.ban({ reason: "Test anti-raid (/testraid)" });
          summary.push(`👢 **${target.user.tag}** a réellement été ${memberAction === "kick" ? "expulsé" : "banni"} (test réel).`);
        } catch (err) {
          summary.push(`❌ Échec de l'action sur ${target.user.tag} : ${err.message}`);
        }
      }
    }

    const embed = new EmbedBuilder()
      .setTitle("🧪 Résultat du test anti-raid")
      .setDescription(summary.join("\n"))
      .setColor(0x8b5cf6)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
