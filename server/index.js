const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const bodyParser = require('body-parser');
const db = require('../db');

const {pricesCache, getAccountsBalance, getAccounts} = require('./function')

app.use(express.static(path.join(__dirname, '/../dist')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


app.get('/fetchaccounts', async (req, res) => {
  const accounts = await getAccounts();
  const accountsBalance = await getAccountsBalance(accounts);
  res.json(accountsBalance)
})

app.get('/fetchprices', (req, res) => {
  res.json(pricesCache)
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
      console.log('REMOVE', result)
      res.send(result);
    })
})

app.listen(port, () => {
  console.log(`Portfolio Tracking app listening at http://localhost:${port}`)
})