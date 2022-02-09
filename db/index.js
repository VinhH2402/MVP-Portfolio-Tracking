const mongoose = require('mongoose');
const ccxt = require('ccxt')

main().catch(err => console.log(err));
async function main(){
  mongoose.connect('mongodb://localhost:27017/accounts', { useNewUrlParser: true, useUnifiedTopology: true });
}


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', function () {
  console.log('data connected')
})

const keysSchema = new mongoose.Schema({
  exchange: String,
  API_KEY: String,
  SECRET_KEY: String,
  passphrase: String,
  sandbox: Boolean
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
        const { API_KEY, SECRET_KEY, passphrase, exchange, sandbox } = data;
        let exchangeName = exchange.toLowerCase().replace('.', '')
        const config = {
          apiKey: API_KEY,
          secret: SECRET_KEY,
          password: passphrase
        };

        const exchangeApi = new ccxt[exchangeName](config);

        if (sandbox === true) {
          exchangeApi.setSandboxMode(true);
        }

        exchangeApi.fetchBalance()
          .then(() => saveKey(data))
          .catch(() => callback('keys are invalid'))
      }
    })
}

module.exports.Keys = Keys;
module.exports.addAccount = addAccount;