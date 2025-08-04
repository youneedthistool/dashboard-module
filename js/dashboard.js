// dashboard.js - coordena a integração, filtros e renderização dos gráficos

import { fetchAllClicks } from './firebase.js';
import { fetchMainData, fetchTrackingData } from './sheets.js';
import { filterByDateRange } from './utils.js';
import { renderClicksByPlatformChart, renderDailyClickTrendChart } from './chart-firebase.js';
import { renderOrdersByProductChart } from './chart-sheets.js';

const platformFilter = document.getElementById('platformFilter');
const dateFilter = document.getElementById('dateFilter');

let allClicks = [];
let trackingData = [];

async function init() {
  // Busca dados
  allClicks = await fetchAllClicks();
  trackingData = await fetchTrackingData();

  populatePlatformFilter();
  updateDashboard();
}

function populatePlatformFilter() {
  // Exemplo para popular filtro plataformas com base nos dados Firebase
  const platforms = [...new Set(allClicks.map(c => c.platform || 'Unknown'))];
  platforms.forEach(p => {
    const option = document.createElement('option');
    option.value = p;
    option.textContent = p;
    platformFilter.appendChild(option);
  });
}

function updateDashboard() {
  // Aplica filtros
  let filteredClicks = allClicks;
  const platform = platformFilter.value;
  const dateRange = dateFilter.value;

  if (platform !== 'all') {
    filteredClicks = filteredClicks.filter(c => c.platform === platform);
  }

  filteredClicks = filterByDateRange(filteredClicks, 'timestamp', dateRange);

  // Atualiza cards
  document.getElementById('totalClicks').textContent = filteredClicks.length;

  // Pedidos e comissões da planilha
  let totalOrders = 0;
  let totalCommissions = 0;

  // trackingData: [headers, row, row, ...]
  const headers = trackingData[0];
  const idxOrders = headers.indexOf('Orders');
  const idxCommissions = headers.indexOf('Commission');

  for (let i = 1; i < trackingData.length; i++) {
    totalOrders += Number(trackingData[i][idxOrders] || 0);
    totalCommissions += Number(trackingData[i][idxCommissions] || 0);
  }

  document.getElementById('totalOrders').textContent = totalOrders;
  document.getElementById('totalCommissions').textContent = '$' + totalCommissions.toFixed(2);

  // Renderiza gráficos
  const ctxPlatform = document.getElementById('chartPlatform').getContext('2d');
  const ctxEvolucao = document.getElementById('chartEvolucao').getContext('2d');
  const ctxTopProducts = document.getElementById('chartCTA').getContext('2d'); // exemplo, ajustar

  // Limpa canvas antes de redesenhar
  ctxPlatform.canvas.replaceWith(ctxPlatform.canvas.cloneNode(true));
  ctxEvolucao.canvas.replaceWith(ctxEvolucao.canvas.cloneNode(true));
  ctxTopProducts.canvas.replaceWith(ctxTopProducts.canvas.cloneNode(true));

  renderClicksByPlatformChart(ctxPlatform.canvas.getContext('2d'), filteredClicks);
  renderDailyClickTrendChart(ctxEvolucao.canvas.getContext('2d'), filteredClicks);
  renderOrdersByProductChart(ctxTopProducts.canvas.getContext('2d'), trackingData);

  // Atualiza tabela Top 5 produtos
  updateTopProductsTable(trackingData);
}

function updateTopProductsTable(trackingData) {
  const tbody = document.getElementById('topProducts');
  tbody.innerHTML = '';

  const headers = trackingData[0];
  const idxProduct = headers.indexOf('Product Name');
  const idxOrders = headers.indexOf('Orders');

  if (idxProduct === -1 || idxOrders === -1) return;

  const products = {};

  for (let i = 1; i < trackingData.length; i++) {
    const product = trackingData[i][idxProduct];
    const orders = Number(trackingData[i][idxOrders] || 0);
    products[product] = (products[product] || 0) + orders;
  }

  // Ordena decrescente
  const sorted = Object.entries(products).sort((a,b) => b[1] - a[1]);
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
