const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { LANGUAGES, TRANSLATIONS } = require("./help-translations");

function buildEmbed(lang) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return new EmbedBuilder()
    .setTitle(t.title)
    .setDescription(t.intro)
    .setColor(0x8b5cf6)
    .addFields(t.fields.map((f) => ({ name: f.name, value: f.value })))
    .setFooter({ text: t.footer });
}

function buildLangRow(selected = "en") {
  const menu = new StringSelectMenuBuilder()
    .setCustomId("help_lang_select")
    .setPlaceholder("🌐 Choose a language / Choisir une langue")
    .addOptions(
      LANGUAGES.map((l) => ({
        label: l.label,
        value: l.value,
        emoji: l.emoji,
        default: l.value === selected,
      }))
    );
  return new ActionRowBuilder().addComponents(menu);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows a tutorial explaining every Raid-Protect command / Tutoriel expliquant les commandes"),

  async execute(interaction) {
    await interaction.reply({
      embeds: [buildEmbed("en")],
      components: [buildLangRow("en")],
      ephemeral: true,
    });
  },

  buildEmbed,
  buildLangRow,
};
