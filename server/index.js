const express = require('express');
const binance = require('./binance.js');
const binanceUS = require('./binanceUS.js')
const app = express();
const port = 3000;
const path = require('path')
const bodyParser = require('body-parser')
const db = require('../db')

app.use(express.static(path.join(__dirname, '/../dist')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/exchanges', (req, res) => {
  db.Keys.find()
    .then(results => {
      const exchanges = results.map(item => {
        return item.exchange
      })
      res.json(exchanges)
    })
})

app.post('/addkey', (req, res) => {
  const key = req.body
  db.add(key, (result) => {
    res.end()
  })
})

app.post('/delete', (req, res) => {
  db.Keys.deleteMany(req.body)
    .then(result => {
      console.log(result)
      res.end()
    })
})

app.get('/Binance', (req, res) => {
  binance.account((data) => {
    res.json(data)
  })
})

app.get('/BinanceUS', (req, res) => {
  binanceUS.account((data) => {
    res.json(data)
  })

})

app.listen(port, () => {
  console.log(`Portfolio Tracking app listening at http://localhost:${port}`)
})