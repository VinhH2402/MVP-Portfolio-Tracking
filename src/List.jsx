import React from "react";
import 'regenerator-runtime/runtime.js';
import axios from "axios";

class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      accountBalances: []
    }
  }

  async pricesApi (exchangeName) {
    return axios.get('/fetchprices', { params: { exchangeName: exchangeName } })
      .then(prices => prices.data)
  } 

  makePair (currency) {
    if (currency === 'USD') {
      return 'USDT/USD';
    } 
    if (currency === 'USDT') {
      return 'USDT';
    }
    return currency + '/USDT';
  }

  findPrice (pair, prices) {
    let price;
    if(pair === 'USDT') {
      price = 1;
    } else {
      price = prices[pair].close;
    }
    return price;
  }

  async componentDidMount() {
    let accountBalances = this.props.exchange.balances;
    const exchangeName = this.props.exchange.exchangeName;
    const prices = await this.pricesApi(exchangeName);
    let exchangeTotal = 0;
    accountBalances.forEach(item => {
      const pair = this.makePair(item.currency);
      const price = this.findPrice(pair, prices);
      item.price = price;
      item.totalValue = Number(price) * Number(item.balance);
      exchangeTotal += item.totalValue;
    })
    this.props.getTotalBalance(exchangeTotal, exchangeName)
    this.setState({
      accountBalances: accountBalances
    })

    //websocket
    // const ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr')
    // ws.onmessage = async (event) => {
    //   const priceData = JSON.parse(event.data);
    //   let accountBalance = 0;
    //   for (const pair of priceData) {
    //     for (const coin of account) {
    //       if (pair.s === coin.asset + 'USDT') {
    //         coin.price = parseFloat(Number(pair.c));
    //         coin.quantity = parseFloat(Number(coin.free) + Number(coin.locked))
    //         coin.totalValue = coin.quantity * coin.price;
    //       }
    //       if (coin.asset === 'USDT' || coin.asset === 'USD' || coin.asset === 'BUSD') {
    //         coin.price = 1;
    //         coin.quantity = parseFloat(Number(coin.free) + Number(coin.locked))
    //         coin.totalValue = coin.quantity * coin.price;
    //       }
    //     }
    //   }
    //   account.forEach(item => {
    //     accountBalance += item.totalValue
    //   })
    //   this.props.getTotalBalance(accountBalance, this.props.exchange.exchangeName)
    // }
  }

  render() {
    const accountBalances = this.state.accountBalances;
    let fontColor = 'black';
    const sortedAccount = accountBalances.sort((a, b) => {
      return b.totalValue - a.totalValue
    })
    return sortedAccount.map((coin, index) => {
      const { currency, price, balance, totalValue } = coin
      const total = new Intl.NumberFormat('en-US',
        { style: 'currency', currency: 'USD' }).format(totalValue);

      return (
        <tr key={index}>
          <td className='align_left' className='number'>{index + 1}</td>
          <td className='align_left'>{currency}</td>
          <td>{parseFloat(balance)}</td>
          <td style={{ color: `${fontColor}` }}>{price}</td>
          <td>{total}</td>
        </tr>
      )
    })
  }
}

export default List;