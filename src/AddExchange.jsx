import React from "react";
import ExchangeLogo from "./ExchangeLogo";

class AddExchange extends React.Component {
  constructor(props) {
    super(props)
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleAddAccount.bind(this);
    this.state = {
      exchange: 'Binance',
      apiKey: '',
      secretKey: '',
      passpharse: ''
    }
  }

  handleInput(e) {
    const id = e.target.id;
    this.setState({
      [id]: e.target.value
    })
  }

  handleAddAccount(e) {
    const { exchange, s_key, a_key } = this.state
    const data = {
      exchange: exchange,
      API_KEY: a_key,
      SECRET_KEY: s_key
    }
    axios.post('/addkey', data)
      .then(() => {
        this.setState({
          addExchange: false,
          buttonLabel: 'ADD EXCHANGE',
          exchange: '',
          a_key: '',
          s_key: ''
        })
      })
      .catch(err => err)
  }


  render() {
    return (
      <div id='add-account'>
        <h1> ADD ACCOUNT </h1>
        <button onClick={this.props.handleClick}>MAIN PAGE</button><br></br>
        <div className="input-keys">
          <ExchangeLogo exchange={this.state.exchange}/>
          <div className="select-exchange-option">
            <select id='exchange' value={this.state.exchange} onChange={this.handleInput}>
              <option value="Binance">Binance</option>
              <option value="BinanceUS">BinanceUS</option>
              <option value="Coinbase">Coinbase</option>
              <option value="Kucoin">Kucoin</option>
              <option value="Gate.io">Gate.io</option>
            </select>
          </div>

          <div>
            <input type="text" id='a_key'
              placeholder='API_KEY'
              value={this.state.a_key}
              onChange={this.handleInput} />
          </div>
          <div>
            <input type="text" id='s_key'
              placeholder='SECRET_KEY'
              value={this.state.s_key}
              onChange={this.handleInput} />
          </div>
          <div className="add-account">
            <button onClick={this.handleAddAccount}>Add Account</button>
          </div>
        </div>
      </div>
    )
  }
}


export default AddExchange;