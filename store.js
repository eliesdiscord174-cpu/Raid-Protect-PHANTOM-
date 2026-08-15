// store.js
// Stockage des réglages anti-raid, un fichier JSON par serveur dans /data
// pour un accès rapide et synchrone. Ce dossier est cependant effacé à
// chaque redéploiement sur les plans gratuits (disque non persistant).
//
// Pour survivre aux redéploiements, chaque écriture est aussi répliquée en
// arrière-plan vers Supabase (si configuré), et au démarrage du bot
// (voir preloadFromSupabase dans index.js) le contenu de Supabase est
// rapatrié vers /data avant que quoi que ce soit d'autre ne s'exécute.
// Le reste du code (toutes les commandes) continue d'utiliser getConfig /
// updateConfig de façon synchrone, sans aucun changement.

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
let supabase = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  try {
    const { createClient } = require("@supabase/supabase-js");
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  } catch (err) {
    console.warn("⚠️  @supabase/supabase-js non installé, la persistance Supabase est désactivée.");
  }
}

const DEFAULT_CONFIG = {
  enabled: true,
  joinThreshold: 6,
  windowSeconds: 10,
  actions: ["lockdown"],
  minAccountAgeDays: 7,
  logChannelId: null,
  whitelistRoleIds: [],
  lockdownRoleIds: [],
  // Sauvegarde de l'état exact des salons avant le dernier verrouillage,
  // pour pouvoir tout restaurer fidèlement au lieu de remettre "neutre".
  lockdownSnapshot: null,
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
  // Réplication en arrière-plan vers Supabase, sans bloquer l'appelant.
  if (supabase) {
    supabase
      .from("raid_protect_configs")
      .upsert({ guild_id: guildId, config, updated_at: new Date().toISOString() })
      .then(({ error }) => {
        if (error) console.error("Erreur sauvegarde Supabase :", error.message);
      });
  }
  return config;
}

function updateConfig(guildId, patch) {
  const current = getConfig(guildId);
  const updated = { ...current, ...patch };
  return saveConfig(guildId, updated);
}

// Rapatrie toutes les configs depuis Supabase vers les fichiers locaux.
// À appeler une fois au démarrage du bot, avant tout le reste.
async function preloadFromSupabase() {
  if (!supabase) {
    console.log("ℹ️  Supabase non configuré : réglages stockés uniquement en local (non persistants entre redéploiements).");
    return;
  }
  const { data, error } = await supabase.from("raid_protect_configs").select("guild_id, config");
  if (error) {
    console.error("❌ Erreur de chargement des configs depuis Supabase :", error.message);
    return;
  }
  for (const row of data || []) {
    fs.writeFileSync(configPath(row.guild_id), JSON.stringify(row.config, null, 2));
  }
  console.log(`✅ ${data ? data.length : 0} configuration(s) de serveur restaurée(s) depuis Supabase.`);
}

module.exports = { getConfig, saveConfig, updateConfig, preloadFromSupabase, DEFAULT_CONFIG };
