import React from "react";
import List from "./List";

function TableHeader (props) {
  return (
    <table id="exchange_table">
          <tbody>
            <tr id="row0">
              <th className='number'>#</th>
              <th>Coin</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total Value</th>
            </tr>
            <List exchange={props.exchange}/>
          </tbody>
        </table>
  )
}

export default TableHeader;