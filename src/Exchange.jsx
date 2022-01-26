import React from 'react';
import TableHeader from './TableHeader';

class Exchange extends React.Component {
  constructor(props) {
    super(props)
    this.getTotalBalance = this.getTotalBalance.bind(this);
    this.state = {}
  }

  getTotalBalance (total, exchange) {
    const currency = new Intl.NumberFormat('en-US',
        { style: 'currency', currency: 'USD' }).format(total);
    this.setState({
      [exchange.name] : currency
    })
  }

  render() {
    const { exchanges } = this.props;
    return exchanges.map(exchange => {
      const exchangeName = exchange.name;
      return (
        <div key={exchange.name}>
          <table id='exchange_name'>
            <tbody>
              <tr>
                <td className='exchange_name'>{exchangeName.toUpperCase()}</td>
                <td className='exchange_total'>{this.state[exchangeName]}</td>
              </tr>
            </tbody>
          </table>
          <TableHeader exchange={exchange} getTotalBalance={this.getTotalBalance}/>
        </div>
      );
    })

  }
}


export default Exchange;