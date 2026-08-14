// index.js
// Bot anti-raid Discord. Fonctionne sur TOUS les serveurs où il est invité :
// chaque serveur a sa propre configuration (voir store.js), donc pas de
// réglage global à faire, juste inviter le bot et lancer /antiraid enable.
//
// Détection : on garde en mémoire les horodatages des derniers "joins" par
// serveur. Si trop de joins arrivent dans la fenêtre de temps configurée,
// on déclenche l'action anti-raid (lockdown / kick / ban / alerte).

const fs = require("fs");
const path = require("path");
const http = require("http");
const { Client, GatewayIntentBits, EmbedBuilder, Collection } = require("discord.js");
require("dotenv").config();

const { getConfig, updateConfig } = require("./store");
const { lockAllChannels } = require("./commands/lockdown");

const { DISCORD_BOT_TOKEN, PORT = 3000 } = process.env;

// Petit serveur HTTP, uniquement pour que Render (plan gratuit "Web Service")
// considère le service comme actif. Le bot lui-même fonctionne via WebSocket
// (Gateway Discord), ce serveur ne fait que répondre "OK" aux vérifications
// de santé automatiques de Render.
http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Bot anti-raid en ligne ✅");
  })
  .listen(PORT, () => console.log(`🌐 Serveur de healthcheck actif sur le port ${PORT}`));

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

// Chargement dynamique des commandes slash
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
for (const file of fs.readdirSync(commandsPath).filter((f) => f.endsWith(".js"))) {
  const command = require(path.join(commandsPath, file));
  if (command.data) client.commands.set(command.data.name, command);
}

// Fenêtres de joins récents, par serveur : Map<guildId, number[]> (timestamps ms)
const recentJoins = new Map();

async function sendAlert(guild, cfg, title, description, color = 0xef4444) {
  if (!cfg.logChannelId) return;
  try {
    const channel = await guild.channels.fetch(cfg.logChannelId);
    if (!channel) return;
    const embed = new EmbedBuilder().setTitle(title).setDescription(description).setColor(color).setTimestamp();
    await channel.send({ embeds: [embed] });
  } catch (err) {
    console.error("Erreur envoi alerte anti-raid :", err.message);
  }
}

function isAccountSuspicious(member, minAccountAgeDays) {
  const ageMs = Date.now() - member.user.createdTimestamp;
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  return ageDays < minAccountAgeDays;
}

client.on("guildMemberAdd", async (member) => {
  const guild = member.guild;
  const cfg = getConfig(guild.id);
  if (!cfg.enabled) return;

  // Un membre en liste blanche (par rôle) ne peut pas exister avant son premier
  // join, donc cette vérification s'applique surtout aux actions, pas ici.

  const now = Date.now();
  const windowMs = cfg.windowSeconds * 1000;

  const timestamps = recentJoins.get(guild.id) || [];
  timestamps.push(now);
  // On ne garde que les joins dans la fenêtre de temps
  const filtered = timestamps.filter((t) => now - t <= windowMs);
  recentJoins.set(guild.id, filtered);

  if (filtered.length < cfg.joinThreshold) return;

  // Seuil dépassé : raid détecté
  console.log(`🚨 Raid détecté sur ${guild.name} (${filtered.length} joins en ${cfg.windowSeconds}s)`);

  await sendAlert(
    guild,
    cfg,
    "🚨 Raid détecté !",
    `**${filtered.length} membres** ont rejoint en moins de **${cfg.windowSeconds} secondes**.\nAction configurée : **${cfg.action}**`
  );

  if (cfg.action === "lockdown" && !cfg.lockedDown) {
    const locked = await lockAllChannels(guild);
    updateConfig(guild.id, { lockedDown: true });
    await sendAlert(
      guild,
      cfg,
      "🔒 Verrouillage automatique",
      `${locked} salon(s) verrouillé(s) suite à la détection du raid. Utilisez \`/unlock\` une fois la menace passée.`,
      0xf59e0b
    );
  }

  if (cfg.action === "kick" || cfg.action === "ban") {
    if (isAccountSuspicious(member, cfg.minAccountAgeDays)) {
      try {
        if (cfg.action === "kick") await member.kick("Anti-raid : compte suspect pendant un raid détecté");
        else await member.ban({ reason: "Anti-raid : compte suspect pendant un raid détecté" });
        await sendAlert(
          guild,
          cfg,
          `👢 Membre ${cfg.action === "kick" ? "expulsé" : "banni"}`,
          `**${member.user.tag}** (compte créé il y a moins de ${cfg.minAccountAgeDays} jours) a été ${
            cfg.action === "kick" ? "expulsé" : "banni"
          } automatiquement.`
        );
      } catch (err) {
        console.error("Erreur action anti-raid :", err.message);
      }
    }
  }

  // Évite de re-déclencher en boucle tant que la fenêtre reste pleine
  recentJoins.set(guild.id, []);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(`Erreur commande /${interaction.commandName} :`, err);
    const payload = { content: "❌ Une erreur est survenue lors de l'exécution de la commande.", ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(payload).catch(() => {});
    } else {
      await interaction.reply(payload).catch(() => {});
    }
  }
});

client.once("clientReady", () => {
  console.log(`✅ Bot anti-raid connecté en tant que ${client.user.tag}`);
  console.log(`🛡️  Actif sur ${client.guilds.cache.size} serveur(s).`);
});

client.login(DISCORD_BOT_TOKEN);
