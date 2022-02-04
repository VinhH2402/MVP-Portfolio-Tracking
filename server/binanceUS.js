const db = require('../db')
const ccxt = require('ccxt')

const burl = 'https://api.binance.us';

// const account = async (callback) => {
//   const keys = await db.Keys.findOne({ exchange: 'BinanceUS' })
//   const secretKey = keys.SECRET_KEY;
//   const apiKey = keys.API_KEY;
//   const client = new Spot(apiKey, secretKey, { baseURL: burl });
//   let responseData;
//   client.account()
//     .then(response => {
//       const data = response.data.balances;
//       responseData = data.filter(item => item.free > 0.01);
//       // callback(responseData);
//     })
//   return responseData;
// }

const account = () => {
  return 'working';

};

module.exports = { account }
