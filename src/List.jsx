import React from "react";

class List extends React.Component {
  constructor(props) {
    super(props)
    this.cache= {}
    this.state = {
      account: [{
        asset: 'coin',
        free: 0,
        locked: 0,
        price: 0
      }]
    }
  }

  componentDidMount() {
    this.setState({
      account: this.props.data
    })
  }

  render() {
    const account = this.props.exchange.data;
    let fontColor = 'black';
    const sortedCoin = account.sort((a, b) => {
      return a.free - b.free
    })
    return sortedCoin.map((coin, index) => {
      const price = parseFloat(coin.price)
      const coinName = coin.asset
      const quality = parseFloat(Number(coin.free) + Number(coin.locked))
      const totalValue = (quality * Number(coin.price)).toFixed(4);
      const totalCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalValue);
      if(!this.cache[coinName]) {
        this.cache[coinName] = price;
      } else {
        if(this.cache[coinName] > price) {
          fontColor = 'red';
        };
        if(this.cache[coinName] < price) {
          fontColor = 'green';
        };
        if (this.cache[coinName] === price) {
          fontColor = 'black';
        };
        this.cache[coinName] = price;
      }
      
      return (
        <tr key={index}>
          <td className='align_left' className='number'>{index + 1}</td>
          <td className='align_left'>{coin.asset}</td>
          <td>{quality}</td>
          <td style={{color: `${fontColor}`}}>{price}</td>
          <td>{totalCurrency}</td>
        </tr>
      )
    })
  }
}

export default List;