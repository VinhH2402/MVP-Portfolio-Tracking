import React from "react";
import 'regenerator-runtime/runtime.js';

class List extends React.Component {
  constructor(props) {
    super(props)
    this.cache = {}
    this.state = {
      account: [{
        asset: 'coin',
        free: 0,
        locked: 0,
        quantity: 0,
        price: 0,
        totalValue: 0
      }],
      accountBalance: 0
    }
  }

  componentDidMount() {
    const account = this.props.exchange.data;
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr')
    ws.onmessage = async (event) => {
      const priceData = JSON.parse(event.data);
      let accountBalance = 0;
      for (const pair of priceData) {
        for (const coin of account) {
          if (pair.s === coin.asset + 'USDT') {
            coin.price = parseFloat(Number(pair.c));
            coin.quantity = parseFloat(Number(coin.free) + Number(coin.locked))
            coin.totalValue = coin.quantity * coin.price;
            accountBalance += coin.totalValue;
          }
          if (coin.asset === 'USDT' || coin.asset === 'USD') {
            coin.price = 1;
            coin.quantity = parseFloat(Number(coin.free) + Number(coin.locked))
            coin.totalValue = coin.quantity * coin.price;
            accountBalance += coin.totalValue;
          }
        }
      }
      this.setState({
        account: account,
        accountBalance: accountBalance
      })

    }
  }

  render() {
    const account = this.state.account;
    let fontColor = 'black';
    const sortedAccount = account.sort((a, b) => {
      return b.totalValue - a.totalValue
    })
    return sortedAccount.map((coin, index) => {
      const { asset, price, quantity, totalValue } = coin
      const $total = new Intl.NumberFormat('en-US',
        { style: 'currency', currency: 'USD' }).format(totalValue);
      if (!this.cache[asset]) {
        this.cache[asset] = price;
      } else {
        if (this.cache[asset] > price) {
          fontColor = 'red';
        };
        if (this.cache[asset] < price) {
          fontColor = 'green';
        };
        if (this.cache[asset] === price) {
          fontColor = 'black';
        };
        this.cache[asset] = price;
      }

      return (
        <tr key={index}>
          <td className='align_left' className='number'>{index + 1}</td>
          <td className='align_left'>{asset +'/USDT'}</td>
          <td>{quantity}</td>
          <td style={{ color: `${fontColor}` }}>{price}</td>
          <td>{$total}</td>
        </tr>
      )
    })
  }
}

export default List;