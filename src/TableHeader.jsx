import React from "react";
import List from "./List";

function TableHeader (props) {
  return (
    <table id="exchange_table">
          <tbody>
            <tr id="row0">
              <th className='number'>#</th>
              <th className="coin-name">Coin</th>
              <th className="quantity">Quantity</th>
              <th className="price">Price</th>
              <th className="total-value">Total Value</th>
            </tr>
            <List exchange={props.exchange} getTotalBalance={props.getTotalBalance}/>
          </tbody>
        </table>
  )
}

export default TableHeader;