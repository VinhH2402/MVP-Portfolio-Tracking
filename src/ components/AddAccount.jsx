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
            handleInput={this.handleInput}
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