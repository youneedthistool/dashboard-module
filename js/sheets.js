// sheets.js - busca dados da planilha Google Sheets via API Key
const SHEET_ID = "1cUlooMtvIgTnVzQnRJoF1x7txty-6MJ_uBsQOvaUs40";
const API_KEY = "AIzaSyB8UuHvCHVt5XDA6r0pruGAw27bgI46KrQ";

async function fetchSheetData(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}?key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erro ao buscar dados da planilha: ${res.statusText}`);
  const json = await res.json();
  return json.values; // matriz [ [header], [row], ... ]
}

export async function fetchMainData() {
  return fetchSheetData("MAIN");
}

export async function fetchTrackingData() {
  return fetchSheetData("Tracking");
}

export async function fetchLinkTypeData() {
  return fetchSheetData("LinkType");
}

export async function fetchDailyTrendsData() {
  return fetchSheetData("DailyTrends");
}
