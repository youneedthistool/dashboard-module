import { groupBy } from './utils.js';

let chartClicksByPlatform = null;
let chartDailyClickTrend = null;

export function renderClicksByPlatformChart(ctx, clicks) {
  if (!clicks || clicks.length === 0) {
    // Opcional: limpar canvas ou mostrar mensagem
    if(chartClicksByPlatform) {
      chartClicksByPlatform.destroy();
      chartClicksByPlatform = null;
    }
    return;
  }

  const grouped = groupBy(clicks, 'platform');
  const labels = Object.keys(grouped);
  const data = labels.map(k => grouped[k].length);

  if(chartClicksByPlatform) chartClicksByPlatform.destroy();

  chartClicksByPlatform = new Chart(ctx, {
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
      responsive: true,
      scales: { y: { beginAtZero: true } },
      plugins: {
        legend: { display: true },
        tooltip: { mode: 'index', intersect: false },
      }
    }
  });
}

export function renderDailyClickTrendChart(ctx, clicks) {
  if (!clicks || clicks.length === 0) {
    if(chartDailyClickTrend) {
      chartDailyClickTrend.destroy();
      chartDailyClickTrend = null;
    }
    return;
  }

  const clicksByDay = {};

  clicks.forEach(c => {
    if (!c.timestamp) return;
    const date = new Date(c.timestamp);
    if (isNaN(date)) return;
    const day = date.toISOString().slice(0, 10);
    clicksByDay[day] = (clicksByDay[day] || 0) + 1;
  });

  const labels = Object.keys(clicksByDay).sort();
  const data = labels.map(d => clicksByDay[d]);

  if(chartDailyClickTrend) chartDailyClickTrend.destroy();

  chartDailyClickTrend = new Chart(ctx, {
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
      responsive: true,
      scales: { y: { beginAtZero: true } },
      plugins: {
        legend: { display: true },
        tooltip: { mode: 'index', intersect: false },
      }
    }
  });
}
