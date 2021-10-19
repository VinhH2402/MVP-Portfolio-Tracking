const axios = require('axios');
const CryptoJS = require("crypto-js");
const db = require('../db')


const burl = 'https://api.binance.com';
const usdtPair = ["BTCUSDT","ETHUSDT","BNBUSDT","NEOUSDT","LTCUSDT","QTUMUSDT","ADAUSDT","XRPUSDT","EOSUSDT","IOTAUSDT","XLMUSDT","ONTUSDT","TRXUSDT","ETCUSDT","ICXUSDT","NULSUSDT","VETUSDT","USDCUSDT","LINKUSDT","WAVESUSDT","BTTUSDT","ONGUSDT","HOTUSDT","ZILUSDT","ZRXUSDT","FETUSDT","BATUSDT","XMRUSDT","ZECUSDT","IOSTUSDT","CELRUSDT","DASHUSDT","OMGUSDT","THETAUSDT","ENJUSDT","MATICUSDT","ATOMUSDT","TFUELUSDT","ONEUSDT","FTMUSDT","ALGOUSDT","GTOUSDT","DOGEUSDT","DUSKUSDT","ANKRUSDT","WINUSDT","COCOSUSDT","MTLUSDT","TOMOUSDT","PERLUSDT","DENTUSDT","KEYUSDT","DOCKUSDT","FUNUSDT","CHZUSDT","BANDUSDT","BUSDUSDT","BEAMUSDT","XTZUSDT","RENUSDT","RVNUSDT","HBARUSDT","NKNUSDT","STXUSDT","KAVAUSDT","ARPAUSDT","IOTXUSDT","RLCUSDT","BCHUSDT","TROYUSDT","VITEUSDT","FTTUSDT","USDTTRY","USDTRUB","EURUSDT","OGNUSDT","TCTUSDT","WRXUSDT","BTSUSDT","LSKUSDT","BNTUSDT","LTOUSDT","MBLUSDT","COTIUSDT","STPTUSDT","WTCUSDT","DATAUSDT","SOLUSDT","CTSIUSDT","HIVEUSDT","CHRUSDT","BTCUPUSDT","BTCDOWNUSDT","GXSUSDT","MDTUSDT","STMXUSDT","KNCUSDT","LRCUSDT","PNTUSDT","COMPUSDT","SCUSDT","ZENUSDT","SNXUSDT","ETHUPUSDT","ETHDOWNUSDT","ADAUPUSDT","ADADOWNUSDT","LINKUPUSDT","LINKDOWNUSDT","VTHOUSDT","DGBUSDT","SXPUSDT","MKRUSDT","STORJUSDT","BNBUPUSDT","BNBDOWNUSDT","XTZUPUSDT","XTZDOWNUSDT","MANAUSDT","AUDUSDT","YFIUSDT","BALUSDT","BLZUSDT","IRISUSDT","KMDUSDT","USDTDAI","JSTUSDT","SRMUSDT","CRVUSDT","SANDUSDT","OCEANUSDT","NMRUSDT","DOTUSDT","LUNAUSDT","RSRUSDT","PAXGUSDT","WNXMUSDT","TRBUSDT","BZRXUSDT","SUSHIUSDT","YFIIUSDT","KSMUSDT","EGLDUSDT","RUNEUSDT","UMAUSDT","EOSUPUSDT","EOSDOWNUSDT","TRXUPUSDT","TRXDOWNUSDT","XRPUPUSDT","XRPDOWNUSDT","DOTUPUSDT","DOTDOWNUSDT","BELUSDT","UNIUSDT","NBSUSDT","OXTUSDT","SUNUSDT","AVAXUSDT","HNTUSDT","FLMUSDT","UNIUPUSDT","UNIDOWNUSDT","ORNUSDT","UTKUSDT","XVSUSDT","ALPHAUSDT","USDTBRL","AAVEUSDT","NEARUSDT","SXPUPUSDT","SXPDOWNUSDT","FILUSDT","FILUPUSDT","FILDOWNUSDT","YFIUPUSDT","YFIDOWNUSDT","INJUSDT","AUDIOUSDT","CTKUSDT","AKROUSDT","AXSUSDT","HARDUSDT","DNTUSDT","STRAXUSDT","UNFIUSDT","AVAUSDT","XEMUSDT","AAVEUPUSDT","AAVEDOWNUSDT","SKLUSDT","SUSHIUPUSDT","SUSHIDOWNUSDT","XLMUPUSDT","GRTUSDT","JUVUSDT","PSGUSDT","USDTBVND","1INCHUSDT","REEFUSDT","ATMUSDT","ASRUSDT","CELOUSDT","RIFUSDT","BTCSTUSDT","TRUUSDT","CKBUSDT","TWTUSDT","FIROUSDT","LITUSDT","SFPUSDT","DODOUSDT","CAKEUSDT","ACMUSDT","BADGERUSDT","FISUSDT","PONDUSDT","ALICEUSDT","LINAUSDT","PERPUSDT","RAMPUSDT","SUPERUSDT","CFXUSDT","EPSUSDT","TLMUSDT","1INCHUPUSDT","1INCHDOWNUSDT","BTGUSDT","FORTHUSDT","BAKEUSDT","BURGERUSDT","SLPUSDT","SHIBUSDT","ICPUSDT","ARUSDT","POLSUSDT","MDXUSDT","MASKUSDT","LPTUSDT","NUUSDT","XVGUSDT","ATAUSDT","GTCUSDT","TORNUSDT","KEEPUSDT","ERNUSDT","KLAYUSDT","DEXEUSDT","C98USDT","CLVUSDT","FLOWUSDT","TVKUSDT","MINAUSDT","RAYUSDT","FARMUSDT","MBOXUSDT","FORUSDT","WAXPUSDT","TRIBEUSDT","XECUSDT","ELFUSDT","DYDXUSDT","POLYUSDT","IDEXUSDT","VIDTUSDT","GALAUSDT","YGGUSDT","DFUSDT","FIDAUSDT","FRONTUSDT","AGLDUSDT","RADUSDT","BETAUSDT","RAREUSDT"]
let secretKey;
let apiKey;

db.Keys.findOne({ exchange: 'Binance' })
  .then(result => {
    if (result) {
      secretKey = result.SECRET_KEY;
      apikey = result.API_KEY;
    }
  })



const getBlances = () => {
  const endpoint = '/api/v3/account';
  const timestamp = 'timestamp=' + Date.now();
  const signature = CryptoJS.HmacSHA256(timestamp, secretKey).toString(CryptoJS.enc.Hex)
  const url = burl + endpoint + '?' + timestamp + '&signature=' + signature;
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
  db.Keys.findOne({ exchange: 'Binance' })
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




module.exports = { account, getTime , getPrice}

