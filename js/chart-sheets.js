// chart-sheets.js - cria gráficos com dados da planilha (pedidos, conversões, etc)

import { groupBy } from './utils.js';

export function renderOrdersByProductChart(ctx, trackingData) {
  // Agrupa por produto e soma orders
  const ordersByProduct = {};

  trackingData.slice(1).forEach(row => {
    const product = row[0]; // ajuste conforme sua coluna Produto
    const orders = parseInt(row[5] || "0"); // ajuste conforme coluna Orders
    ordersByProduct[product] = (ordersByProduct[product] || 0) + orders;
  });

  const sorted = Object.entries(ordersByProduct).sort((a, b) => b[1] - a[1]);
  const top5 = sorted.slice(0, 5);

  const labels = top5.map(x => x[0]);
  const data = top5.map(x => x[1]);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Top 5 Products by Orders',
        data,
        backgroundColor: 'rgba(0, 255, 102, 0.7)',
      }]
    },
    options: {
      scales: { y: { beginAtZero: true } }
    }
  });
}
