/**
 * UFM 27 - Mi Equipo / Squad Builder
 * Sistema de Alineaciones, Cancha Táctica, Química y Banquillo EA FC Ultimate Team
 */

var DB_KEY = 'ufm27_database_v3';
var TEAM_KEY = 'ufm27_my_team_v1';
var currentLang = localStorage.getItem('ufm_lang') || 'es';
var currentViewMode = 'front'; // 'front' (Modo 1), 'chemistry' (Modo 2), 'stats' (Modo 3)
var activeSidebarTab = 'formations'; // 'bench', 'formations', 'tactics', 'roles'
var activeFormationId = '433_def';
var activeSlotIndex = -1; // Slot seleccionado para cambio
var pickerTargetType = 'starter'; // 'starter' o 'bench'
var pickerPosFilter = 'ALL';

// Variables para Drag and Drop y Menús Interactivos
var draggedData = null; // { type: 'starter'|'bench', index: number }
var mouseDownInfo = null; // { x, y, time, type, index, moved }
var activeContextTarget = null; // { type: 'starter'|'bench', index: number }
var activeDetailTarget = null; // { type: 'starter'|'bench', index: number }

// Diccionario de Traducciones i18n
var i18nTeam = {
  es: {
    navHome: "Inicio", navDb: "Base de Datos", navCalc: "Calculadora SBC", navTeam: "Mi Equipo",
    chem: "QUÍ", ovr: "GRL", del: "DEL", cen: "CEN", def: "DEF", auto: "AUTO",
    squads: "Alineaciones", toggle: "Cambiar",
    toggleFront: "Vista: Foto", toggleChem: "Vista: Química", toggleStats: "Vista: Stats",
    tabBench: "Banquillo", tabFormations: "Formaciones", tabTactics: "Tácticas", tabRoles: "Roles",
    benchTitle: "BANQUILLO", formationsTitle: "FORMACIONES", tacticsTitle: "TÁCTICAS", rolesTitle: "ROLES",
    delanteros: "Delanteros", centrocampistas: "Centrocampistas", defensas: "Defensas", porteros: "Porteros",
    addBench: "+ Añadir Suplente", emptyBench: "No hay suplentes en esta categoría.",
    swapPlayer: "Cambiar jugador", toBench: "Enviar al banquillo", removePlayer: "Quitar de la cancha",
    autoComplete: "Autocompletar", clearSquad: "Vaciar Cancha",
    pickerTitle: "Seleccionar Jugador",
    optSave: "Guardar Plantilla", optTemplate: "Cargar Plantilla Ejemplo",
    optClear: "Vaciar Plantilla",
    tacticsOffensive: "Estilo Ofensivo", tacticsDefensive: "Estilo Defensivo",
    tacticsWidth: "Anchura de Plantilla", tacticsDepth: "Profundidad Defensiva",
    tacticsPlayersInBox: "Jugadores al Área",
    roleCaptain: "Capitán", rolePenalties: "Penaltis", roleFkShort: "Falta Corta", roleFkLong: "Falta Lejana",
    roleCornerL: "Córner Izquierdo", roleCornerR: "Córner Derecho",
    yearsOld: "años", noClub: "Sin club",
    ctxDetail: "Ver ficha completa y precio", ctxSwap: "Cambiar jugador (Base de Datos)",
    ctxToBench: "Mover al banquillo", ctxToPitch: "Poner en la cancha", ctxRemove: "Quitar de la alineación",
    detModalTitle: "Ficha del Jugador", detPriceTitle: "Precio Mercado / SBC", detNoPrice: "Sin precio registrado",
    detPos: "POSICIÓN", detClub: "CLUB", detLeague: "LIGA", detNat: "NACIONALIDAD", detAge: "EDAD", detRarity: "RAREZA",
    detStatsTitle: "ESTADÍSTICAS DEL JUGADOR",
    detBtnChange: "Cambiar Jugador", detBtnToBench: "Mover al Banquillo", detBtnToPitch: "Poner en la Cancha",
    detBtnRemove: "Quitar", detBtnClose: "Cerrar",
    statPac: "RIT", statSho: "TIR", statPas: "PAS", statDri: "REG", statDef: "DEF", statPhy: "FIS",
    gkDiv: "EST", gkHan: "PAR", gkKic: "SAQ", gkRef: "REF", gkSpd: "VEL", gkPos: "POS",
    pitch11Price: "Precio 11 Inicial:", pitch11Acq: "Precio Adquisición (11):",
    stageTotalWord: "Total (11 + Banquillo):", stageTotalAcqWord: "Adquisición:",
    benchTotalWord: "Total Banquillo:", benchAcqWord: "Adquisición Banquillo:",
    detAcqTitle: "Precio Adquisición", savePricesBtn: "Guardar Precios",
    pricesUpdatedMsg: "Precios del jugador actualizados"
  },
  en: {
    navHome: "Home", navDb: "Database", navCalc: "SBC Calculator", navTeam: "My Team",
    chem: "CHEM", ovr: "OVR", del: "ATT", cen: "MID", def: "DEF", auto: "AUTO",
    squads: "Squads", toggle: "Toggle View",
    toggleFront: "View: Front", toggleChem: "View: Chemistry", toggleStats: "View: Stats",
    tabBench: "Bench", tabFormations: "Formations", tabTactics: "Tactics", tabRoles: "Roles",
    benchTitle: "BENCH", formationsTitle: "FORMATIONS", tacticsTitle: "TACTICS", rolesTitle: "ROLES",
    delanteros: "Forwards", centrocampistas: "Midfielders", defensas: "Defenders", porteros: "Goalkeepers",
    addBench: "+ Add Substitute", emptyBench: "No substitutes in this category.",
    swapPlayer: "Swap player", toBench: "Move to bench", removePlayer: "Remove from pitch",
    autoComplete: "Auto Build", clearSquad: "Clear Pitch",
    pickerTitle: "Select Player",
    optSave: "Save Squad", optTemplate: "Load Example Squad",
    optClear: "Clear Squad",
    tacticsOffensive: "Offensive Style", tacticsDefensive: "Defensive Style",
    tacticsWidth: "Team Width", tacticsDepth: "Defensive Depth",
    tacticsPlayersInBox: "Players in Box",
    roleCaptain: "Captain", rolePenalties: "Penalties", roleFkShort: "Short Free Kick", roleFkLong: "Long Free Kick",
    roleCornerL: "Left Corner", roleCornerR: "Right Corner",
    yearsOld: "years", noClub: "No club",
    ctxDetail: "View card details & price", ctxSwap: "Swap player (Database)",
    ctxToBench: "Move to bench", ctxToPitch: "Put on pitch", ctxRemove: "Remove from squad",
    detModalTitle: "Player Details", detPriceTitle: "Market / SBC Price", detNoPrice: "No price registered",
    detPos: "POSITION", detClub: "CLUB", detLeague: "LEAGUE", detNat: "NATIONALITY", detAge: "AGE", detRarity: "RARITY",
    detStatsTitle: "PLAYER STATS",
    detBtnChange: "Change Player", detBtnToBench: "Move to Bench", detBtnToPitch: "Put on Pitch",
    detBtnRemove: "Remove", detBtnClose: "Close",
    statPac: "PAC", statSho: "SHO", statPas: "PAS", statDri: "DRI", statDef: "DEF", statPhy: "PHY",
    gkDiv: "DIV", gkHan: "HAN", gkKic: "KIC", gkRef: "REF", gkSpd: "SPD", gkPos: "POS",
    pitch11Price: "Starting 11 Value:", pitch11Acq: "Acquisition Price (11):",
    stageTotalWord: "Total (11 + Bench):", stageTotalAcqWord: "Acquisition:",
    benchTotalWord: "Total Bench:", benchAcqWord: "Bench Acquisition:",
    detAcqTitle: "Acquisition Price", savePricesBtn: "Save Prices",
    pricesUpdatedMsg: "Player prices updated"
  },
  fr: {
    navHome: "Accueil", navDb: "Base de Données", navCalc: "Calculateur DCE", navTeam: "Mon Équipe",
    chem: "COLL", ovr: "GEN", del: "ATT", cen: "MIL", def: "DÉF", auto: "AUTO",
    squads: "Compositions", toggle: "Changer",
    toggleFront: "Vue: Photo", toggleChem: "Vue: Collectif", toggleStats: "Vue: Stats",
    tabBench: "Banc", tabFormations: "Dispositifs", tabTactics: "Tactiques", tabRoles: "Rôles",
    benchTitle: "BANC DES REMPLAÇANTS", formationsTitle: "DISPOSITIFS", tacticsTitle: "TACTIQUES", rolesTitle: "RÔLES",
    delanteros: "Attaquants", centrocampistas: "Milieux", defensas: "Défenseurs", porteros: "Gardiens",
    addBench: "+ Ajouter remplaçant", emptyBench: "Aucun remplaçant dans cette catégorie.",
    swapPlayer: "Changer joueur", toBench: "Mettre sur le banc", removePlayer: "Retirer du terrain",
    autoComplete: "Auto Remplissage", clearSquad: "Vider le terrain",
    pickerTitle: "Sélectionner Joueur",
    optSave: "Enregistrer l'équipe", optTemplate: "Charger modèle exemple",
    optClear: "Vider l'équipe",
    tacticsOffensive: "Style Offensif", tacticsDefensive: "Style Défensif",
    tacticsWidth: "Largeur d'Équipe", tacticsDepth: "Profondeur",
    tacticsPlayersInBox: "Dans la surface",
    roleCaptain: "Capitaine", rolePenalties: "Penaltys", roleFkShort: "Coup franc court", roleFkLong: "Coup franc long",
    roleCornerL: "Corner gauche", roleCornerR: "Corner droit",
    yearsOld: "ans", noClub: "Sans club",
    ctxDetail: "Voir fiche complète et prix", ctxSwap: "Changer joueur (Base de données)",
    ctxToBench: "Mettre sur le banc", ctxToPitch: "Mettre sur le terrain", ctxRemove: "Retirer de l'équipe",
    detModalTitle: "Fiche du Joueur", detPriceTitle: "Prix Marché / DCE", detNoPrice: "Aucun prix enregistré",
    detPos: "POSTE", detClub: "CLUB", detLeague: "LIGUE", detNat: "NATIONALITÉ", detAge: "ÂGE", detRarity: "RARETÉ",
    detStatsTitle: "STATISTIQUES DU JOUEUR",
    detBtnChange: "Changer Joueur", detBtnToBench: "Mettre sur le banc", detBtnToPitch: "Mettre sur le terrain",
    detBtnRemove: "Retirer", detBtnClose: "Fermer",
    statPac: "VIT", statSho: "TIR", statPas: "PAS", statDri: "DRI", statDef: "DÉF", statPhy: "PHY",
    gkDiv: "PLO", gkHan: "JEU", gkKic: "DÉG", gkRef: "RÉF", gkSpd: "VIT", gkPos: "POS",
    pitch11Price: "Prix 11 Titulaire :", pitch11Acq: "Prix Acquisition (11) :",
    stageTotalWord: "Total (11 + Banc) :", stageTotalAcqWord: "Acquisition :",
    benchTotalWord: "Total Banc :", benchAcqWord: "Acquisition Banc :",
    detAcqTitle: "Prix d'Acquisition", savePricesBtn: "Enregistrer les prix",
    pricesUpdatedMsg: "Prix du joueur mis à jour"
  },
  de: {
    navHome: "Startseite", navDb: "Datenbank", navCalc: "SBC-Rechner", navTeam: "Mein Team",
    chem: "CHM", ovr: "GES", del: "ANG", cen: "MIT", def: "ABW", auto: "AUTO",
    squads: "Aufstellungen", toggle: "Ansicht",
    toggleFront: "Ansicht: Foto", toggleChem: "Ansicht: Chemie", toggleStats: "Ansicht: Stats",
    tabBench: "Bank", tabFormations: "Formationen", tabTactics: "Taktik", tabRoles: "Rollen",
    benchTitle: "AUSWECHSELBANK", formationsTitle: "FORMATIONEN", tacticsTitle: "TAKTIK", rolesTitle: "ROLLEN",
    delanteros: "Stürmer", centrocampistas: "Mittelfeld", defensas: "Verteidiger", porteros: "Torhüter",
    addBench: "+ Ersatzspieler", emptyBench: "Keine Spieler in dieser Kategorie.",
    swapPlayer: "Spieler tauschen", toBench: "Auf die Bank", removePlayer: "Vom Feld nehmen",
    autoComplete: "Automatisch", clearSquad: "Feld leeren",
    pickerTitle: "Spieler auswählen",
    optSave: "Team speichern", optTemplate: "Beispielteam laden",
    optClear: "Team leeren",
    tacticsOffensive: "Offensivstil", tacticsDefensive: "Defensivstil",
    tacticsWidth: "Breite", tacticsDepth: "Tiefe",
    tacticsPlayersInBox: "Spieler im Strafraum",
    roleCaptain: "Kapitän", rolePenalties: "Elfmeter", roleFkShort: "Freistoß kurz", roleFkLong: "Freistoß lang",
    roleCornerL: "Ecke links", roleCornerR: "Ecke rechts",
    yearsOld: "Jahre", noClub: "Kein Verein",
    ctxDetail: "Karte & Preis anzeigen", ctxSwap: "Spieler tauschen (Datenbank)",
    ctxToBench: "Auf die Bank", ctxToPitch: "Auf das Feld", ctxRemove: "Aus Team entfernen",
    detModalTitle: "Spielerdetails", detPriceTitle: "Markt- / SBC-Preis", detNoPrice: "Kein Preis erfasst",
    detPos: "POSITION", detClub: "VEREIN", detLeague: "LIGA", detNat: "NATIONALITÄT", detAge: "ALTER", detRarity: "SELTENHEIT",
    detStatsTitle: "SPIELERSTATISTIKEN",
    detBtnChange: "Spieler wechseln", detBtnToBench: "Auf die Bank", detBtnToPitch: "Auf das Feld",
    detBtnRemove: "Entfernen", detBtnClose: "Schließen",
    statPac: "TEM", statSho: "SCH", statPas: "PAS", statDri: "DRI", statDef: "DEF", statPhy: "PHY",
    gkDiv: "HECH", gkHan: "FANG", gkKic: "ABST", gkRef: "REFL", gkSpd: "GES", gkPos: "POS",
    pitch11Price: "Startelf-Wert:", pitch11Acq: "Einkaufspreis (11):",
    stageTotalWord: "Gesamt (11 + Bank):", stageTotalAcqWord: "Einkauf:",
    benchTotalWord: "Gesamte Bank:", benchAcqWord: "Bank Einkauf:",
    detAcqTitle: "Einkaufspreis", savePricesBtn: "Preise speichern",
    pricesUpdatedMsg: "Spielerpreise aktualisiert"
  },
  it: {
    navHome: "Home", navDb: "Database", navCalc: "Calcolatore SCR", navTeam: "La Mia Squadra",
    chem: "INT", ovr: "VAL", del: "ATT", cen: "CEN", def: "DIF", auto: "AUTO",
    squads: "Formazioni", toggle: "Cambia",
    toggleFront: "Vista: Foto", toggleChem: "Vista: Intesa", toggleStats: "Vista: Stats",
    tabBench: "Panchina", tabFormations: "Moduli", tabTactics: "Tattiche", tabRoles: "Ruoli",
    benchTitle: "PANCHINA", formationsTitle: "MODULI", tacticsTitle: "TATTICHE", rolesTitle: "RUOLI",
    delanteros: "Attaccanti", centrocampistas: "Centrocampisti", defensas: "Difensori", porteros: "Portieri",
    addBench: "+ Aggiungi riserva", emptyBench: "Nessuna riserva.",
    swapPlayer: "Cambia giocatore", toBench: "Metti in panchina", removePlayer: "Rimuovi dal campo",
    autoComplete: "Completamento", clearSquad: "Svuota campo",
    pickerTitle: "Seleziona Giocatore",
    optSave: "Salva Squadra", optTemplate: "Carica Squadra Esempio",
    optClear: "Svuota Squadra",
    tacticsOffensive: "Stile Offensivo", tacticsDefensive: "Stile Difensivo",
    tacticsWidth: "Ampiezza", tacticsDepth: "Profondità",
    tacticsPlayersInBox: "Giocatori in area",
    roleCaptain: "Capitano", rolePenalties: "Rigori", roleFkShort: "Punizione corta", roleFkLong: "Punizione da lontano",
    roleCornerL: "Angolo sinistro", roleCornerR: "Angolo destro",
    yearsOld: "anni", noClub: "Senza club",
    ctxDetail: "Vedi dettagli e prezzo", ctxSwap: "Cambia giocatore (Database)",
    ctxToBench: "Metti in panchina", ctxToPitch: "Metti in campo", ctxRemove: "Rimuovi dalla squadra",
    detModalTitle: "Scheda Giocatore", detPriceTitle: "Prezzo Mercato / SCR", detNoPrice: "Nessun prezzo registrato",
    detPos: "RUOLO", detClub: "CLUB", detLeague: "CAMPIONATO", detNat: "NAZIONALITÀ", detAge: "ETÀ", detRarity: "RARITÀ",
    detStatsTitle: "STATISTICHE GIOCATORE",
    detBtnChange: "Cambia Giocatore", detBtnToBench: "Metti in panchina", detBtnToPitch: "Metti in campo",
    detBtnRemove: "Rimuovi", detBtnClose: "Chiudi",
    statPac: "VEL", statSho: "TIR", statPas: "PAS", statDri: "DRI", statDef: "DIF", statPhy: "FIS",
    gkDiv: "TUF", gkHan: "PRE", gkKic: "RIN", gkRef: "RIF", gkSpd: "VEL", gkPos: "POS",
    pitch11Price: "Valore Titolari (11):", pitch11Acq: "Prezzo Acquisto (11):",
    stageTotalWord: "Totale (11 + Panchina):", stageTotalAcqWord: "Acquisto:",
    benchTotalWord: "Totale Panchina:", benchAcqWord: "Acquisto Panchina:",
    detAcqTitle: "Prezzo di Acquisto", savePricesBtn: "Salva Prezzi",
    pricesUpdatedMsg: "Prezzi del giocatore aggiornati"
  },
  pt: {
    navHome: "Início", navDb: "Base de Dados", navCalc: "Calculadora DME", navTeam: "A Minha Equipa",
    chem: "ENT", ovr: "GER", del: "ATA", cen: "MÉD", def: "DEF", auto: "AUTO",
    squads: "Escalações", toggle: "Alternar",
    toggleFront: "Vista: Foto", toggleChem: "Vista: Entrosamento", toggleStats: "Vista: Stats",
    tabBench: "Banco", tabFormations: "Formações", tabTactics: "Táticas", tabRoles: "Funções",
    benchTitle: "BANCO DE RESERVAS", formationsTitle: "FORMAÇÕES", tacticsTitle: "TÁTICAS", rolesTitle: "FUNÇÕES",
    delanteros: "Atacantes", centrocampistas: "Médios", defensas: "Defensores", porteros: "Guarda-redes",
    addBench: "+ Adicionar Suplente", emptyBench: "Nenhum suplente nesta categoria.",
    swapPlayer: "Trocar jogador", toBench: "Enviar para o banco", removePlayer: "Retirar de campo",
    autoComplete: "Preenchimento Automático", clearSquad: "Limpar Campo",
    pickerTitle: "Selecionar Jogador",
    optSave: "Salvar Equipe", optTemplate: "Carregar Equipe Exemplo",
    optClear: "Limpar Equipe",
    tacticsOffensive: "Estilo Ofensivo", tacticsDefensive: "Estilo Defensivo",
    tacticsWidth: "Amplitude", tacticsDepth: "Profundidade",
    tacticsPlayersInBox: "Jogadores na Área",
    roleCaptain: "Capitão", rolePenalties: "Pênaltis", roleFkShort: "Falta curta", roleFkLong: "Falta longa",
    roleCornerL: "Escanteio esquerdo", roleCornerR: "Escanteio direito",
    yearsOld: "anos", noClub: "Sem clube",
    ctxDetail: "Ver carta completa e preço", ctxSwap: "Trocar jogador (Base de Dados)",
    ctxToBench: "Enviar para o banco", ctxToPitch: "Colocar em campo", ctxRemove: "Remover da escalação",
    detModalTitle: "Ficha do Jogador", detPriceTitle: "Preço Mercado / DME", detNoPrice: "Sem preço registrado",
    detPos: "POSIÇÃO", detClub: "CLUBE", detLeague: "LIGA", detNat: "NACIONALIDADE", detAge: "IDADE", detRarity: "RARIDADE",
    detStatsTitle: "ESTATÍSTICAS DO JOGADOR",
    detBtnChange: "Trocar Jogador", detBtnToBench: "Enviar para o banco", detBtnToPitch: "Colocar em campo",
    detBtnRemove: "Remover", detBtnClose: "Fechar",
    statPac: "RIT", statSho: "REM", statPas: "PAS", statDri: "DRI", statDef: "DEF", statPhy: "FÍS",
    gkDiv: "MER", gkHan: "MAN", gkKic: "PON", gkRef: "REF", gkSpd: "VEL", gkPos: "POS",
    pitch11Price: "Preço Titulares (11):", pitch11Acq: "Preço Aquisição (11):",
    stageTotalWord: "Total (11 + Banco):", stageTotalAcqWord: "Aquisição:",
    benchTotalWord: "Total Banco:", benchAcqWord: "Aquisição Banco:",
    detAcqTitle: "Preço de Aquisição", savePricesBtn: "Salvar Preços",
    pricesUpdatedMsg: "Preços do jogador actualizados"
  }
};

// Traducciones de posiciones
var posTranslations = {
  es: { 'ST':'DC', 'RW':'ED', 'LW':'EI', 'RM':'MD', 'LM':'MI', 'CM':'MC', 'CDM':'MCD', 'CAM':'MCO', 'CB':'DFC', 'RB':'LD', 'LB':'LI', 'GK':'POR', 'CF':'SD', 'RWB':'CAD', 'LWB':'CAI' },
  en: { 'ST':'ST', 'RW':'RW', 'LW':'LW', 'RM':'RM', 'LM':'LM', 'CM':'CM', 'CDM':'CDM', 'CAM':'CAM', 'CB':'CB', 'RB':'RB', 'LB':'LB', 'GK':'GK', 'CF':'CF', 'RWB':'RWB', 'LWB':'LWB' },
  fr: { 'ST':'BU', 'RW':'AD', 'LW':'AG', 'RM':'MD', 'LM':'MG', 'CM':'MC', 'CDM':'MDC', 'CAM':'MOC', 'CB':'DC', 'RB':'DD', 'LB':'DG', 'GK':'G', 'CF':'AT', 'RWB':'DLD', 'LWB':'DLG' },
  de: { 'ST':'ST', 'RW':'RF', 'LW':'LF', 'RM':'RM', 'LM':'LM', 'CM':'ZM', 'CDM':'ZDM', 'CAM':'ZOM', 'CB':'IV', 'RB':'RV', 'LB':'LV', 'GK':'TW', 'CF':'MS', 'RWB':'RAV', 'LWB':'LAV' },
  it: { 'ST':'ATT', 'RW':'AD', 'LW':'AS', 'RM':'ED', 'LM':'ES', 'CM':'CC', 'CDM':'CDC', 'CAM':'COC', 'CB':'DC', 'RB':'TD', 'LB':'TS', 'GK':'POR', 'CF':'AT', 'RWB':'ADA', 'LWB':'ASA' },
  pt: { 'ST':'PL', 'RW':'PD', 'LW':'PE', 'RM':'MD', 'LM':'ME', 'CM':'MC', 'CDM':'VOL', 'CAM':'MEI', 'CB':'ZAG', 'RB':'LD', 'LB':'LE', 'GK':'GR', 'CF':'SA', 'RWB':'ADD', 'LWB':'ADE' }
};

var reversePosLookup = {
  'DC':'ST', 'ED':'RW', 'EI':'LW', 'DFC':'CB', 'LD':'RB', 'LI':'LB', 'POR':'GK', 'MCD':'CDM', 'MCO':'CAM', 'MI':'LM', 'MD':'RM', 'MC':'CM', 'SD':'CF', 'CAD':'RWB', 'CAI':'LWB',
  'BU':'ST', 'AD':'RW', 'AG':'LW', 'MDC':'CDM', 'MOC':'CAM', 'DD':'RB', 'DG':'LB', 'G':'GK', 'MG':'LM', 'AT':'CF', 'DLD':'RWB', 'DLG':'LWB',
  'RF':'RW', 'LF':'LW', 'ZM':'CM', 'ZDM':'CDM', 'ZOM':'CAM', 'IV':'CB', 'RV':'RB', 'LV':'LB', 'TW':'GK', 'MS':'CF', 'RAV':'RWB', 'LAV':'LWB',
  'ATT':'ST', 'AS':'LW', 'CC':'CM', 'CDC':'CDM', 'COC':'CAM', 'TD':'RB', 'TS':'LB', 'ES':'LM', 'ADA':'RWB', 'ASA':'LWB',
  'PL':'ST', 'PD':'RW', 'PE':'LW', 'VOL':'CDM', 'MEI':'CAM', 'ZAG':'CB', 'LE':'LB', 'GR':'GK', 'SA':'CF', 'ADD':'RWB', 'ADE':'LWB'
};

function normalizePosition(p) {
  if (!p) return 'ST';
  var up = String(p).trim().toUpperCase();
  return reversePosLookup[up] || up;
}
// Obtiene una clave única de la persona física (independiente de su versión/rareza)
function getPersonId(p) {
  if (!p) return '';
  var cleanName = (p.name || '').replace(/\s*\([^)]*\)/g, '').trim().toLowerCase();
  var nat = (p.country || '').trim().toLowerCase();
  // Combina nombre limpio + país para diferenciar a jugadores con igual apellido
  return cleanName + '_' + nat;
}

// Comprueba si esa misma persona ya está en el campo o en el banquillo
function isPersonAlreadyInTeam(player, excludeType, excludeIndex) {
  if (!player) return false;
  var targetKey = getPersonId(player);
  if (!targetKey) return false;

  // Revisar titulares
  for (var i = 0; i < myTeamState.starters.length; i++) {
    if (excludeType === 'starter' && excludeIndex === i) continue;
    var s = myTeamState.starters[i];
    if (s && getPersonId(s) === targetKey) return true;
  }

  // Revisar banquillo
  for (var j = 0; j < myTeamState.bench.length; j++) {
    if (excludeType === 'bench' && excludeIndex === j) continue;
    var b = myTeamState.bench[j];
    if (b && getPersonId(b) === targetKey) return true;
  }

  return false;
}

function displayPos(p) {
  if (!p) return '—';
  var std = normalizePosition(p);
  var dict = posTranslations[currentLang] || posTranslations.es;
  return dict[std] || std;
}

function getDisplayClub(club) {
  if (!club) return '';
  var c = String(club).trim();
  var lower = c.toLowerCase();
  if (lower === 'sin club' || lower === 'sin equipo' || lower === 'no club' || lower === 'none' || lower === '—' || lower === '-' || lower === 'n/a' || lower === 'null' || lower === 'undefined') {
    return '';
  }
  return c;
}

function getPlayerPrice(p) {
  if (!p) return 0;
  var pr = parseInt(p.price, 10);
  return (!isNaN(pr) && pr > 0) ? pr : 0;
}

function getPlayerAcqPrice(p) {
  if (!p) return 0;
  var val = (p.bought_price !== undefined && p.bought_price !== null && p.bought_price !== '') 
    ? p.bought_price 
    : (p.boughtPrice !== undefined && p.boughtPrice !== null && p.boughtPrice !== '' ? p.boughtPrice : p.acquisition_price);
  var pr = parseInt(val, 10);
  return (!isNaN(pr) && pr > 0) ? pr : 0;
}

// CÓDIGOS CORTO PARA MODO 2 (Química/Atributos como en Captura 2)
function getCountryCode(country) {
  if (!country) return 'GEN';
  var c = String(country).toLowerCase();
  if (c.includes('países bajos') || c.includes('holanda') || c.includes('netherland')) return 'NL';
  if (c.includes('brasil') || c.includes('brazil')) return 'BR';
  if (c.includes('inglaterra') || c.includes('england')) return 'EN';
  if (c.includes('españa') || c.includes('spain')) return 'ES';
  if (c.includes('argentina')) return 'AR';
  if (c.includes('italia') || c.includes('italy')) return 'IT';
  if (c.includes('francia') || c.includes('france')) return 'FR';
  if (c.includes('alemania') || c.includes('germany')) return 'DE';
  if (c.includes('portugal')) return 'PT';
  if (c.includes('croacia') || c.includes('croatia')) return 'HR';
  if (c.includes('bélgica') || c.includes('belgium')) return 'BE';
  if (c.includes('argelia') || c.includes('algeria')) return 'DZ';
  if (c.includes('suecia') || c.includes('sweden')) return 'SE';
  if (c.includes('irlanda del norte') || c.includes('northern ireland')) return 'NIR';
  if (c.includes('turquía') || c.includes('turkey')) return 'TUR';
  if (c.includes('uruguay')) return 'UY';
  if (c.includes('colombia')) return 'CO';
  if (c.includes('polonia') || c.includes('poland')) return 'PL';
  if (c.includes('rumanía') || c.includes('rumania') || c.includes('romania')) return 'RO';
  if (c.includes('suiza') || c.includes('switzerland')) return 'CH';
  if (c.includes('noruega') || c.includes('norway')) return 'NO';
  if (c.includes('corea') || c.includes('korea')) return 'KR';
  if (c.includes('escocia') || c.includes('scotland')) return 'SCT';
  if (c.includes('australia')) return 'AU';
  if (c.includes('dinamarca') || c.includes('denmark')) return 'DK';
  if (c.includes('irlanda') || c.includes('ireland')) return 'IE';
  if (c.includes('austria')) return 'AT';
  if (c.includes('estados unidos') || c.includes('usa')) return 'US';
  if (c.includes('méxico') || c.includes('mexico')) return 'MX';
  if (c.includes('marruecos') || c.includes('morocco')) return 'MA';
  if (c.includes('japón') || c.includes('japan')) return 'JP';
  if (c.includes('nigeria')) return 'NG';
  if (c.includes('senegal')) return 'SN';
  if (c.includes('serbia')) return 'RS';
  return country.substring(0, 3).toUpperCase();
}

function getLeagueCode(league) {
  if (!league) return 'LIG';
  var l = String(league).toLowerCase();
  if (l.includes('premier') || l.includes('inglaterra')) return 'ENG1';
  if (l.includes('laliga') || l.includes('españa')) return 'SPA1';
  if (l.includes('serie a') || l.includes('italia')) return 'ITA1';
  if (l.includes('bundesliga') || l.includes('alemania')) return 'GER1';
  if (l.includes('ligue 1') || l.includes('francia')) return 'FRA1';
  if (l.includes('eredivisie') || l.includes('países bajos')) return 'NETH';
  if (l.includes('süper lig') || l.includes('turquía')) return 'TURK';
  if (l.includes('liga portugal') || l.includes('portugal')) return 'POR1';
  if (l.includes('brasileir') || l.includes('brasil')) return 'BRA1';
  return league.substring(0, 4).toUpperCase();
}

function getRarityCode(rarity) {
  if (!rarity) return 'GOLD';
  var r = String(rarity).toLowerCase();
  if (r.includes('euro')) return 'EURO';
  if (r.includes('totw')) return 'WEEK';
  if (r.includes('transfer')) return 'TRAN';
  if (r.includes('ptc')) return 'PTC';
  if (r.includes('season')) return 'NWS';
  if (r.includes('potm')) return 'POTM';
  if (r.includes('silver')) return 'SILV';
  if (r.includes('bronze')) return 'BRNZ';
  return 'GOLD';
}

var DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='124' height='124' viewBox='0 0 24 24' fill='%23ffffff'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>";

function getShieldType(rarity, rating) {
  var r = (rarity || 'normal').toLowerCase();
  if (r === 'normal') {
    var rat = +rating || 0;
    if (rat <= 64) return 'bronze';
    if (rat <= 74) return 'silver';
    if (rat <= 82) return 'gold-light';
    return 'gold-dark';
  }
  return r;
}

function getRarityClass(rarity, rating) {
  var r = (rarity || 'normal').toLowerCase();
  var rat = +rating || 0;
  if (r === 'normal') {
    if (rat <= 64) return 'card-bronze';
    if (rat <= 74) return 'card-silver';
    if (rat <= 82) return 'card-gold-light';
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

function isSpecialRarityType(rarity) {
  if (!rarity) return false;
  var r = String(rarity).trim().toLowerCase();
  var normalList = ['normal', 'oro', 'gold', 'plata', 'silver', 'bronce', 'bronze', 'oro común', 'oro unico', 'oro único', 'oro standard'];
  return !normalList.includes(r);
}

function getPlayerCategoryChem(p, slotPos) {
  if (!p) return { countryPts: 0, leaguePts: 0, rarityPts: 0, total: 0 };
  var chemData = calculateTeamChemistry();
  var isCompatible = slotPos ? isPosCompatible(p.position, slotPos) : true;
  if (!isCompatible) {
    return { countryPts: 0, leaguePts: 0, rarityPts: 0, total: 0 };
  }
  var cCode = getCountryCode(p.country);
  var lCode = getLeagueCode(p.league);
  var rCode = getRarityCode(p.rarity);
  var isSpecial = isSpecialRarityType(p.rarity);

  var cCnt = chemData.countryCounts[cCode] || 0;
  var cPts = 0;
  if (cCnt >= 8) cPts = 3;
  else if (cCnt >= 5) cPts = 2;
  else if (cCnt >= 2) cPts = 1;

  var lCnt = chemData.leagueCounts[lCode] || 0;
  var lPts = 0;
  if (lCnt >= 8) lPts = 3;
  else if (lCnt >= 5) lPts = 2;
  else if (lCnt >= 3) lPts = 1;

  var rPts = 0;
  if (isSpecial) {
    var rCnt = chemData.rarityCounts[rCode] || 0;
    if (rCnt >= 7) rPts = 3;
    else if (rCnt >= 4) rPts = 2;
    else if (rCnt >= 2) rPts = 1;
    if (rPts === 0 && rCnt >= 1) rPts = 1;
  }

  return {
    countryPts: cPts,
    leaguePts: lPts,
    rarityPts: rPts,
    total: Math.min(3, cPts + lPts + rPts)
  };
}

function renderPlayerShieldCard(p, chemPts, isBench, isDetailModal, slotPos) {
  if (!p) return '';
  var shieldType = getShieldType(p.rarity, p.rating);
  var rClass = getRarityClass(p.rarity, p.rating);
  var cleanName = (p.name || '').replace(/\s*\([^)]*\)/g, '').trim();
  var imgUrl = p.image ? p.image : DEFAULT_AVATAR;
  var t = i18nTeam[currentLang] || i18nTeam.es;
  var sizeClass = isDetailModal ? 'shield-db-size' : 'shield-team-size';
  var isGK = normalizePosition(p.position) === 'GK';

  // 1. MODAL DETALLE: Carta completa ampliada con banderas y estadísticas
  if (isDetailModal) {
    var natFlag = getFlagUrl(p.country);
    var leagueFlag = getLeagueFlagUrl(p.league, p.country);
    var flagsHtml = `
      <img class="flag-rect" title="${p.country || 'Nacionalidad'}" src="${natFlag}" onerror="this.src='https://flagcdn.com/w40/un.png'">
      <div class="shield-flag-wrap" title="${p.league || 'Liga'}">
        <img src="${leagueFlag}" onerror="this.src='https://flagcdn.com/w40/un.png'">
      </div>
    `;

    var s1Lbl = isGK ? (t.gkDiv || 'EST') : (t.statPac || 'RIT');
    var s2Lbl = isGK ? (t.gkHan || 'PAR') : (t.statDri || 'REG');
    var s3Lbl = isGK ? (t.gkKic || 'SAQ') : (t.statSho || 'TIR');
    var s4Lbl = isGK ? (t.gkRef || 'REF') : (t.statDef || 'DEF');
    var s5Lbl = isGK ? (t.gkSpd || 'VEL') : (t.statPas || 'PAS');
    var s6Lbl = isGK ? (t.gkPos || 'POS') : (t.statPhy || 'FIS');

    return `
      <div class="card-shield-border shield-${shieldType} ${sizeClass}">
        <div class="fut-card ${rClass} card-shield-shape">
          <div class="card-top">
            <div class="card-meta">
              <span class="card-rat">${p.rating}</span>
              <span class="card-pos">${displayPos(p.position)}</span>
              ${flagsHtml}
            </div>
            <div class="card-img-wrap">
              <img class="card-img" src="${imgUrl}" onerror="this.onerror=null;this.src='${DEFAULT_AVATAR}'">
            </div>
          </div>
          <div class="card-info">
            <div class="card-name">${cleanName}</div>
          </div>
          <div class="card-stats">
            <div class="stat-row"><span class="stat-num">${p.pac || '0'}</span> <span class="stat-lbl">${s1Lbl}</span></div>
            <div class="stat-row"><span class="stat-num">${p.dri || '0'}</span> <span class="stat-lbl">${s2Lbl}</span></div>
            <div class="stat-row"><span class="stat-num">${p.sho || '0'}</span> <span class="stat-lbl">${s3Lbl}</span></div>
            <div class="stat-row"><span class="stat-num">${p.def || '0'}</span> <span class="stat-lbl">${s4Lbl}</span></div>
            <div class="stat-row"><span class="stat-num">${p.pas || '0'}</span> <span class="stat-lbl">${s5Lbl}</span></div>
            <div class="stat-row"><span class="stat-num">${p.phy || '0'}</span> <span class="stat-lbl">${s6Lbl}</span></div>
          </div>
        </div>
      </div>
    `;
  }

  // 2. VISTAS EN CANCHA Y BANQUILLO
  var mode = (currentViewMode === 'front' || currentViewMode === 'photo') ? 'front' : currentViewMode;

  if (mode === 'front') {
    // VISTA FRONTAL: Media, Posición, Imagen y Nombre. Sin estadísticas y sin banderas delante
    // Las 3 bolitas de química dispuestas en triángulo (1 arriba y 2 debajo) sobre el borde superior derecho
    var chemNodesHtml = '';
    if (!isBench) {
      chemNodesHtml = `
        <div class="pitch-card-chem-triangle" title="${chemPts}/3 Química">
          <div class="chem-tri-top">
            <span class="chem-dot-tri ${chemPts >= 1 ? 'active' : ''}"></span>
          </div>
          <div class="chem-tri-bottom">
            <span class="chem-dot-tri ${chemPts >= 2 ? 'active' : ''}"></span>
            <span class="chem-dot-tri ${chemPts >= 3 ? 'active' : ''}"></span>
          </div>
        </div>
      `;
    }

    return `
      <div class="card-shield-border shield-${shieldType} ${sizeClass}">
        <div class="fut-card ${rClass} card-shield-shape">
          <div class="card-top">
            <div class="card-meta">
              <span class="card-rat">${p.rating}</span>
              <span class="card-pos">${displayPos(p.position)}</span>
            </div>
            <div class="card-img-wrap">
              <img class="card-img" draggable="false" src="${imgUrl}" onerror="this.onerror=null;this.src='${DEFAULT_AVATAR}'">
            </div>
            ${chemNodesHtml}
          </div>
          <div class="card-info">
            <div class="card-name">${cleanName}</div>
          </div>
        </div>
      </div>
    `;
  } else if (mode === 'chemistry') {
    // VISTA TRASERA 1: País, Liga y Rareza (si no es normal) con 3 bolitas cada uno, compactos y sin huecos
    var catChem = getPlayerCategoryChem(p, slotPos);
    var cCode = getCountryCode(p.country);
    var lCode = getLeagueCode(p.league);
    var rCode = getRarityCode(p.rarity);
    var natFlag2 = getFlagUrl(p.country);
    var leagueFlag2 = getLeagueFlagUrl(p.league, p.country);
    var isSpecial = isSpecialRarityType(p.rarity);

    var rarityRowHtml = '';
    if (isSpecial) {
      rarityRowHtml = `
        <div class="mode2-row">
          <div class="mode2-row-left"><span class="mode2-icon">✨</span><span>${rCode}</span></div>
          <div class="mode2-pips">
            <span class="mode2-pip ${catChem.rarityPts >= 1 ? 'active' : ''}"></span>
            <span class="mode2-pip ${catChem.rarityPts >= 2 ? 'active' : ''}"></span>
            <span class="mode2-pip ${catChem.rarityPts >= 3 ? 'active' : ''}"></span>
          </div>
        </div>
      `;
    }

    return `
      <div class="card-shield-border shield-${shieldType} ${sizeClass}">
        <div class="pitch-card-mode2">
          <div class="mode2-header">
            <span class="mode2-rat">${p.rating}</span>
            <span class="mode2-pos">${displayPos(p.position)}</span>
          </div>
          <div class="mode2-rows-wrap">
            <div class="mode2-row">
              <div class="mode2-row-left"><img draggable="false" src="${natFlag2}"><span>${cCode}</span></div>
              <div class="mode2-pips">
                <span class="mode2-pip ${catChem.countryPts >= 1 ? 'active' : ''}"></span>
                <span class="mode2-pip ${catChem.countryPts >= 2 ? 'active' : ''}"></span>
                <span class="mode2-pip ${catChem.countryPts >= 3 ? 'active' : ''}"></span>
              </div>
            </div>
            <div class="mode2-row">
              <div class="mode2-row-left"><div class="mode2-shield-wrap" title="${p.league || 'Liga'}"><img draggable="false" src="${leagueFlag2}" onerror="this.src='https://flagcdn.com/w40/un.png'"></div><span>${lCode}</span></div>
              <div class="mode2-pips">
                <span class="mode2-pip ${catChem.leaguePts >= 1 ? 'active' : ''}"></span>
                <span class="mode2-pip ${catChem.leaguePts >= 2 ? 'active' : ''}"></span>
                <span class="mode2-pip ${catChem.leaguePts >= 3 ? 'active' : ''}"></span>
              </div>
            </div>
            ${rarityRowHtml}
          </div>
        </div>
      </div>
    `;
  } else {
    // VISTA TRASERA 2: Solo nombre del jugador y debajo las 6 estadísticas (sin media ni posición)
    var s1Lbl = isGK ? (t.gkDiv || 'EST') : (t.statPac || 'RIT');
    var s2Lbl = isGK ? (t.gkHan || 'PAR') : (t.statSho || 'TIR');
    var s3Lbl = isGK ? (t.gkKic || 'SAQ') : (t.statPas || 'PAS');
    var s4Lbl = isGK ? (t.gkRef || 'REF') : (t.statDri || 'REG');
    var s5Lbl = isGK ? (t.gkSpd || 'VEL') : (t.statDef || 'DEF');
    var s6Lbl = isGK ? (t.gkPos || 'POS') : (t.statPhy || 'FIS');

    var s1Val = p.pac || '0';
    var s2Val = p.sho || '0';
    var s3Val = p.pas || '0';
    var s4Val = p.dri || '0';
    var s5Val = p.def || '0';
    var s6Val = p.phy || '0';

    return `
      <div class="card-shield-border shield-${shieldType} ${sizeClass}">
        <div class="pitch-card-mode-stats">
          <div class="mode-stats-name">${cleanName}</div>
          <div class="mode-stats-grid">
            <div class="mstat-row"><span class="mstat-lbl">${s1Lbl}</span> <span class="mstat-num">${s1Val}</span></div>
            <div class="mstat-row"><span class="mstat-lbl">${s4Lbl}</span> <span class="mstat-num">${s4Val}</span></div>
            <div class="mstat-row"><span class="mstat-lbl">${s2Lbl}</span> <span class="mstat-num">${s2Val}</span></div>
            <div class="mstat-row"><span class="mstat-lbl">${s5Lbl}</span> <span class="mstat-num">${s5Val}</span></div>
            <div class="mstat-row"><span class="mstat-lbl">${s3Lbl}</span> <span class="mstat-num">${s3Val}</span></div>
            <div class="mstat-row"><span class="mstat-lbl">${s6Lbl}</span> <span class="mstat-num">${s6Val}</span></div>
          </div>
        </div>
      </div>
    `;
  }
}

function getFlagUrl(country) {
  if (!country) return 'https://flagcdn.com/w40/un.png';
  var code = getCountryCode(country).toLowerCase();
  var map = {
    'nl':'nl', 'br':'br', 'en':'gb-eng', 'es':'es', 'ar':'ar', 'it':'it', 'fr':'fr', 'de':'de',
    'pt':'pt', 'hr':'hr', 'be':'be', 'dz':'dz', 'se':'se', 'nir':'gb-nir', 'tur':'tr', 'uy':'uy',
    'co':'co', 'pl':'pl', 'ro':'ro', 'ch':'ch', 'no':'no', 'kr':'kr', 'sct':'gb-sct', 'au':'au',
    'dk':'dk', 'ie':'ie', 'at':'at', 'us':'us', 'mx':'mx', 'ma':'ma', 'jp':'jp', 'ng':'ng',
    'sn':'sn', 'rs':'rs', 'sa':'sa'
  };
  var fCode = map[code] || (code.length === 2 ? code : 'un');
  return 'https://flagcdn.com/w40/' + fCode + '.png';
}

function getLeagueFlagUrl(league, country) {
  if (!league && !country) return 'https://flagcdn.com/w40/un.png';
  var raw = String(league || country).toLowerCase();

  // Diccionario completo de ligas y divisiones
  if (raw.includes('premier') || raw.includes('championship') || raw.includes('league one') || raw.includes('league two') || raw.includes('inglaterra') || raw.includes('england')) return 'https://flagcdn.com/w40/gb-eng.png';
  if (raw.includes('laliga') || raw.includes('la liga') || raw.includes('hypermotion') || raw.includes('españa') || raw.includes('spain')) return 'https://flagcdn.com/w40/es.png';
  if (raw.includes('serie a') || raw.includes('serie b') || raw.includes('italia') || raw.includes('italy')) return 'https://flagcdn.com/w40/it.png';
  if (raw.includes('bundesliga') || raw.includes('3. liga') || raw.includes('alemania') || raw.includes('germany')) return 'https://flagcdn.com/w40/de.png';
  if (raw.includes('ligue 1') || raw.includes('ligue 2') || raw.includes('francia') || raw.includes('france')) return 'https://flagcdn.com/w40/fr.png';
  if (raw.includes('eredivisie') || raw.includes('países bajos') || raw.includes('paises bajos') || raw.includes('holanda') || raw.includes('netherland')) return 'https://flagcdn.com/w40/nl.png';
  if (raw.includes('liga portugal') || raw.includes('portugal')) return 'https://flagcdn.com/w40/pt.png';
  if (raw.includes('süper lig') || raw.includes('super lig') || raw.includes('turquía') || raw.includes('turkey')) return 'https://flagcdn.com/w40/tr.png';
  if (raw.includes('brasileir') || raw.includes('brasil') || raw.includes('brazil')) return 'https://flagcdn.com/w40/br.png';
  if (raw.includes('profesional') || raw.includes('argentina')) return 'https://flagcdn.com/w40/ar.png';
  if (raw.includes('premiership') || raw.includes('escocia') || raw.includes('scotland')) return 'https://flagcdn.com/w40/gb-sct.png';
  if (raw.includes('bélgica') || raw.includes('belgica') || raw.includes('belgium')) return 'https://flagcdn.com/w40/be.png';
  if (raw.includes('a-league') || raw.includes('australia')) return 'https://flagcdn.com/w40/au.png';
  if (raw.includes('super league') || raw.includes('suiza') || raw.includes('switzerland')) return 'https://flagcdn.com/w40/ch.png';
  if (raw.includes('eliteserien') || raw.includes('noruega') || raw.includes('norway')) return 'https://flagcdn.com/w40/no.png';
  if (raw.includes('k league') || raw.includes('corea') || raw.includes('korea')) return 'https://flagcdn.com/w40/kr.png';
  if (raw.includes('liga i') || raw.includes('rumanía') || raw.includes('rumania') || raw.includes('romania')) return 'https://flagcdn.com/w40/ro.png';
  if (raw.includes('allsvenskan') || raw.includes('suecia') || raw.includes('sweden')) return 'https://flagcdn.com/w40/se.png';
  if (raw.includes('superliga') || raw.includes('dinamarca') || raw.includes('denmark')) return 'https://flagcdn.com/w40/dk.png';
  if (raw.includes('ekstraklasa') || raw.includes('polonia') || raw.includes('poland')) return 'https://flagcdn.com/w40/pl.png';
  if (raw.includes('austria') || raw.includes('österreich')) return 'https://flagcdn.com/w40/at.png';
  if (raw.includes('irlanda') || raw.includes('ireland')) return 'https://flagcdn.com/w40/ie.png';
  if (raw.includes('mls') || raw.includes('estados unidos') || raw.includes('usa')) return 'https://flagcdn.com/w40/us.png';
  if (raw.includes('saudi') || raw.includes('arabia')) return 'https://flagcdn.com/w40/sa.png';

  // Si no se encuentra en las ligas, usa la bandera del país
  return getFlagUrl(country || league);
}

// 24 FORMACIONES TÁCTICAS POPULARES DE EA FC
var FORMATIONS = {
  '433_def': {
    name: '4-3-3 defensa',
    category: '4-def',
    slots: [
      { id: 'GK', pos: 'GK', sector: 'DEF', x: 50, y: 88 },
      { id: 'LB', pos: 'LB', sector: 'DEF', x: 18, y: 64 },
      { id: 'CB1', pos: 'CB', sector: 'DEF', x: 38, y: 65 },
      { id: 'CB2', pos: 'CB', sector: 'DEF', x: 62, y: 65 },
      { id: 'RB', pos: 'RB', sector: 'DEF', x: 82, y: 64 },
      { id: 'CDM1', pos: 'CDM', sector: 'CEN', x: 30, y: 44 },
      { id: 'CM', pos: 'CM', sector: 'CEN', x: 50, y: 38 },
      { id: 'CDM2', pos: 'CDM', sector: 'CEN', x: 70, y: 44 },
      { id: 'LW', pos: 'LW', sector: 'DEL', x: 22, y: 16 },
      { id: 'ST', pos: 'ST', sector: 'DEL', x: 50, y: 14 },
      { id: 'RW', pos: 'RW', sector: 'DEL', x: 78, y: 16 }
    ]
  },
  '433_atk': {
    name: '4-3-3 ataque',
    category: '4-def',
    slots: [
      { id: 'GK', pos: 'GK', sector: 'DEF', x: 50, y: 88 },
      { id: 'LB', pos: 'LB', sector: 'DEF', x: 18, y: 65 },
      { id: 'CB1', pos: 'CB', sector: 'DEF', x: 38, y: 67 },
      { id: 'CB2', pos: 'CB', sector: 'DEF', x: 62, y: 67 },
      { id: 'RB', pos: 'RB', sector: 'DEF', x: 82, y: 65 },
      { id: 'CM1', pos: 'CM', sector: 'CEN', x: 34, y: 46 },
      { id: 'CAM', pos: 'CAM', sector: 'CEN', x: 50, y: 32 },
      { id: 'CM2', pos: 'CM', sector: 'CEN', x: 66, y: 46 },
      { id: 'LW', pos: 'LW', sector: 'DEL', x: 22, y: 16 },
      { id: 'ST', pos: 'ST', sector: 'DEL', x: 50, y: 14 },
      { id: 'RW', pos: 'RW', sector: 'DEL', x: 78, y: 16 }
    ]
  },
  '433_pivot': {
    name: '4-3-3 con pivote',
    category: '4-def',
    slots: [
      { id: 'GK', pos: 'GK', sector: 'DEF', x: 50, y: 88 },
      { id: 'LB', pos: 'LB', sector: 'DEF', x: 18, y: 64 },
      { id: 'CB1', pos: 'CB', sector: 'DEF', x: 38, y: 66 },
      { id: 'CB2', pos: 'CB', sector: 'DEF', x: 62, y: 66 },
      { id: 'RB', pos: 'RB', sector: 'DEF', x: 82, y: 64 },
      { id: 'CDM', pos: 'CDM', sector: 'CEN', x: 50, y: 50 },
      { id: 'CM1', pos: 'CM', sector: 'CEN', x: 32, y: 36 },
      { id: 'CM2', pos: 'CM', sector: 'CEN', x: 68, y: 36 },
      { id: 'LW', pos: 'LW', sector: 'DEL', x: 22, y: 16 },
      { id: 'ST', pos: 'ST', sector: 'DEL', x: 50, y: 14 },
      { id: 'RW', pos: 'RW', sector: 'DEL', x: 78, y: 16 }
    ]
  },
  '433_flat': {
    name: '4-3-3 plano',
    category: '4-def',
    slots: [
      { id: 'GK', pos: 'GK', sector: 'DEF', x: 50, y: 88 },
      { id: 'LB', pos: 'LB', sector: 'DEF', x: 18, y: 65 },
      { id: 'CB1', pos: 'CB', sector: 'DEF', x: 38, y: 66 },
      { id: 'CB2', pos: 'CB', sector: 'DEF', x: 62, y: 66 },
      { id: 'RB', pos: 'RB', sector: 'DEF', x: 82, y: 65 },
      { id: 'CM1', pos: 'CM', sector: 'CEN', x: 28, y: 42 },
      { id: 'CM2', pos: 'CM', sector: 'CEN', x: 50, y: 42 },
      { id: 'CM3', pos: 'CM', sector: 'CEN', x: 72, y: 42 },
      { id: 'LW', pos: 'LW', sector: 'DEL', x: 22, y: 16 },
      { id: 'ST', pos: 'ST', sector: 'DEL', x: 50, y: 14 },
      { id: 'RW', pos: 'RW', sector: 'DEL', x: 78, y: 16 }
    ]
  },
  '352': {
    name: '3-5-2',
    category: '3-def',
    slots: [
      { id: 'GK', pos: 'GK', sector: 'DEF', x: 50, y: 88 },
      { id: 'CB1', pos: 'CB', sector: 'DEF', x: 26, y: 68 },
      { id: 'CB2', pos: 'CB', sector: 'DEF', x: 50, y: 70 },
      { id: 'CB3', pos: 'CB', sector: 'DEF', x: 74, y: 68 },
      { id: 'CDM1', pos: 'CDM', sector: 'CEN', x: 36, y: 52 },
      { id: 'CDM2', pos: 'CDM', sector: 'CEN', x: 64, y: 52 },
      { id: 'LM', pos: 'LM', sector: 'CEN', x: 16, y: 38 },
      { id: 'CAM', pos: 'CAM', sector: 'CEN', x: 50, y: 34 },
      { id: 'RM', pos: 'RM', sector: 'CEN', x: 84, y: 38 },
      { id: 'ST1', pos: 'ST', sector: 'DEL', x: 36, y: 15 },
      { id: 'ST2', pos: 'ST', sector: 'DEL', x: 64, y: 15 }
    ]
  },
  '343_diamond': {
    name: '3-4-3 diamante',
    category: '3-def',
    slots: [
      { id: 'GK', pos: 'GK', sector: 'DEF', x: 50, y: 88 },
      { id: 'CB1', pos: 'CB', sector: 'DEF', x: 26, y: 68 },
      { id: 'CB2', pos: 'CB', sector: 'DEF', x: 50, y: 70 },
      { id: 'CB3', pos: 'CB', sector: 'DEF', x: 74, y: 68 },
      { id: 'CDM', pos: 'CDM', sector: 'CEN', x: 50, y: 52 },
      { id: 'LM', pos: 'LM', sector: 'CEN', x: 20, y: 40 },
      { id: 'RM', pos: 'RM', sector: 'CEN', x: 80, y: 40 },
      { id: 'CAM', pos: 'CAM', sector: 'CEN', x: 50, y: 32 },
      { id: 'LW', pos: 'LW', sector: 'DEL', x: 22, y: 16 },
      { id: 'ST', pos: 'ST', sector: 'DEL', x: 50, y: 14 },
      { id: 'RW', pos: 'RW', sector: 'DEL', x: 78, y: 16 }
    ]
  },
  '343_flat': {
    name: '3-4-3 plano',
    category: '3-def',
    slots: [
      { id: 'GK', pos: 'GK', sector: 'DEF', x: 50, y: 88 },
      { id: 'CB1', pos: 'CB', sector: 'DEF', x: 26, y: 68 },
      { id: 'CB2', pos: 'CB', sector: 'DEF', x: 50, y: 70 },
      { id: 'CB3', pos: 'CB', sector: 'DEF', x: 74, y: 68 },
      { id: 'LM', pos: 'LM', sector: 'CEN', x: 18, y: 44 },
      { id: 'CM1', pos: 'CM', sector: 'CEN', x: 38, y: 44 },
      { id: 'CM2', pos: 'CM', sector: 'CEN', x: 62, y: 44 },
      { id: 'RM', pos: 'RM', sector: 'CEN', x: 82, y: 44 },
      { id: 'LW', pos: 'LW', sector: 'DEL', x: 22, y: 16 },
      { id: 'ST', pos: 'ST', sector: 'DEL', x: 50, y: 14 },
      { id: 'RW', pos: 'RW', sector: 'DEL', x: 78, y: 16 }
    ]
  },
  '442': {
    name: '4-4-2 plano',
    category: '4-def',
    slots: [
      { id: 'GK', pos: 'GK', sector: 'DEF', x: 50, y: 88 },
      { id: 'LB', pos: 'LB', sector: 'DEF', x: 18, y: 65 },
      { id: 'CB1', pos: 'CB', sector: 'DEF', x: 38, y: 67 },
      { id: 'CB2', pos: 'CB', sector: 'DEF', x: 62, y: 67 },
      { id: 'RB', pos: 'RB', sector: 'DEF', x: 82, y: 65 },
      { id: 'LM', pos: 'LM', sector: 'CEN', x: 18, y: 42 },
      { id: 'CM1', pos: 'CM', sector: 'CEN', x: 38, y: 44 },
      { id: 'CM2', pos: 'CM', sector: 'CEN', x: 62, y: 44 },
      { id: 'RM', pos: 'RM', sector: 'CEN', x: 82, y: 42 },
      { id: 'ST1', pos: 'ST', sector: 'DEL', x: 36, y: 16 },
      { id: 'ST2', pos: 'ST', sector: 'DEL', x: 64, y: 16 }
    ]
  },
  '442_holding': {
    name: '4-4-2 contención',
    category: '4-def',
    slots: [
      { id: 'GK', pos: 'GK', sector: 'DEF', x: 50, y: 88 },
      { id: 'LB', pos: 'LB', sector: 'DEF', x: 18, y: 65 },
      { id: 'CB1', pos: 'CB', sector: 'DEF', x: 38, y: 67 },
      { id: 'CB2', pos: 'CB', sector: 'DEF', x: 62, y: 67 },
      { id: 'RB', pos: 'RB', sector: 'DEF', x: 82, y: 65 },
      { id: 'LM', pos: 'LM', sector: 'CEN', x: 18, y: 40 },
      { id: 'CDM1', pos: 'CDM', sector: 'CEN', x: 38, y: 48 },
      { id: 'CDM2', pos: 'CDM', sector: 'CEN', x: 62, y: 48 },
      { id: 'RM', pos: 'RM', sector: 'CEN', x: 82, y: 40 },
      { id: 'ST1', pos: 'ST', sector: 'DEL', x: 36, y: 16 },
      { id: 'ST2', pos: 'ST', sector: 'DEL', x: 64, y: 16 }
    ]
  },
  '4231': {
    name: '4-2-3-1 estrecho',
    category: '4-def',
    slots: [
      { id: 'GK', pos: 'GK', sector: 'DEF', x: 50, y: 88 },
      { id: 'LB', pos: 'LB', sector: 'DEF', x: 18, y: 65 },
      { id: 'CB1', pos: 'CB', sector: 'DEF', x: 38, y: 67 },
      { id: 'CB2', pos: 'CB', sector: 'DEF', x: 62, y: 67 },
      { id: 'RB', pos: 'RB', sector: 'DEF', x: 82, y: 65 },
      { id: 'CDM1', pos: 'CDM', sector: 'CEN', x: 36, y: 49 },
      { id: 'CDM2', pos: 'CDM', sector: 'CEN', x: 64, y: 49 },
      { id: 'CAM1', pos: 'CAM', sector: 'CEN', x: 25, y: 32 },
      { id: 'CAM2', pos: 'CAM', sector: 'CEN', x: 50, y: 30 },
      { id: 'CAM3', pos: 'CAM', sector: 'CEN', x: 75, y: 32 },
      { id: 'ST', pos: 'ST', sector: 'DEL', x: 50, y: 14 }
    ]
  },
  '41212_narrow': {
    name: '4-1-2-1-2 cerrado',
    category: '4-def',
    slots: [
      { id: 'GK', pos: 'GK', sector: 'DEF', x: 50, y: 88 },
      { id: 'LB', pos: 'LB', sector: 'DEF', x: 18, y: 65 },
      { id: 'CB1', pos: 'CB', sector: 'DEF', x: 38, y: 67 },
      { id: 'CB2', pos: 'CB', sector: 'DEF', x: 62, y: 67 },
      { id: 'RB', pos: 'RB', sector: 'DEF', x: 82, y: 65 },
      { id: 'CDM', pos: 'CDM', sector: 'CEN', x: 50, y: 52 },
      { id: 'CM1', pos: 'CM', sector: 'CEN', x: 30, y: 40 },
      { id: 'CM2', pos: 'CM', sector: 'CEN', x: 70, y: 40 },
      { id: 'CAM', pos: 'CAM', sector: 'CEN', x: 50, y: 30 },
      { id: 'ST1', pos: 'ST', sector: 'DEL', x: 36, y: 15 },
      { id: 'ST2', pos: 'ST', sector: 'DEL', x: 64, y: 15 }
    ]
  },
  '4222': {
    name: '4-2-2-2',
    category: '4-def',
    slots: [
      { id: 'GK', pos: 'GK', sector: 'DEF', x: 50, y: 88 },
      { id: 'LB', pos: 'LB', sector: 'DEF', x: 18, y: 65 },
      { id: 'CB1', pos: 'CB', sector: 'DEF', x: 38, y: 67 },
      { id: 'CB2', pos: 'CB', sector: 'DEF', x: 62, y: 67 },
      { id: 'RB', pos: 'RB', sector: 'DEF', x: 82, y: 65 },
      { id: 'CDM1', pos: 'CDM', sector: 'CEN', x: 36, y: 48 },
      { id: 'CDM2', pos: 'CDM', sector: 'CEN', x: 64, y: 48 },
      { id: 'CAM1', pos: 'CAM', sector: 'CEN', x: 26, y: 32 },
      { id: 'CAM2', pos: 'CAM', sector: 'CEN', x: 74, y: 32 },
      { id: 'ST1', pos: 'ST', sector: 'DEL', x: 36, y: 15 },
      { id: 'ST2', pos: 'ST', sector: 'DEL', x: 64, y: 15 }
    ]
  },
  '4321': {
    name: '4-3-2-1',
    category: '4-def',
    slots: [
      { id: 'GK', pos: 'GK', sector: 'DEF', x: 50, y: 88 },
      { id: 'LB', pos: 'LB', sector: 'DEF', x: 18, y: 65 },
      { id: 'CB1', pos: 'CB', sector: 'DEF', x: 38, y: 67 },
      { id: 'CB2', pos: 'CB', sector: 'DEF', x: 62, y: 67 },
      { id: 'RB', pos: 'RB', sector: 'DEF', x: 82, y: 65 },
      { id: 'CM1', pos: 'CM', sector: 'CEN', x: 28, y: 45 },
      { id: 'CM2', pos: 'CM', sector: 'CEN', x: 50, y: 47 },
      { id: 'CM3', pos: 'CM', sector: 'CEN', x: 72, y: 45 },
      { id: 'CF1', pos: 'CF', sector: 'DEL', x: 32, y: 24 },
      { id: 'CF2', pos: 'CF', sector: 'DEL', x: 68, y: 24 },
      { id: 'ST', pos: 'ST', sector: 'DEL', x: 50, y: 14 }
    ]
  },
  '424': {
    name: '4-2-4',
    category: '4-def',
    slots: [
      { id: 'GK', pos: 'GK', sector: 'DEF', x: 50, y: 88 },
      { id: 'LB', pos: 'LB', sector: 'DEF', x: 18, y: 65 },
      { id: 'CB1', pos: 'CB', sector: 'DEF', x: 38, y: 67 },
      { id: 'CB2', pos: 'CB', sector: 'DEF', x: 62, y: 67 },
      { id: 'RB', pos: 'RB', sector: 'DEF', x: 82, y: 65 },
      { id: 'CM1', pos: 'CM', sector: 'CEN', x: 36, y: 46 },
      { id: 'CM2', pos: 'CM', sector: 'CEN', x: 64, y: 46 },
      { id: 'LW', pos: 'LW', sector: 'DEL', x: 20, y: 18 },
      { id: 'ST1', pos: 'ST', sector: 'DEL', x: 40, y: 14 },
      { id: 'ST2', pos: 'ST', sector: 'DEL', x: 60, y: 14 },
      { id: 'RW', pos: 'RW', sector: 'DEL', x: 80, y: 18 }
    ]
  },
  '532': {
    name: '5-3-2',
    category: '5-def',
    slots: [
      { id: 'GK', pos: 'GK', sector: 'DEF', x: 50, y: 88 },
      { id: 'LWB', pos: 'LWB', sector: 'DEF', x: 16, y: 62 },
      { id: 'CB1', pos: 'CB', sector: 'DEF', x: 32, y: 68 },
      { id: 'CB2', pos: 'CB', sector: 'DEF', x: 50, y: 70 },
      { id: 'CB3', pos: 'CB', sector: 'DEF', x: 68, y: 68 },
      { id: 'RWB', pos: 'RWB', sector: 'DEF', x: 84, y: 62 },
      { id: 'CM1', pos: 'CM', sector: 'CEN', x: 30, y: 44 },
      { id: 'CM2', pos: 'CM', sector: 'CEN', x: 50, y: 44 },
      { id: 'CM3', pos: 'CM', sector: 'CEN', x: 70, y: 44 },
      { id: 'ST1', pos: 'ST', sector: 'DEL', x: 36, y: 16 },
      { id: 'ST2', pos: 'ST', sector: 'DEL', x: 64, y: 16 }
    ]
  },
  '523': {
    name: '5-2-3',
    category: '5-def',
    slots: [
      { id: 'GK', pos: 'GK', sector: 'DEF', x: 50, y: 88 },
      { id: 'LWB', pos: 'LWB', sector: 'DEF', x: 16, y: 62 },
      { id: 'CB1', pos: 'CB', sector: 'DEF', x: 32, y: 68 },
      { id: 'CB2', pos: 'CB', sector: 'DEF', x: 50, y: 70 },
      { id: 'CB3', pos: 'CB', sector: 'DEF', x: 68, y: 68 },
      { id: 'RWB', pos: 'RWB', sector: 'DEF', x: 84, y: 62 },
      { id: 'CM1', pos: 'CM', sector: 'CEN', x: 38, y: 45 },
      { id: 'CM2', pos: 'CM', sector: 'CEN', x: 62, y: 45 },
      { id: 'LW', pos: 'LW', sector: 'DEL', x: 22, y: 16 },
      { id: 'ST', pos: 'ST', sector: 'DEL', x: 50, y: 14 },
      { id: 'RW', pos: 'RW', sector: 'DEL', x: 78, y: 16 }
    ]
  }
};

// ESTADO GLOBAL DEL EQUIPO (Plantilla Real del Usuario)
var myTeamState = {
  formation: '433_def',
  starters: Array(11).fill(null),
  bench: []

};

// Asegurar carga de la base de datos real (desde localStorage o Gist de base de datos)
function ensureDatabaseLoaded(callback) {
  var players = getAllDbPlayers();
  if (players && players.length > 0) {
    if (callback) callback(players);
    return;
  }
  // Cargar desde el Gist oficial de la base de datos
  fetch('https://gist.githubusercontent.com/andokez/22ea33695072a2f1685bd096296232e4/raw')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem(DB_KEY, JSON.stringify(data));
        if (callback) callback(data);
        renderAll();
      }
    })
    .catch(function(e) {
      console.warn('Gist fetch error:', e);
    });
}

// Carga inicial del equipo desde localStorage
function initTeamState() {
  ensureDatabaseLoaded();

  try {
    var saved = localStorage.getItem(TEAM_KEY);
    if (saved) {
      var parsed = JSON.parse(saved);
      if (parsed && parsed.formation && Array.isArray(parsed.starters)) {
        myTeamState = parsed;
        activeFormationId = parsed.formation;
        
        // Limpiar jugadores simulados de capturas anteriores si existieran
        var fakeIds = [
          'p-henderson-85-ptc', 'p-ait-nouri-85-totw', 'p-guehi-85', 'p-gabriel-88',
          'p-llorente-86-euro', 'p-rodri-88', 'p-macallister-87-euro', 'p-tonali-87-transfer',
          'p-gakpo-85', 'p-cunha-88-euro', 'p-saka-86',
          'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9'
        ];
        myTeamState.starters = myTeamState.starters.map(function(p) {
          if (!p) return null;
          if (fakeIds.indexOf(p.id) !== -1) return null;
          return p;
        });
        if (Array.isArray(myTeamState.bench)) {
          myTeamState.bench = myTeamState.bench.filter(function(p) {
            return fakeIds.indexOf(p.id) === -1;
          });
        } else {
          myTeamState.bench = [];
        }
        return;
      }
    }
  } catch(e) {}

  // Plantilla inicial limpia (11 huecos para colocar jugadores de la base de datos)
  myTeamState.formation = '433_def';
  activeFormationId = '433_def';
  myTeamState.starters = Array(11).fill(null);
  myTeamState.bench = [];
  saveTeamState();
}

function saveTeamState() {
  try {
    localStorage.setItem(TEAM_KEY, JSON.stringify(myTeamState));
  } catch(e) {}
}

function clearAllStarters() {
  myTeamState.starters = Array(11).fill(null);
  saveTeamState();
  renderAll();
}

// OBTENER JUGADORES DE LA BASE DE DATOS REAL (SIN HARDCODEO)
function getAllDbPlayers() {
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

// CÁLCULO OFICIAL DE QUÍMICA EA FC
// Cada jugador puede tener hasta 3 puntos (Hexágonos/Rayos).
// Bonificación por País: >=2 -> 1, >=5 -> 2, >=8 -> 3
// Bonificación por Liga: >=3 -> 1, >=5 -> 2, >=8 -> 3
// Bonificación por Club/Rareza: >=2 -> 1, >=4 -> 2, >=7 -> 3
function calculateTeamChemistry() {
  var starters = myTeamState.starters;
  var formation = FORMATIONS[activeFormationId] || FORMATIONS['433_def'];

  var countryCounts = {};
  var leagueCounts = {};
  var clubCounts = {};
  var rarityCounts = {};

  starters.forEach(function(p) {
    if (!p) return;
    var cCode = getCountryCode(p.country);
    var lCode = getLeagueCode(p.league);
    var club = getDisplayClub(p.club);
    var rCode = getRarityCode(p.rarity);

    if (cCode) countryCounts[cCode] = (countryCounts[cCode] || 0) + 1;
    if (lCode) leagueCounts[lCode] = (leagueCounts[lCode] || 0) + 1;
    if (club) clubCounts[club] = (clubCounts[club] || 0) + 1;
    if (rCode) rarityCounts[rCode] = (rarityCounts[rCode] || 0) + 1;
  });

  var playerChemPoints = Array(11).fill(0);
  var totalPoints = 0;
  var occupiedCount = 0;

  starters.forEach(function(p, i) {
    if (!p) return;
    occupiedCount++;
    var targetSlot = formation.slots[i];
    var isPositionMatch = isPosCompatible(p.position, targetSlot.pos);

    if (!isPositionMatch) {
      // Fuera de posición: 0 de química
      playerChemPoints[i] = 0;
      return;
    }

    var pts = 0;
    var cCode = getCountryCode(p.country);
    var lCode = getLeagueCode(p.league);
    var club = getDisplayClub(p.club);
    var rCode = getRarityCode(p.rarity);

    // Puntos por País
    var cCnt = countryCounts[cCode] || 0;
    if (cCnt >= 8) pts += 3;
    else if (cCnt >= 5) pts += 2;
    else if (cCnt >= 2) pts += 1;

    // Puntos por Liga
    var lCnt = leagueCounts[lCode] || 0;
    if (lCnt >= 8) pts += 3;
    else if (lCnt >= 5) pts += 2;
    else if (lCnt >= 3) pts += 1;

    // Puntos por Club o Rareza
    var clCnt = club ? (clubCounts[club] || 0) : 0;
    var rCnt = rarityCounts[rCode] || 0;
    var maxCR = Math.max(clCnt, rCnt);
    if (maxCR >= 7) pts += 3;
    else if (maxCR >= 4) pts += 2;
    else if (maxCR >= 2) pts += 1;

    // Máximo 3 puntos por jugador
    var finalPts = Math.min(3, pts);
    playerChemPoints[i] = finalPts;
    totalPoints += finalPts;
  });

  // Factor de bonificación (como el +2,7 de la captura)
  var bonusFactor = (totalPoints / 33 * 3.0);
  if (totalPoints > 0 && bonusFactor < 1.0) bonusFactor = 1.0;

  return {
    playerChem: playerChemPoints,
    totalPoints: totalPoints,
    bonusFormatted: '+' + bonusFactor.toFixed(1).replace('.', ','),
    countryCounts: countryCounts,
    leagueCounts: leagueCounts,
    rarityCounts: rarityCounts
  };
}

// CÁLCULO DE VALORACIÓN GENERAL DE PLANTILLA (Fórmula oficial EA FC: Media ponderada de exceso)
function calculateTeamRatings() {
  var starters = myTeamState.starters.filter(Boolean);
  var bench = myTeamState.bench.filter(Boolean);

  var formation = FORMATIONS[activeFormationId] || FORMATIONS['433_def'];
  var sum = 0;
  var startersPrice = 0, startersAcqPrice = 0;
  var delSum = 0, delCount = 0;
  var cenSum = 0, cenCount = 0;
  var defSum = 0, defCount = 0;

  myTeamState.starters.forEach(function(p, i) {
    if (!p) return;
    var rat = +p.rating || 0;
    sum += rat;
    startersPrice += getPlayerPrice(p);
    startersAcqPrice += getPlayerAcqPrice(p);

    var sec = formation.slots[i].sector;
    if (sec === 'DEL') { delSum += rat; delCount++; }
    else if (sec === 'CEN') { cenSum += rat; cenCount++; }
    else { defSum += rat; defCount++; }
  });

  var benchPrice = 0, benchAcqPrice = 0;
  bench.forEach(function(p) {
    benchPrice += getPlayerPrice(p);
    benchAcqPrice += getPlayerAcqPrice(p);
  });

  var totalPrice = startersPrice + benchPrice;
  var totalAcqPrice = startersAcqPrice + benchAcqPrice;

  var avg = starters.length > 0 ? (sum / 11) : 0;
  var excess = 0;
  myTeamState.starters.forEach(function(p) {
    if (!p) return;
    var rat = +p.rating || 0;
    if (rat > avg) excess += (rat - avg);
  });
  var finalOvr = starters.length > 0 ? (avg + (excess / 11)) : 0;

  return {
    ovr: starters.length > 0 ? finalOvr.toFixed(1) : '0.0',
    del: delCount > 0 ? (delSum / delCount).toFixed(1) : '—',
    cen: cenCount > 0 ? (cenSum / cenCount).toFixed(1) : '—',
    def: defCount > 0 ? (defSum / defCount).toFixed(1) : '—',
    startersPrice: startersPrice,
    startersAcqPrice: startersAcqPrice,
    benchPrice: benchPrice,
    benchAcqPrice: benchAcqPrice,
    totalPrice: totalPrice,
    totalAcqPrice: totalAcqPrice
  };
}

// Comprobación de compatibilidad de posición
function isPosCompatible(playerPos, slotPos) {
  if (!playerPos || !slotPos) return false;
  var p = normalizePosition(playerPos);
  var s = normalizePosition(slotPos);
  if (p === s) return true;
  // Compatibilidades de campo
  var compatMap = {
    'ST': ['CF', 'RW', 'LW'],
    'CF': ['ST', 'CAM'],
    'RW': ['RM', 'ST'],
    'LW': ['LM', 'ST'],
    'CAM': ['CM', 'CF'],
    'CM': ['CAM', 'CDM', 'LM', 'RM'],
    'CDM': ['CM', 'CB'],
    'LM': ['LW', 'CM'],
    'RM': ['RW', 'CM'],
    'LB': ['LWB', 'CB'],
    'RB': ['RWB', 'CB'],
    'LWB': ['LB', 'LM'],
    'RWB': ['RB', 'RM'],
    'CB': ['CDM', 'LB', 'RB'],
    'GK': []
  };
  return (compatMap[s] && compatMap[s].includes(p)) || false;
}

// RENDERIZADO DEL CAMPO Y SLOTS
function renderPitch() {
  var container = document.getElementById('starterSlotsContainer');
  if (!container) return;
  container.innerHTML = '';

  var formation = FORMATIONS[activeFormationId] || FORMATIONS['433_def'];
  var chemData = calculateTeamChemistry();
  var ratings = calculateTeamRatings();

  // 1. Mostrar precio 11 inicial y precio de adquisición directamente arriba del campo
  var p11PriceVal = document.getElementById('pitch11PriceVal');
  if (p11PriceVal) p11PriceVal.textContent = Number(ratings.startersPrice).toLocaleString('es-ES') + ' 🪙';

  var p11AcqVal = document.getElementById('pitch11AcqVal');
  if (p11AcqVal) p11AcqVal.textContent = Number(ratings.startersAcqPrice).toLocaleString('es-ES') + ' 🪙';

  formation.slots.forEach(function(slot, index) {
    var p = myTeamState.starters[index];
    var slotElem = document.createElement('div');
    slotElem.className = 'pitch-slot';
    slotElem.style.left = slot.x + '%';
    slotElem.style.top = slot.y + '%';
    slotElem.setAttribute('ondragover', 'handleDragOver(event)');
    slotElem.setAttribute('ondragleave', 'handleDragLeave(event)');
    slotElem.setAttribute('ondrop', 'handleDrop(event, "starter", ' + index + ')');

    if (!p) {
      // Slot Vacío
      slotElem.innerHTML = `
        <div class="slot-empty-card" onclick="openPickerForSlot(${index})" title="${currentLang === 'es' ? 'Añadir jugador de la base de datos' : 'Add player from database'}">
          <span class="plus-icon">+</span>
          <span class="slot-target-pos">${displayPos(slot.pos)}</span>
        </div>
        <div class="slot-pos-badge">${displayPos(slot.pos)}</div>
      `;
    } else {
      // Slot Ocupado
      var pts = chemData.playerChem[index] || 0;
      var isMatch = normalizePosition(p.position) === normalizePosition(slot.pos);
      var arrowIcon = isMatch ? '▲▲' : (isPosCompatible(p.position, slot.pos) ? '▲' : '▼');
      var arrowClass = isMatch ? 'compat-match' : (isPosCompatible(p.position, slot.pos) ? 'compat-match' : 'compat-wrong');

      var cardHtml = renderPlayerShieldCard(p, pts, false, false, slot.pos);

      slotElem.innerHTML = `
        <div class="pitch-card-interactive-wrap"
             draggable="true"
             ondragstart="handleDragStart(event, 'starter', ${index})"
             ondragend="handleDragEnd(event)"
             onmousedown="handleCardMouseDown(event, 'starter', ${index})"
             onmousemove="handleCardMouseMove(event)"
             onmouseup="handleCardMouseUp(event, 'starter', ${index})"
             oncontextmenu="handlePlayerContextMenu(event, 'starter', ${index})"
             title="${p.name} - ${displayPos(p.position)} (${p.rating})">
          ${cardHtml}
        </div>
        <div class="slot-pos-badge" oncontextmenu="handlePlayerContextMenu(event, 'starter', ${index})">
          <span class="slot-compat-arrow ${arrowClass}">${arrowIcon}</span>
          <span>${displayPos(slot.pos)}</span>
        </div>
      `;
    }

    container.appendChild(slotElem);
  });
}

// RENDERIZADO DEL HUD IZQUIERDO
function renderHud() {
  var ratings = calculateTeamRatings();
  var chem = calculateTeamChemistry();
  var t = i18nTeam[currentLang] || i18nTeam.es;

  document.getElementById('hudChemVal').textContent = chem.bonusFormatted;
  document.getElementById('hudOvrVal').textContent = ratings.ovr;
  document.getElementById('hudSecDel').textContent = ratings.del;
  document.getElementById('hudSecCen').textContent = ratings.cen;
  document.getElementById('hudSecDef').textContent = ratings.def;

  document.getElementById('txtSquadFormation').textContent = (FORMATIONS[activeFormationId] || {}).name.toUpperCase();

  // 2. En la barra donde está el botón de autocompletar: mostrar suma total (alineación + banquillo)
  var txtCost = document.getElementById('txtSquadCost');
  if (txtCost) txtCost.textContent = Number(ratings.totalPrice).toLocaleString('es-ES') + ' 🪙';

  var txtTotalAcq = document.getElementById('txtSquadTotalAcq');
  if (txtTotalAcq) txtTotalAcq.textContent = Number(ratings.totalAcqPrice).toLocaleString('es-ES') + ' 🪙';

  // Desglose de química en Modo 2
  var breakdownList = document.getElementById('chemBreakdownList');
  if (currentViewMode === 'chemistry') {
    breakdownList.style.display = 'flex';
    var itemsHtml = '';

    // Países con química
    for (var c in chem.countryCounts) {
      if (chem.countryCounts[c] >= 2) {
        var flag = getFlagUrl(c);
        itemsHtml += `
          <div class="chem-breakdown-item" title="País: ${c}">
            <img src="${flag}">
            <div class="chem-nodes-pill"><span>${c}</span> <span>${chem.countryCounts[c]}</span></div>
          </div>
        `;
      }
    }
    // Ligas con química
    for (var l in chem.leagueCounts) {
      if (chem.leagueCounts[l] >= 3) {
        itemsHtml += `
          <div class="chem-breakdown-item" title="Liga: ${l}">
            <span style="font-size:11px;">🛡️</span>
            <div class="chem-nodes-pill"><span>${l}</span> <span>${chem.leagueCounts[l]}</span></div>
          </div>
        `;
      }
    }
    breakdownList.innerHTML = itemsHtml;
  } else {
    breakdownList.style.display = 'none';
  }
}

// ALTERNAR MODO DE VISTA (Frontal -> Química -> Stats -> Frontal)
function toggleCardViewMode() {
  if (currentViewMode === 'front' || currentViewMode === 'photo') {
    currentViewMode = 'chemistry';
  } else if (currentViewMode === 'chemistry') {
    currentViewMode = 'stats';
  } else {
    currentViewMode = 'front';
  }
  var btn = document.getElementById('btnToggleViewMode');
  var lbl = document.getElementById('lblHudToggle');
  var t = i18nTeam[currentLang] || i18nTeam.es;
  if (btn) {
    if (currentViewMode === 'front') {
      btn.classList.remove('active-mode');
      if (lbl) lbl.textContent = t.toggleFront || "Vista: Foto";
    } else if (currentViewMode === 'chemistry') {
      btn.classList.add('active-mode');
      if (lbl) lbl.textContent = t.toggleChem || "Vista: Química";
    } else {
      btn.classList.add('active-mode');
      if (lbl) lbl.textContent = t.toggleStats || "Vista: Stats";
    }
  }
  renderAll();
}

// RENDERIZADO DEL PANEL DERECHO
function renderSidebar() {
  var t = i18nTeam[currentLang] || i18nTeam.es;
  var body = document.getElementById('sidebarBodyContent');
  var title = document.getElementById('sidebarTabTitle');
  var subTitle = document.getElementById('sidebarSubTitle');
  if (!body) return;

  // Actualizar botones de pestaña
  ['bench', 'formations'].forEach(tab => {
    var btn = document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1));
    if (btn) btn.classList.toggle('active', activeSidebarTab === tab);
  });

  if (activeSidebarTab === 'bench') {
    title.textContent = t.benchTitle;
    subTitle.textContent = myTeamState.bench.length + ' ' + (currentLang === 'es' ? 'Suplentes' : 'Subs');

    var ratings = calculateTeamRatings();

    // 3. En el banquillo, muestra exclusivamente el total correspondiente al banquillo
    var benchPriceStr = Number(ratings.benchPrice).toLocaleString('es-ES');
    var benchAcqStr = Number(ratings.benchAcqPrice).toLocaleString('es-ES');

    var forwards = myTeamState.bench.filter(p => ['ST','CF','RW','LW','RF','LF'].includes(normalizePosition(p.position)));
    var mids = myTeamState.bench.filter(p => ['CAM','CM','CDM','LM','RM'].includes(normalizePosition(p.position)));
    var defs = myTeamState.bench.filter(p => ['CB','RB','LB','RWB','LWB','GK'].includes(normalizePosition(p.position)));

    var html = `
      <!-- Cuadro exclusivo con el total correspondiente al banquillo -->
      <div class="bench-exclusive-price-box">
        <div class="bench-price-stat">
          <small>${t.benchTotalWord || 'Total Banquillo:'}</small>
          <b>${benchPriceStr} 🪙</b>
        </div>
        <div class="bench-price-stat stat-acq">
          <small>${t.benchAcqWord || 'Adquisición Banquillo:'}</small>
          <b>${benchAcqStr} 🪙</b>
        </div>
      </div>

      <div style="margin-bottom:12px;">
        <button type="button" class="btn-hud-action" style="width:100%; padding:8px; font-size:12px; font-weight:800;" onclick="openPickerForBench()">
          <span>+</span> <span>${t.addBench}</span>
        </button>
      </div>
    `;

    function renderBenchGroup(groupTitle, list) {
      if (!list || list.length === 0) return '';
      var avg = (list.reduce((a,b) => a + (+b.rating || 0), 0) / list.length).toFixed(0);
      var cardsHtml = list.map((p) => {
        var globalIdx = myTeamState.bench.indexOf(p);
        var cardHtml = renderPlayerShieldCard(p, 3, true, false);

        return `
          <div class="bench-card-item"
               draggable="true"
               ondragstart="handleDragStart(event, 'bench', ${globalIdx})"
               ondragend="handleDragEnd(event)"
               ondragover="handleDragOver(event)"
               ondragleave="handleDragLeave(event)"
               ondrop="handleDrop(event, 'bench', ${globalIdx})"
               onmousedown="handleCardMouseDown(event, 'bench', ${globalIdx})"
               onmousemove="handleCardMouseMove(event)"
               onmouseup="handleCardMouseUp(event, 'bench', ${globalIdx})"
               oncontextmenu="handlePlayerContextMenu(event, 'bench', ${globalIdx})"
               title="${p.name} - ${displayPos(p.position)} (${p.rating})">
            ${cardHtml}
          </div>
        `;
      }).join('');

      return `
        <div class="bench-section">
          <div class="bench-section-title">
            <span class="rating-pill">${avg}</span>
            <span>${groupTitle} (${list.length})</span>
          </div>
          <div class="bench-cards-grid">${cardsHtml}</div>
        </div>
      `;
    }

    html += renderBenchGroup(t.delanteros, forwards);
    html += renderBenchGroup(t.centrocampistas, mids);
    html += renderBenchGroup(t.defensas, defs);

    // Zona para soltar cartas de la cancha al banquillo
    html += `
      <div class="bench-drop-zone"
           ondragover="handleDragOver(event)"
           ondragleave="handleDragLeave(event)"
           ondrop="handleDrop(event, 'bench', -1)">
        📥 <span>${currentLang === 'es' ? 'Arrastra aquí para enviar al banquillo' : 'Drop here to send to bench'}</span>
      </div>
    `;

    body.innerHTML = html;

  } else if (activeSidebarTab === 'formations') {
    title.textContent = t.formationsTitle;
    subTitle.textContent = Object.keys(FORMATIONS).length + ' ' + (currentLang === 'es' ? 'Disponibles' : 'Tactics');

    var gridHtml = '<div class="formations-grid">';
    for (var fId in FORMATIONS) {
      var f = FORMATIONS[fId];
      var isActive = (fId === activeFormationId);
      
      // Dibujar los 11 puntos tácticos en el mini campo
      var dotsHtml = f.slots.map(s => {
        return `<div class="mini-pitch-dot" style="left:${s.x}%; top:${s.y}%;"></div>`;
      }).join('');

      gridHtml += `
        <div class="formation-card ${isActive ? 'active' : ''}" onclick="selectFormation('${fId}')">
          <div class="formation-mini-pitch">
            ${dotsHtml}
          </div>
          <div class="formation-card-name">${f.name}</div>
        </div>
      `;
    }
    gridHtml += '</div>';
    body.innerHTML = gridHtml;

  
  }
}

function switchSidebarTab(tab) {
  activeSidebarTab = tab;
  renderSidebar();
}

// SELECCIÓN DE FORMACIÓN
function selectFormation(fId) {
  if (!FORMATIONS[fId]) return;
  activeFormationId = fId;
  myTeamState.formation = fId;
  saveTeamState();
  renderAll();
}

// ==========================================
// DRAG AND DROP (ARRASTRAR CARTAS PARA CAMBIAR POSICIÓN)
// ==========================================
function handleDragStart(e, type, index) {
  draggedData = { type: type, index: index };
  mouseDownInfo = null; // Evitar que el mouseup posterior interprete un click
  if (e.dataTransfer) {
    try {
      e.dataTransfer.setData('text/plain', JSON.stringify(draggedData));
      e.dataTransfer.effectAllowed = 'move';
    } catch(err) {}
  }
  if (e.currentTarget) {
    e.currentTarget.classList.add('is-dragging');
  }
  // Retrasar la activación global de drop targets para permitir que el navegador inicie el arrastre limpiamente
  setTimeout(function() {
    document.body.classList.add('is-dragging-active');
    document.querySelectorAll('.pitch-slot, .bench-card-item, .bench-drop-zone').forEach(function(el) {
      el.classList.add('drop-target-active');
    });
  }, 0);
}

function handleDragOver(e) {
  e.preventDefault();
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move';
  }
  var target = e.currentTarget;
  if (target && !target.classList.contains('drop-target-hover')) {
    target.classList.add('drop-target-hover');
  }
}

function handleDragLeave(e) {
  var target = e.currentTarget;
  // Solo remover la clase si el puntero verdaderamente abandonó el contenedor del slot
  if (target && (!e.relatedTarget || !target.contains(e.relatedTarget))) {
    target.classList.remove('drop-target-hover');
  }
}

function handleDrop(e, targetType, targetIndex) {
  e.preventDefault();
  e.stopPropagation();
  handleDragEnd(e);

  if (!draggedData) {
    try {
      var raw = e.dataTransfer.getData('text/plain');
      if (raw) draggedData = JSON.parse(raw);
    } catch(err) {}
  }
  if (!draggedData) return;

  var srcType = draggedData.type;
  var srcIdx = draggedData.index;

  // No hacer nada si se suelta sobre sí mismo
  if (srcType === targetType && srcIdx === targetIndex) {
    draggedData = null;
    return;
  }

  if (srcType === 'starter' && targetType === 'starter') {
    // Intercambiar titulares en la cancha
    var temp = myTeamState.starters[targetIndex];
    myTeamState.starters[targetIndex] = myTeamState.starters[srcIdx];
    myTeamState.starters[srcIdx] = temp;
  } else if (srcType === 'starter' && targetType === 'bench') {
    var starterPlayer = myTeamState.starters[srcIdx];
    if (targetIndex >= 0 && targetIndex < myTeamState.bench.length) {
      // Intercambiar titular con jugador específico del banquillo
      myTeamState.starters[srcIdx] = myTeamState.bench[targetIndex];
      myTeamState.bench[targetIndex] = starterPlayer;
    } else {
      // Soltado en la zona de banquillo general
      if (starterPlayer) {
        myTeamState.bench.push(starterPlayer);
        myTeamState.starters[srcIdx] = null;
      }
    }
  } else if (srcType === 'bench' && targetType === 'starter') {
    var benchPlayer = myTeamState.bench[srcIdx];
    var starterPlayer = myTeamState.starters[targetIndex];
    if (starterPlayer) {
      // Intercambiar titular y suplente
      myTeamState.starters[targetIndex] = benchPlayer;
      myTeamState.bench[srcIdx] = starterPlayer;
    } else {
      // Mover suplente a slot vacío
      myTeamState.starters[targetIndex] = benchPlayer;
      myTeamState.bench.splice(srcIdx, 1);
    }
  } else if (srcType === 'bench' && targetType === 'bench') {
    // Reordenar banquillo
    if (targetIndex >= 0 && targetIndex < myTeamState.bench.length) {
      var tempP = myTeamState.bench[targetIndex];
      myTeamState.bench[targetIndex] = myTeamState.bench[srcIdx];
      myTeamState.bench[srcIdx] = tempP;
    }
  }

  draggedData = null;
  saveTeamState();
  renderAll();
}

function handleDragEnd(e) {
  document.body.classList.remove('is-dragging-active');
  document.querySelectorAll('.is-dragging').forEach(function(el) { el.classList.remove('is-dragging'); });
  document.querySelectorAll('.drop-target-active').forEach(function(el) { el.classList.remove('drop-target-active'); });
  document.querySelectorAll('.drop-target-hover').forEach(function(el) { el.classList.remove('drop-target-hover'); });
  draggedData = null;
  mouseDownInfo = null;
}

// ==========================================
// DETECCIÓN DE CLICK SIMPLE VS ARRASTRE
// ==========================================
function handleCardMouseDown(e, type, index) {
  if (e.button === 2) return; // El click derecho lo maneja contextmenu
  mouseDownInfo = {
    x: e.clientX,
    y: e.clientY,
    time: Date.now(),
    type: type,
    index: index,
    moved: false
  };
}

function handleCardMouseMove(e) {
  if (mouseDownInfo) {
    var dist = Math.hypot(e.clientX - mouseDownInfo.x, e.clientY - mouseDownInfo.y);
    if (dist > 5) {
      mouseDownInfo.moved = true;
    }
  }
}

function handleCardMouseUp(e, type, index) {
  if (mouseDownInfo && !mouseDownInfo.moved && e.button !== 2) {
    // Click simple: abrir la ficha completa con precio y estadísticas
    openPlayerDetailModal(type, index);
  }
  mouseDownInfo = null;
}

// ==========================================
// MENÚ CONTEXTUAL PERSONALIZADO (CLICK DERECHO)
// ==========================================
function handlePlayerContextMenu(e, type, index) {
  e.preventDefault();
  e.stopPropagation();
  activeContextTarget = { type: type, index: index };

  var p = (type === 'starter' ? myTeamState.starters[index] : myTeamState.bench[index]);
  if (!p) return;

  var menu = document.getElementById('playerContextMenu');
  if (!menu) return;

  var nameEl = document.getElementById('ctxPlayerName');
  if (nameEl) nameEl.textContent = p.name + ' (' + p.rating + ' · ' + displayPos(p.position) + ')';

  var moveBtn = document.getElementById('ctxBtnMove');
  var moveLbl = document.getElementById('lblCtxMove');
  if (moveBtn && moveLbl) {
    if (type === 'starter') {
      moveLbl.textContent = (currentLang === 'es' ? 'Mover al banquillo' : 'Move to bench');
      moveBtn.querySelector('span:first-child').textContent = '🪑';
    } else {
      moveLbl.textContent = (currentLang === 'es' ? 'Poner en la cancha' : 'Put on pitch');
      moveBtn.querySelector('span:first-child').textContent = '⚽';
    }
  }

  // Posicionar evitando desbordamiento de pantalla
  var x = e.clientX;
  var y = e.clientY;
  var menuWidth = 230;
  var menuHeight = 180;

  if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 10;
  if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 10;
  if (x < 10) x = 10;
  if (y < 10) y = 10;

  menu.style.left = x + 'px';
  menu.style.top = y + 'px';
  menu.classList.add('open');
}

function closePlayerContextMenu() {
  var menu = document.getElementById('playerContextMenu');
  if (menu) menu.classList.remove('open');
}

window.addEventListener('click', function(e) {
  if (!e.target.closest('#playerContextMenu')) {
    closePlayerContextMenu();
  }
});

function viewDetailFromContext() {
  if (!activeContextTarget) return;
  var target = Object.assign({}, activeContextTarget);
  closePlayerContextMenu();
  openPlayerDetailModal(target.type, target.index);
}

function triggerSwapFromContext() {
  if (!activeContextTarget) return;
  var target = Object.assign({}, activeContextTarget);
  closePlayerContextMenu();
  if (target.type === 'starter') {
    openPickerForSlot(target.index);
  } else {
    openPickerForBench(target.index);
  }
}

function movePlayerFromContext() {
  if (!activeContextTarget) return;
  var target = Object.assign({}, activeContextTarget);
  closePlayerContextMenu();

  if (target.type === 'starter') {
    var p = myTeamState.starters[target.index];
    if (p) {
      myTeamState.bench.push(p);
      myTeamState.starters[target.index] = null;
      saveTeamState();
      renderAll();
    }
  } else {
    var p = myTeamState.bench[target.index];
    if (p) {
      var emptyIdx = myTeamState.starters.findIndex(function(x) { return x === null; });
      if (emptyIdx !== -1) {
        myTeamState.starters[emptyIdx] = p;
        myTeamState.bench.splice(target.index, 1);
      } else {
        var old = myTeamState.starters[0];
        myTeamState.starters[0] = p;
        myTeamState.bench[target.index] = old;
      }
      saveTeamState();
      renderAll();
    }
  }
}

function removePlayerFromContext() {
  if (!activeContextTarget) return;
  var target = Object.assign({}, activeContextTarget);
  closePlayerContextMenu();

  if (target.type === 'starter') {
    myTeamState.starters[target.index] = null;
  } else {
    myTeamState.bench.splice(target.index, 1);
  }
  saveTeamState();
  renderAll();
}

// ==========================================
// MODAL FICHA COMPLETA (CLICK SIMPLE EN CARTA)
// ==========================================
function openPlayerDetailModal(type, index) {
  activeDetailTarget = { type: type, index: index };
  var p = (type === 'starter' ? myTeamState.starters[index] : myTeamState.bench[index]);
  if (!p) return;

  var modal = document.getElementById('playerDetailModal');
  if (!modal) return;

  var t = i18nTeam[currentLang] || i18nTeam.es;
  var isGK = normalizePosition(p.position) === 'GK';
  var cleanName = (p.name || '').replace(/\s*\([^)]*\)/g, '').trim();

  document.getElementById('detPlayerName').textContent = cleanName;
  document.getElementById('detRatingBadge').textContent = p.rating + ' ' + displayPos(p.position);
  var clubStr = getDisplayClub(p.club) || t.noClub || 'Sin club';
  var rarityDisplay = (p.rarity || 'Normal').toUpperCase();
  document.getElementById('detSubtitle').textContent = clubStr + ' · ' + (p.league || '—') + ' · ' + rarityDisplay;

  // Llenar inputs de Precio de Mercado y Precio de Adquisición
  var inputPrice = document.getElementById('inputDetPrice');
  if (inputPrice) inputPrice.value = (p.price !== undefined && p.price !== null && p.price !== '') ? p.price : '';

  var inputAcqPrice = document.getElementById('inputDetAcqPrice');
  var currentAcq = (p.bought_price !== undefined && p.bought_price !== null && p.bought_price !== '') 
    ? p.bought_price 
    : (p.boughtPrice !== undefined && p.boughtPrice !== null && p.boughtPrice !== '' ? p.boughtPrice : p.acquisition_price);
  if (inputAcqPrice) inputAcqPrice.value = (currentAcq !== undefined && currentAcq !== null && currentAcq !== '') ? currentAcq : '';

  document.getElementById('detPosVal').textContent = displayPos(p.position);
  document.getElementById('detClubVal').textContent = getDisplayClub(p.club) || '—';
  document.getElementById('detLeagueVal').textContent = p.league || '—';

  var natFlag = getFlagUrl(p.country);
  var flagImg = document.getElementById('detCountryFlag');
  if (flagImg) flagImg.src = natFlag;
  document.getElementById('detCountryName').textContent = p.country || '—';
  document.getElementById('detAgeVal').textContent = p.age ? (p.age + ' ' + (t.yearsOld || 'años')) : '—';
  document.getElementById('detRarityVal').textContent = rarityDisplay;

  // Subatributos (adaptados para Porteros o Jugadores de Campo)
  var s1Lbl = isGK ? (t.gkDiv || 'EST') : (t.statPac || 'RIT');
  var s2Lbl = isGK ? (t.gkHan || 'PAR') : (t.statSho || 'TIR');
  var s3Lbl = isGK ? (t.gkKic || 'SAQ') : (t.statPas || 'PAS');
  var s4Lbl = isGK ? (t.gkRef || 'REF') : (t.statDri || 'REG');
  var s5Lbl = isGK ? (t.gkSpd || 'VEL') : (t.statDef || 'DEF');
  var s6Lbl = isGK ? (t.gkPos || 'POS') : (t.statPhy || 'FIS');

  var elPac = document.getElementById('lblDetPac'); if (elPac) elPac.textContent = s1Lbl;
  var elSho = document.getElementById('lblDetSho'); if (elSho) elSho.textContent = s2Lbl;
  var elPas = document.getElementById('lblDetPas'); if (elPas) elPas.textContent = s3Lbl;
  var elDri = document.getElementById('lblDetDri'); if (elDri) elDri.textContent = s4Lbl;
  var elDef = document.getElementById('lblDetDef'); if (elDef) elDef.textContent = s5Lbl;
  var elPhy = document.getElementById('lblDetPhy'); if (elPhy) elPhy.textContent = s6Lbl;

  document.getElementById('detStatPac').textContent = p.pac || '—';
  document.getElementById('detStatSho').textContent = p.sho || '—';
  document.getElementById('detStatPas').textContent = p.pas || '—';
  document.getElementById('detStatDri').textContent = p.dri || '—';
  document.getElementById('detStatDef').textContent = p.def || '—';
  document.getElementById('detStatPhy').textContent = p.phy || '—';

  // Renderizar la ficha ampliada en el lateral izquierdo del modal
  var cardContainer = document.getElementById('detCardContainer');
  if (cardContainer) {
    cardContainer.innerHTML = renderPlayerShieldCard(p, 3, false, true, null);
  }

  // Textos traducidos de los botones de acción
  var moveLbl = document.getElementById('lblDetBtnMove');
  if (moveLbl) {
    if (type === 'starter') {
      moveLbl.textContent = '🪑 ' + (t.detBtnToBench || 'Mover al Banquillo');
    } else {
      moveLbl.textContent = '⚽ ' + (t.detBtnToPitch || 'Poner en la Cancha');
    }
  }
  var changeLbl = document.getElementById('lblDetBtnChange');
  if (changeLbl) changeLbl.textContent = '🔄 ' + (t.detBtnChange || 'Cambiar Jugador');
  var removeLbl = document.getElementById('lblDetBtnRemove');
  if (removeLbl) removeLbl.textContent = '🗑️ ' + (t.detBtnRemove || 'Quitar');
  var closeLbl = document.getElementById('lblDetBtnClose');
  if (closeLbl) closeLbl.textContent = t.detBtnClose || 'Cerrar';

  modal.classList.add('open');
}

function closePlayerDetailModal() {
  var modal = document.getElementById('playerDetailModal');
  if (modal) modal.classList.remove('open');
}

// GUARDAR PRECIO Y PRECIO DE ADQUISICIÓN DESDE LA FICHA DEL JUGADOR
function savePlayerPricesFromDetail() {
  if (!activeDetailTarget) return;
  var target = activeDetailTarget;
  var p = (target.type === 'starter' ? myTeamState.starters[target.index] : myTeamState.bench[target.index]);
  if (!p) return;

  var inputPrice = document.getElementById('inputDetPrice');
  var inputAcqPrice = document.getElementById('inputDetAcqPrice');

  var newPrice = inputPrice && inputPrice.value.trim() !== '' ? parseInt(inputPrice.value, 10) : '';
  var newAcqPrice = inputAcqPrice && inputAcqPrice.value.trim() !== '' ? parseInt(inputAcqPrice.value, 10) : '';

  if (newPrice !== '' && (isNaN(newPrice) || newPrice < 0)) newPrice = 0;
  if (newAcqPrice !== '' && (isNaN(newAcqPrice) || newAcqPrice < 0)) newAcqPrice = 0;

  // Actualizar objeto en plantilla
  p.price = newPrice;
  p.bought_price = newAcqPrice;
  p.price_date = new Date().toISOString();

  // Persistir en myTeamState
  saveTeamState();

  // Sincronizar también con la Base de Datos en localStorage para persistencia
  try {
    var candidateKeys = [DB_KEY, 'ufm27_db_v7', 'ufm27_database_v6', 'ufm27_database_v5', 'ufm27_database_v4', 'ufm_database_players_v2'];
    var cleanPName = (p.name || '').replace(/\s*\([^)]*\)/g, '').trim().toLowerCase();
    var pRat = +p.rating || 0;

    candidateKeys.forEach(function(key) {
      var raw = localStorage.getItem(key);
      if (!raw) return;
      var dbList = JSON.parse(raw);
      if (!Array.isArray(dbList) || dbList.length === 0) return;

      var changed = false;
      dbList.forEach(function(item) {
        var match = false;
        if (p.id && item.id && String(p.id) === String(item.id)) match = true;
        else {
          var cleanItem = (item.name || '').replace(/\s*\([^)]*\)/g, '').trim().toLowerCase();
          if (cleanItem === cleanPName && +item.rating === pRat) match = true;
        }
        if (match) {
          item.price = newPrice;
          item.bought_price = newAcqPrice;
          item.price_date = p.price_date;
          changed = true;
        }
      });
      if (changed) localStorage.setItem(key, JSON.stringify(dbList));
    });
  } catch(e) {}

  // Actualizar UI
  renderAll();

  // Re-renderizar la ficha en el modal
  var cardContainer = document.getElementById('detCardContainer');
  if (cardContainer) {
    cardContainer.innerHTML = renderPlayerShieldCard(p, 3, false, true, null);
  }

  var t = i18nTeam[currentLang] || i18nTeam.es;
  showToast(t.pricesUpdatedMsg || "Precios del jugador actualizados", "success");
}

function showToast(msg, type) {
  var toast = document.getElementById('teamToastNotification');
  if (!toast) return;
  toast.className = 'team-toast-notification show ' + (type === 'error' ? 'toast-error' : (type === 'warning' ? 'toast-warning' : 'toast-success'));
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">✓</span>
      <span>${msg}</span>
    </div>
  `;
  setTimeout(function() {
    toast.classList.remove('show');
  }, 2500);
}

function changePlayerFromDetail() {
  if (!activeDetailTarget) return;
  var target = Object.assign({}, activeDetailTarget);
  closePlayerDetailModal();
  if (target.type === 'starter') {
    openPickerForSlot(target.index);
  } else {
    openPickerForBench(target.index);
  }
}

function movePlayerFromDetail() {
  if (!activeDetailTarget) return;
  var target = Object.assign({}, activeDetailTarget);
  closePlayerDetailModal();

  if (target.type === 'starter') {
    var p = myTeamState.starters[target.index];
    if (p) {
      myTeamState.bench.push(p);
      myTeamState.starters[target.index] = null;
      saveTeamState();
      renderAll();
    }
  } else {
    var p = myTeamState.bench[target.index];
    if (p) {
      var emptyIdx = myTeamState.starters.findIndex(function(x) { return x === null; });
      if (emptyIdx !== -1) {
        myTeamState.starters[emptyIdx] = p;
        myTeamState.bench.splice(target.index, 1);
      } else {
        var old = myTeamState.starters[0];
        myTeamState.starters[0] = p;
        myTeamState.bench[target.index] = old;
      }
      saveTeamState();
      renderAll();
    }
  }
}

function removePlayerFromDetail() {
  if (!activeDetailTarget) return;
  var target = Object.assign({}, activeDetailTarget);
  closePlayerDetailModal();

  if (target.type === 'starter') {
    myTeamState.starters[target.index] = null;
  } else {
    myTeamState.bench.splice(target.index, 1);
  }
  saveTeamState();
  renderAll();
}

// SELECTOR DE JUGADORES (DRAWER / MODAL)
function openPickerForSlot(slotIndex) {
  pickerTargetType = 'starter';
  activeSlotIndex = slotIndex;
  var formation = FORMATIONS[activeFormationId] || FORMATIONS['433_def'];
  var targetPos = formation.slots[slotIndex].pos;

  var norm = normalizePosition(targetPos);
  if (['ST','CF','RW','LW','RF','LF'].includes(norm)) pickerPosFilter = 'DEL';
  else if (['CAM','CM','CDM','LM','RM'].includes(norm)) pickerPosFilter = 'MED';
  else if (['CB','RB','LB','RWB','LWB'].includes(norm)) pickerPosFilter = 'DEF';
  else if (norm === 'GK') pickerPosFilter = 'POR';
  else pickerPosFilter = 'ALL';

  updatePickerPosButtons();
  document.getElementById('playerPickerModal').classList.add('open');
  filterPickerPlayers();
}

function openPickerForBench(benchIndex) {
  pickerTargetType = 'bench';
  activeSlotIndex = (benchIndex !== undefined && benchIndex !== null) ? benchIndex : -1;
  pickerPosFilter = 'ALL';
  updatePickerPosButtons();
  document.getElementById('playerPickerModal').classList.add('open');
  filterPickerPlayers();
}

function closePlayerPicker() {
  document.getElementById('playerPickerModal').classList.remove('open');
}

function updatePickerPosButtons() {
  var btns = document.querySelectorAll('#pickerPosFilters .drawer-filter-btn');
  btns.forEach(btn => {
    btn.classList.toggle('active', btn.textContent === pickerPosFilter);
  });
}

function setPickerPosFilter(pos) {
  pickerPosFilter = pos;
  updatePickerPosButtons();
  filterPickerPlayers();
}

function filterPickerPlayers() {
  var q = (document.getElementById('pickerSearch').value || '').trim().toLowerCase();
  var sortVal = document.getElementById('pickerSort').value;
  var allPlayers = getAllDbPlayers();

  var filtered = allPlayers.filter(p => {
    var normP = normalizePosition(p.position);
    if (pickerPosFilter === 'DEL' && !['ST','CF','RW','LW','RF','LF'].includes(normP)) return false;
    if (pickerPosFilter === 'MED' && !['CAM','CM','CDM','LM','RM'].includes(normP)) return false;
    if (pickerPosFilter === 'DEF' && !['CB','RB','LB','RWB','LWB'].includes(normP)) return false;
    if (pickerPosFilter === 'POR' && normP !== 'GK') return false;

    if (q) {
      var matchStr = [p.name, p.club, p.league, p.country, p.position].join(' ').toLowerCase();
      if (!matchStr.includes(q)) return false;
    }
    return true;
  });

  // Ordenar
  if (sortVal === 'rat-desc') filtered.sort((a,b) => (+b.rating || 0) - (+a.rating || 0));
  else if (sortVal === 'rat-asc') filtered.sort((a,b) => (+a.rating || 0) - (+b.rating || 0));
  else if (sortVal === 'price-asc') filtered.sort((a,b) => (+a.price || 9999999) - (+b.price || 9999999));
  else if (sortVal === 'name') filtered.sort((a,b) => a.name.localeCompare(b.name));

  var container = document.getElementById('pickerCardsList');
  if (!container) return;

  container.innerHTML = filtered.slice(0, 48).map(p => {
    var inTeam = isPersonAlreadyInTeam(p, pickerTargetType, activeSlotIndex);
    var dupClass = inTeam ? 'already-in-team' : '';
    var dupBadge = inTeam ? `<div class="in-team-tag">${currentLang === 'es' ? 'EN EQUIPO' : 'IN SQUAD'}</div>` : '';
    var priceStr = (p.price !== '' && p.price != null && !isNaN(p.price) && +p.price > 0)
      ? Number(p.price).toLocaleString('es-ES') + ' 🪙'
      : (i18nTeam[currentLang] || i18nTeam.es).noPrice || 'Sin precio';

    // Genera el escudo idéntico al del campo (vista frontal foto)
    var shieldHtml = renderPlayerShieldCard(p, 0, true, false, null);

    return `
      <div class="drawer-player-card ${dupClass}" onclick="assignPickedPlayer('${p.id || p.name}')" title="${p.name} (${p.rating} · ${displayPos(p.position)})">
        ${dupBadge}
        ${shieldHtml}
        <div class="drawer-card-price">${priceStr}</div>
      </div>
    `;
  }).join('');
}

function assignPickedPlayer(pIdOrName) {
  var allPlayers = getAllDbPlayers();
  var player = allPlayers.find(x => (x.id && x.id === pIdOrName) || x.name === pIdOrName);
  if (!player) return;

  // Excluye el slot que estás reemplazando para permitir sustituir una versión por otra del mismo jugador
  var isDup = isPersonAlreadyInTeam(player, pickerTargetType, activeSlotIndex);
  if (isDup) {
    alert(currentLang === 'es' 
      ? '¡Ya tienes una versión de ' + player.name + ' en otra posición de la plantilla o banquillo!'
      : 'You already have a version of ' + player.name + ' in another position of your squad or bench!');
    return;
  }

  if (pickerTargetType === 'starter' && activeSlotIndex >= 0) {
    myTeamState.starters[activeSlotIndex] = Object.assign({}, player);
  } else if (pickerTargetType === 'bench' && activeSlotIndex >= 0 && activeSlotIndex < myTeamState.bench.length) {
    // Si se eligió sustituir a un suplente existente, lo reemplaza en su misma posición
    myTeamState.bench[activeSlotIndex] = Object.assign({}, player);
  } else {
    // Si se pulsó el botón general "+ Añadir Suplente"
    myTeamState.bench.push(Object.assign({}, player));
  }

  saveTeamState();
  closePlayerPicker();
  renderAll();
}

// AUTO-COMPLETAR PLANTILLA CON LA BASE DE DATOS
function autoCompleteTeam() {
  var allPlayers = getAllDbPlayers();
  var formation = FORMATIONS[activeFormationId] || FORMATIONS['433_def'];

  formation.slots.forEach(function(slot, idx) {
    if (!myTeamState.starters[idx]) {
      // Buscar el mejor jugador disponible compatible con esta posición
      var compatible = allPlayers.filter(p => isPosCompatible(p.position, slot.pos));
      if (compatible.length === 0) compatible = allPlayers;

      // Ordenar por valoración descendente
      compatible.sort((a,b) => (+b.rating || 0) - (+a.rating || 0));

      // Asignar uno que no esté ya en los titulares
      var chosen = compatible.find(p => !isPersonAlreadyInTeam(p, 'starter', idx));
      if (chosen) {
        myTeamState.starters[idx] = Object.assign({}, chosen);
      }
    }
  });

  saveTeamState();
  renderAll();
}

// MODAL DE AYUDA
function openHelpModal() {
  document.getElementById('helpModal').classList.add('open');
}
function closeHelpModal() {
  document.getElementById('helpModal').classList.remove('open');
}

// GESTOR DE ALINEACIONES
function openSquadManagerModal() {
  document.getElementById('squadManagerModal').classList.add('open');
}
function closeSquadManagerModal() {
  document.getElementById('squadManagerModal').classList.remove('open');
}
function saveSquadSlot() {
  saveTeamState();
  closeSquadManagerModal();
}

// CAMBIO DE IDIOMA
function changeLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('ufm_lang', lang);
  document.documentElement.lang = lang;
  applyTranslations();
  renderAll();

  // Si el modal de la ficha del jugador está abierto, actualizarlo al nuevo idioma inmediatamente
  var detModal = document.getElementById('playerDetailModal');
  if (detModal && detModal.classList.contains('open') && activeDetailTarget) {
    openPlayerDetailModal(activeDetailTarget.type, activeDetailTarget.index);
  }
}

function applyTranslations() {
  var t = i18nTeam[currentLang] || i18nTeam.es;
  var langSelect = document.getElementById('langSelect');
  if (langSelect) langSelect.value = currentLang;

  var setTxt = function(id, val) {
    var el = document.getElementById(id);
    if (el && val != null) el.textContent = val;
  };

  setTxt('lblNavHome', t.navHome);
  setTxt('lblNavDb', t.navDb);
  setTxt('lblNavCalc', t.navCalc);
  setTxt('lblNavTeam', t.navTeam);

  setTxt('lblChem', t.chem);
  setTxt('lblOvr', t.ovr);
  setTxt('lblSecDel', t.del);
  setTxt('lblSecCen', t.cen);
  setTxt('lblSecDef', t.def);
  setTxt('lblAutoWord', t.auto);
  setTxt('lblBtnAuto', t.autoComplete);
  setTxt('lblBtnClearSquad', t.clearSquad);

  setTxt('lblHudSquads', t.squads);
  if (currentViewMode === 'front') {
    setTxt('lblHudToggle', t.toggleFront || "Vista: Foto");
  } else if (currentViewMode === 'chemistry') {
    setTxt('lblHudToggle', t.toggleChem || "Vista: Química");
  } else {
    setTxt('lblHudToggle', t.toggleStats || "Vista: Stats");
  }

  setTxt('lblTabBench', t.tabBench);
  setTxt('lblTabFormations', t.tabFormations);
  setTxt('lblTabTactics', t.tabTactics);
  setTxt('lblTabRoles', t.tabRoles);

  setTxt('lblPopSwap', t.swapPlayer);
  setTxt('lblPopToBench', t.toBench);
  setTxt('lblPopRemove', t.removePlayer);

  setTxt('lblPickerTitle', t.pickerTitle);
  setTxt('lblCtxDetail', t.ctxDetail);
  setTxt('lblCtxSwap', t.ctxSwap);
  setTxt('lblCtxMove', t.ctxToBench);
  setTxt('lblCtxRemove', t.ctxRemove);

  // Textos y etiquetas de la Ficha del Jugador (Player Detail Modal)
  setTxt('detModalTitle', t.detModalTitle || 'Ficha del Jugador');
  setTxt('lblDetPriceHeader', t.detPriceTitle || 'Precio Mercado / SBC');
  setTxt('lblDetAcqHeader', t.detAcqTitle || 'Precio Adquisición');
  setTxt('lblBtnSavePrices', t.savePricesBtn || 'Guardar Precios');
  setTxt('lblDetPos', t.detPos || 'POSICIÓN');
  setTxt('lblDetClub', t.detClub || 'CLUB');
  setTxt('lblDetLeague', t.detLeague || 'LIGA');
  setTxt('lblDetNat', t.detNat || 'NACIONALIDAD');
  setTxt('lblDetAge', t.detAge || 'EDAD');
  setTxt('lblDetRarity', t.detRarity || 'RAREZA');
  setTxt('lblDetStatsHeader', t.detStatsTitle || 'ESTADÍSTICAS DEL JUGADOR');
  setTxt('lblDetBtnChange', '🔄 ' + (t.detBtnChange || 'Cambiar Jugador'));
  setTxt('lblDetBtnRemove', '🗑️ ' + (t.detBtnRemove || 'Quitar'));
  setTxt('lblDetBtnClose', t.detBtnClose || 'Cerrar');

  setTxt('lblPitch11Price', t.pitch11Price || 'Precio 11 Inicial:');
  setTxt('lblPitch11Acq', t.pitch11Acq || 'Precio Adquisición (11):');
  setTxt('lblStageTotalWord', t.stageTotalWord || 'Total (11 + Banquillo):');
  setTxt('lblStageTotalAcqWord', t.stageTotalAcqWord || 'Adquisición:');
}

// FUNCIÓN GENERAL DE RENDERIZADO
function renderAll() {
  renderPitch();
  renderHud();
  renderSidebar();
}

// CIERRE DE MENÚ CONTEXTUAL Y MODALES AL PULSAR ESCAPE
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closePlayerContextMenu();
    closePlayerDetailModal();
    closePlayerPicker();
    closeHelpModal();
    closeSquadManagerModal();
  }
});

// INICIALIZACIÓN AL CARGAR LA PÁGINA
window.addEventListener('DOMContentLoaded', function() {
  initTeamState();
  applyTranslations();
  renderAll();
});
