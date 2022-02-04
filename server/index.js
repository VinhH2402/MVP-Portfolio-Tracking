const express = require('express');
const ccxt = require('ccxt');
const app = express();
const port = 3000;
const path = require('path')
const bodyParser = require('body-parser')
const db = require('../db')

app.use(express.static(path.join(__dirname, '/../dist')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/fetchdata', (req, res) => {
  const promiseAll = [];
  const responseData = [];
  db.Keys.find()
    .then(async (results) => {
      results.forEach(item => {
        const exchangeName = item.exchange.toLowerCase().replace('.', '');
        const config = {
          apiKey: item.API_KEY,
          secret: item.SECRET_KEY,
          password: item.passphrase
        };


        const exchangeApi = new ccxt[exchangeName](config);
        if (item.sandbox === true) { exchangeApi.setSandboxMode(true) }
        promiseAll.push(exchangeApi.fetchBalance()
          .then((resData) => {
            const data = resData.info.balances;
            const filterData = data.filter(symbol => Number(symbol.free) + Number(symbol.locked));
            const returnData = {
              id: item.id,
              exchangeName: exchangeName,
              balances: filterData
            }
            responseData.push(returnData)
          })
          .catch((error) => console.log('fetch balance error', error))
        )
      })

      Promise.all(promiseAll)
        .then(() => res.json(responseData))
        .catch(error => res.json(error))
    })
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