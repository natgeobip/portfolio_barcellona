const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.title = "Referenze: DRAINS";
const F = "Arial";
const RED = "DC2A1E", NAVY = "0B2240", SLATE = "55687F", GREY = "F0F0F0", TXT = "1C2430", MUT = "5B6573", LINE = "D9DDE3";
const s = pres.addSlide();
s.background = { color: "FFFFFF" };
const T = (text, o) => s.addText(text, Object.assign({ fontFace: F, isTextBox: true, margin: 0, valign: "top" }, o));

T("CALL ESA – SPACE-ENABLED SOLUTIONS FOR RESILIENT GRIDS", { x: 0.4, y: 0.2, w: 10, h: 0.28, fontSize: 12, bold: true, color: RED, objectName: "Call" });
T("Referenze: DRAINS", { x: 0.4, y: 0.5, w: 5.5, h: 0.6, fontSize: 34, color: NAVY, objectName: "Title" });
T("Data-driven Resilience In Adaptive and Intelligent urbaN Scenarios", { x: 5.9, y: 0.68, w: 7, h: 0.3, fontSize: 12, italic: true, color: MUT, align: "right" });

// Settore / Durata / Importo
const cols = [
  { x: 0.4, h: "SETTORE", t: "SPACE, rischio di allagamento urbano e gestione delle reti di drenaggio" },
  { x: 4.85, h: "DURATA", t: "Avvio 12/2025 (contratto ASI) · fine da confermare" },
  { x: 8.9, h: "IMPORTO", t: "[da confermare] · progetto in RTI" },
];
cols.forEach((c, i) => {
  if (i) s.addShape(pres.shapes.LINE, { x: c.x - 0.2, y: 1.2, w: 0, h: 0.6, line: { color: LINE, width: 1 } });
  T(c.h, { x: c.x, y: 1.15, w: 3.9, h: 0.28, fontSize: 14, bold: true, color: RED });
  T(c.t, { x: c.x, y: 1.45, w: 3.9, h: 0.4, fontSize: 11, color: TXT });
});

// Descrizione
s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 1.95, w: 12.5, h: 0.95, fill: { color: NAVY }, line: { color: NAVY } });
T([
  { text: "DESCRIZIONE DEL PROGETTO", options: { bold: true, fontSize: 12, breakLine: true } },
  { text: "Piattaforma web GIS su ArcGIS per le pubbliche amministrazioni, che integra dati satellitari, modello digitale del terreno, piani ufficiali (PAI, PGRA), previsioni meteo e segnalazioni georeferenziate di cittadini e operatori per mappare il rischio di allagamento urbano e supportare la gestione delle caditoie. Sviluppata per l'Agenzia Spaziale Italiana (contratto ASI n. 2025-81-I.0) dall'RTI BIP, IPT Sat e Spacexe.", options: { fontSize: 11 } },
], { x: 0.55, y: 2.0, w: 12.2, h: 0.85, color: "FFFFFF", objectName: "Descrizione" });

// Approccio
T("APPROCCIO ALLA PARTECIPAZIONE", { x: 0.4, y: 3.0, w: 8, h: 0.28, fontSize: 14, bold: true, color: RED });
T("Ruoli chiari tra chi finanzia, chi sviluppa e chi usa la piattaforma. Riferimenti: Direttiva 2007/60/CE, D.Lgs. 49/2010, linee guida AGID.", { x: 0.4, y: 3.3, w: 12.5, h: 0.25, fontSize: 11, color: MUT });
const roles = [
  { x: 0.4, lab: "ASI", fill: RED, h: "Committente e finanziatore", t: "Finanzia e valida il progetto. Utenti finali: amministrazioni pubbliche (viewer ed editor)." },
  { x: 4.65, lab: "BIP", fill: NAVY, h: "Sviluppo e integrazione", t: "Progetta e integra la piattaforma: servizi cartografici, web app, app mobile e dashboard." },
  { x: 8.9, lab: "PARTNER\nDEL RTI", fill: SLATE, h: "IPT Sat e Spacexe", t: "Partner dell'RTI. [Ruoli specifici da completare]" },
];
roles.forEach((r) => {
  s.addShape(pres.shapes.RECTANGLE, { x: r.x, y: 3.65, w: 4.0, h: 0.95, fill: { color: GREY }, line: { color: GREY } });
  s.addShape(pres.shapes.RECTANGLE, { x: r.x, y: 3.65, w: 1.25, h: 0.95, fill: { color: r.fill }, line: { color: r.fill } });
  T(r.lab, { x: r.x, y: 3.65, w: 1.25, h: 0.95, fontSize: 13, bold: true, color: "FFFFFF", align: "center", valign: "middle" });
  T([
    { text: r.h, options: { bold: true, fontSize: 12, color: NAVY, breakLine: true } },
    { text: r.t, options: { fontSize: 10.5, color: MUT } },
  ], { x: r.x + 1.35, y: 3.7, w: 2.55, h: 0.85 });
});

// Attività e benefici
T("PRINCIPALI ATTIVITÀ PREVISTE", { x: 0.4, y: 4.72, w: 6, h: 0.28, fontSize: 14, bold: true, color: RED });
const bl = (arr) => arr.map((t, i) => ({ text: t, options: { bullet: { code: "25CF" }, breakLine: i < arr.length - 1, fontSize: 10.5, color: TXT, paraSpaceAfter: 2 } }));
T(bl([
  "Raccolta e armonizzazione di dati ufficiali, satellitari, meteo e segnalazioni",
  "Mappa di rischio TWI e 2 scenari di allagamento (caditoie ostruite/funzionanti)",
  "Servizi ArcGIS Enterprise (OGC/REST), dashboard, strumenti GIS e livelli live",
  "Segnalazioni dei cittadini (Survey123) e app mobile per i manutentori sul campo",
  "Gestione utenti e ruoli, backup e aggiornamento continuo di dati e servizi",
]), { x: 0.4, y: 5.02, w: 6.45, h: 1.15, objectName: "Attivita" });

s.addShape(pres.shapes.RECTANGLE, { x: 7.1, y: 4.7, w: 5.8, h: 1.5, fill: { color: GREY }, line: { color: GREY } });
T("BENEFICI ATTESI PER IL CLIENTE", { x: 7.25, y: 4.72, w: 5.5, h: 0.28, fontSize: 14, bold: true, color: RED });
T(bl([
  "Dati eterogenei trasformati in informazioni operative in un'unica vista",
  "Rischio strutturale e condizioni correnti (meteo, segnalazioni) a confronto",
  "Interventi più mirati sulle caditoie grazie al confronto tra scenari",
  "Soluzione replicabile e scalabile su altri territori e domini ambientali",
]), { x: 7.25, y: 5.02, w: 5.55, h: 1.15, objectName: "Benefici" });

// Output, strumenti, use case
s.addShape(pres.shapes.LINE, { x: 0.4, y: 6.32, w: 12.5, h: 0, line: { color: LINE, width: 1 } });
T([
  { text: "OUTPUT  ", options: { bold: true, color: RED, fontSize: 12 } },
  { text: "Piattaforma web GIS con mappa di rischio, 2 scenari, dashboard e strumenti GIS; app mobile per i manutentori e modulo di segnalazione per i cittadini", options: { color: MUT, fontSize: 10.5 } },
], { x: 0.4, y: 6.38, w: 12.5, h: 0.3, valign: "middle", objectName: "Output" });

T("STRUMENTI E TECNOLOGIE", { x: 0.4, y: 6.8, w: 2.4, h: 0.3, fontSize: 10.5, bold: true, color: NAVY, valign: "middle" });
const tools = [
  ["Immagini satellitari e DTM", 2.1], ["ArcGIS Enterprise", 1.6], ["Experience Builder", 1.65],
  ["Survey123 / Field Maps", 1.9], ["Previsioni meteo (API)", 1.85], ["Servizi OGC", 1.2],
];
let tx = 2.85;
tools.forEach(([t, w]) => {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: tx, y: 6.8, w, h: 0.3, rectRadius: 0.15, fill: { color: NAVY }, line: { color: NAVY } });
  T(t, { x: tx, y: 6.8, w, h: 0.3, fontSize: 10, color: "FFFFFF", align: "center", valign: "middle" });
  tx += w + 0.1;
});
T("USE CASE ESA COLLEGATI", { x: 0.4, y: 7.15, w: 2.4, h: 0.28, fontSize: 10.5, bold: true, color: NAVY, valign: "middle" });
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 2.85, y: 7.15, w: 3.2, h: 0.28, rectRadius: 0.14, fill: { color: "FFFFFF" }, line: { color: LINE, width: 1 } });
T("[Da definire]", { x: 2.85, y: 7.15, w: 3.2, h: 0.28, fontSize: 10, color: MUT, align: "center", valign: "middle" });

pres.writeFile({ fileName: __dirname + "/DRAINS_referenze.pptx" }).then(() => console.log("written"));
