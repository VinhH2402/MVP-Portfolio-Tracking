import React from "react";
import ExchangeLogo from "./ExchangeLogo";
import axios from "axios";

class AddAccount extends React.Component {
  constructor(props) {
    super(props)
    this.handleInput = this.handleInput.bind(this);
    this.handleAddAccount = this.handleAddAccount.bind(this);
    this.state = {
      exchange: 'Binance',
      apiKey: '',
      secretKey: '',
      passphrase: '',
      sandbox: false,
      errorText: ''
    }
  }

  handleInput(e) {
    const id = e.target.id;
    this.setState({
      [id]: e.target.value
    })
  }

  handleAddAccount(e) {
    const { exchange, apiKey, secretKey, passphrase, sandbox } = this.state
    const data = {
      exchange: exchange,
      API_KEY: apiKey,
      SECRET_KEY: secretKey,
      passphrase: passphrase,
      sandbox: sandbox
    }
    axios.post('/addAccount', data)
      .then((result) => {
        this.setState({
          errorText: result.data
        })
        // this.setState({
        //   addExchange: false,
        //   buttonLabel: 'ADD EXCHANGE',
        //   exchange: '',
        //   a_key: '',
        //   s_key: ''
        // })
      })
      .catch(err => err)
  }


  render() {
    const { exchange, apiKey, secretKey, passphrase, sandbox, errorText } = this.state;
    let togglePassphrase = false;
    const exchangeNeedPassphrase = ['Coinbase','Kucoin']
    if(exchangeNeedPassphrase.includes(exchange)) {
      togglePassphrase = true;
    }
    return (
      <div id='add-account'>
        <h1> ADD ACCOUNT </h1>
        <button onClick={this.props.handleClick}>MAIN PAGE</button><br></br>
        <div className="input-keys">
          <ExchangeLogo exchange={exchange} />
          <div className="select-exchange-option">
            <select id='exchange' value={exchange} onChange={this.handleInput}>
              <option value="Binance">Binance</option>
              <option value="BinanceUS">BinanceUS</option>
              <option value="Coinbase">Coinbase</option>
              <option value="Kucoin">Kucoin</option>
              <option value="Gate.io">Gate.io</option>
            </select>
          </div>

          <div>
            <input type="text" id='apiKey'
              placeholder='API_KEY'
              value={apiKey}
              onChange={this.handleInput} />
          </div>
          <div>
            <input type="text" id='secretKey'
              placeholder='SECRET_KEY'
              value={secretKey}
              onChange={this.handleInput} />
          </div>
          {togglePassphrase ?
            <div>
              <input type="text" id='passphrase'
                placeholder='passphrase'
                value={passphrase}
                onChange={this.handleInput} />
            </div> :
            null
          }
          <div className="sandbox-check">
            <label>
              <input type="checkbox" id='sandbox'
                value={sandbox}
                onChange={this.handleInput} />
              Sandbox
            </label>
          </div>
          {errorText ? <div className="error-text">{errorText}</div> : null}
          <div className="add-account">
            <button onClick={this.handleAddAccount}>Add Account</button>
          </div>
        </div>
      </div>
    )
  }
}


export default AddAccount;