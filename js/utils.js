// utils.js - funções auxiliares para filtros, datas, agrupamentos, formatações e mais

/**
 * Converte string para Date, suporta ISO ou texto simples.
 * @param {string|Date} dateStr
 * @returns {Date}
 */
export function parseDate(dateStr) {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return dateStr;
  return new Date(dateStr);
}

/**
 * Filtra array por faixa de datas, baseado na chave dateKey e range pré-definido.
 * @param {Array<Object>} data
 * @param {string} dateKey
 * @param {string} range - 'today', 'yesterday', 'last7', 'last15', 'last30', 'thisMonth', 'lastMonth', 'all'
 * @returns {Array<Object>}
 */
export function filterByDateRange(data, dateKey, range) {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  switch(range) {
    case "today":
      return data.filter(item => {
        const d = parseDate(item[dateKey]);
        return d >= start && d <= now;
      });
    case "yesterday":
      start.setDate(start.getDate() - 1);
      const endYesterday = new Date(start);
      endYesterday.setHours(23, 59, 59, 999);
      return data.filter(item => {
        const d = parseDate(item[dateKey]);
        return d >= start && d <= endYesterday;
      });
    case "last7":
      start.setDate(start.getDate() - 6);
      return data.filter(item => parseDate(item[dateKey]) >= start);
    case "last15":
      start.setDate(start.getDate() - 14);
      return data.filter(item => parseDate(item[dateKey]) >= start);
    case "last30":
      start.setDate(start.getDate() - 29);
      return data.filter(item => parseDate(item[dateKey]) >= start);
    case "thisMonth":
      start.setDate(1);
      return data.filter(item => parseDate(item[dateKey]) >= start);
    case "lastMonth":
      start.setMonth(start.getMonth() - 1);
      start.setDate(1);
      const endLastMonth = new Date(start);
      endLastMonth.setMonth(endLastMonth.getMonth() + 1);
      endLastMonth.setDate(0);
      return data.filter(item => {
        const d = parseDate(item[dateKey]);
        return d >= start && d <= endLastMonth;
      });
    case "all":
    default:
      return data;
  }
}

/**
 * Agrupa array de objetos por uma chave.
 * @param {Array<Object>} array
 * @param {string} key
 * @returns {Object<string, Array<Object>>}
 */
export function groupBy(array, key) {
  return array.reduce((result, item) => {
    const k = item[key] || 'undefined';
    if (!result[k]) result[k] = [];
    result[k].push(item);
    return result;
  }, {});
}

/**
 * Filtra array por múltiplos critérios fornecidos em um objeto.
 * Exemplo: { platform: 'Pinterest', trackingId: 'abc' }
 * @param {Array<Object>} data
 * @param {Object} criteria
 * @returns {Array<Object>}
 */
export function filterByCriteria(data, criteria) {
  return data.filter(item => {
    return Object.entries(criteria).every(([key, value]) => {
      if (value === undefined || value === null || value === '' || value === 'all') return true;
      return item[key] === value;
    });
  });
}

/**
 * Soma os valores numéricos de uma chave em um array de objetos.
 * @param {Array<Object>} data
 * @param {string} key
 * @returns {number}
 */
export function sumBy(data, key) {
  return data.reduce((acc, item) => {
    const val = Number(item[key]);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);
}

/**
 * Ordena array por uma chave (ascendente ou descendente).
 * @param {Array<Object>} data
 * @param {string} key
 * @param {boolean} asc - true para ascendente, false para descendente
 * @returns {Array<Object>}
 */
export function sortBy(data, key, asc = true) {
  return data.slice().sort((a, b) => {
    const valA = a[key];
    const valB = b[key];

    if (valA == null) return 1;
    if (valB == null) return -1;

    if (valA < valB) return asc ? -1 : 1;
    if (valA > valB) return asc ? 1 : -1;
    return 0;
  });
}

/**
 * Formata data para 'dd/mm/yyyy' (pt-BR).
 * @param {Date|string} date
 * @returns {string}
 */
export function formatDateBR(date) {
  const d = parseDate(date);
  if (!d || isNaN(d)) return '';
  return d.toLocaleDateString('pt-BR');
}

/**
 * Formata número para moeda BRL.
 * @param {number|string} value
 * @returns {string}
 */
export function formatCurrencyBRL(value) {
  const num = Number(value);
  if (isNaN(num)) return '';
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/**
 * Formata número para percentual (ex: 0.123 -> "12.3%").
 * @param {number|string} value
 * @param {number} decimals
 * @returns {string}
 */
export function formatPercent(value, decimals = 1) {
  const num = Number(value);
  if (isNaN(num)) return '';
  return (num * 100).toFixed(decimals) + '%';
}

/**
 * Normaliza dados para garantir tipos corretos.
 * Exemplo: transforma campos numéricos para Number, strings trimadas etc.
 * @param {Array<Object>} data
 * @param {Array<string>} numericKeys
 * @returns {Array<Object>}
 */
export function sanitizeData(data, numericKeys = []) {
  return data.map(item => {
    const newItem = {...item};
    numericKeys.forEach(key => {
      newItem[key] = Number(newItem[key]) || 0;
    });
    return newItem;
  });
}
