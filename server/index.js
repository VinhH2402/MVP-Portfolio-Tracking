const express = require('express');
const ccxt = require('ccxt');
const app = express();
const port = 3000;
const path = require('path');
const bodyParser = require('body-parser');
const db = require('../db');
const filterBalance = require('./filterBalance');


app.use(express.static(path.join(__dirname, '/../dist')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const getAccounts = () => {
  return db.Keys.find()
    .then(results => results)
    .catch(error => error)
};

const getAccountsBalance = async (accounts) => {
  const promiseAll = [];
  const responseData = [];

  for(const acc of accounts) {
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
 
    responseData.push({id: acc.id ,exchangeName: exchangeName, balances: sortedBalances})
  }
  return responseData
}

app.get('/fetchaccounts', async (req, res) => {
  const accounts = await getAccounts();
  const accountsBalance = await getAccountsBalance(accounts);
  res.json(accountsBalance)
})

app.get('/fetchprices', (req, res) => {
  const exchangeName = req.query.exchangeName;
  const exchangeApi = new ccxt[exchangeName];
  exchangeApi.fetchTickers()
    .then(result => res.json(result))
    .catch(error => res.json(error))
})

app.post('/addAccount', (req, res) => {
  const keys = req.body
  db.addAccount(keys, (result) => {
    res.send(result)
  })
})

app.post('/delete', (req, res) => {
  db.Keys.deleteMany()
    .then(result => {
      console.log('result', result)
      res.send('deleted')
    })
})

app.put('/remove', (req, res) => {
  db.Keys.deleteOne({ _id: req.body.id })
    .then((result) => {
      console.log(req.body.exchange + ' REMOVE', result);
      res.send(result);
    })
})

app.listen(port, () => {
  console.log(`Portfolio Tracking app listening at http://localhost:${port}`)
})