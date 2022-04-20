import React from "react";

function List(props) {
  return props.balances.map((ticker, index) => {
    const { symbol, price, total, totalValue } = ticker
    return (
      <tr key={index}>
        <td className='align-left'>{index + 1}</td>
        <td className='align-left'>{symbol}</td>
        <td>{parseFloat(total)}</td>
        <td>{price || 1}</td>
        <td>{totalValue}</td>
      </tr>
    )
  })
}

export default List;