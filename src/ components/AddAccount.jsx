import React from "react";
import ExchangeLogo from "./ExchangeLogo";
import axios from "axios";
import './addAccount.css';
import AccountInfo from "./AccountInfo";


class AddAccount extends React.Component {
  constructor(props) {
    super(props)
    this.handleInput = this.handleInput.bind(this);
    this.handleAddAccount = this.handleAddAccount.bind(this);
    this.autoInputKeys = this.autoInputKeys.bind(this)
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
    const value = id === 'sandbox' ? e.target.checked : e.target.value;
    this.setState({
      [id]: value
    })
  }

  autoInputKeys(e) {
    if (e.target.value === 'Binance') {
      this.setState({
        exchange: e.target.value,
        apiKey: '7mkRbbrPtqAHMw4VIeHYNmEeczmg5UeeUXQO54bOvjReRjIkfZ9c7gimr8mMtFiq',
        secretKey: '2IjzxQClS3RxlMH3pFokDpdXUMdIufpgp6qivN9kRwtHYiJOS8W6YqIeAunrFqFN',
        sandbox: true
      })
    }
    if (e.target.value === 'BinanceUS') {
      this.setState({
        exchange: e.target.value,
        apiKey: 'DPHowXgRy80h9MBCaH8KXk3GPIMx25rScFaXz120TMsJEQNj1s7azowGkCEgfh1h',
        secretKey: 'o6Z7jr9BzsYBVsXp1XONaNLMu8AeIpqOaqgADXpox6WWBVM7ErAxmy7XKH7ITgd6',
        sandbox: false
      })
    }

    if (e.target.value === 'Kucoin') {
      this.setState({
        exchange: e.target.value,
        apiKey: '61f9ccd2b170ab000108e497',
        secretKey: '6edcf839-eccb-4ef0-83f4-04be7f23519b',
        passphrase: 'VinhNhu@0205',
        sandbox: false
      })
    }

    if (e.target.value === 'CoinbasePro') {
      this.setState({
        exchange: e.target.value,
        apiKey: '8966d631fcb3830a0ac4eb4fed7b754d',
        secretKey: 'BpJbqAVqlg7YGw0uRHr7i071cd3ORNlB+Ola4240ekCiSpDbzlUSY1qRuX3Ff3a6m7amoSZDRQIo2in3uSeftQ==',
        sandbox: true,
        passphrase: '1u0budpiwt6'
      })
    }

    if (e.target.value === 'Gate.io') {
      this.setState({
        exchange: e.target.value,
        apiKey: '714ffe6020e43996828ee5e8182eaa61',
        secretKey: '455311277a1d025ce0dd80af265c9edff0297cc1b67533d52f842500b63b80c8',
        sandbox: false
      })
    }

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
        if (result.data === 'keys are saved') {
          this.props.handleClick();
          this.props.fetchAccount();
        } else {
          this.setState({
            errorText: result.data,
            API_KEY: '',
            SECRET_KEY: '',
            passphrase: '',
            sandbox: false,
          })
        }
      })
      .catch(err => err)
  }


  render() {
    const { exchange, apiKey, secretKey, passphrase, sandbox, errorText } = this.state;
    let togglePassphrase = false;
    const exchangeNeedPassphrase = ['CoinbasePro', 'Kucoin']
    if (exchangeNeedPassphrase.includes(exchange)) {
      togglePassphrase = true;
    }
    return (
      <div id='add-account'>
        <div className="add-account-header">
          <span className='back-button' onClick={this.props.handleClick}>{'<'}</span>
          <h3 className="add-account-text">ADD ACCOUNT</h3>
        </div>
        <div className="input-keys">
          <ExchangeLogo exchange={exchange} />
          <AccountInfo
            exchange={exchange}
            handleInput={this.autoInputKeys}
            apiKey={apiKey}
            secretKey={secretKey}
            passphrase={passphrase}
            sandbox={sandbox}
          />
          {errorText && (<div className="error-text">{errorText}</div>)}
          <div className="add-account">
            <button onClick={this.handleAddAccount}>Add Account</button>
          </div>
        </div>
      </div>
    )
  }
}


export default AddAccount;