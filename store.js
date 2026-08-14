// store.js
// Stockage simple des réglages anti-raid, un fichier JSON par serveur
// dans le dossier /data. Chaque serveur (guild) a sa propre config,
// donc le bot fonctionne indépendamment sur tous les serveurs où il est invité.

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DEFAULT_CONFIG = {
  enabled: true,
  // Nombre de joins déclenchant une alerte de raid
  joinThreshold: 6,
  // Fenêtre de temps (en secondes) dans laquelle ces joins sont comptés
  windowSeconds: 10,
  // Action automatique quand un raid est détecté : "lockdown" | "kick" | "ban" | "alert"
  action: "lockdown",
  // Âge minimum du compte en jours ; en dessous, considéré comme suspect pendant un raid
  minAccountAgeDays: 7,
  // Salon où envoyer les alertes (id de salon, ou null)
  logChannelId: null,
  // Rôles jamais impactés par les actions anti-raid
  whitelistRoleIds: [],
  // true si un lockdown manuel/auto est actuellement actif
  lockedDown: false,
};

function configPath(guildId) {
  return path.join(DATA_DIR, `${guildId}.json`);
}

function getConfig(guildId) {
  const file = configPath(guildId);
  if (!fs.existsSync(file)) {
    return { ...DEFAULT_CONFIG };
  }
  try {
    const raw = fs.readFileSync(file, "utf-8");
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

function saveConfig(guildId, config) {
  fs.writeFileSync(configPath(guildId), JSON.stringify(config, null, 2));
  return config;
}

function updateConfig(guildId, patch) {
  const current = getConfig(guildId);
  const updated = { ...current, ...patch };
  return saveConfig(guildId, updated);
}

module.exports = { getConfig, saveConfig, updateConfig, DEFAULT_CONFIG };
