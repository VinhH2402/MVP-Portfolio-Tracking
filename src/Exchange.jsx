import React from 'react';
import TableHeader from './TableHeader';

function Exchange(props) {
  const { exchanges, total } = props;
  return exchanges.map(exchange => {
    const exchangeName = exchange.name.toUpperCase();
    return (
      <div key={exchange.name}>
        <table id='exchange_name'>
          <tbody>
            <tr>
              <td className='exchange_name'>{exchangeName}</td>
              <td className='exchange_total'>{total[exchange.name]}</td>
            </tr>
          </tbody>
        </table>
        <TableHeader exchange={exchange} />
      </div>
    );
  })
}


export default Exchange;