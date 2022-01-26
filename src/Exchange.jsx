import React from 'react';
import TableHeader from './TableHeader';

class Exchange extends React.Component {
  constructor(props) {
    super(props)
    this.getTotalBalance = this.getTotalBalance.bind(this);
    this.state = {
      totalValue: 0
    }
  }

  getTotalBalance (total) {
    const currency = new Intl.NumberFormat('en-US',
        { style: 'currency', currency: 'USD' }).format(total);
    this.setState({
      totalBalance: currency
    })
  }

  render() {
    const { exchanges } = this.props;
    const { totalBalance } = this.state
    return exchanges.map(exchange => {
      const exchangeName = exchange.name.toUpperCase();
      return (
        <div key={exchange.name}>
          <table id='exchange_name'>
            <tbody>
              <tr>
                <td className='exchange_name'>{exchangeName}</td>
                <td className='exchange_total'>{totalBalance}</td>
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