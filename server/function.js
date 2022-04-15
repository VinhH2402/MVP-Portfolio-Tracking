const ccxt = require('ccxt');
const db = require('../db');

const cache = new Map();

const priceFilter = (obj) => {
  return Object.keys(obj)
    .filter(key => key.includes('USDT'))
    .reduce((res, key) => (res[key] = obj[key].close, res), {});
}

const balancesFilter = (total, prices) => {
  const balances = [];
  for (const symbol in total) {
    const pair = symbol + '/USDT'
    if (total[symbol] > 0 && prices[pair]) {
      const totalValue = parseFloat(total[symbol] * prices[pair]).toFixed(2);
      balances.push({
        symbol: symbol,
        total: total[symbol],
        price: prices[pair],
        totalValue: Number(totalValue)
      })
    }
    else if (total[symbol] > 0) {
      const totalValue = parseFloat(total[symbol]).toFixed(2)
      balances.push({
        symbol: symbol,
        total: total[symbol],
        totalValue: Number(totalValue)
      })
    }
  }
  return balances;
}

async function fetchAccount() {
  const accounts = await getAccounts();
  const exchanges = await getBalances(accounts);
  cache.set('exchanges', exchanges)
  console.log('completed fetch data')
  return exchanges;
}

async function getBalances(accounts) {
  const responseData = [];
  for (const acc of accounts) {
    const exchangeName = acc.exchange.toLowerCase().replace('.', '');
    const config = {
      apiKey: acc.API_KEY,
      secret: acc.SECRET_KEY,
      password: acc.passphrase
    };

    const exchangeApi = new ccxt[exchangeName](config);
    if (acc.sandbox === true) { exchangeApi.setSandboxMode(true) }

    const prices = await exchangeApi.fetchTickers();
    const balances = await exchangeApi.fetchBalance();

    const pairUSDT = priceFilter(prices)
    const filteredBalance = balancesFilter(balances.total, pairUSDT)
    const exchangeTotal = filteredBalance.reduce((pre, cur) => pre + cur.totalValue, 0)
    const sortedBalances = filteredBalance.sort((a, b) => {
      return b.total - a.total
    })
    responseData.push({
      id: acc.id,
      exchangeName: exchangeName,
      balances: sortedBalances,
      exchangeTotal: exchangeTotal
    })
  }
  return responseData
}

async function getAccounts() {
  try {
    const results = await db.Keys.find();
    return results;
  } catch (error) {
    return error;
  }
};


fetchAccount();


module.exports.cache = cache;
module.exports.fetchAccount = fetchAccount;