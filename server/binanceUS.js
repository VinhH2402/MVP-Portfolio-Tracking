const axios = require('axios');
const CryptoJS = require("crypto-js");
const db = require('../db')


const burl = 'https://api.binance.us';
let secretKey;
let apiKey;


db.Keys.findOne({ exchange: 'BinanceUS' })
  .then(result => {
    if(result) {
      secretKey = result.SECRET_KEY;
      apikey = result.API_KEY;
    }
  })



const getBlances = () => {
  const endpoint = '/api/v3/account';
  const queryString = 'timestamp=' + Date.now();
  const signature = CryptoJS.HmacSHA256(queryString, secretKey).toString(CryptoJS.enc.Hex)
  const url = burl + endpoint + '?' + queryString + '&signature=' + signature;
  return axios.get(url, {
    headers: {
      'X-MBX-APIKEY': apiKey
    }
  })
};

const getTime = () => {
  const endpoint = '/api/v3/exchangeInfo';
  const url = burl + endpoint;
  return axios.get(url)
}


const getPrice = (symbol) => {
  const endpoint = '/api/v3/ticker/price';
  const url = burl + endpoint + '?symbol=' + symbol;
  return axios.get(url)
}


const account = (callback) => {
  const resData = [];
  const promises = [];
  db.Keys.findOne({ exchange: 'BinanceUS' })
    .then(result => {
      secretKey = result.SECRET_KEY;
      apiKey = result.API_KEY;
      getBlances()
        .then(res => {
          const balances = res.data.balances;
          balances.forEach(each => {
            if (each.free > 0.01) {
              if (each.asset === 'USD' || each.asset === 'USDT') {
                each.price = 1;
                resData.push(each);
              } else {
                const symbol = each.asset + 'USDT';
                promises.push(getPrice(symbol)
                  .then(res => {
                    const price = res.data.price;
                    each.price = price;
                    resData.push(each)
                  })
                  .catch(err => err)
                )
              }
            }
          })
          Promise.all(promises)
            .then(() => {
              callback(resData)
            })
            .catch(err => callback(err))
        })
    })

    .catch(err => callback(err))
}




module.exports = { account, getTime, getPrice }

