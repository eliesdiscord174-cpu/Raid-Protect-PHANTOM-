const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { getConfig, updateConfig } = require("../store");
const { unlockAllChannels } = require("./lockdown");
const { resetRecentJoins } = require("../raid-state");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stopraid")
    .setDescription("Arrêt d'urgence : déverrouille tout et réinitialise la détection de raid en cours")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const guild = interaction.guild;
    const cfg = getConfig(guild.id);

    let unlocked = 0;
    if (cfg.lockedDown) {
      unlocked = await unlockAllChannels(guild, cfg);
      updateConfig(guild.id, { lockedDown: false });
    }

    // Vide le compteur de joins récents pour éviter un nouveau déclenchement immédiat
    resetRecentJoins(guild.id);

    const embed = new EmbedBuilder()
      .setTitle("🛑 Raid stoppé")
      .setDescription(
        [
          "La détection de raid en cours a été réinitialisée.",
          unlocked > 0 ? `🔓 ${unlocked} salon(s) déverrouillé(s).` : "Aucun salon n'était verrouillé.",
          "Le compteur de nouveaux membres repart de zéro.",
        ].join("\n")
      )
      .setColor(0x22c55e)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
