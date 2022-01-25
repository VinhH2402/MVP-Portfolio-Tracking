const axios = require('axios');
const CryptoJS = require("crypto-js");
const db = require('../db')
const { Spot } = require('@binance/connector')


const burl = 'https://api.binance.us';

getBalances = async () => {
  const keys = await db.Keys.findOne({ exchange: 'BinanceUS' })
  const secretKey = keys.SECRET_KEY;
  const apiKey = keys.API_KEY;
  const client = new Spot(apiKey, secretKey, { baseURL: burl })
  return client.account().then(response => response.data.balances)
}

const getTime = () => {
  const endpoint = '/api/v3/exchangeInfo';
  const url = burl + endpoint;
  return axios.get(url)
}

const getPrice = async (symbol) => {
  const endpoint = '/api/v3/ticker/price';
  const url = burl + endpoint + '?symbol=' + symbol;
  const price = await axios.get(url)
  return price.data.price
}

const account = async (callback) => {
  const resData = [];
  const promises = [];
  const balances = await getBalances();

  const getResData = async () => {
    for (let i = 0; i < balances.length; i++) {
      if (balances[i].free > 0.01) {
        if (balances[i].asset === 'USD' || balances[i].asset === 'USDT') {
          balances[i].price = 1;
          resData.push(balances[i]);
        } else {
          const symbol = balances[i].asset + 'USDT';
          const price = await getPrice(symbol);
          balances[i].price = price;
          resData.push(balances[i]);
        }
      }
    }
  }

  getResData()
    .then(() => callback(resData));
}


module.exports = { account, getTime, getPrice }

