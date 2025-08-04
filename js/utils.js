// utils.js - funções auxiliares para filtros, datas, agrupamentos

export function parseDate(dateStr) {
  // Suporta datas no formato ISO ou texto simples, ajusta para Date()
  return new Date(dateStr);
}

export function filterByDateRange(data, dateKey, range) {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  switch(range) {
    case "today":
      return data.filter(item => {
        const d = new Date(item[dateKey]);
        return d >= start && d <= now;
      });
    case "yesterday":
      start.setDate(start.getDate() - 1);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      return data.filter(item => {
        const d = new Date(item[dateKey]);
        return d >= start && d <= end;
      });
    case "last7":
      start.setDate(start.getDate() - 6);
      return data.filter(item => new Date(item[dateKey]) >= start);
    case "last15":
      start.setDate(start.getDate() - 14);
      return data.filter(item => new Date(item[dateKey]) >= start);
    case "last30":
      start.setDate(start.getDate() - 29);
      return data.filter(item => new Date(item[dateKey]) >= start);
    case "thisMonth":
      start.setDate(1);
      return data.filter(item => new Date(item[dateKey]) >= start);
    case "lastMonth":
      start.setMonth(start.getMonth() - 1);
      start.setDate(1);
      const endLastMonth = new Date(start);
      endLastMonth.setMonth(endLastMonth.getMonth() + 1);
      endLastMonth.setDate(0);
      return data.filter(item => {
        const d = new Date(item[dateKey]);
        return d >= start && d <= endLastMonth;
      });
    case "all":
    default:
      return data;
  }
}

// Agrupa array de objetos por uma chave
export function groupBy(array, key) {
  return array.reduce((result, item) => {
    const k = item[key];
    if (!result[k]) result[k] = [];
    result[k].push(item);
    return result;
  }, {});
}
