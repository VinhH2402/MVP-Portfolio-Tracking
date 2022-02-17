
module.exports = {
  coinbasepro: function (data) {
    const filtedData = data.info.filter(symbol => symbol.balance > 0)
    return filtedData
  },

  binance: function (data) {
    const filtedData = [];
    for(symbol in data.total) {
      if(data.total[symbol] > 0) {
        filtedData.push({currency: symbol, balance: data.total[symbol]})
      }
    }
    return filtedData;
  },

  binanceus: function (data) {
    const filtedData = [];
    for (symbol in data.total) {
      if (data.total[symbol] > 0) {
        filtedData.push({ currency: symbol, balance: data.total[symbol] })
      }
    }
    return filtedData;
  },

  kucoin: function (data) {
    const filtedData = data.info.data.filter(symbol => Number(symbol.balance) > 0)
    return filtedData;
  },
  
  gateio: function (data) {
    const filtedData = [];
    data.info.forEach(item => {
      const total = Number(item.available) + Number(item.locked);
      if (total > 0) {
        filtedData.push({
          currency: item.currency,
          balance: total
        })
      }
      return filtedData;
    })
    return filtedData;
  }
}
