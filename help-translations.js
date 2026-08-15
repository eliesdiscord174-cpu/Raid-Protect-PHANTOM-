// help-translations.js
// Contenu du tutoriel /help dans plusieurs langues.
// Pour ajouter une langue : ajoute une entrée dans LANGUAGES (le menu déroulant)
// et un bloc correspondant dans TRANSLATIONS avec la même clé.

const LANGUAGES = [
  { label: "English", value: "en", emoji: "🇬🇧" },
  { label: "Français", value: "fr", emoji: "🇫🇷" },
  { label: "Español", value: "es", emoji: "🇪🇸" },
  { label: "Deutsch", value: "de", emoji: "🇩🇪" },
  { label: "Português", value: "pt", emoji: "🇵🇹" },
  { label: "العربية", value: "ar", emoji: "🇸🇦" },
];

const TRANSLATIONS = {
  en: {
    title: "🛡️ Raid-Protect — Command Guide",
    intro:
      "Raid-Protect automatically watches how fast members join your server. If too many join too quickly, it can lock your channels, kick, or ban suspicious accounts — based on how you configure it below.",
    footer: "Use the menu below to change language.",
    fields: [
      { name: "/antiraid status", value: "Shows the current anti-raid configuration for this server." },
      { name: "/antiraid enable / disable", value: "Turns the anti-raid protection on or off." },
      {
        name: "/antiraid threshold <joins> <seconds>",
        value: "Sets how many joins within how many seconds count as a raid.",
      },
      {
        name: "/antiraid action <lockdown|kick|ban|alert>",
        value: "Chooses what happens automatically when a raid is detected.",
      },
      {
        name: "/antiraid account-age <days>",
        value: "Accounts younger than this are treated as suspicious during a raid.",
      },
      { name: "/lockdown", value: "Manually locks every text channel so @everyone can't send messages." },
      { name: "/unlock", value: "Manually unlocks every text channel again." },
      { name: "/whitelist add|remove|list", value: "Manages roles that are never affected by anti-raid actions." },
      { name: "/setlogs <channel>", value: "Sets the channel where raid alerts are sent." },
    ],
  },
  fr: {
    title: "🛡️ Raid-Protect — Guide des commandes",
    intro:
      "Raid-Protect surveille automatiquement la vitesse à laquelle les membres rejoignent ton serveur. Si trop de membres arrivent trop vite, il peut verrouiller les salons, expulser ou bannir les comptes suspects — selon ta configuration ci-dessous.",
    footer: "Utilise le menu ci-dessous pour changer de langue.",
    fields: [
      { name: "/antiraid status", value: "Affiche la configuration anti-raid actuelle du serveur." },
      { name: "/antiraid enable / disable", value: "Active ou désactive la protection anti-raid." },
      {
        name: "/antiraid threshold <joins> <secondes>",
        value: "Définit combien de joins en combien de secondes déclenchent une alerte de raid.",
      },
      {
        name: "/antiraid action <lockdown|kick|ban|alert>",
        value: "Choisit ce qui se passe automatiquement quand un raid est détecté.",
      },
      {
        name: "/antiraid account-age <jours>",
        value: "Les comptes plus récents que ça sont jugés suspects pendant un raid.",
      },
      { name: "/lockdown", value: "Verrouille manuellement tous les salons textuels (empêche @everyone d'écrire)." },
      { name: "/unlock", value: "Déverrouille manuellement tous les salons textuels." },
      {
        name: "/whitelist add|remove|list",
        value: "Gère les rôles jamais impactés par les actions anti-raid.",
      },
      { name: "/setlogs <salon>", value: "Définit le salon où sont envoyées les alertes de raid." },
    ],
  },
  es: {
    title: "🛡️ Raid-Protect — Guía de comandos",
    intro:
      "Raid-Protect vigila automáticamente la velocidad a la que los miembros se unen a tu servidor. Si demasiados se unen muy rápido, puede bloquear los canales, expulsar o banear cuentas sospechosas, según la configuración de abajo.",
    footer: "Usa el menú de abajo para cambiar de idioma.",
    fields: [
      { name: "/antiraid status", value: "Muestra la configuración anti-raid actual del servidor." },
      { name: "/antiraid enable / disable", value: "Activa o desactiva la protección anti-raid." },
      {
        name: "/antiraid threshold <uniones> <segundos>",
        value: "Define cuántas uniones en cuántos segundos cuentan como un raid.",
      },
      {
        name: "/antiraid action <lockdown|kick|ban|alert>",
        value: "Elige qué ocurre automáticamente cuando se detecta un raid.",
      },
      {
        name: "/antiraid account-age <días>",
        value: "Las cuentas más nuevas que esto se consideran sospechosas durante un raid.",
      },
      { name: "/lockdown", value: "Bloquea manualmente todos los canales de texto." },
      { name: "/unlock", value: "Desbloquea manualmente todos los canales de texto." },
      {
        name: "/whitelist add|remove|list",
        value: "Gestiona los roles que nunca se ven afectados por las acciones anti-raid.",
      },
      { name: "/setlogs <canal>", value: "Define el canal donde se envían las alertas de raid." },
    ],
  },
  de: {
    title: "🛡️ Raid-Protect — Befehlsübersicht",
    intro:
      "Raid-Protect überwacht automatisch, wie schnell Mitglieder deinem Server beitreten. Treten zu viele zu schnell bei, kann der Bot Kanäle sperren, verdächtige Konten kicken oder bannen — je nach deiner Konfiguration unten.",
    footer: "Nutze das Menü unten, um die Sprache zu ändern.",
    fields: [
      { name: "/antiraid status", value: "Zeigt die aktuelle Anti-Raid-Konfiguration des Servers an." },
      { name: "/antiraid enable / disable", value: "Aktiviert oder deaktiviert den Anti-Raid-Schutz." },
      {
        name: "/antiraid threshold <joins> <sekunden>",
        value: "Legt fest, wie viele Beitritte in wie vielen Sekunden als Raid gelten.",
      },
      {
        name: "/antiraid action <lockdown|kick|ban|alert>",
        value: "Legt fest, was automatisch passiert, wenn ein Raid erkannt wird.",
      },
      {
        name: "/antiraid account-age <tage>",
        value: "Konten, die jünger sind, gelten während eines Raids als verdächtig.",
      },
      { name: "/lockdown", value: "Sperrt manuell alle Textkanäle." },
      { name: "/unlock", value: "Entsperrt manuell alle Textkanäle wieder." },
      {
        name: "/whitelist add|remove|list",
        value: "Verwaltet Rollen, die nie von Anti-Raid-Aktionen betroffen sind.",
      },
      { name: "/setlogs <kanal>", value: "Legt den Kanal fest, in dem Raid-Warnungen gesendet werden." },
    ],
  },
  pt: {
    title: "🛡️ Raid-Protect — Guia de comandos",
    intro:
      "O Raid-Protect monitoriza automaticamente a velocidade com que os membros entram no teu servidor. Se demasiados entrarem muito rápido, ele pode bloquear os canais, expulsar ou banir contas suspeitas — conforme a tua configuração abaixo.",
    footer: "Usa o menu abaixo para mudar de idioma.",
    fields: [
      { name: "/antiraid status", value: "Mostra a configuração anti-raid atual do servidor." },
      { name: "/antiraid enable / disable", value: "Ativa ou desativa a proteção anti-raid." },
      {
        name: "/antiraid threshold <entradas> <segundos>",
        value: "Define quantas entradas em quantos segundos contam como um raid.",
      },
      {
        name: "/antiraid action <lockdown|kick|ban|alert>",
        value: "Escolhe o que acontece automaticamente quando um raid é detetado.",
      },
      {
        name: "/antiraid account-age <dias>",
        value: "Contas mais recentes do que isto são consideradas suspeitas durante um raid.",
      },
      { name: "/lockdown", value: "Bloqueia manualmente todos os canais de texto." },
      { name: "/unlock", value: "Desbloqueia manualmente todos os canais de texto." },
      {
        name: "/whitelist add|remove|list",
        value: "Gere os cargos que nunca são afetados pelas ações anti-raid.",
      },
      { name: "/setlogs <canal>", value: "Define o canal onde os alertas de raid são enviados." },
    ],
  },
  ar: {
    title: "🛡️ Raid-Protect — دليل الأوامر",
    intro:
      "يراقب Raid-Protect تلقائيًا سرعة انضمام الأعضاء إلى سيرفرك. إذا انضم عدد كبير جدًا بسرعة كبيرة، يمكنه قفل القنوات أو طرد أو حظر الحسابات المشبوهة — وفقًا للإعدادات أدناه.",
    footer: "استخدم القائمة أدناه لتغيير اللغة.",
    fields: [
      { name: "/antiraid status", value: "يعرض إعدادات الحماية من الغارات الحالية لهذا السيرفر." },
      { name: "/antiraid enable / disable", value: "تفعيل أو تعطيل الحماية من الغارات." },
      {
        name: "/antiraid threshold <عدد الانضمامات> <ثواني>",
        value: "يحدد عدد الانضمامات خلال عدد الثواني التي تُعتبر غارة.",
      },
      {
        name: "/antiraid action <lockdown|kick|ban|alert>",
        value: "يختار ما يحدث تلقائيًا عند اكتشاف غارة.",
      },
      {
        name: "/antiraid account-age <أيام>",
        value: "الحسابات الأحدث من هذه المدة تُعتبر مشبوهة أثناء الغارة.",
      },
      { name: "/lockdown", value: "يقفل يدويًا جميع القنوات النصية." },
      { name: "/unlock", value: "يفتح يدويًا جميع القنوات النصية مجددًا." },
      {
        name: "/whitelist add|remove|list",
        value: "يدير الأدوار التي لا تتأثر أبدًا بإجراءات الحماية من الغارات.",
      },
      { name: "/setlogs <قناة>", value: "يحدد القناة التي تُرسل إليها تنبيهات الغارات." },
    ],
  },
};

module.exports = { LANGUAGES, TRANSLATIONS };
