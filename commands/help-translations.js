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
        name: "/antiraid action <add|remove> <lockdown|kick|ban|alert>",
        value: "Adds or removes a raid response — you can combine several at once, e.g. lockdown + ban.",
      },
      {
        name: "/antiraid account-age <days>",
        value: "Accounts younger than this are treated as suspicious during a raid.",
      },
      { name: "/lockdown", value: "Manually locks channels according to your lockdown-roles setting (default: @everyone)." },
      {
        name: "/antiraid lockdown-roles <add|remove|list>",
        value: "Chooses which roles get blocked during a lockdown instead of blocking everyone.",
      },
      { name: "/unlock", value: "Manually unlocks every text channel again." },
      { name: "/whitelist add|remove|list", value: "Manages roles that are never affected by anti-raid actions." },
      { name: "/setlogs <channel>", value: "Sets the channel where raid alerts are sent." },
      { name: "/kick <member> [reason]", value: "Kicks a member from the server." },
      { name: "/ban <member> [reason] [delete-days]", value: "Bans a member from the server." },
      { name: "/timeout <member> <minutes> [reason]", value: "Times out (mutes) a member for a set duration." },
      { name: "/purge <amount>", value: "Bulk-deletes recent messages in this channel (max 100, under 14 days old)." },
      { name: "/userinfo [member]", value: "Shows account age, join date and roles — useful to spot suspicious accounts." },
      {
        name: "/massban <minutes> [reason]",
        value: "Bans everyone who joined in the last X minutes — quick cleanup after a raid.",
      },
      { name: "/slowmode <seconds>", value: "Sets slowmode on this channel without a full lockdown." },
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
        name: "/antiraid action <add|remove> <lockdown|kick|ban|alert>",
        value: "Ajoute ou retire une action de raid — plusieurs peuvent être combinées, ex : lockdown + ban.",
      },
      {
        name: "/antiraid account-age <jours>",
        value: "Les comptes plus récents que ça sont jugés suspects pendant un raid.",
      },
      { name: "/lockdown", value: "Verrouille les salons selon les rôles ciblés (par défaut : @everyone)." },
      {
        name: "/antiraid lockdown-roles <add|remove|list>",
        value: "Choisit quels rôles sont bloqués pendant un lockdown, au lieu de bloquer tout le monde.",
      },
      { name: "/unlock", value: "Déverrouille manuellement tous les salons textuels." },
      {
        name: "/whitelist add|remove|list",
        value: "Gère les rôles jamais impactés par les actions anti-raid.",
      },
      { name: "/setlogs <salon>", value: "Définit le salon où sont envoyées les alertes de raid." },
      { name: "/kick <membre> [raison]", value: "Expulse un membre du serveur." },
      { name: "/ban <membre> [raison] [jours-de-messages]", value: "Bannit un membre du serveur." },
      { name: "/timeout <membre> <minutes> [raison]", value: "Met un membre en sourdine pendant une durée donnée." },
      {
        name: "/purge <nombre>",
        value: "Supprime en masse des messages récents dans ce salon (max 100, moins de 14 jours).",
      },
      {
        name: "/userinfo [membre]",
        value: "Affiche l'âge du compte, la date d'arrivée et les rôles — utile pour repérer les comptes suspects.",
      },
      {
        name: "/massban <minutes> [raison]",
        value: "Bannit tous ceux arrivés dans les X dernières minutes — nettoyage rapide après un raid.",
      },
      { name: "/slowmode <secondes>", value: "Règle le mode lent de ce salon sans le verrouiller complètement." },
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
        name: "/antiraid action <add|remove> <lockdown|kick|ban|alert>",
        value: "Añade o quita una respuesta a raid — se pueden combinar varias, ej: lockdown + ban.",
      },
      {
        name: "/antiraid account-age <días>",
        value: "Las cuentas más nuevas que esto se consideran sospechosas durante un raid.",
      },
      { name: "/lockdown", value: "Bloquea los canales según los roles configurados (por defecto: @everyone)." },
      {
        name: "/antiraid lockdown-roles <add|remove|list>",
        value: "Elige qué roles se bloquean durante un lockdown, en vez de bloquear a todos.",
      },
      { name: "/unlock", value: "Desbloquea manualmente todos los canales de texto." },
      {
        name: "/whitelist add|remove|list",
        value: "Gestiona los roles que nunca se ven afectados por las acciones anti-raid.",
      },
      { name: "/setlogs <canal>", value: "Define el canal donde se envían las alertas de raid." },
      { name: "/kick <miembro> [motivo]", value: "Expulsa a un miembro del servidor." },
      { name: "/ban <miembro> [motivo] [días-de-mensajes]", value: "Banea a un miembro del servidor." },
      { name: "/timeout <miembro> <minutos> [motivo]", value: "Silencia a un miembro durante un tiempo determinado." },
      {
        name: "/purge <cantidad>",
        value: "Elimina en masa mensajes recientes de este canal (máx. 100, menos de 14 días).",
      },
      {
        name: "/userinfo [miembro]",
        value: "Muestra la antigüedad de la cuenta, fecha de ingreso y roles — útil para detectar cuentas sospechosas.",
      },
      {
        name: "/massban <minutos> [motivo]",
        value: "Banea a todos los que se unieron en los últimos X minutos — limpieza rápida tras un raid.",
      },
      { name: "/slowmode <segundos>", value: "Activa el modo lento en este canal sin bloquearlo por completo." },
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
        name: "/antiraid action <add|remove> <lockdown|kick|ban|alert>",
        value: "Fügt eine Raid-Reaktion hinzu oder entfernt sie — mehrere sind kombinierbar, z. B. lockdown + ban.",
      },
      {
        name: "/antiraid account-age <tage>",
        value: "Konten, die jünger sind, gelten während eines Raids als verdächtig.",
      },
      { name: "/lockdown", value: "Sperrt Kanäle je nach eingestellten Rollen (Standard: @everyone)." },
      {
        name: "/antiraid lockdown-roles <add|remove|list>",
        value: "Legt fest, welche Rollen bei einem Lockdown gesperrt werden, statt alle zu sperren.",
      },
      { name: "/unlock", value: "Entsperrt manuell alle Textkanäle wieder." },
      {
        name: "/whitelist add|remove|list",
        value: "Verwaltet Rollen, die nie von Anti-Raid-Aktionen betroffen sind.",
      },
      { name: "/setlogs <kanal>", value: "Legt den Kanal fest, in dem Raid-Warnungen gesendet werden." },
      { name: "/kick <mitglied> [grund]", value: "Kickt ein Mitglied vom Server." },
      { name: "/ban <mitglied> [grund] [nachrichtentage]", value: "Bannt ein Mitglied vom Server." },
      { name: "/timeout <mitglied> <minuten> [grund]", value: "Setzt ein Mitglied für eine bestimmte Zeit stumm." },
      {
        name: "/purge <anzahl>",
        value: "Löscht mehrere aktuelle Nachrichten in diesem Kanal (max. 100, unter 14 Tage alt).",
      },
      {
        name: "/userinfo [mitglied]",
        value: "Zeigt Kontoalter, Beitrittsdatum und Rollen — nützlich, um verdächtige Konten zu erkennen.",
      },
      {
        name: "/massban <minuten> [grund]",
        value: "Bannt alle, die in den letzten X Minuten beigetreten sind — schnelle Aufräumaktion nach einem Raid.",
      },
      { name: "/slowmode <sekunden>", value: "Aktiviert den Slowmode in diesem Kanal, ohne ihn komplett zu sperren." },
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
        name: "/antiraid action <add|remove> <lockdown|kick|ban|alert>",
        value: "Adiciona ou remove uma resposta a raid — podes combinar várias, ex: lockdown + ban.",
      },
      {
        name: "/antiraid account-age <dias>",
        value: "Contas mais recentes do que isto são consideradas suspeitas durante um raid.",
      },
      { name: "/lockdown", value: "Bloqueia os canais consoante os cargos configurados (padrão: @everyone)." },
      {
        name: "/antiraid lockdown-roles <add|remove|list>",
        value: "Escolhe que cargos são bloqueados durante um lockdown, em vez de bloquear todos.",
      },
      { name: "/unlock", value: "Desbloqueia manualmente todos os canais de texto." },
      {
        name: "/whitelist add|remove|list",
        value: "Gere os cargos que nunca são afetados pelas ações anti-raid.",
      },
      { name: "/setlogs <canal>", value: "Define o canal onde os alertas de raid são enviados." },
      { name: "/kick <membro> [motivo]", value: "Expulsa um membro do servidor." },
      { name: "/ban <membro> [motivo] [dias-de-mensagens]", value: "Bane um membro do servidor." },
      { name: "/timeout <membro> <minutos> [motivo]", value: "Silencia um membro por um tempo determinado." },
      {
        name: "/purge <quantidade>",
        value: "Apaga em massa mensagens recentes neste canal (máx. 100, com menos de 14 dias).",
      },
      {
        name: "/userinfo [membro]",
        value: "Mostra a idade da conta, data de entrada e cargos — útil para detetar contas suspeitas.",
      },
      {
        name: "/massban <minutos> [motivo]",
        value: "Bane todos os que entraram nos últimos X minutos — limpeza rápida após um raid.",
      },
      { name: "/slowmode <segundos>", value: "Ativa o modo lento neste canal sem o bloquear por completo." },
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
        name: "/antiraid action <add|remove> <lockdown|kick|ban|alert>",
        value: "إضافة أو إزالة إجراء استجابة للغارة — يمكن الجمع بين عدة إجراءات، مثل lockdown + ban.",
      },
      {
        name: "/antiraid account-age <أيام>",
        value: "الحسابات الأحدث من هذه المدة تُعتبر مشبوهة أثناء الغارة.",
      },
      { name: "/lockdown", value: "يقفل القنوات حسب الأدوار المحددة (افتراضيًا: @everyone)." },
      {
        name: "/antiraid lockdown-roles <add|remove|list>",
        value: "يحدد الأدوار التي يتم حظرها أثناء القفل بدلاً من حظر الجميع.",
      },
      { name: "/unlock", value: "يفتح يدويًا جميع القنوات النصية مجددًا." },
      {
        name: "/whitelist add|remove|list",
        value: "يدير الأدوار التي لا تتأثر أبدًا بإجراءات الحماية من الغارات.",
      },
      { name: "/setlogs <قناة>", value: "يحدد القناة التي تُرسل إليها تنبيهات الغارات." },
      { name: "/kick <عضو> [سبب]", value: "طرد عضو من السيرفر." },
      { name: "/ban <عضو> [سبب] [أيام-الرسائل]", value: "حظر عضو من السيرفر." },
      { name: "/timeout <عضو> <دقائق> [سبب]", value: "كتم عضو لمدة زمنية محددة." },
      {
        name: "/purge <عدد>",
        value: "حذف عدة رسائل حديثة في هذه القناة دفعة واحدة (بحد أقصى 100، أقل من 14 يومًا).",
      },
      {
        name: "/userinfo [عضو]",
        value: "يعرض عمر الحساب وتاريخ الانضمام والأدوار — مفيد لاكتشاف الحسابات المشبوهة.",
      },
      {
        name: "/massban <دقائق> [سبب]",
        value: "حظر كل من انضم خلال آخر X دقيقة — تنظيف سريع بعد الغارة.",
      },
      { name: "/slowmode <ثواني>", value: "تفعيل الوضع البطيء في هذه القناة دون قفلها بالكامل." },
    ],
  },
};

module.exports = { LANGUAGES, TRANSLATIONS };
