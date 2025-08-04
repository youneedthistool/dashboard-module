// chart-sheets.js - cria gráficos com dados da planilha (pedidos, conversões, etc)

// Função utilitária para agrupar e somar por chave
function groupSum(data, keyGetter, valueGetter) {
  const map = {};
  data.forEach(item => {
    const key = keyGetter(item);
    const value = valueGetter(item) || 0;
    map[key] = (map[key] || 0) + value;
  });
  return map;
}

// Gráfico: Top 5 produtos por Orders
export function renderOrdersByProductChart(ctx, trackingData) {
  if (!trackingData || trackingData.length < 2) return;

  const headers = trackingData[0];
  const idxProduct = headers.indexOf('Product Name');
  const idxOrders = headers.indexOf('Orders');

  if (idxProduct === -1 || idxOrders === -1) {
    console.error("Colunas 'Product Name' ou 'Orders' não encontradas no cabeçalho.");
    return;
  }

  const dataRows = trackingData.slice(1);
  const ordersByProduct = groupSum(dataRows, row => row[idxProduct], row => parseInt(row[idxOrders]) || 0);

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
      scales: { y: { beginAtZero: true } },
      responsive: true,
      plugins: {
        legend: { display: true }
      }
    }
  });
}

// Gráfico: Conversão média por produto (Orders / Clicks)
export function renderConversionByProductChart(ctx, trackingData) {
  if (!trackingData || trackingData.length < 2) return;

  const headers = trackingData[0];
  const idxProduct = headers.indexOf('Product Name');
  const idxOrders = headers.indexOf('Orders');
  const idxClicks = headers.indexOf('Clicks');

  if (idxProduct === -1 || idxOrders === -1 || idxClicks === -1) {
    console.error("Colunas 'Product Name', 'Orders' ou 'Clicks' não encontradas no cabeçalho.");
    return;
  }

  const dataRows = trackingData.slice(1);

  // Calcula conversão média = sum(orders) / sum(clicks) por produto
  const clicksByProduct = groupSum(dataRows, row => row[idxProduct], row => parseInt(row[idxClicks]) || 0);
  const ordersByProduct = groupSum(dataRows, row => row[idxProduct], row => parseInt(row[idxOrders]) || 0);

  // Filtra produtos que tiveram clicks > 0 para evitar divisão por zero
  const conversionByProduct = {};
  Object.keys(clicksByProduct).forEach(prod => {
    const clicks = clicksByProduct[prod];
    if (clicks > 0) {
      conversionByProduct[prod] = (ordersByProduct[prod] || 0) / clicks;
    }
  });

  const sorted = Object.entries(conversionByProduct).sort((a, b) => b[1] - a[1]);
  const top5 = sorted.slice(0, 5);

  const labels = top5.map(x => x[0]);
  const data = top5.map(x => (x[1] * 100).toFixed(2)); // converte para %

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Top 5 Products by Conversion (%)',
        data,
        backgroundColor: 'rgba(0, 200, 150, 0.7)',
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: val => val + '%'
          }
        }
      },
      responsive: true,
      plugins: {
        legend: { display: true }
      }
    }
  });
}

// Exporte outras funções para mais gráficos se precisar
