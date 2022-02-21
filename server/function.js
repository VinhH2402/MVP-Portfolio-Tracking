const ccxt = require('ccxt');
const filterBalance = require('./filterBalance');
const db = require('../db');

const pricesCache = {};

const filterPrices = (obj, predicate) => {
    return Object.keys(obj)
      .filter(key => key.includes('USDT'))
      .reduce((res, key) => (res[key] = obj[key].close, res), {});
  }

async function fetchPrices() {
  const exchanges = ['binance', 'coinbasepro', 'kucoin', 'binanceus', 'gateio']
  const exch = exchanges[0]
  for (ex in exchanges) {
    const exchangeName = exchanges[ex]
    const exchangeApi = new ccxt[exchangeName];
    exchangeApi.fetchTickers()
      .then(result => {
        const prices = filterPrices(result);
        console.log(prices)
        pricesCache[exchangeName] = prices;
      })
      .catch(error => console.log(error))
  }
  console.log('prices updated')
}

fetchPrices();
setInterval(() => fetchPrices(), 30000)


async function getAccountsBalance (accounts) {
  const promiseAll = [];
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

    const fetchBalances = await exchangeApi.fetchBalance();
    const balances = filterBalance[exchangeName](fetchBalances)
    const sortedBalances = balances.sort((a, b) => {
      return b.balance - a.balance
    })

    responseData.push({ id: acc.id, exchangeName: exchangeName, balances: sortedBalances })
  }
  return responseData
}

const getAccounts = () => {
  return db.Keys.find()
    .then(results => results)
    .catch(error => error)
};

module.exports.pricesCache = pricesCache;
module.exports.getAccounts = getAccounts;
module.exports.getAccountsBalance = getAccountsBalance;