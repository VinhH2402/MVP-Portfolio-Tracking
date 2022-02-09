import React from "react";
import axios from "axios";

class List extends React.Component {
  constructor(props) {
    super(props)
    this._isMount = true;
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

  async getSymbolInfo () {
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
    this.props.getTotalBalance(exchangeTotal, exchangeName);
    if(this._isMount) {
      this.setState({
        accountBalances: accountBalances
      });
    }
  }

  componentDidMount() {
    this.getSymbolInfo();
  }

  componentWillUnmount() {
    this._isMount = false;
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