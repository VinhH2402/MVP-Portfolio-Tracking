const ccxt = require('ccxt');
const db = require('../db');
const fs = require('fs')
const logs = require('../logs.json')


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
  const date = new Date().toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
  })
  console.log(date)
  logs.push(date)
  fs.writeFile('data.json', JSON.stringify(exchanges), (err) => console.log('save data success'))
  fs.writeFile('logs.json', JSON.stringify(logs), (err) => console.log('save log success'))
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


module.exports.fetchAccount = fetchAccount;