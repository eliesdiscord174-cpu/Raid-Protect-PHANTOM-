# Bot Anti-Raid

Bot Discord qui protège automatiquement **tous les serveurs** où il est invité contre les raids
(vagues de faux comptes qui rejoignent en masse). Chaque serveur a ses propres réglages,
indépendants les uns des autres.

## Installation

1. `npm install`
2. Copie `.env.example` vers `.env` et remplis :
   - `DISCORD_BOT_TOKEN` : Developer Portal → ton appli → **Bot** → Reset Token
   - `DISCORD_CLIENT_ID` : déjà pré-rempli avec `1537905062251077632`
3. Enregistre les commandes slash (une seule fois, ou après modification d'une commande) :
   ```
   node deploy-commands.js
   ```
   ⚠️ La première propagation globale peut prendre jusqu'à 1h avant d'apparaître sur tous les serveurs.
4. Lance le bot :
   ```
   node index.js
   ```

## Inviter le bot sur un serveur

Utilise ton URL d'invitation (permission Administrateur, comme fourni) :
```
https://discord.com/oauth2/authorize?client_id=1537905062251077632&permissions=8&integration_type=0&scope=bot
```

## Commandes disponibles

- `/antiraid status` — affiche la configuration actuelle du serveur
- `/antiraid enable` / `/antiraid disable` — active/désactive la protection
- `/antiraid threshold <joins> <secondes>` — règle la sensibilité de détection
- `/antiraid action <lockdown|kick|ban|alert>` — action déclenchée en cas de raid
- `/antiraid account-age <jours>` — âge minimum de compte avant d'être jugé suspect
- `/lockdown` — verrouille manuellement tous les salons textuels
- `/unlock` — déverrouille tous les salons
- `/whitelist add|remove|list` — gère les rôles jamais impactés par les actions anti-raid
- `/setlogs <salon>` — définit où envoyer les alertes anti-raid

## Fonctionnement de la détection

Le bot compte les arrivées de membres (`guildMemberAdd`) dans une fenêtre de temps glissante.
Si le nombre de joins dépasse le seuil configuré (par défaut : 6 joins en 10 secondes),
un raid est considéré comme détecté et l'action configurée se déclenche automatiquement :
verrouillage des salons, kick, ban, ou simple alerte — selon ton réglage.

## Déploiement en production

Comme pour le bot de sondage PHANTOM, tu peux héberger ce bot sur Render (ou tout autre
hébergeur Node.js) : type de service "Background Worker" (pas "Web Service", ce bot n'a pas
de serveur HTTP), commande de démarrage `node index.js`, avec les mêmes variables d'environnement
que dans `.env`.
