import React from 'react';
import TableHeader from './TableHeader';
import axios from 'axios';
import 'regenerator-runtime/runtime.js';

class Exchange extends React.Component {
  constructor(props) {
    super(props)
    this.getExchangesBalances = this.getExchangesBalances.bind(this);
    this.state = {
      exchanges: this.props.exchanges
    }
  }

  componentDidMount() {
    this.getExchangesBalances();
  }

  componentDidUpdate() {
    if(this.props.exchanges.length !== this.state.exchanges.length) {
      this.getExchangesBalances();
    }
  }

  getPrices(exchangeName) {
    return axios.get('/fetchprices', { params: { exchangeName: exchangeName } })
      .then(prices => prices.data)
      .catch(error => null)
  }
  
  findPrice(ticker, prices) {
    if (ticker === 'USDT') {
      return 1;
    } 
    if (ticker === 'USD') {
      return 1;
    } 
    return prices[ticker + '/USDT'].close;
  }

  calculateBalances (exchange, prices) {
     let totalBalances = 0;
     let balances = exchange.balances;
     balances.forEach(item => {
      const price = this.findPrice(item.currency, prices);
      const total = Number(price) * Number(item.balance);
      item.price = price;
      item.totalValue = new Intl.NumberFormat('en-US',
      { style: 'currency', currency: 'USD' }).format(total);
      totalBalances += total;
    })
    exchange.totalBalances = totalBalances;
    return exchange;
  }


  async getExchangesBalances () {
    const {exchanges} = this.props;
    let totalAssets = 0;
    const prices = await this.getPrices()
    for (const ex in exchanges) {
      const exchangePrices = prices[exchanges[ex].exchangeName]
      const exchange = this.calculateBalances(exchanges[ex], exchangePrices);
      totalAssets += exchange.totalBalances;
    }
    this.props.getTotalAssets(totalAssets)
    this.setState({exchanges: exchanges})
  }


  render() {
    const {removeAccount } = this.props;
    const {exchanges} = this.state;
    return exchanges.map(exchange => {
      const exchangeName = exchange.exchangeName;
      const currencyTotal = new Intl.NumberFormat('en-US',
        { style: 'currency', currency: 'USD' }).format(exchange.totalBalances);
      return (
        <div key={exchange.id}>
          <table id='exchange_name'>
            <tbody>
              <tr>
                <td className='exchange_name'>{exchangeName.toUpperCase()}</td>
                <td className='exchange_total'>{currencyTotal}</td>
                <td className='remove-account'>
                  <div>
                    <button id={exchange.id} onClick={removeAccount}>REMOVE</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <TableHeader balances={exchange.balances}/>
        </div>
      );
    })

  }
}


export default Exchange;