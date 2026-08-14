// deploy-commands.js
// À lancer une fois (ou après avoir modifié/ajouté une commande) avec :
//   node deploy-commands.js
// Enregistre les commandes slash GLOBALEMENT : elles seront disponibles
// sur tous les serveurs où le bot est invité, sans réglage supplémentaire.
// Note : la propagation globale peut prendre jusqu'à 1h la première fois.

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");

const { DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID } = process.env;

if (!DISCORD_BOT_TOKEN || !DISCORD_CLIENT_ID) {
  console.error("❌ DISCORD_BOT_TOKEN ou DISCORD_CLIENT_ID manquant dans .env");
  process.exit(1);
}

const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((f) => f.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (command.data) commands.push(command.data.toJSON());
}

const rest = new REST().setToken(DISCORD_BOT_TOKEN);

(async () => {
  try {
    console.log(`📤 Enregistrement de ${commands.length} commande(s) slash...`);
    await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), { body: commands });
    console.log("✅ Commandes enregistrées avec succès.");
  } catch (err) {
    console.error("❌ Erreur lors de l'enregistrement des commandes :", err);
  }
})();
