import React from 'react';
import TableHeader from './TableHeader';

class Exchange extends React.Component {
  constructor(props) {
    super(props)
    this.getTotalBalance = this.getTotalBalance.bind(this);
    this.state = {}
  }

  getTotalBalance(accountBalance, exchangeName) {
    this.state[exchangeName] = accountBalance;
    let totalAssets = 0;
    for (const key in this.state) {
      totalAssets += this.state[key]
    }
    this.props.getTotalAssets(totalAssets)
    this.setState({
      [exchangeName]: accountBalance
    })
  }

  render() {
    const { exchanges, removeAccount } = this.props;
    return exchanges.map(exchange => {
      const exchangeName = exchange.exchangeName;
      const currencyTotal = new Intl.NumberFormat('en-US',
        { style: 'currency', currency: 'USD' }).format(this.state[exchangeName]);
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
          <TableHeader exchange={exchange} getTotalBalance={this.getTotalBalance} />
        </div>
      );
    })

  }
}


export default Exchange;