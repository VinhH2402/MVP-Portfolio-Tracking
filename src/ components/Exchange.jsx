import React from 'react';
import TableHeader from './TableHeader';
import 'regenerator-runtime/runtime.js';

const Exchange = (props) => {
  const { removeAccount, exchanges } = props;
  return exchanges.map(exchange => {
    const exchangeName = exchange.exchangeName.toUpperCase();
    const exchangeTotal = new Intl.NumberFormat('en-US',
      { style: 'currency', currency: 'USD' }).format(exchange.exchangeTotal);
    return (
      <div key={exchange.id}>
        <div id='exchange'>
          <div className='exchange-name'>{exchangeName}</div>
          <div className='exchange-total'>{exchangeTotal}</div>
          <div className='remove-account'>
            <button id={exchange.id} onClick={removeAccount}>REMOVE</button>
          </div>
        </div>
        <TableHeader balances={exchange.balances} />
      </div>
    );
  })
}

export default Exchange;