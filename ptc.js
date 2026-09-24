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
  { id: "eng_3", code: "gb-eng", names: { es: "Inglaterra (3ª Div - League One)", en: "England (3rd Div - League One)", fr: "Angleterre (3ème Div - League One)", de: "England (3. Liga - League One)", it: "Inghilterra (3ª Div - League One)", pt: "Inglaterra (3ª Div - League One)" } },
  { id: "eng_4", code: "gb-eng", names: { es: "Inglaterra (4ª Div - League Two)", en: "England (4th Div - League Two)", fr: "Angleterre (4ème Div - League Two)", de: "England (4. Liga - League Two)", it: "Inghilterra (4ª Div - League Two)", pt: "Inglaterra (4ª Div - League Two)" } },
  { id: "fr_1", code: "fr", names: { es: "Francia (1ª Div - Ligue 1)", en: "France (1st Div - Ligue 1)", fr: "France (1ère Div - Ligue 1)", de: "Frankreich (1. Liga - Ligue 1)", it: "Francia (1ª Div - Ligue 1)", pt: "França (1ª Div - Ligue 1)" } },
  { id: "fr_2", code: "fr", names: { es: "Francia (2ª Div - Ligue 2)", en: "France (2nd Div - Ligue 2)", fr: "France (2ème Div - Ligue 2)", de: "Frankreich (2. Liga - Ligue 2)", it: "Francia (2ª Div - Ligue 2)", pt: "França (2ª Div - Ligue 2)" } },
  { id: "de_1", code: "de", names: { es: "Alemania (1ª Div - Bundesliga)", en: "Germany (1st Div - Bundesliga)", fr: "Allemagne (1ère Div - Bundesliga)", de: "Deutschland (1. Liga - Bundesliga)", it: "Germania (1ª Div - Bundesliga)", pt: "Alemanha (1ª Div - Bundesliga)" } },
  { id: "de_2", code: "de", names: { es: "Alemania (2ª Div - 2. Bundesliga)", en: "Germany (2nd Div - 2. Bundesliga)", fr: "Allemagne (2ème Div - 2. Bundesliga)", de: "Deutschland (2. Liga - 2. Bundesliga)", it: "Germania (2ª Div - 2. Bundesliga)", pt: "Alemanha (2ª Div - 2. Bundesliga)" } },
  { id: "de_3", code: "de", names: { es: "Alemania (3ª Div - 3. Liga)", en: "Germany (3rd Div - 3. Liga)", fr: "Allemagne (3ème Div - 3. Liga)", de: "Deutschland (3. Liga)", it: "Germania (3ª Div - 3. Liga)", pt: "Alemanha (3ª Div - 3. Liga)" } },
  { id: "it_1", code: "it", names: { es: "Italia (1ª Div - Serie A)", en: "Italy (1st Div - Serie A)", fr: "Italie (1ère Div - Serie A)", de: "Italien (1. Liga - Serie A)", it: "Italia (1ª Div - Serie A)", pt: "Itália (1ª Div - Serie A)" } },
  { id: "it_2", code: "it", names: { es: "Italia (2ª Div - Serie B)", en: "Italy (2nd Div - Serie B)", fr: "Italie (2ème Div - Serie B)", de: "Italien (2. Liga - Serie B)", it: "Italia (2ª Div - Serie B)", pt: "Itália (2ª Div - Serie B)" } },
  { id: "nl_1", code: "nl", names: { es: "Holanda (1ª Div - Eredivisie)", en: "Netherlands (1st Div - Eredivisie)", fr: "Pays-Bas (1ère Div - Eredivisie)", de: "Niederlande (1. Liga - Eredivisie)", it: "Paesi Bassi (1ª Div - Eredivisie)", pt: "Holanda (1ª Div - Eredivisie)" } },
  { id: "pt_1", code: "pt", names: { es: "Portugal (1ª Div - Liga Portugal)", en: "Portugal (1st Div - Liga Portugal)", fr: "Portugal (1ère Div - Liga Portugal)", de: "Portugal (1. Liga - Liga Portugal)", it: "Portogallo (1ª Div - Liga Portugal)", pt: "Portugal (1ª Div - Liga Portugal)" } },
  { id: "es_1", code: "es", names: { es: "España (1ª Div - LaLiga)", en: "Spain (1st Div - LaLiga)", fr: "Espagne (1ère Div - LaLiga)", de: "Spanien (1. Liga - LaLiga)", it: "Spagna (1ª Div - LaLiga)", pt: "Espanha (1ª Div - LaLiga)" } },
  { id: "es_2", code: "es", names: { es: "España (2ª Div - LaLiga Hypermotion)", en: "Spain (2nd Div - Hypermotion)", fr: "Espagne (2ème Div - Hypermotion)", de: "Spanien (2. Liga - Hypermotion)", it: "Spagna (2ª Div - Hypermotion)", pt: "Espanha (2ª Div - Hypermotion)" } },
  { id: "tr_1", code: "tr", names: { es: "Turquía (1ª Div - Süper Lig)", en: "Turkey (1st Div - Süper Lig)", fr: "Turquie (1ère Div - Süper Lig)", de: "Türkei (1. Liga - Süper Lig)", it: "Turchia (1ª Div - Süper Lig)", pt: "Turquia (1ª Div - Süper Lig)" } },
  { id: "ar_1", code: "ar", names: { es: "Argentina (1ª Div - Liga Profesional)", en: "Argentina (1st Div)", fr: "Argentine (1ère Div)", de: "Argentinien (1. Liga)", it: "Argentina (1ª Div)", pt: "Argentina (1ª Div)" } },
  { id: "au_1", code: "au", names: { es: "Australia (1ª Div - A-League)", en: "Australia (1st Div - A-League)", fr: "Australie (1ère Div - A-League)", de: "Australien (1. Liga - A-League)", it: "Australia (1ª Div - A-League)", pt: "Austrália (1ª Div - A-League)" } },
  { id: "at_1", code: "at", names: { es: "Austria (1ª Div - Bundesliga)", en: "Austria (1st Div - Bundesliga)", fr: "Autriche (1ère Div - Bundesliga)", de: "Österreich (1. Liga - Bundesliga)", it: "Austria (1ª Div - Bundesliga)", pt: "Áustria (1ª Div - Bundesliga)" } },
  { id: "br_1", code: "br", names: { es: "Brasil (1ª Div - Brasileirão)", en: "Brazil (1st Div - Brasileirão)", fr: "Brésil (1ère Div - Brasileirão)", de: "Brasilien (1. Liga - Brasileirão)", it: "Brasile (1ª Div - Brasileirão)", pt: "Brasil (1ª Div - Brasileirão)" } },
  { id: "dk_1", code: "dk", names: { es: "Dinamarca (1ª Div - Superliga)", en: "Denmark (1st Div - Superliga)", fr: "Danemark (1ère Div - Superliga)", de: "Dänemark (1. Liga - Superliga)", it: "Danimarca (1ª Div - Superliga)", pt: "Dinamarca (1ª Div - Superliga)" } },
  { id: "ie_1", code: "ie", names: { es: "Irlanda (1ª Div - Premier Div)", en: "Ireland (1st Div - Premier Div)", fr: "Irlande (1ère Div - Premier Div)", de: "Irland (1. Liga - Premier Div)", it: "Irlanda (1ª Div - Premier Div)", pt: "Irlanda (1ª Div - Premier Div)" } },
  { id: "no_1", code: "no", names: { es: "Noruega (1ª Div - Eliteserien)", en: "Norway (1st Div - Eliteserien)", fr: "Norvège (1ère Div - Eliteserien)", de: "Norwegen (1. Liga - Eliteserien)", it: "Norvegia (1ª Div - Eliteserien)", pt: "Noruega (1ª Div - Eliteserien)" } },
  { id: "pl_1", code: "pl", names: { es: "Polonia (1ª Div - Ekstraklasa)", en: "Poland (1st Div - Ekstraklasa)", fr: "Pologne (1ère Div - Ekstraklasa)", de: "Polen (1. Liga - Ekstraklasa)", it: "Polonia (1ª Div - Ekstraklasa)", pt: "Polónia (1ª Div - Ekstraklasa)" } },
  { id: "ro_1", code: "ro", names: { es: "Rumanía (1ª Div - Liga I)", en: "Romania (1st Div - Liga I)", fr: "Roumanie (1ère Div - Liga I)", de: "Rumänien (1. Liga - Liga I)", it: "Romania (1ª Div - Liga I)", pt: "Roménia (1ª Div - Liga I)" } },
  { id: "sct_1", code: "gb-sct", names: { es: "Escocia (1ª Div - Premiership)", en: "Scotland (1st Div - Premiership)", fr: "Écosse (1ère Div - Premiership)", de: "Schottland (1. Liga - Premiership)", it: "Scozia (1ª Div - Premiership)", pt: "Escócia (1ª Div - Premiership)" } },
  { id: "kr_1", code: "kr", names: { es: "Corea del Sur (1ª Div - K League)", en: "South Korea (1st Div - K League)", fr: "Corée du Sud (1ère Div - K League)", de: "Südkorea (1. Liga - K League)", it: "Corea del Sud (1ª Div - K League)", pt: "Coreia do Sul (1ª Div - K League)" } },
  { id: "se_1", code: "se", names: { es: "Suecia (1ª Div - Allsvenskan)", en: "Sweden (1st Div - Allsvenskan)", fr: "Suède (1ère Div - Allsvenskan)", de: "Schweden (1. Liga - Allsvenskan)", it: "Svezia (1ª Div - Allsvenskan)", pt: "Suécia (1ª Div - Allsvenskan)" } },
  { id: "ch_1", code: "ch", names: { es: "Suiza (1ª Div - Super League)", en: "Switzerland (1st Div - Super League)", fr: "Suisse (1ère Div - Super League)", de: "Schweiz (1. Liga - Super League)", it: "Svizzera (1ª Div - Super League)", pt: "Suíça (1ª Div - Super League)" } }
];

var masterCountriesData = [
  { code: "de", names: { es: "Alemania", en: "Germany", fr: "Allemagne", de: "Deutschland", it: "Germania", pt: "Alemanha" } },
  { code: "ar", names: { es: "Argentina", en: "Argentina", fr: "Argentine", de: "Argentinien", it: "Argentina", pt: "Argentina" } },
  { code: "au", names: { es: "Australia", en: "Australia", fr: "Australie", de: "Australien", it: "Australia", pt: "Austrália" } },
  { code: "at", names: { es: "Austria", en: "Austria", fr: "Autriche", de: "Österreich", it: "Austria", pt: "Áustria" } },
  { code: "be", names: { es: "Bélgica", en: "Belgium", fr: "Belgique", de: "Belgien", it: "Belgio", pt: "Bélgica" } },
  { code: "br", names: { es: "Brasil", en: "Brazil", fr: "Brésil", de: "Brasilien", it: "Brasile", pt: "Brasil" } },
  { code: "co", names: { es: "Colombia", en: "Colombia", fr: "Colombie", de: "Kolumbien", it: "Colombia", pt: "Colômbia" } },
  { code: "kr", names: { es: "Corea del Sur", en: "South Korea", fr: "Corée du Sud", de: "Südkorea", it: "Corea del Sud", pt: "Coreia do Sul" } },
  { code: "hr", names: { es: "Croacia", en: "Croatia", fr: "Croatie", de: "Kroatien", it: "Croazia", pt: "Croácia" } },
  { code: "dk", names: { es: "Dinamarca", en: "Denmark", fr: "Danemark", de: "Dänemark", it: "Danimarca", pt: "Dinamarca" } },
  { code: "ec", names: { es: "Ecuador", en: "Ecuador", fr: "Équateur", de: "Ecuador", it: "Ecuador", pt: "Equador" } },
  { code: "gb-sct", names: { es: "Escocia", en: "Scotland", fr: "Écosse", de: "Schottland", it: "Scozia", pt: "Escócia" } },
  { code: "es", names: { es: "España", en: "Spain", fr: "Espagne", de: "Spanien", it: "Spagna", pt: "Espanha" } },
  { code: "us", names: { es: "Estados Unidos", en: "USA", fr: "États-Unis", de: "USA", it: "Stati Uniti", pt: "Estados Unidos" } },
  { code: "fr", names: { es: "Francia", en: "France", fr: "France", de: "Frankreich", it: "Francia", pt: "França" } },
  { code: "gb-wls", names: { es: "Gales", en: "Wales", fr: "Pays de Galles", de: "Wales", it: "Galles", pt: "País de Gales" } },
  { code: "nl", names: { es: "Holanda", en: "Netherlands", fr: "Pays-Bas", de: "Niederlande", it: "Paesi Bassi", pt: "Holanda" } },
  { code: "gb-eng", names: { es: "Inglaterra", en: "England", fr: "Angleterre", de: "England", it: "Inghilterra", pt: "Inglaterra" } },
  { code: "ie", names: { es: "Irlanda", en: "Ireland", fr: "Irlande", de: "Irland", it: "Irlanda", pt: "Irlanda" } },
  { code: "it", names: { es: "Italia", en: "Italy", fr: "Italie", de: "Italien", it: "Italia", pt: "Itália" } },
  { code: "jp", names: { es: "Japón", en: "Japan", fr: "Japon", de: "Japan", it: "Giappone", pt: "Japão" } },
  { code: "ma", names: { es: "Marruecos", en: "Morocco", fr: "Maroc", de: "Marokko", it: "Marocco", pt: "Marrocos" } },
  { code: "mx", names: { es: "México", en: "Mexico", fr: "Mexique", de: "Mexiko", it: "Messico", pt: "México" } },
  { code: "ng", names: { es: "Nigeria", en: "Nigeria", fr: "Nigeria", de: "Nigeria", it: "Nigeria", pt: "Nigéria" } },
  { code: "no", names: { es: "Noruega", en: "Norway", fr: "Norvège", de: "Norwegen", it: "Norvegia", pt: "Noruega" } },
  { code: "pl", names: { es: "Polonia", en: "Poland", fr: "Pologne", de: "Polen", it: "Polonia", pt: "Polónia" } },
  { code: "pt", names: { es: "Portugal", en: "Portugal", fr: "Portugal", de: "Portugal", it: "Portogallo", pt: "Portugal" } },
  { code: "ro", names: { es: "Rumanía", en: "Romania", fr: "Roumanie", de: "Rumänien", it: "Romania", pt: "Roménia" } },
  { code: "sn", names: { es: "Senegal", en: "Senegal", fr: "Sénégal", de: "Senegal", it: "Senegal", pt: "Senegal" } },
  { code: "rs", names: { es: "Serbia", en: "Serbia", fr: "Serbie", de: "Serbien", it: "Serbia", pt: "Sérvia" } },
  { code: "se", names: { es: "Suecia", en: "Sweden", fr: "Suède", de: "Schweden", it: "Svezia", pt: "Suécia" } },
  { code: "ch", names: { es: "Suiza", en: "Switzerland", fr: "Suisse", de: "Schweiz", it: "Svizzera", pt: "Suíça" } },
  { code: "tr", names: { es: "Turquía", en: "Turkey", fr: "Turquie", de: "Türkei", it: "Turchia", pt: "Turquia" } },
  { code: "uy", names: { es: "Uruguay", en: "Uruguay", fr: "Uruguay", de: "Uruguay", it: "Uruguay", pt: "Uruguai" } }
];

function normalizeSimple(str) {
  if (!str) return '';
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function getLocalizedCountryName(nameOrCode, lang) {
  if (!nameOrCode) return '';
  var l = lang || currentLang || 'es';
  var clean = nameOrCode.trim().toLowerCase();
  var norm = normalizeSimple(nameOrCode);
  var found = masterCountriesData.find(function(c) {
    if (clean === c.code.toLowerCase() || norm === c.code.toLowerCase()) return true;
    return Object.values(c.names).some(function(n) {
      return clean === n.toLowerCase() || norm === normalizeSimple(n);
    });
  });
  return found ? (found.names[l] || found.names.es || nameOrCode) : nameOrCode;
}

function getLocalizedLeagueName(nameOrCode, lang) {
  if (!nameOrCode) return '';
  var l = lang || currentLang || 'es';
  var clean = nameOrCode.trim().toLowerCase();
  var norm = normalizeSimple(nameOrCode);
  var found = masterLeaguesData.find(function(item) {
    if (clean === item.code.toLowerCase() || norm === item.code.toLowerCase()) return true;
    return Object.values(item.names).some(function(n) {
      return clean.includes(n.toLowerCase()) || norm.includes(normalizeSimple(n));
    });
  });
  return found ? (found.names[l] || found.names.es || nameOrCode) : nameOrCode;
}

function getFlagUrl(str) {
  if (!str) return 'https://flagcdn.com/w40/un.png';
  var raw = str.trim();
  var clean = raw.toLowerCase();
  var norm = normalizeSimple(raw);

  var foundLeague = masterLeaguesData.find(function(l) {
    if (clean === l.code.toLowerCase() || norm === l.code.toLowerCase()) return true;
    return Object.values(l.names).some(function(n) {
      var nLow = n.toLowerCase();
      var nNorm = normalizeSimple(n);
      return clean.includes(nLow) || norm.includes(nNorm);
    });
  });
  if (foundLeague) return 'https://flagcdn.com/w40/' + foundLeague.code + '.png';

  var foundCountry = masterCountriesData.find(function(c) {
    if (clean === c.code.toLowerCase() || norm === c.code.toLowerCase()) return true;
    return Object.values(c.names).some(function(n) {
      return clean === n.toLowerCase() || norm === normalizeSimple(n);
    });
  });
  if (foundCountry) return 'https://flagcdn.com/w40/' + foundCountry.code + '.png';

  var fallbackDict = {
    'premier league': 'gb-eng', 'laliga': 'es', 'la liga': 'es', 'serie a': 'it', 'bundesliga': 'de',
    'ligue 1': 'fr', 'eredivisie': 'nl', 'spain': 'es', 'england': 'gb-eng', 'france': 'fr', 'germany': 'de',
    'mexico': 'mx', 'irlanda': 'ie', 'ireland': 'ie', 'scotland': 'gb-sct', 'escocia': 'gb-sct'
  };
  var code = fallbackDict[clean] || fallbackDict[norm] || 'un';
  return 'https://flagcdn.com/w40/' + code + '.png';
}

function getCardClass(rating, rarity) {
  var r = (rarity || 'normal').toLowerCase();
  if (r === 'weekend_league') return 'weekend_league';
  if (r === 'ptc') return 'ptc';
  if (r === 'matchday') return 'matchday';
  if (r === 'potm') return 'potm';
  if (r === 'totw') return 'totw';
  if (r === 'euro_evo') return 'euro_evo';
  if (r === 'new_season') return 'new_season';
  if (r === 'transfer_stars') return 'transfer_stars';
  
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
  if (r === 'matchday') return 'card-matchday';
  if (r === 'new_season') return 'card-new-season';
  if (r === 'potm') return 'card-potm';
  if (r === 'ptc') return 'card-ptc';
  if (r === 'euro_evo') return 'card-euro-evo';
  if (r === 'totw') return 'card-totw';
  if (r === 'transfer_stars') return 'card-transfer-stars';
  if (r === 'weekend_league') return 'card-weekend-league';
  return 'card-gold-dark';
}

function getRarityLabel(r) {
  var norm = (r || 'normal').toLowerCase();
  if (norm === 'normal' || norm === 'bronze' || norm === 'silver' || norm === 'gold-dark') return 'Normal';
  var labels = {
    matchday: 'Matchday', new_season: 'NewSeason', potm: 'Player of the Month',
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
    reqSquads: "Plantillas requeridas:",
    reqRarity: "Rareza exigida:",
    viewSolution: "Ver alineación óptima →",
    estCost: "Coste estimado:",
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
    reqAgeMin: "Edad ≥ {val}", reqAgeMax: "Edad ≤ {val}",
    reqWeightMax: "Peso ≤ {val}kg"
  },
  en: {
    navHome: "Home", navDb: "Database", navCalc: "SBC Calculator",
    heroTitle: "Squad Building Challenges (PTC)",
    heroSubtitle: "Explore active challenges and get the cheapest squad solution using database or calculator manual prices.",
    statPlayers: "Players in DB", statActive: "Active PTCs",
    tabBasic: "📁 Basics", tabSeason: "🏆 Season Challenges", tabLimited: "⏳ Limited Time",
    btnSrcDb: "🗄️ Database", btnSrcManual: "✏️ Manual Calculator",
    reqPlayers: "Players:", reqTarget: "Target Rating:",
    reqSquads: "Required Squads:",
    reqRarity: "Required Rarity:",
    viewSolution: "View cheapest squad →",
    estCost: "Estimated Cost:",
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
    reqAgeMin: "Age ≥ {val}", reqAgeMax: "Age ≤ {val}",
    reqWeightMax: "Weight ≤ {val}kg"
  },
  fr: {
    navHome: "Accueil", navDb: "Base de Données", navCalc: "Calculateur DCE",
    heroTitle: "Défis de Création d'Équipe (DCE)",
    heroSubtitle: "Découvrez les défis actifs et obtenez la solution la moins chère avec votre base de données ou la calculatrice.",
    statPlayers: "Joueurs en BD", statActive: "DCE Actifs",
    tabBasic: "📁 Basiques", tabSeason: "🏆 De Saison", tabLimited: "⏳ Temps Limité",
    btnSrcDb: "🗄️ Base de Données", btnSrcManual: "✏️ Calculateur Manuel",
    reqPlayers: "Joueurs :", reqTarget: "Note Requise :",
    reqSquads: "Équipes Requises :",
    reqRarity: "Rareté Exigée :",
    viewSolution: "Voir l'équipe optimale →",
    estCost: "Coût estimé :",
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
    reqAgeMin: "Âge ≥ {val}", reqAgeMax: "Âge ≤ {val}",
    reqWeightMax: "Poids ≤ {val}kg"
  },
  de: {
    navHome: "Startseite", navDb: "Datenbank", navCalc: "SBC-Rechner",
    heroTitle: "Squad Building Challenges (PTC)",
    heroSubtitle: "Finde die günstigste SBC-Kombination mit Datenbank- oder manuellen Rechnerpreisen.",
    statPlayers: "Spieler in DB", statActive: "Aktive PTCs",
    tabBasic: "📁 Basis", tabSeason: "🏆 Saison-PTC", tabLimited: "⏳ Zeitlich Begrenzt",
    btnSrcDb: "🗄️ Datenbank", btnSrcManual: "✏️ Rechner Manuell",
    reqPlayers: "Spieler:", reqTarget: "Benötigte Wertung:",
    reqSquads: "Erforderliche Teams:",
    reqRarity: "Benötigte Seltenheit:",
    viewSolution: "Günstigste Aufstellung →",
    estCost: "Geschätzte Kosten:",
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
    reqAgeMin: "Alter ≥ {val}", reqAgeMax: "Alter ≤ {val}",
    reqWeightMax: "Gewicht ≤ {val}kg"
  },
  it: {
    navHome: "Home", navDb: "Database", navCalc: "Calcolatore SCR",
    heroTitle: "Sfide Creazione Rosa (PTC)",
    heroSubtitle: "Trova la combinazione più economica usando i prezzi del database o del calcolatore manuale.",
    statPlayers: "Giocatori in BD", statActive: "PTC Attivi",
    tabBasic: "📁 Base", tabSeason: "🏆 Stagionali", tabLimited: "⏳ Tempo Limitato",
    btnSrcDb: "🗄️ Database", btnSrcManual: "✏️ Calcolatore Manuale",
    reqPlayers: "Giocatori:", reqTarget: "Valutazione richiesta:",
    reqSquads: "Rose richieste:",
    reqRarity: "Rarità richiesta:",
    viewSolution: "Vedi rosa migliore →",
    estCost: "Costo stimato:",
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
    reqAgeMin: "Età ≥ {val}", reqAgeMax: "Età ≤ {val}",
    reqWeightMax: "Peso ≤ {val}kg"
  },
  pt: {
    navHome: "Início", navDb: "Base de Dados", navCalc: "Calculadora DME",
    heroTitle: "Desafios de Montagem de Elenco (DME)",
    heroSubtitle: "Encontre a solução mais barata para os desafios usando preços da base de dados ou da calculadora.",
    statPlayers: "Jogadores na BD", statActive: "DMEs Ativos",
    tabBasic: "📁 Básicos", tabSeason: "🏆 De Temporada", tabLimited: "⏳ Tempo Limitado",
    btnSrcDb: "🗄️ Base de Dados", btnSrcManual: "✏️ Calculadora Manual",
    reqPlayers: "Jogadores:", reqTarget: "Classificação exigida:",
    reqSquads: "Elencos exigidos:",
    reqRarity: "Raridade exigida:",
    viewSolution: "Ver elenco ideal →",
    estCost: "Custo estimado:",
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
    reqAgeMin: "Idade ≥ {val}", reqAgeMax: "Idade ≤ {val}",
    reqWeightMax: "Peso ≤ {val}kg"
  }
};

var ptcTitles = {
  b_60: { es: "Mejora 60+", en: "60+ Upgrade", fr: "Renfort 60+", de: "60+-Upgrade", it: "Miglioramento 60+", pt: "Melhoria 60+" },
  b_70: { es: "Mejora 70+", en: "70+ Upgrade", fr: "Renfort 70+", de: "70+-Upgrade", it: "Miglioramento 70+", pt: "Melhoria 70+" },
  b_74: { es: "Mejora 74+", en: "74+ Upgrade", fr: "Renfort 74+", de: "74+-Upgrade", it: "Miglioramento 74+", pt: "Melhoria 74+" },
  b_78: { es: "Mejora 78+", en: "78+ Upgrade", fr: "Renfort 78+", de: "78+-Upgrade", it: "Miglioramento 78+", pt: "Melhoria 78+" },
  b_81: { es: "Mejora 81+", en: "81+ Upgrade", fr: "Renfort 81+", de: "81+-Upgrade", it: "Miglioramento 81+", pt: "Melhoria 81+" },
  b_83: { es: "Mejora 83+", en: "83+ Upgrade", fr: "Renfort 83+", de: "83+-Upgrade", it: "Miglioramento 83+", pt: "Melhoria 83+" },
  b_85: { es: "Mejora 85+", en: "85+ Upgrade", fr: "Renfort 85+", de: "85+-Upgrade", it: "Miglioramento 85+", pt: "Melhoria 85+" },
  b_87: { es: "Mejora 87+", en: "87+ Upgrade", fr: "Renfort 87+", de: "87+-Upgrade", it: "Miglioramento 87+", pt: "Melhoria 87+" },
  b_bronze_group: { es: "Desafío Bronce", en: "Bronze Challenge", fr: "Défi Bronze", de: "Bronze-Challenge", it: "Sfida Bronzo", pt: "Desafio Bronze" },
  b_silver_group: { es: "Desafío Plata", en: "Silver Challenge", fr: "Défi Argent", de: "Silber-Challenge", it: "Sfida Argento", pt: "Desafio Prata" },
  b_gold_group: { es: "Desafío Oro", en: "Gold Challenge", fr: "Défi Oro", de: "Gold-Challenge", it: "Sfida Oro", pt: "Desafio Ouro" },
  s_aficionado_1: { es: "Aficionado 1", en: "Amateur 1", fr: "Amateur 1", de: "Amateur 1", it: "Dilettante 1", pt: "Amador 1" },
  s_aficionado_2: { es: "Aficionado 2", en: "Amateur 2", fr: "Amateur 2", de: "Amateur 2", it: "Dilettante 2", pt: "Amador 2" },
  s_aficionado_3: { es: "Aficionado 3", en: "Amateur 3", fr: "Amateur 3", de: "Amateur 3", it: "Dilettante 3", pt: "Amador 3" },
  s_semipro_1: { es: "Semiprofesional 1", en: "Semi-Pro 1", fr: "Semi-Pro 1", de: "Halbprofi 1", it: "Semi-Pro 1", pt: "Semiprofissional 1" },
  s_semipro_2: { es: "Semiprofesional 2", en: "Semi-Pro 2", fr: "Semi-Pro 2", de: "Halbprofi 2", it: "Semi-Pro 2", pt: "Semiprofissional 2" },
  s_semipro_3: { es: "Semiprofesional 3", en: "Semi-Pro 3", fr: "Semi-Pro 3", de: "Halbprofi 3", it: "Semi-Pro 3", pt: "Semiprofissional 3" },
  s_pro_1: { es: "Profesional 1", en: "Professional 1", fr: "Professionnel 1", de: "Profi 1", it: "Professionista 1", pt: "Profissional 1" },
  s_pro_2: { es: "Profesional 2", en: "Professional 2", fr: "Professionnel 2", de: "Profi 2", it: "Professionista 2", pt: "Profissional 2" },
  s_pro_3: { es: "Profesional 3", en: "Professional 3", fr: "Professionnel 3", de: "Profi 3", it: "Professionista 3", pt: "Profissional 3" },
  s_legend_1: { es: "Legendario 1", en: "Legendary 1", fr: "Légendaire 1", de: "Legende 1", it: "Leggenda 1", pt: "Lendário 1" },
  s_wl_1: { es: "Liga de Fin de Semana 1", en: "Weekend League 1", fr: "Ligue Week-end 1", de: "Weekend League 1", it: "Weekend League 1", pt: "Weekend League 1" },
  s_wl_2: { es: "Liga de Fin de Semana 2", en: "Weekend League 2", fr: "Ligue Week-end 2", de: "Weekend League 2", it: "Weekend League 2", pt: "Weekend League 2" },
  l_totw_upgrade: { es: "Mejora TOTW Activo", en: "Active TOTW Upgrade", fr: "Renfort TOTW Actif", de: "Aktives TDW-Upgrade", it: "Miglioramento TOTW Attivo", pt: "Melhoria TOTW Ativa" },
  l_flash_challenge: { es: "Desafío Relámpago", en: "Flash Challenge", fr: "Défi Flash", de: "Blitz-Challenge", it: "Sfida Lampo", pt: "Desafio Relâmpago" },
  l_odegaard_91: { es: "Martin Ødegaard (91 POTM)", en: "Martin Ødegaard (91 POTM)", fr: "Martin Ødegaard (91 POTM)", de: "Martin Ødegaard (91 POTM)", it: "Martin Ødegaard (91 POTM)", pt: "Martin Ødegaard (91 POTM)" }
};

var groupShortTitles = {
  b_bronze_group: { es: "BRONCE", en: "BRONZE", fr: "BRONZE", de: "BRONZE", it: "BRONZO", pt: "BRONZE" },
  b_silver_group: { es: "PLATA", en: "SILVER", fr: "ARGENT", de: "SILBER", it: "ARGENTO", pt: "PRATA" },
  b_gold_group: { es: "ORO", en: "GOLD", fr: "OR", de: "GOLD", it: "ORO", pt: "OURO" }
};

var packWords = {
  es: { pack: "Sobre", singleElite: "Sobre Individual Élite Oro {r}+ (1)", challengeReward: "Premio del desafío" },
  en: { pack: "Pack", singleElite: "1x 81+ Single Gold Elite Pack ({r}+)", challengeReward: "Challenge reward" },
  fr: { pack: "Pack", singleElite: "Pack Individuel Élite Or {r}+ (1)", challengeReward: "Récompense du défi" },
  de: { pack: "Pack", singleElite: "Einzelnes Elite-Gold-Pack {r}+ (1)", challengeReward: "Challenge-Belohnung" },
  it: { pack: "Pacchetto", singleElite: "Pacchetto Singolo Élite Oro {r}+ (1)", challengeReward: "Premio della sfida" },
  pt: { pack: "Pacote", singleElite: "Pacote Individual Ouro Elite {r}+ (1)", challengeReward: "Recompensa do desafio" }
};

var ptcRewards = {
  b_bronze_group: {
    type: 'player', name: 'Moore', pos: 'ST', rating: 75,
    country: 'Gales', league: 'Inglaterra (1ª Div - Premier)', club: 'Wrexham',
    stats: { pac: 71, dri: 66, sho: 76, def: 38, pas: 59, phy: 76 },
    image: 'https://b.fssta.com/uploads/application/soccer/headshots/5649.vresize.350.350.medium.1.png'
  },
  b_silver_group: {
    type: 'player', name: 'Bueno', pos: 'CB', rating: 78,
    country: 'Uruguay', league: 'Inglaterra (1ª Div - Premier)', club: 'Wolves',
    stats: { pac: 74, dri: 63, sho: 37, def: 79, pas: 66, phy: 81 },
    image: 'https://www.ceroacero.es/img/jogadores/new/97/82/749782_hugo_bueno_20260218234652.png'
  },
  b_gold_group: {
    type: 'player', name: 'Merino', pos: 'CM', rating: 83,
    country: 'España', league: 'Inglaterra (1ª Div - Premier)', club: 'Arsenal',
    stats: { pac: 79, dri: 80, sho: 63, def: 68, pas: 77, phy: 74 },
    image: 'https://cdn-img.staticzz.com/img/jogadores/new/01/75/420175_mikel_merino_20250928235143.png'
  },
  s_semipro_2: { type: 'player', name: 'Szoboszlai', pos: 'CAM', rating: 87, rarity: 'ptc' },
  s_wl_1: { type: 'pack', minRating: 81, event: 'Weekend League', draft: '1/3' },
  s_wl_2: { type: 'pack', minRating: 84, event: 'Weekend League', draft: '1/3' }
};

function formatPtcReward(ptcId) {
  var r = ptcRewards[ptcId];
  if (!r) return '';
  if (r.type === 'player') {
    var localizedPos = displayPosition(r.pos, currentLang);
    var rarityTag = r.rarity ? ' [' + r.rarity.toUpperCase() + ']' : '';
    return r.name + ' (' + localizedPos + ') ⭐ ' + r.rating + rarityTag;
  }
  if (r.type === 'pack') {
    var pw = (packWords[currentLang] || packWords.es).pack;
    return pw + ' ' + r.minRating + '+ ' + r.event + ' (' + r.draft + ' Draft)';
  }
  return '';
}

function getSubChallengeRewardText(sub) {
  var pw = packWords[currentLang] || packWords.es;
  if (sub.rewardRating) {
    return pw.singleElite.replace('{r}', sub.rewardRating);
  }
  if (sub.rewardText) {
    if (typeof sub.rewardText === 'object') {
      return sub.rewardText[currentLang] || sub.rewardText.es || sub.rewardText.en;
    }
    return sub.rewardText;
  }
  return '';
}

function createBlankRankSubchallenges(prefixKey) {
  return [1, 2, 3, 4].map(function(num) {
    return { subKey: prefixKey, num: num, players: 0, target: 0, isPending: true };
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
      { name: "Bronce 1", players: 0, target: 0, isPending: true },
      { name: "Bronce 2", players: 0, target: 0, isPending: true },
      { name: "Bronce 3", players: 0, target: 0, isPending: true }
    ]
  },
  {
    id: "b_silver_group", category: "basic", isRepeatable: false, shortTitle: "PLATA",
    subchallenges: [
      { name: "Plata 1", players: 0, target: 0, isPending: true },
      { name: "Plata 2", players: 0, target: 0, isPending: true },
      { name: "Plata 3", players: 0, target: 0, isPending: true }
    ]
  },
  {
    id: "b_gold_group", category: "basic", isRepeatable: false, shortTitle: "ORO",
    subchallenges: [
      { name: "Oro 1", players: 0, target: 0, isPending: true },
      { name: "Oro 2", players: 0, target: 0, isPending: true },
      { name: "Oro 3", players: 0, target: 0, isPending: true }
    ]
  },
  { id: "s_aficionado_1", category: "season", isRepeatable: false, subchallenges: createBlankRankSubchallenges("s_aficionado_1") },
  { id: "s_aficionado_2", category: "season", isRepeatable: false, subchallenges: createBlankRankSubchallenges("s_aficionado_2") },
  { id: "s_aficionado_3", category: "season", isRepeatable: false, subchallenges: createBlankRankSubchallenges("s_aficionado_3") },
  { id: "s_semipro_1", category: "season", isRepeatable: false, subchallenges: createBlankRankSubchallenges("s_semipro_1") },
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
          minCountry: { name: "Holanda", count: 3 },
          exactPositions: [
            { pos: "ST", count: 1 },
            { pos: "LM", count: 1 },
            { pos: "CB", count: 1 }
          ]
        }
      }
    ]
  },
  { id: "s_semipro_3", category: "season", isRepeatable: false, subchallenges: createBlankRankSubchallenges("s_semipro_3") },
  { id: "s_pro_1", category: "season", isRepeatable: false, subchallenges: createBlankRankSubchallenges("s_pro_1") },
  { id: "s_pro_2", category: "season", isRepeatable: false, subchallenges: createBlankRankSubchallenges("s_pro_2") },
  { id: "s_pro_3", category: "season", isRepeatable: false, subchallenges: createBlankRankSubchallenges("s_pro_3") },
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
  var candidateKeys = [DB_KEY, 'ufm27_db_v7', 'ufm27_database_v6'];
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

function generatePlayerFutCardHtml(p) {
  var imgUrl = p.image ? p.image : DEFAULT_AVATAR;
  var natFlag = getFlagUrl(p.country);
  var leagueFlag = getFlagUrl(p.league || p.country);
  var rClass = getRarityClass(p.rarity, p.rating);
  var t = i18n[currentLang] || i18n.es;

  return `
    <div class="fut-card ${rClass}">
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
        <div class="stat-row"><span class="stat-num">${p.pac || '0'}</span> <span class="stat-lbl">${t.statPac}</span></div>
        <div class="stat-row"><span class="stat-num">${p.dri || '0'}</span> <span class="stat-lbl">${t.statDri}</span></div>
        <div class="stat-row"><span class="stat-num">${p.sho || '0'}</span> <span class="stat-lbl">${t.statSho}</span></div>
        <div class="stat-row"><span class="stat-num">${p.def || '0'}</span> <span class="stat-lbl">${t.statDef}</span></div>
        <div class="stat-row"><span class="stat-num">${p.pas || '0'}</span> <span class="stat-lbl">${t.statPas}</span></div>
        <div class="stat-row"><span class="stat-num">${p.phy || '0'}</span> <span class="stat-lbl">${t.statPhy}</span></div>
      </div>
    </div>
  `;
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
      var sSol = solveSbc(ptc.players, ptc.target, pPrices);
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
        <div class="ptc-brush-effect"></div>
        <div class="ptc-game-footer">
          <span class="ptc-game-title">${repeatTitle}</span>
          <div class="ptc-game-arrow-btn">❯</div>
        </div>
      `;
      grid.appendChild(card);
      return;
    }

    var rewardData = ptcRewards[ptc.id];
    if (rewardData && rewardData.type === 'player' && ptc.subchallenges) {
      var groupTheme = 'theme-group-bronze';
      if (ptc.id === 'b_silver_group') groupTheme = 'theme-group-silver';
      if (ptc.id === 'b_gold_group') groupTheme = 'theme-group-gold';

      card.className = 'ptc-card-player-group ' + groupTheme;
      var totalSquads = ptc.subchallenges.length;
      var totalCost = 0;
      var hasValidSol = false;
      var allSolved = true;

      ptc.subchallenges.forEach(function(sub) {
        if (!sub.isPending) {
          var s = solveSbc(sub.players, sub.target, defaultPrices);
          if (s) { totalCost += s.cost; hasValidSol = true; }
          else { allSolved = false; }
        } else {
          allSolved = false;
        }
      });
      var costBadgeText = (hasValidSol && allSolved) ? (Number(totalCost).toLocaleString('es-ES') + ' 🪙') : '—';

      var mockPlayer = {
        name: rewardData.name,
        rating: rewardData.rating,
        position: rewardData.pos,
        rarity: 'ptc',
        country: rewardData.country,
        league: rewardData.league,
        club: rewardData.club,
        image: rewardData.image,
        pac: rewardData.stats ? rewardData.stats.pac : 70,
        sho: rewardData.stats ? rewardData.stats.sho : 70,
        pas: rewardData.stats ? rewardData.stats.pas : 70,
        dri: rewardData.stats ? rewardData.stats.dri : 70,
        def: rewardData.stats ? rewardData.stats.def : 70,
        phy: rewardData.stats ? rewardData.stats.phy : 70
      };

      var shortEntry = groupShortTitles[ptc.id];
      var footerTitle = shortEntry ? (shortEntry[currentLang] || shortEntry.es || shortEntry.en) : getPtcTitle(ptc.id);

      card.innerHTML = `
        <div class="ptc-bg-side"></div>
        <div class="ptc-card-cost-badge">${costBadgeText}</div>
        <div class="ptc-group-hex-row">
          <div class="ptc-hex-badge"><div class="ptc-hex-icon ptc-hex-green"></div>0</div>
          <div class="ptc-hex-badge"><div class="ptc-hex-icon ptc-hex-yellow"></div>0</div>
          <div class="ptc-hex-badge"><div class="ptc-hex-icon ptc-hex-red"></div>${totalSquads}</div>
        </div>
        <div class="ptc-player-card-center">
          ${generatePlayerFutCardHtml(mockPlayer)}
        </div>
        <div class="ptc-squad-counter">0/${totalSquads}</div>
        <div class="ptc-game-footer">
          <span class="ptc-game-title">${footerTitle}</span>
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
      var totalCost = 0;
      var hasValidSol = false;
      var allSolved = true;
      ptc.subchallenges.forEach(function(sub) {
        if (!sub.isPending) {
          var s = solveSbc(sub.players, sub.target, prices);
          if (s) { totalCost += s.cost; hasValidSol = true; }
          else { allSolved = false; }
        } else {
          allSolved = false;
        }
      });
      if (hasValidSol && allSolved) costText = Number(totalCost).toLocaleString('es-ES') + ' 🪙';
    } else {
      var rarityHint = ptc.requiredRarity === 'weekend_league' ? `<div class="ptc-req-item"><span>${t.reqRarity}</span> <b style="color:var(--gold)">Weekend League</b></div>` : '';
      reqHtml = `
        <div class="ptc-req-item"><span>${t.reqPlayers}</span> <b>${ptc.players}</b></div>
        <div class="ptc-req-item"><span>${t.reqTarget}</span> <b>⭐ ${ptc.target}</b></div>
        ${rarityHint}
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
    var globalReward = formatPtcReward(ptc.id);
    var pw = packWords[currentLang] || packWords.es;

    subTabsWrap.innerHTML = ptc.subchallenges.map(function(sub, idx) {
      var targetLabel = sub.isPending ? 'Pendiente' : ('⭐ ' + sub.target);
      var subName = formatSubChallengeName(sub);
      var subReward = getSubChallengeRewardText(sub);
      var rewardLabel = subReward ? ('🎁 ' + subReward) : (globalReward ? ('🎁 ' + globalReward) : ('🎁 ' + pw.challengeReward));

      return `
        <button type="button" class="sub-tab-btn ${idx === 0 ? 'active' : ''}" onclick="selectSubChallenge(${idx})">
          <div class="sub-tab-top">
            <span class="sub-tab-name">${subName}</span>
            <span class="sub-tab-target">${targetLabel}</span>
          </div>
          <span class="sub-tab-reward">${rewardLabel}</span>
        </button>
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
  var btns = document.querySelectorAll('.sub-tab-btn');
  btns.forEach(function(b, i) { b.classList.toggle('active', i === idx); });
  renderModalContent();
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
  if (type === 'league') {
    var pL = normalizeSimple(p.league || '');
    var cL = normalizeSimple(cond || '');
    return pL === cL || pL.includes(cL);
  }
  if (type === 'country') {
    var pC = normalizeSimple(p.country || '');
    var cC = normalizeSimple(cond || '');
    return pC === cC || pC.includes(cC);
  }
  if (type === 'role') return getPlayerRole(p.position) === cond;
  if (type === 'minAge') return p.age && parseInt(p.age, 10) >= cond;
  if (type === 'maxAge') return p.age && parseInt(p.age, 10) <= cond;
  if (type === 'maxWeight') return p.weight && parseInt(p.weight, 10) <= cond;
  if (type === 'minDri') return p.dri && parseInt(p.dri, 10) >= cond;
  if (type === 'minSho') return p.sho && parseInt(p.sho, 10) >= cond;
  if (type === 'minPhy') return p.phy && parseInt(p.phy, 10) >= cond;
  return false;
}

function solveSquadWithRequirements(dbCandidates, targetPtc, prices) {
  var n = targetPtc.players;
  var target = targetPtc.target;
  var minTotalSum = thresholdFor(n, target);
  var reqs = targetPtc.reqs;

  if (!dbCandidates || dbCandidates.length === 0) {
    var rawSol = solveSbc(n, target, prices);
    if (!rawSol) return null;
    var slots = [];
    rawSol.counts.forEach(function(count, rating) {
      for (var i = 0; i < count; i++) slots.push({ rating: rating, player: null });
    });
    slots.sort(function(a, b) { return b.rating - a.rating; });
    return { cost: rawSol.cost, sumRating: rawSol.bestSum, slots: slots };
  }

  var candidates = dbCandidates.filter(function(p) {
    var pr = parseInt(p.price, 10);
    var rat = parseInt(p.rating, 10);
    return !isNaN(pr) && pr > 0 && !isNaN(rat) && rat >= 50 && rat <= 99;
  });

  if (!reqs) {
    var rawSol = solveSbc(n, target, prices);
    if (!rawSol) return null;
    var usedIds = new Set();
    var slots = [];
    var totalCost = 0;
    var sumRating = 0;

    var reqRatings = [];
    rawSol.counts.forEach(function(count, rating) {
      for (var i = 0; i < count; i++) reqRatings.push(rating);
    });
    reqRatings.sort(function(a, b) { return b - a; });

    reqRatings.forEach(function(rat) {
      var matched = candidates.filter(function(p) {
        return parseInt(p.rating, 10) === rat && !usedIds.has(p.id);
      }).sort(function(a, b) { return (+a.price) - (+b.price); })[0];

      if (matched) {
        usedIds.add(matched.id);
        slots.push({ rating: rat, player: matched });
        totalCost += (+matched.price);
        sumRating += (+matched.rating);
      } else {
        slots.push({ rating: rat, player: null });
        totalCost += (prices[rat] || 0);
        sumRating += rat;
      }
    });

    return { cost: totalCost, sumRating: sumRating, slots: slots };
  }

  var selectedPlayers = [];
  var usedIds = new Set();

  if (reqs.exactPositions && Array.isArray(reqs.exactPositions)) {
    reqs.exactPositions.forEach(function(ep) {
      for (var i = 0; i < ep.count; i++) {
        var exactPool = candidates.filter(function(p) {
          return !usedIds.has(p.id) && checkPlayerMatches(p, 'exactPos', ep.pos);
        });
        if (exactPool.length > 0) {
          exactPool.sort(function(a, b) {
            var diffA = Math.abs(a.rating - target);
            var diffB = Math.abs(b.rating - target);
            if (diffA !== diffB) return diffA - diffB;
            return (+a.price) - (+b.price);
          });
          var chosenPosPlayer = exactPool[0];
          usedIds.add(chosenPosPlayer.id);
          selectedPlayers.push(chosenPosPlayer);
        }
      }
    });
  }

  var otherConditions = [];
  if (reqs.minLeague) for (var i = 0; i < reqs.minLeague.count; i++) otherConditions.push({ type: 'league', cond: reqs.minLeague.name });
  if (reqs.minCountry) for (var i = 0; i < reqs.minCountry.count; i++) otherConditions.push({ type: 'country', cond: reqs.minCountry.name });
  if (reqs.minRole) for (var i = 0; i < reqs.minRole.count; i++) otherConditions.push({ type: 'role', cond: reqs.minRole.role });
  if (reqs.minAge && reqs.minAgeCount) for (var i = 0; i < reqs.minAgeCount; i++) otherConditions.push({ type: 'minAge', cond: reqs.minAge });
  if (reqs.maxAge && reqs.maxAgeCount) for (var i = 0; i < reqs.maxAgeCount; i++) otherConditions.push({ type: 'maxAge', cond: reqs.maxAge });
  if (reqs.maxWeight && reqs.maxWeightCount) for (var i = 0; i < reqs.maxWeightCount; i++) otherConditions.push({ type: 'maxWeight', cond: reqs.maxWeight });
  if (reqs.minDri && reqs.minDriCount) for (var i = 0; i < reqs.minDriCount; i++) otherConditions.push({ type: 'minDri', cond: reqs.minDri });
  if (reqs.minSho && reqs.minShoCount) for (var i = 0; i < reqs.minShoCount; i++) otherConditions.push({ type: 'minSho', cond: reqs.minSho });
  if (reqs.minPhy && reqs.minPhyCount) for (var i = 0; i < reqs.minPhyCount; i++) otherConditions.push({ type: 'minPhy', cond: reqs.minPhy });

  otherConditions.forEach(function(reqItem) {
    var covered = false;
    for (var k = 0; k < selectedPlayers.length; k++) {
      var sel = selectedPlayers[k];
      if (!sel._tags) sel._tags = [];
      if (!sel._tags.includes(reqItem.type) && checkPlayerMatches(sel, reqItem.type, reqItem.cond)) {
        sel._tags.push(reqItem.type);
        covered = true;
        break;
      }
    }
    if (covered) return;

    var pool = candidates.filter(function(p) {
      return !usedIds.has(p.id) && checkPlayerMatches(p, reqItem.type, reqItem.cond);
    });

    if (pool.length > 0) {
      pool.sort(function(a, b) {
        var diffA = Math.abs(a.rating - target);
        var diffB = Math.abs(b.rating - target);
        if (diffA !== diffB) return diffA - diffB;
        return (+a.price) - (+b.price);
      });
      var picked = pool[0];
      picked._tags = [reqItem.type];
      usedIds.add(picked.id);
      selectedPlayers.push(picked);
    }
  });

  if (selectedPlayers.length > n) selectedPlayers = selectedPlayers.slice(0, n);

  var remainingSlots = n - selectedPlayers.length;
  var currentSum = selectedPlayers.reduce(function(acc, p) { return acc + (+p.rating); }, 0);
  var currentCost = selectedPlayers.reduce(function(acc, p) { return acc + (+p.price); }, 0);

  var slots = selectedPlayers.map(function(p) {
    return { rating: +p.rating, player: p };
  });

  if (remainingSlots > 0) {
    var neededSum = Math.max(0, minTotalSum - currentSum);
    var approxNeededRating = Math.max(50, Math.min(99, Math.ceil(neededSum / remainingSlots)));
    var remSol = solveSbc(remainingSlots, approxNeededRating, prices) || solveSbc(remainingSlots, target, prices);

    if (remSol) {
      var reqRatings = [];
      remSol.counts.forEach(function(count, rating) {
        for (var i = 0; i < count; i++) reqRatings.push(rating);
      });
      reqRatings.sort(function(a, b) { return b - a; });

      reqRatings.forEach(function(rat) {
        var matched = candidates.filter(function(p) {
          return parseInt(p.rating, 10) === rat && !usedIds.has(p.id);
        }).sort(function(a, b) { return (+a.price) - (+b.price); })[0];

        if (matched) {
          usedIds.add(matched.id);
          slots.push({ rating: rat, player: matched });
          currentCost += (+matched.price);
          currentSum += (+matched.rating);
        } else {
          slots.push({ rating: rat, player: null });
          currentCost += (prices[rat] || 0);
          currentSum += rat;
        }
      });
    } else {
      var unassigned = candidates.filter(function(p) { return !usedIds.has(p.id); })
        .sort(function(a, b) { return (+a.price) - (+b.price); });
      for (var k = 0; k < remainingSlots; k++) {
        var pExtra = unassigned[k];
        if (pExtra) {
          usedIds.add(pExtra.id);
          slots.push({ rating: +pExtra.rating, player: pExtra });
          currentCost += (+pExtra.price);
          currentSum += (+pExtra.rating);
        } else {
          slots.push({ rating: target, player: null });
          currentCost += (prices[target] || 0);
          currentSum += target;
        }
      }
    }
  }

  slots.sort(function(a, b) { return b.rating - a.rating; });

  return {
    cost: currentCost,
    sumRating: currentSum,
    slots: slots
  };
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

  var reqPanel = document.getElementById('modalReqPanel');
  var reqTags = document.getElementById('modalReqTags');

  if (currentTargetPtc.reqs) {
    reqPanel.style.display = 'block';
    reqTags.innerHTML = '';
    var r = currentTargetPtc.reqs;

    var rolesMap = {
      'DEF': t.roleDef,
      'MID': t.roleMid,
      'ATT': t.roleAtt
    };

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
      var roleName = rolesMap[r.minRole.role] || r.minRole.role;
      reqTags.innerHTML += `<span class="req-tag">🛡️ ${roleName} (${t.minPrefix} ${r.minRole.count})</span>`;
    }
    if (r.minAge) {
      var ageText = t.reqAgeMin.replace('{val}', r.minAge);
      reqTags.innerHTML += `<span class="req-tag">🎂 ${ageText} (${t.minPrefix} ${r.minAgeCount})</span>`;
    }
    if (r.maxAge) {
      var ageText = t.reqAgeMax.replace('{val}', r.maxAge);
      reqTags.innerHTML += `<span class="req-tag">👶 ${ageText} (${t.minPrefix} ${r.maxAgeCount})</span>`;
    }
    if (r.maxWeight) {
      var weightText = t.reqWeightMax.replace('{val}', r.maxWeight);
      reqTags.innerHTML += `<span class="req-tag">⚖️ ${weightText} (${t.minPrefix} ${r.maxWeightCount})</span>`;
    }
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
  if (filterRarity === 'weekend_league') localizedSubtitle += ' · [Weekend League]';

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

  document.getElementById('solCost').textContent = Number(solution.cost).toLocaleString('es-ES') + ' 🪙';
  document.getElementById('solTarget').textContent = currentTargetPtc.target;
  document.getElementById('solAvg').textContent = (solution.sumRating / currentTargetPtc.players).toFixed(2).replace('.', ',');

  window._activeSquadPlayers = [];

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
      var raritySubText = filterRarity === 'weekend_league' ? ' (WL)' : '';
      slot.innerHTML = `
        <div class="squad-slot-empty">
          <b>⭐ ${rat}</b>
          <span>${t.anyPlayer} ⭐ ${rat}${raritySubText}</span>
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

  var imgUrl = p.image ? p.image : DEFAULT_AVATAR;
  var natFlag = getFlagUrl(p.country);
  var leagueFlag = getFlagUrl(p.league || p.country);
  var rClass = getRarityClass(p.rarity, p.rating);
  var rarityText = getRarityLabel(p.rarity);
  var cleanName = p.name ? p.name.replace(/\s*\([^)]*\)/g, '').trim() : '';
  var status = getDateStatus(p.price_date);
  var t = i18n[currentLang] || i18n.es;

  var cardHtml = `
    <div class="fut-card ${rClass}">
      <div class="card-rarity-tag">${rarityText}</div>
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
        <div class="card-name">${cleanName}</div>
        <div class="card-club">${p.club || 'Sin Club'}</div>
      </div>
      <div class="card-stats">
        <div class="stat-row"><span class="stat-num">${p.pac || '0'}</span> <span class="stat-lbl">${t.statPac}</span></div>
        <div class="stat-row"><span class="stat-num">${p.dri || '0'}</span> <span class="stat-lbl">${t.statDri}</span></div>
        <div class="stat-row"><span class="stat-num">${p.sho || '0'}</span> <span class="stat-lbl">${t.statSho}</span></div>
        <div class="stat-row"><span class="stat-num">${p.def || '0'}</span> <span class="stat-lbl">${t.statDef}</span></div>
        <div class="stat-row"><span class="stat-num">${p.pas || '0'}</span> <span class="stat-lbl">${t.statPas}</span></div>
        <div class="stat-row"><span class="stat-num">${p.phy || '0'}</span> <span class="stat-lbl">${t.statPhy}</span></div>
      </div>
    </div>
  `;

  document.getElementById('detailCardTarget').innerHTML = cardHtml;
  document.getElementById('detName').textContent = cleanName + ' (' + p.rating + ')';
  document.getElementById('detSub').textContent = displayPosition(p.position, currentLang) + ' · ' + rarityText;
  document.getElementById('detClub').textContent = p.club || '—';
  document.getElementById('detLeague').textContent = getLocalizedLeagueName(p.league, currentLang) || '—';
  document.getElementById('detCountry').textContent = getLocalizedCountryName(p.country, currentLang) || '—';
  document.getElementById('detAge').textContent = p.age ? (p.age + ' años') : '—';
  document.getElementById('detPhysique').textContent = (p.height ? p.height + ' cm' : '—') + ' / ' + (p.weight ? p.weight + ' kg' : '—');
  document.getElementById('detPrice').textContent = p.price ? (Number(p.price).toLocaleString('es-ES') + ' 🪙') : 'Sin precio';
  document.getElementById('detUpdated').innerHTML = '<span class="date-badge ' + status.colorClass + '">' + status.text + '</span>';

  document.getElementById('detailModalBg').classList.add('open');
}

function closeDetailModal(e) {
  if (!e || e.target === document.getElementById('detailModalBg')) {
    document.getElementById('detailModalBg').classList.remove('open');
  }
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
