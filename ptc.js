var DB_KEY = 'ufm27_database_v3';
var currentLang = localStorage.getItem('ufm_lang') || 'es';
var currentCategory = 'basic';
var priceSource = 'db';
var activeModalPtc = null;
var activeSubIndex = 0;

var DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='124' height='124' viewBox='0 0 24 24' fill='%234b5668'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>";

var posTranslations = {
  es: { 'ST':'DC', 'RW':'ED', 'LW':'EI', 'RM':'MD', 'LM':'MI', 'CM':'MC', 'CDM':'MCD', 'CAM':'MCO', 'CB':'DFC', 'RB':'LD', 'LB':'LI', 'GK':'POR' },
  en: { 'ST':'ST', 'RW':'RW', 'LW':'LW', 'RM':'RM', 'LM':'LM', 'CM':'CM', 'CDM':'CDM', 'CAM':'CAM', 'CB':'CB', 'RB':'RB', 'LB':'LB', 'GK':'GK' },
  fr: { 'ST':'BU', 'RW':'AD', 'LW':'AG', 'RM':'MD', 'LM':'MG', 'CM':'MC', 'CDM':'MDC', 'CAM':'MOC', 'CB':'DC', 'RB':'DD', 'LB':'DG', 'GK':'G' },
  de: { 'ST':'ST', 'RW':'RF', 'LW':'LF', 'RM':'RM', 'LM':'LM', 'CM':'ZM', 'CDM':'ZDM', 'CAM':'ZOM', 'CB':'IV', 'RB':'RV', 'LB':'LV', 'GK':'TW' },
  it: { 'ST':'ATT', 'RW':'AD', 'LW':'AS', 'RM':'ED', 'LM':'ES', 'CM':'CC', 'CDM':'CDC', 'CAM':'COC', 'CB':'DC', 'RB':'TD', 'LB':'TS', 'GK':'POR' },
  pt: { 'ST':'PL', 'RW':'PD', 'LW':'PE', 'RM':'MD', 'LM':'ME', 'CM':'MC', 'CDM':'VOL', 'CAM':'MEI', 'CB':'ZAG', 'RB':'LD', 'LB':'LE', 'GK':'GR' }
};

var reversePosLookup = {
  'DC':'ST', 'ED':'RW', 'EI':'LW', 'DFC':'CB', 'LD':'RB', 'LI':'LB', 'POR':'GK', 'MCD':'CDM', 'MCO':'CAM', 'MI':'LM', 'MD':'RM', 'MC':'CM',
  'BU':'ST', 'AD':'RW', 'AG':'LW', 'MDC':'CDM', 'MOC':'CAM', 'DD':'RB', 'DG':'LB', 'G':'GK', 'MG':'LM',
  'RF':'RW', 'LF':'LW', 'ZM':'CM', 'ZDM':'CDM', 'ZOM':'CAM', 'IV':'CB', 'RV':'RB', 'LV':'LB', 'TW':'GK',
  'ATT':'ST', 'AS':'LW', 'CC':'CM', 'CDC':'CDM', 'COC':'CAM', 'TD':'RB', 'TS':'LB', 'ES':'LM',
  'PL':'ST', 'PD':'RW', 'PE':'LW', 'VOL':'CDM', 'MEI':'CAM', 'ZAG':'CB', 'LE':'LB', 'GR':'GK', 'ME':'LM'
};

function normalizePosition(p) {
  if (!p) return 'ST';
  var up = String(p).trim().toUpperCase();
  return reversePosLookup[up] || up;
}

function displayPosition(p, lang) {
  if (!p) return '—';
  var standard = normalizePosition(p);
  var l = lang || currentLang || 'es';
  var dict = posTranslations[l] || posTranslations.es;
  return dict[standard] || standard;
}

var masterLeaguesData = [
  { id: "be_1", code: "be", names: { es: "Bélgica (1ª Div)", en: "Belgium (1st Div)", fr: "Belgique (1ère Div)", de: "Belgien (1. Liga)", it: "Belgio (1ª Div)", pt: "Bélgica (1ª Div)" } },
  { id: "eng_1", code: "gb-eng", names: { es: "Inglaterra (1ª Div - Premier)", en: "England (1st Div - Premier)", fr: "Angleterre (1ère Div - Premier)", de: "England (1. Liga - Premier)", it: "Inghilterra (1ª Div - Premier)", pt: "Inglaterra (1ª Div - Premier)" } },
  { id: "eng_2", code: "gb-eng", names: { es: "Inglaterra (2ª Div - Championship)", en: "England (2nd Div - Championship)", fr: "Angleterre (2ème Div - Championship)", de: "England (2. Liga - Championship)", it: "Inghilterra (2ª Div - Championship)", pt: "Inglaterra (2ª Div - Championship)" } },
  { id: "fr_1", code: "fr", names: { es: "Francia (1ª Div - Ligue 1)", en: "France (1st Div - Ligue 1)", fr: "France (1ère Div - Ligue 1)", de: "Frankreich (1. Liga - Ligue 1)", it: "Francia (1ª Div - Ligue 1)", pt: "França (1ª Div - Ligue 1)" } },
  { id: "de_1", code: "de", names: { es: "Alemania (1ª Div - Bundesliga)", en: "Germany (1st Div - Bundesliga)", fr: "Allemagne (1ère Div - Bundesliga)", de: "Deutschland (1. Liga - Bundesliga)", it: "Germania (1ª Div - Bundesliga)", pt: "Alemanha (1ª Div - Bundesliga)" } },
  { id: "it_1", code: "it", names: { es: "Italia (1ª Div - Serie A)", en: "Italy (1st Div - Serie A)", fr: "Italie (1ère Div - Serie A)", de: "Italien (1. Liga - Serie A)", it: "Italia (1ª Div - Serie A)", pt: "Itália (1ª Div - Serie A)" } },
  { id: "nl_1", code: "nl", names: { es: "Países Bajos (1ª Div - Eredivisie)", en: "Netherlands (1st Div - Eredivisie)", fr: "Pays-Bas (1ère Div - Eredivisie)", de: "Niederlande (1. Liga - Eredivisie)", it: "Paesi Bassi (1ª Div - Eredivisie)", pt: "Países Baixos (1ª Div - Eredivisie)" } },
  { id: "pt_1", code: "pt", names: { es: "Portugal (1ª Div - Liga Portugal)", en: "Portugal (1st Div - Liga Portugal)", fr: "Portugal (1ère Div - Liga Portugal)", de: "Portugal (1. Liga - Liga Portugal)", it: "Portogallo (1ª Div - Liga Portugal)", pt: "Portugal (1ª Div - Liga Portugal)" } },
  { id: "es_1", code: "es", names: { es: "España (1ª Div - LaLiga)", en: "Spain (1st Div - LaLiga)", fr: "Espagne (1ère Div - LaLiga)", de: "Spanien (1. Liga - LaLiga)", it: "Spagna (1ª Div - LaLiga)", pt: "Espanha (1ª Div - LaLiga)" } },
  { id: "tr_1", code: "tr", names: { es: "Turquía (1ª Div - Süper Lig)", en: "Turkey (1st Div - Süper Lig)", fr: "Turquie (1ère Div - Süper Lig)", de: "Türkei (1. Liga - Süper Lig)", it: "Turchia (1ª Div - Süper Lig)", pt: "Turquia (1ª Div - Süper Lig)" } }
];

var masterCountriesData = [
  { code: "nl", names: { es: "Países Bajos", en: "Netherlands", fr: "Pays-Bas", de: "Niederlande", it: "Paesi Bassi", pt: "Países Baixos" } },
  { code: "es", names: { es: "España", en: "Spain", fr: "Espagne", de: "Spanien", it: "Spagna", pt: "Espanha" } },
  { code: "fr", names: { es: "Francia", en: "France", fr: "France", de: "Frankreich", it: "Francia", pt: "França" } },
  { code: "de", names: { es: "Alemania", en: "Germany", fr: "Allemagne", de: "Deutschland", it: "Germania", pt: "Alemanha" } },
  { code: "gb-eng", names: { es: "Inglaterra", en: "England", fr: "Angleterre", de: "England", it: "Inghilterra", pt: "Inglaterra" } },
  { code: "br", names: { es: "Brasil", en: "Brazil", fr: "Brésil", de: "Brasilien", it: "Brasile", pt: "Brasil" } },
  { code: "ar", names: { es: "Argentina", en: "Argentina", fr: "Argentine", de: "Argentinien", it: "Argentina", pt: "Argentina" } },
  { code: "it", names: { es: "Italia", en: "Italy", fr: "Italie", de: "Italien", it: "Italia", pt: "Itália" } },
  { code: "pt", names: { es: "Portugal", en: "Portugal", fr: "Portugal", de: "Portugal", it: "Portogallo", pt: "Portugal" } },
  { code: "be", names: { es: "Bélgica", en: "Belgium", fr: "Belgique", de: "Belgien", it: "Belgio", pt: "Bélgica" } },
  { code: "pl", names: { es: "Polonia", en: "Poland", fr: "Pologne", de: "Polen", it: "Polonia", pt: "Polónia" } },
  { code: "no", names: { es: "Noruega", en: "Norway", fr: "Norvège", de: "Norwegen", it: "Norvegia", pt: "Noruega" } },
  { code: "uy", names: { es: "Uruguay", en: "Uruguay", fr: "Uruguay", de: "Uruguay", it: "Uruguay", pt: "Uruguai" } },
  { code: "hu", names: { es: "Hungría", en: "Hungary", fr: "Hongrie", de: "Ungarn", it: "Ungheria", pt: "Hungria" } },
  { code: "uz", names: { es: "Uzbekistán", en: "Uzbekistan", fr: "Ouzbékistan", de: "Usbekistan", it: "Uzbekistan", pt: "Uzbequistão" } },
  { code: "gb-wls", names: { es: "Gales", en: "Wales", fr: "Pays de Galles", de: "Wales", it: "Galles", pt: "País de Gales" } }
];

function normalizeSimple(str) {
  if (!str) return '';
  return String(str).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function getCanonicalCountry(str) {
  if (!str) return '';
  var raw = String(str).trim();
  var clean = raw.toLowerCase();
  var norm = normalizeSimple(raw);

  var found = masterCountriesData.find(function(c) {
    if (c.code.toLowerCase() === clean || c.code.toLowerCase() === norm) return true;
    return Object.values(c.names).some(function(n) {
      return n.toLowerCase() === clean || normalizeSimple(n) === norm;
    });
  });
  if (found) return found.code;

  var aliases = {
    'holanda': 'nl', 'paises bajos': 'nl', 'países bajos': 'nl', 'netherlands': 'nl', 'nederland': 'nl', 'pays-bas': 'nl', 'paesi bassi': 'nl', 'paises baixos': 'nl',
    'inglaterra': 'gb-eng', 'england': 'gb-eng', 'espana': 'es', 'españa': 'es', 'spain': 'es'
  };
  return aliases[clean] || aliases[norm] || norm;
}

function countriesMatch(c1, c2) {
  if (!c1 || !c2) return false;
  var code1 = getCanonicalCountry(c1);
  var code2 = getCanonicalCountry(c2);
  if (code1 && code2 && code1 === code2) return true;
  var norm1 = normalizeSimple(c1);
  var norm2 = normalizeSimple(c2);
  return norm1 === norm2 || norm1.includes(norm2) || norm2.includes(norm1);
}

function getCanonicalLeague(str) {
  if (!str) return '';
  var raw = String(str).trim();
  var clean = raw.toLowerCase();
  var norm = normalizeSimple(raw);

  var found = masterLeaguesData.find(function(l) {
    if (l.id.toLowerCase() === clean || l.code.toLowerCase() === clean) return true;
    return Object.values(l.names).some(function(n) {
      return n.toLowerCase() === clean || normalizeSimple(n) === norm;
    });
  });
  if (found) return found.id;

  var aliases = {
    'premier': 'eng_1', 'premier league': 'eng_1',
    'laliga': 'es_1', 'la liga': 'es_1',
    'ligue 1': 'fr_1', 'bundesliga': 'de_1',
    'serie a': 'it_1', 'eredivisie': 'nl_1'
  };
  for (var k in aliases) {
    if (clean.includes(k) || norm.includes(k)) return aliases[k];
  }
  return norm;
}

function leaguesMatch(l1, l2) {
  if (!l1 || !l2) return false;
  var id1 = getCanonicalLeague(l1);
  var id2 = getCanonicalLeague(l2);
  if (id1 && id2 && id1 === id2) return true;
  var norm1 = normalizeSimple(l1);
  var norm2 = normalizeSimple(l2);
  return norm1 === norm2 || norm1.includes(norm2) || norm2.includes(norm1);
}

function getLocalizedCountryName(nameOrCode, lang) {
  if (!nameOrCode) return '';
  var l = lang || currentLang || 'es';
  var code = getCanonicalCountry(nameOrCode);
  var found = masterCountriesData.find(function(c) { return c.code === code; });
  if (found) return found.names[l] || found.names.es || nameOrCode;
  return nameOrCode;
}

function getLocalizedLeagueName(nameOrCode, lang) {
  if (!nameOrCode) return '';
  var l = lang || currentLang || 'es';
  var id = getCanonicalLeague(nameOrCode);
  var found = masterLeaguesData.find(function(item) { return item.id === id; });
  if (found) return found.names[l] || found.names.es || nameOrCode;
  return nameOrCode;
}

function getFlagUrl(str) {
  if (!str) return 'https://flagcdn.com/w40/un.png';
  var code = getCanonicalCountry(str);
  if (code && code.length <= 6) {
    return 'https://flagcdn.com/w40/' + code + '.png';
  }
  var lId = getCanonicalLeague(str);
  var lFound = masterLeaguesData.find(function(l) { return l.id === lId; });
  if (lFound) return 'https://flagcdn.com/w40/' + lFound.code + '.png';
  return 'https://flagcdn.com/w40/un.png';
}

function getCardClass(rating, rarity) {
  var r = (rarity || 'normal').toLowerCase();
  if (r === 'weekend_league' || r === 'ptc' || r === 'matchday' || r === 'potm' || r === 'totw' || r === 'euro_evo' || r === 'new_season' || r === 'transfer_stars') {
    return r;
  }
  var rat = +rating || 0;
  if (rat <= 64) return 'bronze';
  if (rat <= 74) return 'silver';
  if (rat <= 82) return 'gold-light';
  return 'gold-dark';
}

function getRarityClass(rarity, rating) {
  var r = (rarity || 'normal').toLowerCase();
  var rat = +rating || 0;
  if (r === 'normal' || r === 'bronze' || r === 'silver' || r === 'gold-dark' || r === 'gold-light') {
    if (r === 'bronze' || rat <= 64) return 'card-bronze';
    if (r === 'silver' || rat <= 74) return 'card-silver';
    if (r === 'gold-light' || rat <= 82) return 'card-gold-light';
    return 'card-gold-dark';
  }
  if (['matchday', 'new_season', 'potm', 'ptc', 'euro_evo', 'totw', 'transfer_stars', 'weekend_league'].includes(r)) {
    return 'card-' + r.replace('_', '-');
  }
  return 'card-gold-dark';
}

function getRarityLabel(r) {
  var norm = (r || 'normal').toLowerCase();
  var labels = {
    normal: 'Normal', matchday: 'Matchday', new_season: 'NewSeason', potm: 'Player of the Month',
    ptc: 'PTC', euro_evo: 'European Evolutions', totw: 'Team of the Week',
    transfer_stars: 'Transfer Stars', weekend_league: 'Weekend League'
  };
  return labels[norm] || r;
}

function getDateStatus(isoDate) {
  if (!isoDate) return { text: '—', colorClass: 'empty' };
  var target = new Date(isoDate);
  if (isNaN(target.getTime())) return { text: isoDate, colorClass: 'red' };
  var diffDays = Math.floor((new Date() - target) / (1000 * 60 * 60 * 24));
  var dateFormatted = target.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
  return {
    text: dateFormatted,
    colorClass: diffDays <= 0 ? 'green' : (diffDays <= 3 ? 'yellow' : 'red')
  };
}

var i18n = {
  es: {
    navHome: "Inicio", navDb: "Base de Datos", navCalc: "Calculadora SBC",
    heroTitle: "Desafíos de Creación de Plantillas (PTC)",
    heroSubtitle: "Explora los desafíos activos y obtén la solución más barata con precios de la base de datos o de la calculadora.",
    statPlayers: "Jugadores en BD", statActive: "PTCs Activos",
    tabBasic: "📁 Básicos", tabSeason: "🏆 De Temporada", tabLimited: "⏳ Tiempo Limitado",
    btnSrcDb: "🗄️ Base de Datos", btnSrcManual: "✏️ Calculadora Manual",
    reqPlayers: "Jugadores:", reqTarget: "Media requerida:",
    reqSquads: "Plantillas requeridas:", reqRarity: "Rareza exigida:",
    viewSolution: "Ver alineación óptima →", estCost: "Coste estimado:",
    sumCost: "Coste Plantilla", sumTarget: "Media Exigida", sumExact: "Media Exacta",
    squadTitle: "Alineación Sugerida",
    noPricesWarning: "No hay precios disponibles. Revisa la Base de Datos o introduce precios en el modo Manual de la calculadora.",
    anyPlayer: "Cualquier jugador de",
    badgeBasic: "Básico", badgeRepeatable: "Básico Repetible", badgeSeason: "Temporada", badgeLimited: "Limitado",
    modalSubtitle: "{players} jugadores · Media {target}",
    pendingDetails: "Requisitos de esta plantilla pendientes de definir.",
    squadWord: "Plantilla", challengeWord: "Desafío",
    specialReqTitle: "Requisitos Especiales de Plantilla",
    minPrefix: "Mín.",
    roleDef: "Defensas", roleMid: "Centrocampistas", roleAtt: "Delanteros",
    statPac: "RIT", statSho: "TIR", statPas: "PAS", statDri: "REG", statDef: "DEF", statPhy: "FIS",
    reqAgeMin: "Edad ≥ {val}", reqAgeMax: "Edad ≤ {val}", reqWeightMax: "Peso ≤ {val}kg",
    dClub: "Club", dLeague: "Liga", dCountry: "Nacionalidad", dAge: "Edad",
    dPhys: "Altura / Peso", dPrice: "Precio Mercado SBC", dUpdated: "Última Actualización",
    yearsOld: "años", noPrice: "Sin precio", detModalTitle: "Detalle del Jugador",
    quickPriceTitle: "Cambiar Precio", quickPriceHelp: "Actualiza el precio en la Base de Datos",
    lblQuickPriceInput: "Nuevo Precio SBC / Mercado (monedas)",
    btnCancelQuickPrice: "Cancelar", btnSaveQuickPrice: "Guardar y Recalcular",
    btnEditPricePtcDetail: "💰 Modificar Precio", btnClosePtcDetail: "Cerrar",
    lockedLabel: "🔒 BLOQUEADO",
    unfulfilledTitle: "Requisitos No Cumplidos",
    unfulfilledNotice: "No se puede completar el PTC porque faltan jugadores con precio en la Base de Datos que cumplan los requisitos obligatorios:",
    unfulfilledItemPattern: "Se requieren {required} jugador(es) con precio en la BD (encontrados: {found}). Faltan {missing}.",
    unfulfilledNote: "Nota: No se rellena la plantilla con jugadores aleatorios porque no cumplirían las condiciones del PTC.",
    unfulfilledTip: "Añade o asigna precio a jugadores que cumplan estos requisitos en la Base de Datos.",
    unfulfilledBadge: "⚠️ FALTANTE",
    unfulfilledReqWord: "Requisito",
    unfulfilledNoPriceInDb: "Sin jugadores con precio en BD",
    unfulfilledPendingSlot: "Slot pendiente",
    unfulfilledPendingDesc: "Requiere cumplir condiciones previas",
    statusIncomplete: "Incompleto",
    labelPosition: "Posición",
    labelFullSquad: "Plantilla completa ({n} jugadores con precio)"
  },
  en: {
    navHome: "Home", navDb: "Database", navCalc: "SBC Calculator",
    heroTitle: "Squad Building Challenges (PTC)",
    heroSubtitle: "Explore active challenges and get the cheapest squad solution using database or calculator manual prices.",
    statPlayers: "Players in DB", statActive: "Active PTCs",
    tabBasic: "📁 Basics", tabSeason: "🏆 Season Challenges", tabLimited: "⏳ Limited Time",
    btnSrcDb: "🗄️ Database", btnSrcManual: "✏️ Manual Calculator",
    reqPlayers: "Players:", reqTarget: "Target Rating:",
    reqSquads: "Required Squads:", reqRarity: "Required Rarity:",
    viewSolution: "View cheapest squad →", estCost: "Estimated Cost:",
    sumCost: "Squad Cost", sumTarget: "Target Rating", sumExact: "Exact Rating",
    squadTitle: "Suggested Squad",
    noPricesWarning: "No prices available. Check your Database or enter manual prices in the calculator.",
    anyPlayer: "Any player of",
    badgeBasic: "Basic", badgeRepeatable: "Repeatable Basic", badgeSeason: "Season", badgeLimited: "Limited",
    modalSubtitle: "{players} players · Rating {target}",
    pendingDetails: "Squad requirements pending to be defined.",
    squadWord: "Squad", challengeWord: "Challenge",
    specialReqTitle: "Special Squad Requirements",
    minPrefix: "Min.",
    roleDef: "Defenders", roleMid: "Midfielders", roleAtt: "Attackers",
    statPac: "PAC", statSho: "SHO", statPas: "PAS", statDri: "DRI", statDef: "DEF", statPhy: "PHY",
    reqAgeMin: "Age ≥ {val}", reqAgeMax: "Age ≤ {val}", reqWeightMax: "Weight ≤ {val}kg",
    dClub: "Club", dLeague: "League", dCountry: "Nation", dAge: "Age",
    dPhys: "Height / Weight", dPrice: "SBC Market Price", dUpdated: "Last Update",
    yearsOld: "years", noPrice: "No price", detModalTitle: "Player Details",
    quickPriceTitle: "Change Price", quickPriceHelp: "Updates the price in the Database",
    lblQuickPriceInput: "New SBC / Market Price (coins)",
    btnCancelQuickPrice: "Cancel", btnSaveQuickPrice: "Save & Recalculate",
    btnEditPricePtcDetail: "💰 Edit Price", btnClosePtcDetail: "Close",
    lockedLabel: "🔒 LOCKED",
    unfulfilledTitle: "Requirements Not Met",
    unfulfilledNotice: "Cannot complete this PTC because there are not enough priced players in the Database to meet mandatory requirements:",
    unfulfilledItemPattern: "Requires {required} player(s) with price in DB (found: {found}). Missing {missing}.",
    unfulfilledNote: "Note: The squad is not filled with random players because they would not fulfill the challenge requirements.",
    unfulfilledTip: "Add or set prices for players meeting these requirements in the Database.",
    unfulfilledBadge: "⚠️ MISSING",
    unfulfilledReqWord: "Requirement",
    unfulfilledNoPriceInDb: "No priced players in DB",
    unfulfilledPendingSlot: "Pending slot",
    unfulfilledPendingDesc: "Requires meeting prerequisite conditions",
    statusIncomplete: "Incomplete",
    labelPosition: "Position",
    labelFullSquad: "Full squad ({n} priced players)"
  },
  fr: {
    navHome: "Accueil", navDb: "Base de Données", navCalc: "Calculateur DCE",
    heroTitle: "Défis de Création d'Équipe (DCE)",
    heroSubtitle: "Découvrez les défis actifs et obtenez la solution la moins chère avec votre base de données ou la calculatrice.",
    statPlayers: "Joueurs en BD", statActive: "DCE Actifs",
    tabBasic: "📁 Basiques", tabSeason: "🏆 De Saison", tabLimited: "⏳ Temps Limité",
    btnSrcDb: "🗄️ Base de Données", btnSrcManual: "✏️ Calculateur Manuel",
    reqPlayers: "Joueurs :", reqTarget: "Note Requise :",
    reqSquads: "Équipes Requises :", reqRarity: "Rareté Exigée :",
    viewSolution: "Voir l'équipe optimale →", estCost: "Coût estimé :",
    sumCost: "Coût de l'équipe", sumTarget: "Note Requise", sumExact: "Note Réelle",
    squadTitle: "Équipe Recommandée",
    noPricesWarning: "Aucun prix disponible. Vérifiez la base ou entrez des prix dans le calculateur manuel.",
    anyPlayer: "Tout joueur de",
    badgeBasic: "Basique", badgeRepeatable: "Basique Répétable", badgeSeason: "Saison", badgeLimited: "Limité",
    modalSubtitle: "{players} joueurs · Note {target}",
    pendingDetails: "Critères de cette équipe en attente de définition.",
    squadWord: "Équipe", challengeWord: "Défi",
    specialReqTitle: "Critères Spéciaux de l'Équipe",
    minPrefix: "Min.",
    roleDef: "Défenseurs", roleMid: "Milieux", roleAtt: "Attaquants",
    statPac: "VIT", statSho: "TIR", statPas: "PAS", statDri: "DRI", statDef: "DÉF", statPhy: "PHY",
    reqAgeMin: "Âge ≥ {val}", reqAgeMax: "Âge ≤ {val}", reqWeightMax: "Poids ≤ {val}kg",
    dClub: "Club", dLeague: "Ligue", dCountry: "Nationalité", dAge: "Âge",
    dPhys: "Taille / Poids", dPrice: "Prix Marché DCE", dUpdated: "Dernière Mise à Jour",
    yearsOld: "ans", noPrice: "Sans prix", detModalTitle: "Détails du Joueur",
    quickPriceTitle: "Modifier le Prix", quickPriceHelp: "Met à jour le prix dans la base de données",
    lblQuickPriceInput: "Nouveau prix DCE / Marché (crédits)",
    btnCancelQuickPrice: "Annuler", btnSaveQuickPrice: "Enregistrer et Recalculer",
    btnEditPricePtcDetail: "💰 Modifier le Prix", btnClosePtcDetail: "Fermer",
    lockedLabel: "🔒 VERROUILLÉ",
    unfulfilledTitle: "Conditions Non Remplies",
    unfulfilledNotice: "Impossible de compléter ce DCE car il manque de joueurs avec prix dans la base de données répondant aux critères obligatoires :",
    unfulfilledItemPattern: "{required} joueur(s) avec prix requis dans la base (trouvés : {found}). Manquants : {missing}.",
    unfulfilledNote: "Remarque : L'équipe n'est pas remplie avec des joueurs aléatoires car ils ne respecteraient pas les conditions du DCE.",
    unfulfilledTip: "Ajoutez ou attribuez un prix aux joueurs respectant ces critères dans la Base de Données.",
    unfulfilledBadge: "⚠️ MANQUANT",
    unfulfilledReqWord: "Condition",
    unfulfilledNoPriceInDb: "Aucun joueur avec prix en BD",
    unfulfilledPendingSlot: "Emplacement en attente",
    unfulfilledPendingDesc: "Nécessite de remplir les conditions préalables",
    statusIncomplete: "Incomplet",
    labelPosition: "Position",
    labelFullSquad: "Équipe complète ({n} joueurs avec prix)"
  },
  de: {
    navHome: "Startseite", navDb: "Datenbank", navCalc: "SBC-Rechner",
    heroTitle: "Squad Building Challenges (PTC)",
    heroSubtitle: "Finde die günstigste SBC-Kombination mit Datenbank- oder manuellen Rechnerpreisen.",
    statPlayers: "Spieler in DB", statActive: "Aktive PTCs",
    tabBasic: "📁 Basis", tabSeason: "🏆 Saison-PTC", tabLimited: "⏳ Zeitlich Begrenzt",
    btnSrcDb: "🗄️ Datenbank", btnSrcManual: "✏️ Rechner Manuell",
    reqPlayers: "Spieler:", reqTarget: "Benötigte Wertung:",
    reqSquads: "Erforderliche Teams:", reqRarity: "Benötigte Seltenheit:",
    viewSolution: "Günstigste Aufstellung →", estCost: "Geschätzte Kosten:",
    sumCost: "Team-Kosten", sumTarget: "Ziel-Wertung", sumExact: "Genaue Wertung",
    squadTitle: "Empfohlene Aufstellung",
    noPricesWarning: "Keine Preise verfügbar. Bitte Datenbank oder manuelle Preise im Rechner prüfen.",
    anyPlayer: "Jeder Spieler mit",
    badgeBasic: "Basis", badgeRepeatable: "Wiederholbar Basis", badgeSeason: "Saison", badgeLimited: "Begrenzt",
    modalSubtitle: "{players} Spieler · Wertung {target}",
    pendingDetails: "Anforderungen für dieses Team noch nicht festgelegt.",
    squadWord: "Team", challengeWord: "Challenge",
    specialReqTitle: "Spezielle Team-Anforderungen",
    minPrefix: "Mind.",
    roleDef: "Verteidiger", roleMid: "Mittelfeldspieler", roleAtt: "Stürmer",
    statPac: "TEM", statSho: "SCH", statPas: "PAS", statDri: "DRI", statDef: "DEF", statPhy: "PHY",
    reqAgeMin: "Alter ≥ {val}", reqAgeMax: "Alter ≤ {val}", reqWeightMax: "Gewicht ≤ {val}kg",
    dClub: "Verein", dLeague: "Liga", dCountry: "Nation", dAge: "Alter",
    dPhys: "Größe / Gewicht", dPrice: "SBC-Marktpreis", dUpdated: "Letzte Aktualisierung",
    yearsOld: "Jahre", noPrice: "Kein Preis", detModalTitle: "Spielerdetails",
    quickPriceTitle: "Preis ändern", quickPriceHelp: "Aktualisiert den Preis in der Datenbank",
    lblQuickPriceInput: "Neuer SBC- / Marktpreis (Münzen)",
    btnCancelQuickPrice: "Abbrechen", btnSaveQuickPrice: "Speichern & Neuberechnen",
    btnEditPricePtcDetail: "💰 Preis bearbeiten", btnClosePtcDetail: "Schließen",
    lockedLabel: "🔒 GESPERRT",
    unfulfilledTitle: "Nicht Erfüllte Anforderungen",
    unfulfilledNotice: "Diese SBC kann nicht abgeschlossen werden, da nicht genügend Spieler mit Preis in der Datenbank vorhanden sind, die die Anforderungen erfüllen:",
    unfulfilledItemPattern: "{required} Spieler mit Preis in der Datenbank erforderlich (gefunden: {found}). Es fehlen {missing}.",
    unfulfilledNote: "Hinweis: Das Team wird nicht mit zufälligen Spielern aufgefüllt, da diese die SBC-Anforderungen nicht erfüllen würden.",
    unfulfilledTip: "Füge in der Datenbank Spieler hinzu oder bepreise sie, die diese Anforderungen erfüllen.",
    unfulfilledBadge: "⚠️ FEHLEND",
    unfulfilledReqWord: "Anforderung",
    unfulfilledNoPriceInDb: "Keine bepreisten Spieler in DB",
    unfulfilledPendingSlot: "Ausstehender Platz",
    unfulfilledPendingDesc: "Erfordert die Erfüllung vorheriger Bedingungen",
    statusIncomplete: "Unvollständig",
    labelPosition: "Position",
    labelFullSquad: "Vollständiges Team ({n} bepreiste Spieler)"
  },
  it: {
    navHome: "Home", navDb: "Database", navCalc: "Calcolatore SCR",
    heroTitle: "Sfide Creazione Rosa (PTC)",
    heroSubtitle: "Trova la combinazione più economica usando i prezzi del database o del calcolatore manuale.",
    statPlayers: "Giocatori in BD", statActive: "PTC Attivi",
    tabBasic: "📁 Base", tabSeason: "🏆 Stagionali", tabLimited: "⏳ Tempo Limitato",
    btnSrcDb: "🗄️ Database", btnSrcManual: "✏️ Calcolatore Manuale",
    reqPlayers: "Giocatori:", reqTarget: "Valutazione richiesta:",
    reqSquads: "Rose richieste:", reqRarity: "Rarità richiesta:",
    viewSolution: "Vedi rosa migliore →", estCost: "Costo stimato:",
    sumCost: "Costo Rosa", sumTarget: "Valutazione Richiesta", sumExact: "Valutazione Reale",
    squadTitle: "Rosa Suggerita",
    noPricesWarning: "Nessun prezzo disponibile. Controlla il database o inserisci prezzi nel calcolatore.",
    anyPlayer: "Qualsiasi giocatore da",
    badgeBasic: "Base", badgeRepeatable: "Ripetibile Base", badgeSeason: "Stagione", badgeLimited: "Limitato",
    modalSubtitle: "{players} giocatori · Valutazione {target}",
    pendingDetails: "Requisiti di questa rosa in attesa di definizione.",
    squadWord: "Rosa", challengeWord: "Sfida",
    specialReqTitle: "Requisiti Speciali della Rosa",
    minPrefix: "Min.",
    roleDef: "Difensori", roleMid: "Centrocampisti", roleAtt: "Attaccanti",
    statPac: "VEL", statSho: "TIR", statPas: "PAS", statDri: "DRI", statDef: "DIF", statPhy: "FIS",
    reqAgeMin: "Età ≥ {val}", reqAgeMax: "Età ≤ {val}", reqWeightMax: "Peso ≤ {val}kg",
    dClub: "Club", dLeague: "Campionato", dCountry: "Nazionalità", dAge: "Età",
    dPhys: "Altezza / Peso", dPrice: "Prezzo Mercato SCR", dUpdated: "Ultimo Aggiornamento",
    yearsOld: "anni", noPrice: "Nessun prezzo", detModalTitle: "Dettagli Giocatore",
    quickPriceTitle: "Modifica Prezzo", quickPriceHelp: "Aggiorna il prezzo nel database",
    lblQuickPriceInput: "Nuovo prezzo SCR / Mercato (crediti)",
    btnCancelQuickPrice: "Annulla", btnSaveQuickPrice: "Salva e Ricalcola",
    btnEditPricePtcDetail: "💰 Modifica Prezzo", btnClosePtcDetail: "Chiudi",
    lockedLabel: "🔒 BLOCCATO",
    unfulfilledTitle: "Requisiti Non Soddisfatti",
    unfulfilledNotice: "Impossibile completare questa SCR perché mancano giocatori con prezzo nel database che soddisfino i requisiti obbligatori:",
    unfulfilledItemPattern: "Richiesti {required} giocatore/i con prezzo nel database (trovati: {found}). Mancanti: {missing}.",
    unfulfilledNote: "Nota: La rosa non viene riempita con giocatori casuali perché non rispetterebbero i requisiti della SCR.",
    unfulfilledTip: "Aggiungi o assegna un prezzo ai giocatori che soddisfano questi requisiti nel Database.",
    unfulfilledBadge: "⚠️ MANCANTE",
    unfulfilledReqWord: "Requisito",
    unfulfilledNoPriceInDb: "Nessun giocatore con prezzo in BD",
    unfulfilledPendingSlot: "Slot in attesa",
    unfulfilledPendingDesc: "Richiede il rispetto delle condizioni precedenti",
    statusIncomplete: "Incompleto",
    labelPosition: "Ruolo",
    labelFullSquad: "Rosa completa ({n} giocatori con prezzo)"
  },
  pt: {
    navHome: "Início", navDb: "Base de Dados", navCalc: "Calculadora DME",
    heroTitle: "Desafios de Montagem de Elenco (DME)",
    heroSubtitle: "Encontre a solução mais barata para os desafios usando preços da base de dados ou da calculadora.",
    statPlayers: "Jogadores na BD", statActive: "DMEs Ativos",
    tabBasic: "📁 Básicos", tabSeason: "🏆 De Temporada", tabLimited: "⏳ Tempo Limitado",
    btnSrcDb: "🗄️ Base de Dados", btnSrcManual: "✏️ Calculadora Manual",
    reqPlayers: "Jogadores:", reqTarget: "Classificação exigida:",
    reqSquads: "Elencos exigidos:", reqRarity: "Raridade exigida:",
    viewSolution: "Ver elenco ideal →", estCost: "Custo estimado:",
    sumCost: "Custo do Elenco", sumTarget: "Nota Exigida", sumExact: "Nota Exata",
    squadTitle: "Elenco Sugerido",
    noPricesWarning: "Sem preços disponíveis. Verifique a base de dados ou insira preços manuais na calculadora.",
    anyPlayer: "Qualquer jogador de",
    badgeBasic: "Básico", badgeRepeatable: "Básico Repetível", badgeSeason: "Temporada", badgeLimited: "Limitado",
    modalSubtitle: "{players} jogadores · Classificação {target}",
    pendingDetails: "Requisitos deste elenco pendentes de definição.",
    squadWord: "Elenco", challengeWord: "Desafio",
    specialReqTitle: "Requisitos Especiais do Elenco",
    minPrefix: "Mín.",
    roleDef: "Defensores", roleMid: "Meio-campistas", roleAtt: "Atacantes",
    statPac: "RIT", statSho: "FIN", statPas: "PAS", statDri: "DRI", statDef: "DEF", statPhy: "FÍS",
    reqAgeMin: "Idade ≥ {val}", reqAgeMax: "Idade ≤ {val}", reqWeightMax: "Peso ≤ {val}kg",
    dClub: "Clube", dLeague: "Liga", dCountry: "Nacionalidade", dAge: "Idade",
    dPhys: "Altura / Peso", dPrice: "Preço Mercado DME", dUpdated: "Última Actualização",
    yearsOld: "anos", noPrice: "Sem preço", detModalTitle: "Detalhes do Jogador",
    quickPriceTitle: "Alterar Preço", quickPriceHelp: "Atualiza o preço na base de dados",
    lblQuickPriceInput: "Novo preço DME / Mercado (moedas)",
    btnCancelQuickPrice: "Cancelar", btnSaveQuickPrice: "Salvar e Recalcular",
    btnEditPricePtcDetail: "💰 Alterar Preço", btnClosePtcDetail: "Fechar",
    lockedLabel: "🔒 BLOQUEADO",
    unfulfilledTitle: "Requisitos Não Cumpridos",
    unfulfilledNotice: "Não é possível concluir este DME porque faltam jogadores com preço na Base de Dados que cumpram os requisitos obrigatórios:",
    unfulfilledItemPattern: "São necessários {required} jogador(es) com preço na BD (encontrados: {found}). Faltam {missing}.",
    unfulfilledNote: "Nota: O elenco não é preenchido com jogadores aleatórios porque não cumpririam os requisitos do DME.",
    unfulfilledTip: "Adicione ou atribua preços aos jogadores que cumprem estes requisitos na Base de Dados.",
    unfulfilledBadge: "⚠️ FALTANDO",
    unfulfilledReqWord: "Requisito",
    unfulfilledNoPriceInDb: "Sem jogadores com preço na BD",
    unfulfilledPendingSlot: "Vaga pendente",
    unfulfilledPendingDesc: "Requer cumprimento de condições prévias",
    statusIncomplete: "Incompleto",
    labelPosition: "Posição",
    labelFullSquad: "Elenco completo ({n} jogadores com preço)"
  }
};

var ptcTitles = {
  b_60: { es: "Mejora 60+", en: "60+ Upgrade" },
  b_70: { es: "Mejora 70+", en: "70+ Upgrade" },
  b_74: { es: "Mejora 74+", en: "74+ Upgrade" },
  b_78: { es: "Mejora 78+", en: "78+ Upgrade" },
  b_81: { es: "Mejora 81+", en: "81+ Upgrade" },
  b_83: { es: "Mejora 83+", en: "83+ Upgrade" },
  b_85: { es: "Mejora 85+", en: "85+ Upgrade" },
  b_87: { es: "Mejora 87+", en: "87+ Upgrade" },
  b_bronze_group: { es: "Desafío Bronce", en: "Bronze Challenge" },
  b_silver_group: { es: "Desafío Plata", en: "Silver Challenge" },
  b_gold_group: { es: "Desafío Oro", en: "Gold Challenge" },
  s_aficionado_1: { es: "Aficionado 1", en: "Amateur 1" },
  s_aficionado_2: { es: "Aficionado 2", en: "Amateur 2" },
  s_aficionado_3: { es: "Aficionado 3", en: "Amateur 3" },
  s_semipro_1: { es: "Semiprofesional 1", en: "Semi-Pro 1" },
  s_semipro_2: { es: "Semiprofesional 2", en: "Semi-Pro 2" },
  s_semipro_3: { es: "Semiprofesional 3", en: "Semi-Pro 3" },
  s_pro_1: { es: "Profesional 1", en: "Professional 1" },
  s_pro_2: { es: "Profesional 2", en: "Professional 2" },
  s_pro_3: { es: "Profesional 3", en: "Professional 3" },
  s_legend_1: { es: "Legendario 1", en: "Legendary 1" },
  s_wl_1: { es: "Liga de Fin de Semana 1", en: "Weekend League 1" },
  s_wl_2: { es: "Liga de Fin de Semana 2", en: "Weekend League 2" },
  l_totw_upgrade: { es: "Mejora TOTW Activo", en: "Active TOTW Upgrade" },
  l_flash_challenge: { es: "Desafío Relámpago", en: "Flash Challenge" },
  l_odegaard_91: { es: "Martin Ødegaard (91 POTM)", en: "Martin Ødegaard (91 POTM)" }
};

var groupShortTitles = {
  b_bronze_group: { es: "BRONCE", en: "BRONZE", fr: "BRONZE", de: "BRONZE", it: "BRONZO", pt: "BRONZE" },
  b_silver_group: { es: "PLATA", en: "SILVER", fr: "ARGENT", de: "SILBER", it: "ARGENTO", pt: "PRATA" },
  b_gold_group: { es: "ORO", en: "GOLD", fr: "OR", de: "GOLD", it: "ORO", pt: "OURO" }
};

var packWords = {
  es: { pack: "Sobre", singleElite: "Sobre Individual Élite Oro {r}+ (1)" },
  en: { pack: "Pack", singleElite: "1x 81+ Single Gold Elite Pack ({r}+)" },
  fr: { pack: "Pack", singleElite: "Pack Individuel Élite Or {r}+ (1)" },
  de: { pack: "Pack", singleElite: "Einzelnes Elite-Gold-Pack {r}+ (1)" },
  it: { pack: "Pacchetto", singleElite: "Pacchetto Singolo Élite Oro {r}+ (1)" },
  pt: { pack: "Pacote", singleElite: "Pacote Individual Ouro Elite {r}+ (1)" }
};

var ptcRewards = {
  b_bronze_group: {
    type: 'player', name: 'Moore', pos: 'ST', rating: 75, rarity: 'ptc',
    country: 'Gales', league: 'Inglaterra (1ª Div - Premier)', club: 'Wrexham',
    stats: { pac: 71, dri: 66, sho: 76, def: 38, pas: 59, phy: 76 },
    image: 'https://b.fssta.com/uploads/application/soccer/headshots/5649.vresize.350.350.medium.1.png'
  },
  b_silver_group: {
    type: 'player', name: 'Bueno', pos: 'CB', rating: 78, rarity: 'ptc',
    country: 'Uruguay', league: 'Inglaterra (1ª Div - Premier)', club: 'Wolves',
    stats: { pac: 74, dri: 63, sho: 37, def: 79, pas: 66, phy: 81 },
    image: 'https://www.ceroacero.es/img/jogadores/new/97/82/749782_hugo_bueno_20260218234652.png'
  },
  b_gold_group: {
    type: 'player', name: 'Merino', pos: 'CM', rating: 83, rarity: 'ptc',
    country: 'España', league: 'Inglaterra (1ª Div - Premier)', club: 'Arsenal',
    stats: { pac: 79, dri: 80, sho: 63, def: 68, pas: 77, phy: 74 },
    image: 'https://cdn-img.staticzz.com/img/jogadores/new/01/75/420175_mikel_merino_20250928235143.png'
  },
  s_aficionado_1: {
    type: 'player', name: 'Khusanov', pos: 'CB', rating: 83, rarity: 'ptc',
    country: 'Uzbekistán', league: 'Inglaterra (1ª Div - Premier)', club: 'Manchester City',
    stats: { pac: 84, dri: 70, sho: 39, def: 83, pas: 69, phy: 82 },
    image: 'https://www.ceroacero.es/img/jogadores/new/40/90/964090_abdukodir_khusanov_20251110125631.png'
  },
  s_aficionado_2: {
    type: 'player', name: 'Rashford', pos: 'LW', rating: 84, rarity: 'ptc',
    country: 'Inglaterra', league: 'Inglaterra (1ª Div - Premier)', club: 'Manchester United',
    stats: { pac: 91, dri: 83, sho: 85, def: 33, pas: 77, phy: 67 },
    image: 'https://www.ceroacero.es/img/jogadores/new/40/80/434080_marcus_rashford_20260824235119.png'
  },
  s_aficionado_3: {
    type: 'player', name: 'Henderson', pos: 'GK', rating: 85, rarity: 'ptc',
    country: 'Inglaterra', league: 'Inglaterra (1ª Div - Premier)', club: 'Crystal Palace',
    stats: { pac: 83, dri: 81, sho: 82, def: 79, pas: 83, phy: 82 },
    image: 'https://www.ceroacero.es/img/jogadores/new/34/02/373402_dean_henderson_20260122212207.png',
    gkLabels: true
  },
  s_semipro_1: {
    type: 'player', name: 'James', pos: 'RB', rating: 86, rarity: 'ptc',
    country: 'Inglaterra', league: 'Inglaterra (1ª Div - Premier)', club: 'Chelsea',
    stats: { pac: 79, dri: 79, sho: 72, def: 84, pas: 78, phy: 81 },
    image: 'https://www.ceroacero.es/img/jogadores/new/71/65/507165_reece_james_20251218141946.png'
  },
  s_semipro_2: {
    type: 'player', name: 'Szoboszlai', pos: 'CDM', rating: 87, rarity: 'ptc',
    country: 'Hungría', league: 'Inglaterra (1ª Div - Premier)', club: 'Liverpool',
    stats: { pac: 81, dri: 86, sho: 83, def: 58, pas: 85, phy: 71 },
    image: 'https://www.ceroacero.es/img/jogadores/new/05/43/540543_dominik_szoboszlai_20251022235907.png'
  },
  s_semipro_3: {
    type: 'player', name: 'Mendes', pos: 'LB', rating: 88, rarity: 'ptc',
    country: 'Portugal', league: 'Francia (1ª Div - Ligue 1)', club: 'Paris Saint-Germain',
    stats: { pac: 96, dri: 82, sho: 51, def: 82, pas: 79, phy: 75 },
    image: 'https://b.fssta.com/uploads/application/soccer/headshots/74576.vresize.350.350.medium.2.png'
  },
  s_pro_1: {
    type: 'player', name: 'Kammach', pos: 'CDM', rating: 89, rarity: 'ptc',
    country: 'Alemania', league: 'Alemania (1ª Div - Bundesliga)', club: 'Bayern München',
    stats: { pac: 72, dri: 82, sho: 73, def: 84, pas: 88, phy: 74 },
    image: 'https://b.fssta.com/uploads/application/soccer/headshots/35439.png'
  },
  s_pro_2: {
    type: 'player', name: 'Koundé', pos: 'RB', rating: 90, rarity: 'ptc',
    country: 'Francia', league: 'España (1ª Div - LaLiga)', club: 'FC Barcelona',
    stats: { pac: 89, dri: 81, sho: 56, def: 88, pas: 77, phy: 89 },
    image: 'https://b.fssta.com/uploads/application/soccer/headshots/40821.vresize.350.350.medium.2.png'
  },
  s_pro_3: {
    type: 'player', name: 'Mbappé', pos: 'ST', rating: 91, rarity: 'ptc',
    country: 'Francia', league: 'España (1ª Div - LaLiga)', club: 'Real Madrid',
    stats: { pac: 95, dri: 90, sho: 90, def: 39, pas: 71, phy: 85 },
    image: 'https://cdn-img.staticzz.com/img/jogadores/new/45/08/394508_kylian_mbappe_20260217195145.png'
  },
  s_wl_1: { type: 'wl', minRating: 81, difficulty: 'Fácil' },
  s_wl_2: { type: 'wl', minRating: 84, difficulty: 'Media' }
};

function formatPtcReward(ptcId) {
  var r = ptcRewards[ptcId];
  if (!r) return '';
  if (r.type === 'player') {
    var localizedPos = displayPosition(r.pos, currentLang);
    return r.name + ' (' + localizedPos + ') ⭐ ' + r.rating;
  }
  return '';
}

function getSubChallengeRewardText(sub) {
  var pw = packWords[currentLang] || packWords.es;
  if (sub.rewardRating) {
    return pw.singleElite.replace('{r}', sub.rewardRating);
  }
  return '';
}

function createBlankRankSubchallenges(prefixKey, rewardRating) {
  return [1, 2, 3, 4].map(function(num) {
    return { subKey: prefixKey, num: num, players: 0, target: 0, isPending: true, rewardRating: rewardRating || 81 };
  });
}

function formatSubChallengeName(sub) {
  var t = i18n[currentLang] || i18n.es;
  if (sub.subKey) return getPtcTitle(sub.subKey) + ' - ' + t.challengeWord + ' ' + sub.num;
  if (sub.isTargetSquad) return t.squadWord + ' ' + sub.target;
  return sub.name || '';
}

var ptcList = [
  { id: "b_60", category: "basic", isRepeatable: true, players: 5, target: 50, repeatNum: 1, bigRating: "60+", theme: "theme-bronze-60" },
  { id: "b_70", category: "basic", isRepeatable: true, players: 5, target: 60, repeatNum: 2, bigRating: "70+", theme: "theme-silver-70" },
  { id: "b_74", category: "basic", isRepeatable: true, players: 5, target: 70, repeatNum: 3, bigRating: "74+", theme: "theme-silver-74" },
  { id: "b_78", category: "basic", isRepeatable: true, players: 5, target: 74, repeatNum: 4, bigRating: "78+", theme: "theme-gold-78" },
  { id: "b_81", category: "basic", isRepeatable: true, players: 5, target: 78, repeatNum: 5, bigRating: "81+", theme: "theme-purple-tier" },
  { id: "b_83", category: "basic", isRepeatable: true, players: 5, target: 81, repeatNum: 6, bigRating: "83+", theme: "theme-purple-tier" },
  { id: "b_85", category: "basic", isRepeatable: true, players: 5, target: 83, repeatNum: 7, bigRating: "85+", theme: "theme-purple-tier" },
  { id: "b_87", category: "basic", isRepeatable: true, players: 5, target: 85, repeatNum: 8, bigRating: "87+", theme: "theme-purple-tier" },
  {
    id: "b_bronze_group", category: "basic", isRepeatable: false, shortTitle: "BRONCE",
    subchallenges: [
      { name: "Bronce 1", players: 11, target: 50, rewardRating: 60, difficulty: "Fácil" },
      { name: "Bronce 2", players: 11, target: 50, rewardRating: 65, difficulty: "Fácil" },
      { name: "Bronce 3", players: 11, target: 50, rewardRating: 70, difficulty: "Fácil" }
    ]
  },
  {
    id: "b_silver_group", category: "basic", isRepeatable: false, shortTitle: "PLATA",
    subchallenges: [
      { name: "Plata 1", players: 11, target: 65, rewardRating: 71, difficulty: "Fácil" },
      { name: "Plata 2", players: 11, target: 68, rewardRating: 73, difficulty: "Media" },
      { name: "Plata 3", players: 11, target: 70, rewardRating: 74, difficulty: "Difícil" }
    ]
  },
  {
    id: "b_gold_group", category: "basic", isRepeatable: false, shortTitle: "ORO",
    subchallenges: [
      { name: "Oro 1", players: 11, target: 74, rewardRating: 76, difficulty: "Difícil" },
      { name: "Oro 2", players: 11, target: 75, rewardRating: 77, difficulty: "Difícil" },
      { name: "Oro 3", players: 11, target: 78, rewardRating: 80, difficulty: "Difícil" }
    ]
  },
  { id: "s_aficionado_1", category: "season", isRepeatable: false, subchallenges: createBlankRankSubchallenges("s_aficionado_1", 80) },
  { id: "s_aficionado_2", category: "season", isRepeatable: false, subchallenges: createBlankRankSubchallenges("s_aficionado_2", 80) },
  { id: "s_aficionado_3", category: "season", isRepeatable: false, subchallenges: createBlankRankSubchallenges("s_aficionado_3", 80) },
  { id: "s_semipro_1", category: "season", isRepeatable: false, subchallenges: createBlankRankSubchallenges("s_semipro_1", 81) },
  {
    id: "s_semipro_2",
    category: "season",
    isRepeatable: false,
    subchallenges: [
      {
        name: "Semiprofesional 2.1",
        rewardRating: 81,
        players: 11,
        target: 80,
        reqs: {
          minLeague: { name: "Francia (1ª Div - Ligue 1)", count: 3 },
          minCountry: { name: "Brasil", count: 3 },
          minRole: { role: "DEF", count: 3 },
          minAge: 30, minAgeCount: 3,
          minDri: 75, minDriCount: 3
        }
      },
      {
        name: "Semiprofesional 2.2",
        rewardRating: 82,
        players: 11,
        target: 81,
        reqs: {
          minLeague: { name: "España (1ª Div - LaLiga)", count: 3 },
          minCountry: { name: "Francia", count: 3 },
          minRole: { role: "MID", count: 3 },
          maxAge: 25, maxAgeCount: 3,
          minSho: 75, minShoCount: 3
        }
      },
      {
        name: "Semiprofesional 2.3",
        rewardRating: 83,
        players: 11,
        target: 82,
        reqs: {
          minLeague: { name: "Alemania (1ª Div - Bundesliga)", count: 3 },
          minCountry: { name: "Inglaterra", count: 3 },
          minRole: { role: "ATT", count: 3 },
          maxWeight: 70, maxWeightCount: 3,
          minPhy: 75, minPhyCount: 3
        }
      },
      {
        name: "Semiprofesional 2.4",
        rewardRating: 84,
        players: 11,
        target: 83,
        reqs: {
          minLeague: { name: "Inglaterra (1ª Div - Premier)", count: 3 },
          minCountry: { name: "Países Bajos", count: 3 },
          exactPositions: [
            { pos: "ST", count: 1 },
            { pos: "LM", count: 1 },
            { pos: "CB", count: 1 }
          ]
        }
      }
    ]
  },
  { id: "s_semipro_3", category: "season", isRepeatable: false, subchallenges: createBlankRankSubchallenges("s_semipro_3", 81) },
  { id: "s_pro_1", category: "season", isRepeatable: false, subchallenges: createBlankRankSubchallenges("s_pro_1", 83) },
  { id: "s_pro_2", category: "season", isRepeatable: false, subchallenges: createBlankRankSubchallenges("s_pro_2", 83) },
  { id: "s_pro_3", category: "season", isRepeatable: false, subchallenges: createBlankRankSubchallenges("s_pro_3", 83) },
  { id: "s_legend_1", category: "season", isRepeatable: false, subchallenges: createBlankRankSubchallenges("s_legend_1") },
  { id: "s_wl_1", category: "season", isRepeatable: false, players: 3, target: 78, requiredRarity: "weekend_league" },
  { id: "s_wl_2", category: "season", isRepeatable: false, players: 7, target: 81, requiredRarity: "weekend_league" },
  {
    id: "l_odegaard_91",
    category: "limited",
    isRepeatable: false,
    subchallenges: [
      { isTargetSquad: true, players: 11, target: 84 },
      { isTargetSquad: true, players: 11, target: 86 },
      { isTargetSquad: true, players: 11, target: 88 },
      { isTargetSquad: true, players: 11, target: 89 },
      { isTargetSquad: true, players: 11, target: 90 }
    ]
  },
  { id: "l_totw_upgrade", category: "limited", isRepeatable: false, players: 11, target: 83 },
  { id: "l_flash_challenge", category: "limited", isRepeatable: false, players: 6, target: 79 }
];

function getPtcTitle(ptcId) {
  var entry = ptcTitles[ptcId];
  return entry ? (entry[currentLang] || entry.es || entry.en) : ptcId;
}

function getPtcBadgeInfo(ptc) {
  var t = i18n[currentLang] || i18n.es;
  if (ptc.isRepeatable) return { label: t.badgeRepeatable, className: 'repeatable' };
  if (ptc.category === 'limited') return { label: t.badgeLimited, className: 'limited' };
  if (ptc.category === 'season') return { label: t.badgeSeason, className: 'season' };
  return { label: t.badgeBasic, className: '' };
}

function getDatabasePlayers() {
  var candidateKeys = [DB_KEY, 'ufm27_db_v7', 'ufm27_database_v6', 'ufm27_database_v5', 'ufm27_database_v4', 'ufm_database_players_v2'];
  for (var i = 0; i < candidateKeys.length; i++) {
    try {
      var raw = localStorage.getItem(candidateKeys[i]);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch(e) {}
  }
  return [];
}

function getActivePrices(filterRarity) {
  if (priceSource === 'manual' && !filterRarity) {
    var raw = localStorage.getItem('ufm_ptc_prices');
    var manualPrices = {};
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        for (var r = 50; r <= 99; r++) {
          if (parsed[r]) {
            var digits = String(parsed[r]).replace(/[^0-9]/g, '');
            if (digits !== '') {
              var n = parseInt(digits, 10);
              if (n > 0) manualPrices[r] = n;
            }
          }
        }
      } catch(e) {}
    }
    return manualPrices;
  }

  var players = getDatabasePlayers();
  var minPrices = {};
  players.forEach(function(p) {
    if (filterRarity && p.rarity !== filterRarity) return;
    var rat = parseInt(p.rating, 10);
    var pr = (p.price !== '' && p.price != null) ? parseInt(p.price, 10) : null;
    if (rat >= 50 && rat <= 99 && pr !== null && !isNaN(pr) && pr > 0) {
      if (!minPrices[rat] || pr < minPrices[rat]) minPrices[rat] = pr;
    }
  });
  return minPrices;
}

function thresholdFor(n, target) {
  return target * n - Math.floor(n / 2);
}

function solveSbc(n, target, prices) {
  if (!n || !target || n < 1 || target < 50) return null;
  var ratings = Object.keys(prices).map(Number).sort(function(a, b) { return a - b; });
  if (!ratings.length) return null;

  var minSum = thresholdFor(n, target);
  var maxSum = n * 99;

  var dp = new Array(maxSum + 1).fill(null);
  dp[0] = { cost: 0, counts: new Map() };

  for (var slot = 0; slot < n; slot++) {
    var ndp = new Array(maxSum + 1).fill(null);
    for (var s = 0; s <= 99 * slot; s++) {
      var state = dp[s];
      if (!state) continue;
      for (var i = 0; i < ratings.length; i++) {
        var r = ratings[i];
        var ns = s + r;
        var nc = state.cost + prices[r];
        var old = ndp[ns];
        if (!old || nc < old.cost) {
          var counts = new Map(state.counts);
          counts.set(r, (counts.get(r) || 0) + 1);
          ndp[ns] = { cost: nc, counts: counts };
        }
      }
    }
    dp = ndp;
  }

  var best = null, bestSum = null;
  for (var s = minSum; s <= maxSum; s++) {
    if (dp[s] && (!best || dp[s].cost < best.cost || (dp[s].cost === best.cost && s < bestSum))) {
      best = dp[s];
      bestSum = s;
    }
  }

  if (!best) return null;
  return { cost: best.cost, bestSum: bestSum, counts: best.counts };
}

function setPriceSource(src) {
  priceSource = src;
  document.getElementById('btnSrcDb').classList.toggle('active', src === 'db');
  document.getElementById('btnSrcManual').classList.toggle('active', src === 'manual');
  renderPtcList();
}

function generatePlayerFutCardHtml(p, isShield) {
  var imgUrl = p.image ? p.image : DEFAULT_AVATAR;
  var natFlag = getFlagUrl(p.country);
  var leagueFlag = getFlagUrl(p.league || p.country);
  var rClass = getRarityClass(p.rarity, p.rating);
  var t = i18n[currentLang] || i18n.es;
  var isGK = p.gkLabels || p.position === 'GK' || p.position === 'POR';

  var s1 = isGK ? (currentLang === 'es' ? 'EST' : 'DIV') : t.statPac;
  var s2 = isGK ? (currentLang === 'es' ? 'REF' : 'REF') : t.statDri;
  var s3 = isGK ? (currentLang === 'es' ? 'PAR' : 'HAN') : t.statSho;
  var s4 = isGK ? (currentLang === 'es' ? 'RIT' : 'SPE') : t.statDef;
  var s5 = isGK ? (currentLang === 'es' ? 'SAQ' : 'KIC') : t.statPas;
  var s6 = isGK ? (currentLang === 'es' ? 'COL' : 'POS') : t.statPhy;

  var cardContent = `
    <div class="fut-card ${rClass} ${isShield ? 'card-shield-shape' : ''}">
      <div class="card-top">
        <div class="card-meta">
          <span class="card-rat">${p.rating}</span>
          <span class="card-pos">${displayPosition(p.position, currentLang)}</span>
          <img class="flag-rect" title="${p.country || 'Nacionalidad'}" src="${natFlag}" onerror="this.src='https://flagcdn.com/w40/un.png'">
          <div class="shield-flag-wrap" title="${p.league || 'Liga'}">
            <img src="${leagueFlag}" onerror="this.src='https://flagcdn.com/w40/un.png'">
          </div>
        </div>
        <div class="card-img-wrap">
          <img class="card-img" src="${imgUrl}" onerror="this.src='${DEFAULT_AVATAR}'">
        </div>
      </div>
      <div class="card-info">
        <div class="card-name">${p.name}</div>
        <div class="card-club">${p.club || 'Sin Club'}</div>
      </div>
      <div class="card-stats">
        <div class="stat-row"><span class="stat-num">${p.pac || '0'}</span> <span class="stat-lbl">${s1}</span></div>
        <div class="stat-row"><span class="stat-num">${p.dri || '0'}</span> <span class="stat-lbl">${s2}</span></div>
        <div class="stat-row"><span class="stat-num">${p.sho || '0'}</span> <span class="stat-lbl">${s3}</span></div>
        <div class="stat-row"><span class="stat-num">${p.def || '0'}</span> <span class="stat-lbl">${s4}</span></div>
        <div class="stat-row"><span class="stat-num">${p.pas || '0'}</span> <span class="stat-lbl">${s5}</span></div>
        <div class="stat-row"><span class="stat-num">${p.phy || '0'}</span> <span class="stat-lbl">${s6}</span></div>
      </div>
    </div>
  `;

  if (isShield) {
    var shieldType = p.rarity || 'ptc';
    return `<div class="card-shield-border shield-${shieldType}">${cardContent}</div>`;
  }
  return cardContent;
}

function getGroupHexRowHtml(ptc) {
  var green = 0, yellow = 0, red = 0;
  if (ptc && ptc.subchallenges && ptc.subchallenges.length) {
    ptc.subchallenges.forEach(function(sub) {
      if (sub.difficulty) {
        var d = sub.difficulty.toLowerCase();
        if (d.includes('f') || d.includes('ea')) green++;
        else if (d.includes('m')) yellow++;
        else red++;
      } else {
        var val = sub.target || sub.rewardRating || 75;
        if (val >= 83) red++;
        else if (val >= 78) yellow++;
        else green++;
      }
    });
  }
  return `
    <div class="ptc-group-hex-row">
      <div class="ptc-hex-badge"><div class="ptc-hex-icon ptc-hex-green"></div>${green}</div>
      <div class="ptc-hex-badge"><div class="ptc-hex-icon ptc-hex-yellow"></div>${yellow}</div>
      <div class="ptc-hex-badge"><div class="ptc-hex-icon ptc-hex-red"></div>${red}</div>
    </div>
  `;
}

function getPlayerRole(pos) {
  var p = normalizePosition(pos);
  if (['CB', 'RB', 'LB'].includes(p)) return 'DEF';
  if (['CM', 'CDM', 'CAM', 'RM', 'LM'].includes(p)) return 'MID';
  if (['ST', 'RW', 'LW'].includes(p)) return 'ATT';
  return 'GK';
}

function checkPlayerMatches(p, type, cond) {
  if (!p) return false;
  if (type === 'exactPos') return normalizePosition(p.position) === normalizePosition(cond);
  if (type === 'league') return leaguesMatch(p.league, cond);
  if (type === 'country') return countriesMatch(p.country, cond);
  if (type === 'role') return getPlayerRole(p.position) === cond;
  if (type === 'minAge') return p.age && parseInt(p.age, 10) >= cond;
  if (type === 'maxAge') return p.age && parseInt(p.age, 10) <= cond;
  if (type === 'maxWeight') return p.weight && parseInt(p.weight, 10) <= cond;
  if (type === 'minDri') return p.dri && parseInt(p.dri, 10) >= cond;
  if (type === 'minSho') return p.sho && parseInt(p.sho, 10) >= cond;
  if (type === 'minPhy') return p.phy && parseInt(p.phy, 10) >= cond;
  return false;
}

function solveOptimalSquad(pool, k, targetSum) {
  if (k <= 0) return { cost: 0, sum: 0, players: [] };
  if (!pool || pool.length === 0) return null;

  var sortedPool = pool.slice().sort(function(a, b) {
    var pA = (+a.price) || 0, pB = (+b.price) || 0;
    if (pA !== pB) return pA - pB;
    return (+b.rating) - (+a.rating);
  });

  if (sortedPool.length >= k) {
    var cheapestK = sortedPool.slice(0, k);
    var cheapestSum = cheapestK.reduce(function(acc, p) { return acc + (+p.rating); }, 0);
    if (cheapestSum >= targetSum) {
      var cheapestCost = cheapestK.reduce(function(acc, p) { return acc + (+p.price); }, 0);
      return {
        cost: cheapestCost,
        sum: cheapestSum,
        players: cheapestK.sort(function(a, b) { return (+b.rating) - (+a.rating); })
      };
    }
  }

  var byRating = {};
  var pruned = [];
  for (var i = 0; i < sortedPool.length; i++) {
    var p = sortedPool[i];
    var r = +p.rating;
    byRating[r] = (byRating[r] || 0) + 1;
    if (byRating[r] <= k) pruned.push(p);
  }

  var actualK = Math.min(k, pruned.length);
  if (actualK <= 0) return null;

  var maxSum = actualK * 99;
  var stride = maxSum + 1;
  var totalStates = (actualK + 1) * stride;

  var dpCost = new Int32Array(totalStates).fill(-1);
  var dpParentS = new Int32Array(totalStates).fill(-1);
  var dpPlayer = new Int32Array(totalStates).fill(-1);

  dpCost[0] = 0;

  for (var pIdx = 0; pIdx < pruned.length; pIdx++) {
    var player = pruned[pIdx];
    var pRat = +player.rating;
    var pPrice = +player.price;

    for (var c = actualK; c >= 1; c--) {
      var cOffset = c * stride;
      var prevCOffset = (c - 1) * stride;

      for (var s = maxSum; s >= pRat; s--) {
        var prevCost = dpCost[prevCOffset + (s - pRat)];
        if (prevCost !== -1) {
          var newCost = prevCost + pPrice;
          var currIdx = cOffset + s;
          var currCost = dpCost[currIdx];

          if (currCost === -1 || newCost < currCost) {
            dpCost[currIdx] = newCost;
            dpParentS[currIdx] = s - pRat;
            dpPlayer[currIdx] = pIdx;
          }
        }
      }
    }
  }

  var bestCost = -1, bestS = -1;
  for (var s = targetSum; s <= maxSum; s++) {
    var costAtS = dpCost[actualK * stride + s];
    if (costAtS !== -1) {
      if (bestCost === -1 || costAtS < bestCost || (costAtS === bestCost && s < bestS)) {
        bestCost = costAtS;
        bestS = s;
      }
    }
  }

  if (bestCost === -1) {
    for (var s = targetSum - 1; s >= 0; s--) {
      var costBelow = dpCost[actualK * stride + s];
      if (costBelow !== -1) {
        bestCost = costBelow;
        bestS = s;
        break;
      }
    }
  }

  if (bestCost === -1) return null;

  var chosen = [];
  var currS = bestS;
  for (var c = actualK; c >= 1; c--) {
    var stateIdx = c * stride + currS;
    var chosenPIdx = dpPlayer[stateIdx];
    chosen.push(pruned[chosenPIdx]);
    currS = dpParentS[stateIdx];
  }

  chosen.sort(function(a, b) { return (+b.rating) - (+a.rating); });
  return { cost: bestCost, sum: bestS, players: chosen };
}

function formatMissingReqLabel(m, lang) {
  var t = i18n[lang] || i18n.es;
  if (!m) return '';
  if (m.type === 'pos') {
    return (t.labelPosition || 'Posición') + ': ' + displayPosition(m.pos, lang);
  }
  if (m.type === 'league') {
    return getLocalizedLeagueName(m.cond, lang);
  }
  if (m.type === 'country') {
    return getLocalizedCountryName(m.cond, lang);
  }
  if (m.type === 'role') {
    return m.cond === 'DEF' ? t.roleDef : (m.cond === 'MID' ? t.roleMid : t.roleAtt);
  }
  if (m.type === 'minAge') {
    return (t.reqAgeMin || 'Edad ≥ {val}').replace('{val}', m.cond);
  }
  if (m.type === 'maxAge') {
    return (t.reqAgeMax || 'Edad ≤ {val}').replace('{val}', m.cond);
  }
  if (m.type === 'maxWeight') {
    return (t.reqWeightMax || 'Peso ≤ {val}kg').replace('{val}', m.cond);
  }
  if (m.type === 'minDri') {
    return (t.statDri || 'REG') + ' ≥ ' + m.cond;
  }
  if (m.type === 'minSho') {
    return (t.statSho || 'TIR') + ' ≥ ' + m.cond;
  }
  if (m.type === 'minPhy') {
    return (t.statPhy || 'FIS') + ' ≥ ' + m.cond;
  }
  if (m.type === 'fullSquad') {
    return (t.labelFullSquad || 'Plantilla completa ({n} jugadores con precio)').replace('{n}', m.cond);
  }
  return m.label || m.cond || '';
}

function solveSquadWithRequirements(dbCandidates, targetPtc, prices) {
  var n = targetPtc.players || 11;
  var target = targetPtc.target;
  var minTotalSum = thresholdFor(n, target);
  var reqs = targetPtc.reqs;

  var candidates = (dbCandidates || []).map(function(p, idx) {
    var cleanN = p.name ? p.name.replace(/\s*\([^)]*\)/g, '').trim().toLowerCase() : 'p';
    var uid = (p.id != null && p.id !== '') ? String(p.id) : (cleanN + '_' + p.rating + '_' + normalizePosition(p.position) + '_' + (p.club || '') + '_' + idx);
    return Object.assign({}, p, { _uid: uid, _dbIndex: idx });
  }).filter(function(p) {
    var pr = parseInt(p.price, 10);
    var rat = parseInt(p.rating, 10);
    return !isNaN(pr) && pr > 0 && !isNaN(rat) && rat >= 50 && rat <= 99;
  });

  // Si no hay requisitos especiales:
  if (!reqs) {
    if (priceSource === 'db' && candidates.length >= n) {
      var opt = solveOptimalSquad(candidates, n, minTotalSum);
      if (opt && opt.players.length === n) {
        var slots = opt.players.map(function(p) { return { rating: +p.rating, player: p }; });
        slots.sort(function(a, b) { return b.rating - a.rating; });
        return { isComplete: true, cost: opt.cost, sumRating: opt.sum, slots: slots, missingReqs: [] };
      }
    }
    var rawSol = solveSbc(n, target, prices);
    if (!rawSol) return null;
    var rawSlots = [];
    rawSol.counts.forEach(function(count, rating) {
      for (var i = 0; i < count; i++) rawSlots.push({ rating: rating, player: null });
    });
    rawSlots.sort(function(a, b) { return b.rating - a.rating; });
    return { isComplete: true, cost: rawSol.cost, sumRating: rawSol.bestSum, slots: rawSlots, missingReqs: [] };
  }

  // Desafío CON requisitos especiales obligatorios:
  var usedUids = new Set();
  var selectedPlayers = [];
  var missingReqs = [];
  var missingSlotsList = [];

  // 1. Exact Positions
  if (reqs.exactPositions && Array.isArray(reqs.exactPositions)) {
    reqs.exactPositions.forEach(function(ep) {
      var needed = ep.count;
      var foundCount = 0;
      var pool = candidates.filter(function(p) {
        return !usedUids.has(p._uid) && checkPlayerMatches(p, 'exactPos', ep.pos);
      }).sort(function(a, b) { return (+a.price) - (+b.price); });

      for (var i = 0; i < needed; i++) {
        if (i < pool.length) {
          var chosen = pool[i];
          usedUids.add(chosen._uid);
          selectedPlayers.push(chosen);
          foundCount++;
        } else {
          missingSlotsList.push({ type: 'pos', pos: ep.pos });
        }
      }

      if (foundCount < needed) {
        missingReqs.push({
          type: 'pos',
          pos: ep.pos,
          required: needed,
          found: foundCount,
          missing: needed - foundCount
        });
      }
    });
  }

  // 2. Otros requisitos
  var conditionGroups = [];
  if (reqs.minLeague) {
    conditionGroups.push({
      type: 'league', cond: reqs.minLeague.name, count: reqs.minLeague.count
    });
  }
  if (reqs.minCountry) {
    conditionGroups.push({
      type: 'country', cond: reqs.minCountry.name, count: reqs.minCountry.count
    });
  }
  if (reqs.minRole) {
    conditionGroups.push({
      type: 'role', cond: reqs.minRole.role, count: reqs.minRole.count
    });
  }
  if (reqs.minAge && reqs.minAgeCount) {
    conditionGroups.push({
      type: 'minAge', cond: reqs.minAge, count: reqs.minAgeCount
    });
  }
  if (reqs.maxAge && reqs.maxAgeCount) {
    conditionGroups.push({
      type: 'maxAge', cond: reqs.maxAge, count: reqs.maxAgeCount
    });
  }
  if (reqs.maxWeight && reqs.maxWeightCount) {
    conditionGroups.push({
      type: 'maxWeight', cond: reqs.maxWeight, count: reqs.maxWeightCount
    });
  }
  if (reqs.minDri && reqs.minDriCount) {
    conditionGroups.push({ type: 'minDri', cond: reqs.minDri, count: reqs.minDriCount });
  }
  if (reqs.minSho && reqs.minShoCount) {
    conditionGroups.push({ type: 'minSho', cond: reqs.minSho, count: reqs.minShoCount });
  }
  if (reqs.minPhy && reqs.minPhyCount) {
    conditionGroups.push({ type: 'minPhy', cond: reqs.minPhy, count: reqs.minPhyCount });
  }

  conditionGroups.forEach(function(cg) {
    var alreadyCovered = 0;
    selectedPlayers.forEach(function(sp) {
      if (!sp._tags) sp._tags = [];
      if (!sp._tags.includes(cg.type) && checkPlayerMatches(sp, cg.type, cg.cond)) {
        sp._tags.push(cg.type);
        alreadyCovered++;
      }
    });

    var stillNeeded = Math.max(0, cg.count - alreadyCovered);
    if (stillNeeded > 0) {
      var pool = candidates.filter(function(p) {
        return !usedUids.has(p._uid) && checkPlayerMatches(p, cg.type, cg.cond);
      }).sort(function(a, b) { return (+a.price) - (+b.price); });

      var pickedCount = 0;
      for (var i = 0; i < stillNeeded; i++) {
        if (i < pool.length) {
          var chosen = pool[i];
          if (!chosen._tags) chosen._tags = [];
          chosen._tags.push(cg.type);
          usedUids.add(chosen._uid);
          selectedPlayers.push(chosen);
          pickedCount++;
        } else {
          missingSlotsList.push({ type: cg.type, cond: cg.cond });
        }
      }

      if (pickedCount < stillNeeded) {
        var totalAvailable = candidates.filter(function(p) { return checkPlayerMatches(p, cg.type, cg.cond); }).length;
        missingReqs.push({
          type: cg.type,
          cond: cg.cond,
          required: cg.count,
          found: totalAvailable,
          missing: stillNeeded - pickedCount
        });
      }
    }
  });

  // SI FALTAN REQUISITOS OBLIGATORIOS:
  // ¡NO RELLENAR CON JUGADORES RANDOM!
  if (missingReqs.length > 0) {
    var slots = [];
    selectedPlayers.forEach(function(p) {
      slots.push({ rating: +p.rating, player: p, isMissingReq: false });
    });
    missingSlotsList.forEach(function(ms) {
      slots.push({ rating: '—', player: null, isMissingReq: true, missingData: ms });
    });
    while (slots.length < n) {
      slots.push({ rating: target, player: null, isMissingReq: false, isUnfilled: true });
    }
    slots = slots.slice(0, n);
    return {
      isComplete: false,
      cost: 0,
      sumRating: 0,
      slots: slots,
      missingReqs: missingReqs
    };
  }

  // SI SE CUMPLEN TODOS LOS REQUISITOS:
  var remainingSlots = n - selectedPlayers.length;
  var currentSum = selectedPlayers.reduce(function(acc, p) { return acc + (+p.rating); }, 0);
  var currentCost = selectedPlayers.reduce(function(acc, p) { return acc + (+p.price); }, 0);

  var slots = selectedPlayers.map(function(p) {
    return { rating: +p.rating, player: p, isMissingReq: false };
  });

  if (remainingSlots > 0) {
    var neededSum = Math.max(0, minTotalSum - currentSum);
    var remainingCandidates = candidates.filter(function(p) { return !usedUids.has(p._uid); });
    var remOptimal = solveOptimalSquad(remainingCandidates, remainingSlots, neededSum);

    if (remOptimal && remOptimal.players.length === remainingSlots) {
      remOptimal.players.forEach(function(p) {
        slots.push({ rating: +p.rating, player: p, isMissingReq: false });
      });
      currentCost += remOptimal.cost;
      currentSum += remOptimal.sum;
    } else {
      var missingCount = remainingSlots - (remOptimal ? remOptimal.players.length : 0);
      missingReqs.push({
        type: 'fullSquad',
        cond: n,
        required: n,
        found: candidates.length,
        missing: missingCount
      });
      return {
        isComplete: false,
        cost: 0,
        sumRating: 0,
        slots: slots,
        missingReqs: missingReqs
      };
    }
  }

  slots.sort(function(a, b) { return b.rating - a.rating; });
  return {
    isComplete: true,
    cost: currentCost,
    sumRating: currentSum,
    slots: slots,
    missingReqs: []
  };
}

function renderPtcList() {
  var t = i18n[currentLang] || i18n.es;
  var db = getDatabasePlayers();
  var defaultPrices = getActivePrices(null);

  document.getElementById('statDbCount').textContent = db.length;
  document.getElementById('statPtcCount').textContent = ptcList.length;

  var filtered = ptcList.filter(function(p) { return p.category === currentCategory; });
  var grid = document.getElementById('ptcGrid');
  grid.innerHTML = '';

  filtered.forEach(function(ptc) {
    var card = document.createElement('div');
    card.onclick = function() { openPtcModal(ptc); };

    if (ptc.isRepeatable && ptc.bigRating) {
      card.className = 'ptc-card-game ' + (ptc.theme || '');
      var repeatTitle = (currentLang === 'es' ? 'REPETIBLE #' : 'REPEATABLE #') + ptc.repeatNum;
      var pPrices = ptc.requiredRarity ? getActivePrices(ptc.requiredRarity) : defaultPrices;
      var sSol = null;
      if (priceSource === 'db' && db && db.length > 0) {
        var dbFiltered = ptc.requiredRarity ? db.filter(function(p) { return p.rarity === ptc.requiredRarity; }) : db;
        sSol = solveSquadWithRequirements(dbFiltered, ptc, pPrices);
      } else {
        sSol = solveSbc(ptc.players, ptc.target, pPrices);
      }
      var costBadgeText = sSol && sSol.cost ? (Number(sSol.cost).toLocaleString('es-ES') + ' 🪙') : '—';

      card.innerHTML = `
        <div class="ptc-bg-side"></div>
        <div class="ptc-card-cost-badge">${costBadgeText}</div>
        <svg class="ptc-badge-icon" viewBox="0 0 24 24" fill="none" stroke="#fae69e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.19"/>
        </svg>
        <div class="ptc-shield-plate">
          <span class="ptc-rating-val">${ptc.bigRating}</span>
        </div>
        <div class="ptc-game-footer">
          <span class="ptc-game-title">${repeatTitle}</span>
          <div class="ptc-game-arrow-btn">❯</div>
        </div>
      `;
      grid.appendChild(card);
      return;
    }

    var rewardData = ptcRewards[ptc.id];

    if (rewardData && (rewardData.type === 'wl' || ptc.id === 's_wl_1' || ptc.id === 's_wl_2')) {
      card.className = 'ptc-card-wl';
      var minR = ptc.id === 's_wl_2' ? 84 : 81;
      var diffLabel = ptc.id === 's_wl_2' ? (currentLang === 'es' ? 'Media' : 'Medium') : (currentLang === 'es' ? 'Fácil' : 'Easy');
      var hexColorClass = ptc.id === 's_wl_2' ? 'ptc-hex-yellow' : 'ptc-hex-green';
      var wlTitle = getPtcTitle(ptc.id);

      card.innerHTML = `
        <div class="ptc-bg-side"></div>
        <div class="ptc-wl-header-bar">
          <div></div>
          <div class="ptc-wl-difficulty">
            <span class="ptc-hex-icon ${hexColorClass}"></span>
            <span>${diffLabel}</span>
          </div>
        </div>
        <div class="ptc-wl-plate">
          <div class="ptc-wl-rat-tag">${minR}+</div>
          <div class="ptc-wl-info-icon">i</div>
          <div class="ptc-wl-title">WEEKEND<br>LEAGUE</div>
          <div class="ptc-wl-sub">ELECCIÓN DE DRAFT</div>
          <div class="ptc-wl-draft-badge"><span>%</span> 1/3</div>
        </div>
        <div class="ptc-squad-counter">0/1</div>
        <div class="ptc-game-footer">
          <span class="ptc-game-title">${wlTitle}</span>
          <div class="ptc-game-arrow-btn">❯</div>
        </div>
      `;
      grid.appendChild(card);
      return;
    }

    if (rewardData && rewardData.type === 'player') {
      var groupTheme = 'theme-group-season';
      if (ptc.id === 'b_bronze_group') groupTheme = 'theme-group-bronze';
      else if (ptc.id === 'b_silver_group') groupTheme = 'theme-group-silver';
      else if (ptc.id === 'b_gold_group') groupTheme = 'theme-group-gold';

      card.className = 'ptc-card-player-group ' + groupTheme;
      var totalSquads = ptc.subchallenges ? ptc.subchallenges.length : 4;
      var counterText = `0/${totalSquads}`;
      var footerTitle = getPtcTitle(ptc.id);
      if (groupShortTitles[ptc.id]) {
        var se = groupShortTitles[ptc.id];
        footerTitle = se[currentLang] || se.es || se.en;
      }

      var cardRarity = rewardData.rarity || 'ptc';
      var mockPlayer = {
        name: rewardData.name,
        rating: rewardData.rating,
        position: rewardData.pos,
        rarity: cardRarity,
        country: rewardData.country,
        league: rewardData.league,
        club: rewardData.club,
        image: rewardData.image,
        pac: rewardData.stats ? rewardData.stats.pac : 70,
        sho: rewardData.stats ? rewardData.stats.sho : 70,
        pas: rewardData.stats ? rewardData.stats.pas : 70,
        dri: rewardData.stats ? rewardData.stats.dri : 70,
        def: rewardData.stats ? rewardData.stats.def : 70,
        phy: rewardData.stats ? rewardData.stats.phy : 70,
        gkLabels: rewardData.gkLabels
      };

      card.innerHTML = `
        <div class="ptc-bg-side"></div>
        ${getGroupHexRowHtml(ptc)}
        <div class="ptc-player-card-center">
          ${generatePlayerFutCardHtml(mockPlayer, true)}
        </div>
        <div class="ptc-squad-counter">${counterText}</div>
        <div class="ptc-game-footer">
          <span class="ptc-game-title">${footerTitle}</span>
          <div class="ptc-game-arrow-btn">❯</div>
        </div>
      `;
      grid.appendChild(card);
      return;
    }

    if (ptc.category === 'season') {
      card.className = 'ptc-card-game theme-locked-season';
      var lockedTitle = getPtcTitle(ptc.id);
      var totalSquads = ptc.subchallenges ? ptc.subchallenges.length : 4;
      var lockedLabel = (t.lockedLabel || '🔒 BLOQUEADO');

      card.innerHTML = `
        <div class="ptc-bg-side"></div>
        <div class="ptc-card-locked-badge">${lockedLabel}</div>
        <div class="ptc-shield-plate">
          <span class="ptc-locked-icon">🔒</span>
        </div>
        <div class="ptc-squad-counter">0/${totalSquads}</div>
        <div class="ptc-game-footer">
          <span class="ptc-game-title">${lockedTitle}</span>
          <div class="ptc-game-arrow-btn">❯</div>
        </div>
      `;
      grid.appendChild(card);
      return;
    }

    card.className = 'ptc-card card';
    var badgeInfo = getPtcBadgeInfo(ptc);
    var localizedTitle = getPtcTitle(ptc.id);
    var rewardFormatted = formatPtcReward(ptc.id);
    var rewardHtml = rewardFormatted ? `<div class="ptc-reward"><span>🎁</span> <b>${rewardFormatted}</b></div>` : '';

    var reqHtml = '';
    var costText = '—';
    var prices = ptc.requiredRarity ? getActivePrices(ptc.requiredRarity) : defaultPrices;

    if (ptc.subchallenges && ptc.subchallenges.length) {
      var targets = ptc.subchallenges.map(function(s) { return s.isPending ? '—' : s.target; }).join(', ');
      reqHtml = `
        <div class="ptc-req-item"><span>${t.reqSquads}</span> <b>${ptc.subchallenges.length}</b></div>
        <div class="ptc-req-item"><span>${t.reqTarget}</span> <b>⭐ ${targets}</b></div>
      `;
    } else {
      reqHtml = `
        <div class="ptc-req-item"><span>${t.reqPlayers}</span> <b>${ptc.players}</b></div>
        <div class="ptc-req-item"><span>${t.reqTarget}</span> <b>⭐ ${ptc.target}</b></div>
      `;
      var sol = solveSbc(ptc.players, ptc.target, prices);
      if (sol) costText = Number(sol.cost).toLocaleString('es-ES') + ' 🪙';
    }

    card.innerHTML = `
      <div>
        <div class="ptc-header">
          <h3 class="ptc-title">${localizedTitle}</h3>
          <span class="ptc-badge-type ${badgeInfo.className}">${badgeInfo.label}</span>
        </div>
        ${rewardHtml}
        <div class="ptc-reqs">${reqHtml}</div>
      </div>
      <div class="ptc-footer">
        <div>
          <small style="color:var(--muted); font-size:10px; display:block">${t.estCost}</small>
          <span class="ptc-cost">${costText}</span>
        </div>
        <span class="ptc-action">${t.viewSolution}</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

function openPtcModal(ptc) {
  activeModalPtc = ptc;
  activeSubIndex = 0;

  var subTabsWrap = document.getElementById('subTabsWrap');
  if (ptc.subchallenges && ptc.subchallenges.length) {
    subTabsWrap.style.display = 'grid';
    subTabsWrap.innerHTML = ptc.subchallenges.map(function(sub, idx) {
      var packRating = sub.rewardRating || (sub.target ? sub.target : (ptc.target || 80));
      var packTag = packRating + '+';
      var subTitle = sub.name || (getPtcTitle(ptc.id) + ' ' + (idx + 1));
      var packInfo = getPackStyleInfo(packRating, ptc.id, sub.difficulty);

      return `
        <div class="sub-tab-card ${idx === 0 ? 'active' : ''}" onclick="selectSubChallenge(${idx})">
          <div class="sub-card-top-bar">
            <span class="sub-card-diff-label">${packInfo.diffLabel}</span>
            <div class="ptc-hex-icon ${packInfo.hexClass}"></div>
          </div>
          <div class="sub-shield-pack ${packInfo.cssClass}">
            <div class="sub-shield-rat-tag">${packTag}</div>
            <div class="sub-shield-info-btn">i</div>
            <div class="sub-shield-title">${packInfo.mainTitle}</div>
            <div class="sub-shield-sub">${packInfo.subTitle}</div>
            <div class="sub-shield-single-tag"><span>%</span> 1</div>
          </div>
          <div class="sub-brush-counter">0/1</div>
          <div class="sub-card-footer">
            <span class="sub-card-footer-title" title="${subTitle}">${subTitle}</span>
            <div class="sub-card-arrow">❯</div>
          </div>
        </div>
      `;
    }).join('');
  } else {
    subTabsWrap.style.display = 'none';
    subTabsWrap.innerHTML = '';
  }

  renderModalContent();
  document.getElementById('modalBg').classList.add('open');
}

function selectSubChallenge(idx) {
  activeSubIndex = idx;
  var cards = document.querySelectorAll('.sub-tab-card');
  cards.forEach(function(c, i) { c.classList.toggle('active', i === idx); });
  renderModalContent();
}

function getPackStyleInfo(ratingVal, ptcId, customDifficulty) {
  var r = parseInt(ratingVal, 10) || 80;
  var diffLabel = 'Fácil', hexClass = 'ptc-hex-green';
  if (r >= 83) { diffLabel = 'Difícil'; hexClass = 'ptc-hex-red'; }
  else if (r >= 78) { diffLabel = 'Media'; hexClass = 'ptc-hex-yellow'; }

  if (customDifficulty) {
    diffLabel = customDifficulty;
    if (customDifficulty === 'Fácil') hexClass = 'ptc-hex-green';
    else if (customDifficulty.includes('Med')) hexClass = 'ptc-hex-yellow';
    else if (customDifficulty.includes('Dif')) hexClass = 'ptc-hex-red';
  }

  if (ptcId && ptcId.includes('totw')) {
    return { cssClass: 'pack-totw', mainTitle: 'TEAM<br>OF THE WEEK', subTitle: 'SOBRE INDIVIDUAL', diffLabel: diffLabel, hexClass: hexClass };
  }
  if (r <= 64) {
    return { cssClass: 'pack-bronze', mainTitle: 'BRONZE', subTitle: 'SOBRE INDIVIDUAL', diffLabel: diffLabel, hexClass: hexClass };
  }
  if (r <= 74) {
    return { cssClass: 'pack-silver', mainTitle: 'SILVER', subTitle: 'SOBRE INDIVIDUAL', diffLabel: diffLabel, hexClass: hexClass };
  }
  if (r <= 77) {
    return { cssClass: 'pack-gold', mainTitle: 'GOLD', subTitle: 'SOBRE INDIVIDUAL', diffLabel: diffLabel, hexClass: hexClass };
  }
  if (r <= 79) {
    return { cssClass: 'pack-emerald', mainTitle: 'PREMIUM<br>GOLD', subTitle: 'SOBRE INDIVIDUAL', diffLabel: diffLabel, hexClass: hexClass };
  }
  return { cssClass: 'pack-purple', mainTitle: 'ELITE<br>GOLD', subTitle: 'SOBRE INDIVIDUAL', diffLabel: diffLabel, hexClass: hexClass };
}

function renderModalContent() {
  var t = i18n[currentLang] || i18n.es;
  var ptc = activeModalPtc;
  if (!ptc) return;

  var isMulti = ptc.subchallenges && ptc.subchallenges.length;
  var currentTargetPtc = isMulti ? ptc.subchallenges[activeSubIndex] : ptc;
  var filterRarity = currentTargetPtc.requiredRarity || ptc.requiredRarity || null;
  
  var prices = getActivePrices(filterRarity);
  var db = priceSource === 'db' ? getDatabasePlayers() : [];
  if (filterRarity) {
    db = db.filter(function(p) { return p.rarity === filterRarity; });
  }

  var localizedTitle = getPtcTitle(ptc.id);
  if (isMulti) {
    var subName = formatSubChallengeName(currentTargetPtc);
    localizedTitle = localizedTitle + ' - ' + subName;
  }

  var squadGrid = document.getElementById('squadGrid');
  squadGrid.innerHTML = '';
  var warningContainer = document.getElementById('modalWarningContainer');
  if (warningContainer) warningContainer.innerHTML = '';

  var reqPanel = document.getElementById('modalReqPanel');
  var reqTags = document.getElementById('modalReqTags');

  if (currentTargetPtc.reqs) {
    reqPanel.style.display = 'block';
    reqTags.innerHTML = '';
    var r = currentTargetPtc.reqs;

    if (r.exactPositions) {
      r.exactPositions.forEach(function(ep) {
        reqTags.innerHTML += `<span class="req-tag" style="background:#28352d; border-color:#38a169; color:#68d391">⚽ ${displayPosition(ep.pos, currentLang)} (${ep.count})</span>`;
      });
    }
    if (r.minLeague) {
      var locLeague = getLocalizedLeagueName(r.minLeague.name, currentLang);
      reqTags.innerHTML += `<span class="req-tag">🌍 ${locLeague} (${t.minPrefix} ${r.minLeague.count})</span>`;
    }
    if (r.minCountry) {
      var locCountry = getLocalizedCountryName(r.minCountry.name, currentLang);
      reqTags.innerHTML += `<span class="req-tag">🏳️ ${locCountry} (${t.minPrefix} ${r.minCountry.count})</span>`;
    }
    if (r.minRole) {
      var roleName = r.minRole.role === 'DEF' ? t.roleDef : (r.minRole.role === 'MID' ? t.roleMid : t.roleAtt);
      reqTags.innerHTML += `<span class="req-tag">🛡️ ${roleName} (${t.minPrefix} ${r.minRole.count})</span>`;
    }
    if (r.minAge) reqTags.innerHTML += `<span class="req-tag">🎂 ${t.reqAgeMin.replace('{val}', r.minAge)} (${t.minPrefix} ${r.minAgeCount})</span>`;
    if (r.maxAge) reqTags.innerHTML += `<span class="req-tag">👶 ${t.reqAgeMax.replace('{val}', r.maxAge)} (${t.minPrefix} ${r.maxAgeCount})</span>`;
    if (r.maxWeight) reqTags.innerHTML += `<span class="req-tag">⚖️ ${t.reqWeightMax.replace('{val}', r.maxWeight)} (${t.minPrefix} ${r.maxWeightCount})</span>`;
    if (r.minDri) reqTags.innerHTML += `<span class="req-tag">⚡ ${t.statDri} ≥ ${r.minDri} (${t.minPrefix} ${r.minDriCount})</span>`;
    if (r.minSho) reqTags.innerHTML += `<span class="req-tag">🎯 ${t.statSho} ≥ ${r.minSho} (${t.minPrefix} ${r.minShoCount})</span>`;
    if (r.minPhy) reqTags.innerHTML += `<span class="req-tag">💪 ${t.statPhy} ≥ ${r.minPhy} (${t.minPrefix} ${r.minPhyCount})</span>`;
  } else {
    reqPanel.style.display = 'none';
  }

  if (currentTargetPtc.isPending) {
    document.getElementById('modalPtcTitle').textContent = localizedTitle;
    document.getElementById('modalPtcSubtitle').textContent = t.pendingDetails;
    document.getElementById('solCost').textContent = '—';
    document.getElementById('solTarget').textContent = '—';
    document.getElementById('solAvg').textContent = '—';
    squadGrid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:35px; color:var(--muted)">📝 ${t.pendingDetails}</div>`;
    return;
  }

  var subtitleTemplate = t.modalSubtitle || "{players} jugadores · Media {target}";
  var localizedSubtitle = subtitleTemplate.replace('{players}', currentTargetPtc.players).replace('{target}', currentTargetPtc.target);
  var subRewardText = getSubChallengeRewardText(currentTargetPtc);
  if (subRewardText) localizedSubtitle += ' · 🎁 ' + subRewardText;

  document.getElementById('modalPtcTitle').textContent = localizedTitle;
  document.getElementById('modalPtcSubtitle').textContent = localizedSubtitle;

  var solution = solveSquadWithRequirements(db, currentTargetPtc, prices);

  if (!solution || !solution.slots || solution.slots.length === 0) {
    document.getElementById('solCost').textContent = '—';
    document.getElementById('solTarget').textContent = currentTargetPtc.target;
    document.getElementById('solAvg').textContent = '—';
    squadGrid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:30px; color:var(--danger)">${t.noPricesWarning}</div>`;
    return;
  }

  window._activeSquadPlayers = [];

  // CASO: FALTAN REQUISITOS OBLIGATORIOS (NO SE COMPLETA CON JUGADORES RANDOM)
  if (solution.isComplete === false && solution.missingReqs && solution.missingReqs.length > 0) {
    document.getElementById('solCost').innerHTML = `<span style="color:#fca5a5; font-size:15px">⚠️ ${t.statusIncomplete || 'Incompleto'}</span>`;
    document.getElementById('solTarget').textContent = currentTargetPtc.target;
    document.getElementById('solAvg').textContent = '—';

    var missingListItems = solution.missingReqs.map(function(m) {
      var label = formatMissingReqLabel(m, currentLang);
      var pattern = t.unfulfilledItemPattern || "Se requieren {required} jugador(es) con precio en la BD (encontrados: {found}). Faltan {missing}.";
      var detail = pattern
        .replace('{required}', m.required)
        .replace('{found}', m.found)
        .replace('{missing}', m.missing);
      return `<li><b>${label}:</b> ${detail}</li>`;
    }).join('');

    if (warningContainer) {
      warningContainer.innerHTML = `
        <div class="ptc-unfulfilled-warning">
          <div class="ptc-unfulfilled-header">
            <span style="font-size:24px">⚠️</span>
            <div>
              <h4>${t.unfulfilledTitle || 'Requisitos No Cumplidos'}</h4>
              <p>${t.unfulfilledNotice || 'No se puede completar el PTC porque faltan jugadores con precio en la Base de Datos que cumplan los requisitos obligatorios:'}</p>
            </div>
          </div>
          <ul class="ptc-unfulfilled-list">
            ${missingListItems}
          </ul>
          <div class="ptc-unfulfilled-tip">
            💡 <b>${t.unfulfilledNote || 'Nota: No se rellena la plantilla con jugadores aleatorios porque no cumplirían las condiciones del PTC.'}</b> ${t.unfulfilledTip || 'Añade o asigna precio a jugadores que cumplan estos requisitos en la Base de Datos.'}
          </div>
        </div>
      `;
    }

    solution.slots.forEach(function(item) {
      var slot = document.createElement('div');
      slot.className = 'squad-slot';

      if (item.player) {
        var chosen = item.player;
        var pIndex = window._activeSquadPlayers.push(chosen) - 1;
        var cClass = getCardClass(chosen.rating, chosen.rarity);
        var img = chosen.image ? chosen.image : DEFAULT_AVATAR;

        slot.innerHTML = `
          <div class="mini-card ${cClass}" onclick="openPlayerCardDetail(${pIndex})">
            <div class="mini-card-top">
              <span class="mini-card-rat">${chosen.rating}</span>
              <span class="mini-card-pos">${displayPosition(chosen.position, currentLang)}</span>
            </div>
            <img class="mini-card-img" src="${img}" onerror="this.src='${DEFAULT_AVATAR}'">
            <div class="mini-card-name">${chosen.name}</div>
            <div class="mini-card-club">${chosen.club || 'Sin Club'}</div>
            <div class="mini-card-price">${Number(chosen.price).toLocaleString('es-ES')} 🪙</div>
          </div>
        `;
      } else if (item.isMissingReq) {
        var missingName = formatMissingReqLabel(item.missingData, currentLang);
        slot.innerHTML = `
          <div class="squad-slot-empty squad-slot-missing">
            <span class="missing-badge">${t.unfulfilledBadge || '⚠️ FALTANTE'}</span>
            <b>${t.unfulfilledReqWord || 'Requisito'}</b>
            <span>${missingName}</span>
            <small>${t.unfulfilledNoPriceInDb || 'Sin jugadores con precio en BD'}</small>
          </div>
        `;
      } else {
        slot.innerHTML = `
          <div class="squad-slot-empty">
            <b>⭐ ${item.rating || currentTargetPtc.target}</b>
            <span>${t.unfulfilledPendingSlot || 'Slot pendiente'}</span>
            <small style="color:var(--muted)">${t.unfulfilledPendingDesc || 'Requiere cumplir condiciones previas'}</small>
          </div>
        `;
      }
      squadGrid.appendChild(slot);
    });
    return;
  }

  // CASO: TODOS LOS REQUISITOS CUMPLIDOS
  document.getElementById('solCost').textContent = Number(solution.cost).toLocaleString('es-ES') + ' 🪙';
  document.getElementById('solTarget').textContent = currentTargetPtc.target;
  document.getElementById('solAvg').textContent = (solution.sumRating / currentTargetPtc.players).toFixed(2).replace('.', ',');

  solution.slots.forEach(function(item) {
    var slot = document.createElement('div');
    slot.className = 'squad-slot';
    var chosen = item.player;
    var rat = item.rating;

    if (chosen) {
      var pIndex = window._activeSquadPlayers.push(chosen) - 1;
      var cClass = getCardClass(chosen.rating, chosen.rarity);
      var img = chosen.image ? chosen.image : DEFAULT_AVATAR;

      slot.innerHTML = `
        <div class="mini-card ${cClass}" onclick="openPlayerCardDetail(${pIndex})">
          <div class="mini-card-top">
            <span class="mini-card-rat">${chosen.rating}</span>
            <span class="mini-card-pos">${displayPosition(chosen.position, currentLang)}</span>
          </div>
          <img class="mini-card-img" src="${img}" onerror="this.src='${DEFAULT_AVATAR}'">
          <div class="mini-card-name">${chosen.name}</div>
          <div class="mini-card-club">${chosen.club || 'Sin Club'}</div>
          <div class="mini-card-price">${Number(chosen.price).toLocaleString('es-ES')} 🪙</div>
        </div>
      `;
    } else {
      var minP = prices[rat] ? Number(prices[rat]).toLocaleString('es-ES') + ' 🪙' : '—';
      slot.innerHTML = `
        <div class="squad-slot-empty">
          <b>⭐ ${rat}</b>
          <span>${t.anyPlayer} ⭐ ${rat}</span>
          <div class="mini-card-price" style="margin-top:8px">${minP}</div>
        </div>
      `;
    }
    squadGrid.appendChild(slot);
  });
}

function openPlayerCardDetail(index) {
  var p = window._activeSquadPlayers ? window._activeSquadPlayers[index] : null;
  if (!p) return;
  window._activeDetailPlayerIndex = index;

  var rarityText = getRarityLabel(p.rarity);
  var cleanName = p.name ? p.name.replace(/\s*\([^)]*\)/g, '').trim() : '';
  var status = getDateStatus(p.price_date);
  var t = i18n[currentLang] || i18n.es;

  var cardPlayerData = Object.assign({}, p, {
    name: cleanName, pac: p.pac || '0', sho: p.sho || '0', pas: p.pas || '0',
    dri: p.dri || '0', def: p.def || '0', phy: p.phy || '0'
  });

  var target = document.getElementById('detailCardTarget');
  target.innerHTML = generatePlayerFutCardHtml(cardPlayerData, true);
  var shieldElem = target.querySelector('.card-shield-border');
  if (shieldElem) shieldElem.classList.add('shield-db-size');

  document.getElementById('detName').textContent = cleanName + ' (' + p.rating + ')';
  document.getElementById('detSub').textContent = displayPosition(p.position, currentLang) + ' · ' + rarityText;
  document.getElementById('detClub').textContent = p.club || '—';
  document.getElementById('detLeague').textContent = getLocalizedLeagueName(p.league, currentLang) || '—';
  document.getElementById('detCountry').textContent = getLocalizedCountryName(p.country, currentLang) || '—';
  document.getElementById('detAge').textContent = p.age ? (p.age + ' ' + (t.yearsOld || 'años')) : '—';
  document.getElementById('detPhysique').textContent = (p.height ? p.height + ' cm' : '—') + ' / ' + (p.weight ? p.weight + ' kg' : '—');
  document.getElementById('detPrice').textContent = p.price ? (Number(p.price).toLocaleString('es-ES') + ' 🪙') : (t.noPrice || 'Sin precio');
  document.getElementById('detUpdated').innerHTML = '<span class="date-badge ' + status.colorClass + '">' + status.text + '</span>';

  document.getElementById('detailModalBg').classList.add('open');
}

function closeDetailModal(e) {
  if (!e || e.target === document.getElementById('detailModalBg')) {
    document.getElementById('detailModalBg').classList.remove('open');
    window._activeDetailPlayerIndex = null;
  }
}

function openQuickPriceFromPtcDetail() {
  if (window._activeDetailPlayerIndex == null || !window._activeSquadPlayers) return;
  var p = window._activeSquadPlayers[window._activeDetailPlayerIndex];
  if (!p) return;

  var cleanName = p.name ? p.name.replace(/\s*\([^)]*\)/g, '').trim() : '';
  var posStr = displayPosition(p.position, currentLang);
  
  var lbl = document.getElementById('quickPricePlayerLabel');
  if (lbl) lbl.innerHTML = `<b>${cleanName}</b> (${p.rating} · ${posStr})`;

  var input = document.getElementById('quickPriceInput');
  if (input) input.value = (p.price != null && p.price !== '') ? p.price : '';

  var qpBg = document.getElementById('quickPriceModalBg');
  if (qpBg) {
    qpBg.classList.add('open');
    setTimeout(function() { if (input) { input.focus(); input.select(); } }, 80);
  }
}

function closeQuickPriceModal(e) {
  if (!e || e.target === document.getElementById('quickPriceModalBg')) {
    var qpBg = document.getElementById('quickPriceModalBg');
    if (qpBg) qpBg.classList.remove('open');
  }
}

function updatePlayerPriceInStorage(p, newPrice) {
  var isoDate = new Date().toISOString();
  p.price = newPrice;
  p.price_date = isoDate;

  var allKeys = [DB_KEY, 'ufm27_db_v7', 'ufm27_database_v6', 'ufm27_database_v5', 'ufm27_database_v4', 'ufm_database_players_v2'];
  var normPName = normalizeSimple(p.name);
  var pRating = +p.rating || 0;
  var normPPos = normalizePosition(p.position);
  var anyUpdated = false;

  allKeys.forEach(function(key) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return;
      var list = JSON.parse(raw);
      if (!Array.isArray(list) || list.length === 0) return;

      var changed = false;
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var isMatch = false;

        if (p.id && item.id && String(p.id) === String(item.id)) isMatch = true;
        else if (p._uid && item._uid && p._uid === item._uid) isMatch = true;
        else if (p._dbIndex != null && p._dbIndex === i && normalizeSimple(item.name) === normPName) isMatch = true;
        else {
          var normItemName = normalizeSimple(item.name);
          if (normItemName && normPName && (normItemName === normPName || normItemName.replace(/\s+/g,'') === normPName.replace(/\s+/g,''))) {
            if (+item.rating === pRating) {
              var normItemPos = normalizePosition(item.position);
              if (normItemPos === normPPos || !item.position || !p.position) isMatch = true;
            }
          }
        }

        if (isMatch) {
          item.price = newPrice;
          item.price_date = isoDate;
          changed = true;
          anyUpdated = true;
        }
      }

      if (changed) localStorage.setItem(key, JSON.stringify(list));
    } catch(err) {}
  });

  if (!anyUpdated) {
    try {
      var currentDb = getDatabasePlayers();
      var foundInDb = false;
      for (var j = 0; j < currentDb.length; j++) {
        var it = currentDb[j];
        if (normalizeSimple(it.name) === normPName && +it.rating === pRating) {
          it.price = newPrice;
          it.price_date = isoDate;
          foundInDb = true;
        }
      }
      if (!foundInDb) {
        currentDb.push(Object.assign({}, p, { price: newPrice, price_date: isoDate }));
      }
      localStorage.setItem(DB_KEY, JSON.stringify(currentDb));
    } catch(e) {}
  }
}

function submitQuickPriceFromPtc(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (window._activeDetailPlayerIndex == null || !window._activeSquadPlayers) return;
  var p = window._activeSquadPlayers[window._activeDetailPlayerIndex];
  if (!p) return;

  var input = document.getElementById('quickPriceInput');
  var newPrice = input && input.value !== '' ? parseInt(input.value, 10) : '';
  if (isNaN(newPrice) || newPrice < 0) return;

  updatePlayerPriceInStorage(p, newPrice);

  var detPrice = document.getElementById('detPrice');
  if (detPrice) detPrice.textContent = Number(newPrice).toLocaleString('es-ES') + ' 🪙';
  var status = getDateStatus(p.price_date);
  var detUpdated = document.getElementById('detUpdated');
  if (detUpdated) detUpdated.innerHTML = '<span class="date-badge ' + status.colorClass + '">' + status.text + '</span>';

  closeQuickPriceModal();
  closeDetailModal();
  renderModalContent();
  renderPtcList();
}

function switchCategory(cat) {
  currentCategory = cat;
  document.getElementById('tabBasic').classList.toggle('active', cat === 'basic');
  document.getElementById('tabSeason').classList.toggle('active', cat === 'season');
  document.getElementById('tabLimited').classList.toggle('active', cat === 'limited');
  renderPtcList();
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('modalBg')) {
    document.getElementById('modalBg').classList.remove('open');
    activeModalPtc = null;
    renderPtcList();
  }
}

function applyTranslations() {
  var t = i18n[currentLang] || i18n.es;
  document.documentElement.lang = currentLang;
  document.getElementById('langSelect').value = currentLang;

  document.getElementById('lblNavHome').textContent = t.navHome;
  document.getElementById('lblNavDb').textContent = t.navDb;
  document.getElementById('lblNavCalc').textContent = t.navCalc;

  document.getElementById('lblHeroTitle').textContent = t.heroTitle;
  document.getElementById('lblHeroSubtitle').textContent = t.heroSubtitle;
  document.getElementById('lblStatPlayers').textContent = t.statPlayers;
  document.getElementById('lblStatActive').textContent = t.statActive;

  document.getElementById('tabBasic').textContent = t.tabBasic;
  document.getElementById('tabSeason').textContent = t.tabSeason;
  document.getElementById('tabLimited').textContent = t.tabLimited;

  document.getElementById('btnSrcDb').textContent = t.btnSrcDb;
  document.getElementById('btnSrcManual').textContent = t.btnSrcManual;

  document.getElementById('lblSumCost').textContent = t.sumCost;
  document.getElementById('lblSumTarget').textContent = t.sumTarget;
  document.getElementById('lblSumExact').textContent = t.sumExact;
  document.getElementById('lblSquadTitle').textContent = t.squadTitle;
  document.getElementById('lblModalReqTitle').textContent = t.specialReqTitle;

  if (document.getElementById('lblDetModalTitle')) document.getElementById('lblDetModalTitle').textContent = t.detModalTitle;
  if (document.getElementById('lblDetClub')) document.getElementById('lblDetClub').textContent = t.dClub;
  if (document.getElementById('lblDetLeague')) document.getElementById('lblDetLeague').textContent = t.dLeague;
  if (document.getElementById('lblDetCountry')) document.getElementById('lblDetCountry').textContent = t.dCountry;
  if (document.getElementById('lblDetAge')) document.getElementById('lblDetAge').textContent = t.dAge;
  if (document.getElementById('lblDetPhys')) document.getElementById('lblDetPhys').textContent = t.dPhys;
  if (document.getElementById('lblDetPrice')) document.getElementById('lblDetPrice').textContent = t.dPrice;
  if (document.getElementById('lblDetUpdated')) document.getElementById('lblDetUpdated').textContent = t.dUpdated;
  if (document.getElementById('btnEditPricePtcDetail')) document.getElementById('btnEditPricePtcDetail').textContent = t.btnEditPricePtcDetail;
  if (document.getElementById('btnClosePtcDetail')) document.getElementById('btnClosePtcDetail').textContent = t.btnClosePtcDetail;

  if (document.getElementById('lblQuickPriceTitle')) document.getElementById('lblQuickPriceTitle').textContent = t.quickPriceTitle;
  if (document.getElementById('lblQuickPriceHelp')) document.getElementById('lblQuickPriceHelp').textContent = t.quickPriceHelp;
  if (document.getElementById('lblQuickPriceInput')) document.getElementById('lblQuickPriceInput').textContent = t.lblQuickPriceInput;
  if (document.getElementById('btnCancelQuickPrice')) document.getElementById('btnCancelQuickPrice').textContent = t.btnCancelQuickPrice;
  if (document.getElementById('btnSaveQuickPrice')) document.getElementById('btnSaveQuickPrice').textContent = t.btnSaveQuickPrice;
}

function changeLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('ufm_lang', currentLang);
  applyTranslations();
  renderPtcList();
  if (activeModalPtc) {
    openPtcModal(activeModalPtc);
    selectSubChallenge(activeSubIndex);
  }
}

applyTranslations();
renderPtcList();
