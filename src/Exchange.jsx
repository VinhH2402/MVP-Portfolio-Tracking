import React from 'react';
import TableHeader from './TableHeader';

class Exchange extends React.Component {
  constructor(props) {
    super(props)
    this.getTotalBalance = this.getTotalBalance.bind(this);
    this.state = {}
  }

  getTotalBalance(total, exchange) {
    this.state[exchange.name] = total;
    let totalAssets = 0;
    for (const key in this.state) {
      totalAssets += this.state[key]
    }
    this.props.getTotalAssets(totalAssets)
    this.setState({
      [exchange.name]: total
    })
  }

  render() {
    const { exchanges } = this.props;
    return exchanges.map(exchange => {
      const exchangeName = exchange.name;
      const currency = new Intl.NumberFormat('en-US',
        { style: 'currency', currency: 'USD' }).format(this.state[exchangeName]);
      return (
        <div key={exchange.name}>
          <table id='exchange_name'>
            <tbody>
              <tr>
                <td className='exchange_name'>{exchangeName.toUpperCase()}</td>
                <td className='exchange_total'>{currency}</td>
                <td className='remove-exchange'>
                  <div>
                    <button id={exchangeName} onClick={this.props.removeExchange}>REMOVE</button>
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