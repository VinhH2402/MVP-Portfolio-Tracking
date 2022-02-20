import React from "react";

function List(props) {
  return props.balances.map((ticker, index) => {
    const { currency, price, balance, totalValue } = ticker
    // const total = new Intl.NumberFormat('en-US',
    //   { style: 'currency', currency: 'USD' }).format(totalValue);
    return (
      <tr key={index}>
        <td className='align_left' className='number'>{index + 1}</td>
        <td className='align_left'>{currency}</td>
        <td>{parseFloat(balance)}</td>
        <td>{price}</td>
        <td>{totalValue}</td>
      </tr>
    )
  })
}

export default List;