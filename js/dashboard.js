// dashboard.js
import { fetchAllClicks } from './firebase.js';
import { fetchTrackingData, fetchCrossAnalysisData } from './sheets.js';  // Importa Cross Analysis
import { filterByDateRange } from './utils.js';
import { renderClicksByPlatformChart, renderDailyClickTrendChart } from './chart-firebase.js';
import { renderOrdersByProductChart } from './chart-sheets.js';

const platformFilter = document.getElementById('platformFilter');
const dateFilter = document.getElementById('dateFilter');

let allClicks = [];
let trackingData = [];
let crossAnalysisData = [];  // Novo array para armazenar Cross Analysis

function resetCanvas(id) {
  const oldCanvas = document.getElementById(id);
  const newCanvas = oldCanvas.cloneNode(true);
  oldCanvas.parentNode.replaceChild(newCanvas, oldCanvas);
  return newCanvas.getContext('2d');
}

async function init() {
  // Busca todos os dados necessários
  allClicks = await fetchAllClicks();
  trackingData = await fetchTrackingData();
  crossAnalysisData = await fetchCrossAnalysisData();

  populatePlatformFilter();
  updateDashboard();
}

function populatePlatformFilter() {
  const platforms = [...new Set(allClicks.map(c => c.platform || 'Unknown'))];
  platformFilter.innerHTML = ''; // limpa opções antigas
  // Sempre adiciona opção ALL
  const optionAll = document.createElement('option');
  optionAll.value = 'all';
  optionAll.textContent = 'All Platforms';
  platformFilter.appendChild(optionAll);

  platforms.forEach(p => {
    const option = document.createElement('option');
    option.value = p;
    option.textContent = p;
    platformFilter.appendChild(option);
  });
}

function updateDashboard() {
  // Aplica filtro por plataforma e data nos clicks
  let filteredClicks = allClicks;
  const platform = platformFilter.value;
  const dateRange = dateFilter.value;

  if (platform !== 'all') {
    filteredClicks = filteredClicks.filter(c => c.platform === platform);
  }

  filteredClicks = filterByDateRange(filteredClicks, 'timestamp', dateRange);

  // Atualiza indicadores principais
  document.getElementById('totalClicks').textContent = filteredClicks.length;

  let totalOrders = 0;
  let totalCommissions = 0;

  const headers = trackingData[0] || [];
  const idxOrders = headers.indexOf('Orders');
  const idxCommissions = headers.indexOf('Commission');

  for (let i = 1; i < trackingData.length; i++) {
    totalOrders += Number(trackingData[i][idxOrders] || 0);
    totalCommissions += Number(trackingData[i][idxCommissions] || 0);
  }

  document.getElementById('totalOrders').textContent = totalOrders;
  document.getElementById('totalCommissions').textContent = '$' + totalCommissions.toFixed(2);

  // Renderiza gráficos
  const ctxPlatform = resetCanvas('chartPlatform');
  const ctxEvolucao = resetCanvas('chartEvolucao');
  const ctxTopProducts = resetCanvas('chartCTA');

  renderClicksByPlatformChart(ctxPlatform, filteredClicks);
  renderDailyClickTrendChart(ctxEvolucao, filteredClicks);
  renderOrdersByProductChart(ctxTopProducts, trackingData);

  updateTopProductsTable(trackingData);

  // Atualiza visualização de Cross Analysis (exemplo)
  updateCrossAnalysisSection(crossAnalysisData);
}

// Função exemplo para mostrar dados da aba Cross Analysis em tabela ou lista
function updateCrossAnalysisSection(data) {
  const thead = document.getElementById('crossAnalysisHead');
  const tbody = document.getElementById('crossAnalysisBody');

  // Limpa conteúdo anterior
  thead.innerHTML = '';
  tbody.innerHTML = '';

  if (!data || data.length < 2) {
    tbody.innerHTML = '<tr><td colspan="100%">No Cross Analysis data available.</td></tr>';
    return;
  }

  const headers = data[0];
  const rows = data.slice(1);

  // Preenche cabeçalho
  const trHead = document.createElement('tr');
  headers.forEach(h => {
    const th = document.createElement('th');
    th.textContent = h;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);

  // Preenche corpo da tabela
  rows.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

function updateTopProductsTable(trackingData) {
  const tbody = document.getElementById('topProducts');
  tbody.innerHTML = '';

  const headers = trackingData[0] || [];
  const idxProduct = headers.indexOf('Product Name');
  const idxOrders = headers.indexOf('Orders');

  if (idxProduct === -1 || idxOrders === -1) return;

  const products = {};

  for (let i = 1; i < trackingData.length; i++) {
    const product = trackingData[i][idxProduct];
    const orders = Number(trackingData[i][idxOrders] || 0);
    products[product] = (products[product] || 0) + orders;
  }

  const sorted = Object.entries(products).sort((a, b) => b[1] - a[1]);
  const top5 = sorted.slice(0, 5);

  top5.forEach(([product, orders]) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${product}</td><td>${orders}</td>`;
    tbody.appendChild(tr);
  });
}

platformFilter.addEventListener('change', updateDashboard);
dateFilter.addEventListener('change', updateDashboard);

window.addEventListener('load', init);
