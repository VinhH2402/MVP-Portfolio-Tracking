const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const db = require('../db');
require('dotenv').config()
const port = process.env.PORT || 3000;
const logs = require('../logs.json');
const data = require('../data.json');

const { fetchAccount } = require('./function')

app.use(express.static(path.join(__dirname, '/../dist')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


app.get('/exchanges', (req, res) => {
  res.json(data)
})

app.get('/update', async (req, res) => {
  const data = await fetchAccount();
  res.json(data)
})

app.get('/fetchprices', (req, res) => {
  const prices = cache.get('prices')
  res.json(prices)
})

app.get('/logs', (req, res) => {
  res.json(logs.length)
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