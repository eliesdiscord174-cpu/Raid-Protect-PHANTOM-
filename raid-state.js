// raid-state.js
// Suivi en mémoire des joins récents par serveur, partagé entre index.js
// (détection) et les commandes qui ont besoin d'y toucher (ex: /stopraid,
// qui doit réinitialiser le compteur pour éviter un nouveau déclenchement
// immédiat une fois le raid stoppé).

const recentJoins = new Map();

function getRecentJoins(guildId) {
  return recentJoins.get(guildId) || [];
}

function setRecentJoins(guildId, timestamps) {
  recentJoins.set(guildId, timestamps);
}

function resetRecentJoins(guildId) {
  recentJoins.set(guildId, []);
}

module.exports = { recentJoins, getRecentJoins, setRecentJoins, resetRecentJoins };
