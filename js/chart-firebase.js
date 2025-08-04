// chart-firebase.js - cria gráficos com dados vindos do Firebase (cliques)

import { groupBy } from './utils.js';

export function renderClicksByPlatformChart(ctx, clicks) {
  // Agrupa por plataforma (ex: referrer ou device)
  const grouped = groupBy(clicks, 'platform' /* ou 'referrer' se tiver */);

  const labels = Object.keys(grouped);
  const data = labels.map(k => grouped[k].length);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Clicks by Platform',
        data,
        backgroundColor: 'rgba(0, 255, 102, 0.7)',
      }]
    },
    options: {
      scales: { y: { beginAtZero: true } }
    }
  });
}

export function renderDailyClickTrendChart(ctx, clicks) {
  // Agrupa cliques por dia
  const clicksByDay = {};

  clicks.forEach(c => {
    const day = new Date(c.timestamp).toISOString().slice(0, 10);
    clicksByDay[day] = (clicksByDay[day] || 0) + 1;
  });

  const labels = Object.keys(clicksByDay).sort();
  const data = labels.map(d => clicksByDay[d]);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Daily Clicks',
        data,
        fill: false,
        borderColor: '#00ff66',
        tension: 0.3
      }]
    },
    options: {
      scales: { y: { beginAtZero: true } }
    }
  });
}
