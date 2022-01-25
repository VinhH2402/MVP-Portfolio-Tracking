const db = require('../db')
const { Spot } = require('@binance/connector')

const burl = 'https://api.binance.us';

const account = async (callback) => {
  const keys = await db.Keys.findOne({ exchange: 'BinanceUS' })
  const secretKey = keys.SECRET_KEY;
  const apiKey = keys.API_KEY;
  const client = new Spot(apiKey, secretKey, { baseURL: burl })
  client.account().then(response => callback(response.data.balances))
}

module.exports = { account }
