import React from "react";
import 'regenerator-runtime/runtime.js';
import axios from "axios";

class List extends React.Component {
  constructor(props) {
    super(props)
    this.exchangeTotal = 0;
    this.state = {
      accountBalances: [],
      prices: [],
      totalExchanges: null
    }
  }

  async getPrices(exchangeName) {
    return axios.get('/fetchprices', { params: { exchangeName: exchangeName } })
      .then(prices => prices.data)
      .catch(error => null)
  }

  makePair(currency) {
    if (currency === 'USD') {
      return 'USDT/USD';
    }
    if (currency === 'USDT') {
      return 'USDT';
    }
    return currency + '/USDT';
  }

  findPrice(pair, prices) {
    let price;
    if (pair === 'USDT') {
      price = 1;
    } else {
      price = prices[pair].close;
    }
    return price;
  }

  async getSymbolInfo() {
    let accountBalances = this.props.exchange.balances;
    const exchangeName = this.props.exchange.exchangeName;
    const prices = await this.getPrices(exchangeName);
    if(prices) {
      let totalBalances = 0;
      accountBalances.forEach(item => {
        const pair = this.makePair(item.currency);
        const price = this.findPrice(pair, prices);
        item.price = price;
        item.totalValue = Number(price) * Number(item.balance);
        totalBalances += item.totalValue;
      })
      this.props.getTotalBalance(totalBalances, exchangeName);
      this.setState({
        accountBalances: accountBalances,
        totalExchanges: this.props.totalExchanges
      });
    }
  }

  componentDidMount() {
    this.getSymbolInfo();
  }


  render() {
    console.log('>>>>>>>>>>>>>>>>>>>.', this.props.totalExchanges)
    const accountBalances = this.state.accountBalances;
    return accountBalances.map((coin, index) => {
      const { currency, price, balance, totalValue } = coin
      const total = new Intl.NumberFormat('en-US',
        { style: 'currency', currency: 'USD' }).format(totalValue);

      return (
        <tr key={index}>
          <td className='align_left' className='number'>{index + 1}</td>
          <td className='align_left'>{currency}</td>
          <td>{parseFloat(balance)}</td>
          <td>{price}</td>
          <td>{total}</td>
        </tr>
      )
    })
  }
}

export default List;