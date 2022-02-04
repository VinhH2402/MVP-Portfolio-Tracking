const express = require('express');
const ccxt = require('ccxt');
const app = express();
const port = 3000;
const path = require('path');
const bodyParser = require('body-parser');
const db = require('../db');
const exchanges = require('./exchanges');


app.use(express.static(path.join(__dirname, '/../dist')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const getAccounts = db.Keys.find()
  .then(results => results)
  .catch(error => error)

const getAccountsBalance = async (accounts) => {
  const promiseAll = [];
  const responseData = [];
  accounts.forEach(account => {
    const exchangeName = account.exchange.toLowerCase().replace('.', '');
    const config = {
      apiKey: account.API_KEY,
      secret: account.SECRET_KEY,
      password: account.passphrase
    };

    const exchangeApi = new ccxt[exchangeName](config);
    if (account.sandbox === true) { exchangeApi.setSandboxMode(true) }
    promiseAll.push(exchangeApi.fetchBalance()
      .then((resData) => {
        const balances = exchanges[exchangeName](resData);
        const returnData = {
          id: account.id,
          exchangeName: exchangeName,
          balances: balances
        }
        responseData.push(returnData)
      })
      .catch((error) => console.log('fetch balance error', error))
    )
  })

  return Promise.all(promiseAll)
    .then(() => responseData)
    .catch(error => (error))
}

app.get('/fetchaccounts', async (req, res) => {
  const accounts = await getAccounts;
  console.log('>>>>>>', accounts)
  const accountsBalance = await getAccountsBalance(accounts);
  res.json(accountsBalance)
})

app.get('/fetchprices', (req, res) => {
  const exchangeName = req.query.exchangeName;
  const exchangeApi = new ccxt[exchangeName];
  exchangeApi.fetchTickers()
    .then(result => res.json(result))
})

app.post('/addAccount', (req, res) => {
  const key = req.body
  db.addAccount(key, (result) => {
    res.json(result)
  })
})

app.post('/delete', (req, res) => {
  console.log(req.body)
  db.Keys.deleteMany(req.body)
    .then(result => {
      console.log(result)
      res.end()
    })
})

app.put('/remove', (req, res) => {
  db.Keys.deleteOne(req.body)
    .then(() => {
      console.log(req.body.exchangeName + ' DELETED');
      res.end();
    })
})

app.listen(port, () => {
  console.log(`Portfolio Tracking app listening at http://localhost:${port}`)
})