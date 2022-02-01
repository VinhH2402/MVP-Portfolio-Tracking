const mongoose = require('mongoose');
const { useCallback } = require('react');
const { Spot } = require('@binance/connector');
const CoinbasePro = require('coinbase-pro');


mongoose.connect('mongodb://localhost:27017/allexchanges', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('data connected')
})

const keysSchema = new mongoose.Schema({
  exchange: String,
  API_KEY: String,
  SECRET_KEY: String
});

const Keys = mongoose.model('Keys', keysSchema);

const addAccount = (data, callback) => {
  console.log(data)
  const saveKey = (data) => {
    const keys = new Keys(data)
    keys.save()
      .then(() => callback('keys are saved'))
      .catch(() => callback('saving keys error'))
  }

  Keys.findOne(data)
    .then(result => {
      if (result) {
        callback('this account was added')
      } else {
        if (data.exchange === 'Binance') {
          //do something with binance keys
          const burl = 'https://testnet.binance.vision';
          const client = new Spot(data.API_KEY, data.SECRET_KEY, { baseURL: burl });
          client.account()
            .then(() => saveKey(data))
            .catch(() => callback('keys are invalid'))
        }

        if (data.exchange === 'Coinbase') {
          console.log('do something with coinbase keys')
          console.log(data)
          const key = '8966d631fcb3830a0ac4eb4fed7b754d';
          const secret = 'BpJbqAVqlg7YGw0uRHr7i071cd3ORNlB+Ola4240ekCiSpDbzlUSY1qRuX3Ff3a6m7amoSZDRQIo2in3uSeftQ==';
          const passphrase = '1u0budpiwt6';
          const sandboxURI = 'https://api-public.sandbox.pro.coinbase.com';

          const authedClient = new CoinbasePro.AuthenticatedClient(
            data.API_KEY,
            data.SECRET_KEY,
            data.passphrase,
            sandboxURI
          );
          authedClient.getAccounts()
            .then(() => saveKey(data))
            .catch(() => callback('keys are invalid'))
        }

        if (data.exchange === 'BinanceUS') {
          console.log('do something with binanceUS key')
          const burl = 'https://api.binance.us';
          const client = new Spot(data.API_KEY, data.SECRET_KEY, { baseURL: burl });
          client.account()
            .then(() => saveKey(data))
            .catch(() => callback('keys are invalid'))
        }

        if (data.exchange === 'Kucoin') {
          console.log('do something with Kucoin keys')
          callback()
        }

        if (data.exchange === 'Gate.io') {
          console.log('do something with Gate.io keys')
          callback()
        }
      }
    })
}

const remove = (exchangeName, callback) => {

}



module.exports.Keys = Keys;
module.exports.addAccount = addAccount;