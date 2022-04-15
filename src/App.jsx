import axios from 'axios';
import React from 'react';
import Exchange from './ components/Exchange';
import AddAccount from './ components/AddAccount';
import Header from './ components/Header';
import './style.css';


class App extends React.Component {
   constructor() {
      super()
      this.handleClick = this.handleClick.bind(this);
      this.handleInput = this.handleInput.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.fetchAccount = this.fetchAccount.bind(this);
      this.removeAccount = this.removeAccount.bind(this);
      this.state = {
         addAccount: false,
         exchange: '',
         apiKey: '',
         secretKey: '',
         exchanges: [],
      }
   }

   async fetchAccount() {
      try {
         const exchanges = await axios.get('/exchanges')
         this.setState({
            exchanges: exchanges.data
         })
         const newExchanges = await axios.get('/update')
         this.setState({
            exchanges: newExchanges.data
         })
      } catch (err) {
         console.log(error);
      }
   }

   removeAccount(e) {
      const id = e.target.id;
      axios.put('/remove', { id: id })
         .then(() => {
            let exchanges = this.state.exchanges;
            exchanges = exchanges.filter(exchange => exchange.id !== id)
            this.setState({
               exchanges: exchanges
            })
         })
         .catch(error => error)
   }

   componentDidMount() {
      this.fetchAccount();
   }

   handleClick() {
      const { addAccount } = this.state;
      this.setState({
         addAccount: !addAccount
      })
   }

   handleInput(e) {
      const id = e.target.id;
      this.setState({
         [id]: e.target.value
      })
   }

   handleSubmit(e) {
      const { exchange, secretKey, apiKey } = this.state
      const data = {
         exchange: exchange,
         API_KEY: apiKey,
         SECRET_KEY: secretKey
      }
      axios.post('/addkey', data)
         .then(() => {
            this.setState({
               addAccount: false,
               buttonLabel: 'ADD EXCHANGE',
               exchange: '',
               apiKey: '',
               secretKey: ''
            })
         })
         .catch(err => err)
   }

   render() {
      const { addAccount, exchanges } = this.state;
      let totalAssets = exchanges && exchanges.reduce((pre, cur) => pre + cur.exchangeTotal, 0);
      totalAssets = new Intl.NumberFormat('en-US',
         { style: 'currency', currency: 'USD' }).format(totalAssets);

      return addAccount ?
         (<AddAccount handleClick={this.handleClick} fetchAccount={this.fetchAccount} />)
         :
         (<div>
            <Header totalAssets={totalAssets || 0} handleClick={this.handleClick} />
            <Exchange
               exchanges={exchanges || []}
               getTotalAssets={this.getTotalAssets}
               removeAccount={this.removeAccount}
            />
         </div>)
   }
}

export default App;

