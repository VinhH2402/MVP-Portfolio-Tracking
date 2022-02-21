import React from "react";

const SelectExchange = (props) => {
  const options = ['Binance', 'BinanceUS', 'CoinbasePro', 'Kucoin', 'Gate.io'];
  const {togglePassphrase, handleInput, exchange, apiKey, secretKey, passphrase, sandbox} = props
  console.log(togglePassphrase)
  return (
    <><div className="select-exchange-option">
      <select id='exchange' value={exchange} onChange={handleInput}>
        {options.map(option => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div><div>
        <input type="text" id='apiKey'
          placeholder='API_KEY'
          value={apiKey}
          onChange={handleInput} />
      </div><div>
        <input type="text" id='secretKey'
          placeholder='SECRET_KEY'
          value={secretKey}
          onChange={handleInput} />
      </div>
      {togglePassphrase &&
        <div>
          <input type="password" id='passphrase'
            placeholder='pass phrase'
            value={passphrase}
            onChange={handleInput} />
        </div>
      }
      <div className="sandbox-check">
            <label>
              <input type="checkbox" id='sandbox'
                value={sandbox}
                onChange={handleInput} />
              Sandbox
            </label>
          </div>
    </>

  )
}

export default SelectExchange;