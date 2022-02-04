import axios from 'axios';
import React from 'react';
import Exchange from './Exchange';
import './style.css';
import AddAccount from './AddAccount';


class App extends React.Component {
   constructor() {
      super()
      this.handleClick = this.handleClick.bind(this);
      this.handleInput = this.handleInput.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.fetchData = this.fetchData.bind(this);
      this.getTotalAssets = this.getTotalAssets.bind(this);
      this.removeExchange = this.removeExchange.bind(this);
      this.state = {
         addAccount: false,
         exchange: '',
         apiKey: '',
         secretKey: '',
         exchanges: [],
         totalAssets: 0
      }
   }

   getTotalAssets(total) {
      const totalAssets = new Intl.NumberFormat('en-US',
         { style: 'currency', currency: 'USD' }).format(total);
      this.setState({
         totalAssets: totalAssets
      })
   }

   fetchData() {
      axios.get('/fetchdata')
         .then(res => {
            this.setState({
               exchanges: res.data
            })
         })
   }

   removeExchange(e) {
      const exchangeName = e.target.id;
      console.log(exchangeName)
      axios.put('/remove', { exchangeName: exchangeName })
         .then(() => {
            this.fetchData();
         })
   }

   componentDidMount() {
      this.fetchData();
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
      const { addAccount, exchanges, totalAssets } = this.state;
      return addAccount === false ?
         (
            <div>
               <h1>PORTFOLIO TRACKING</h1>
               <div>
                  <table id="total_assets">
                     <tbody>
                        <tr>
                           <td className='total_assets'>TOTAL ASSETS</td>
                           <td className='assets_number'>{totalAssets}</td>
                           <td>
                              <div className='add_exchange'>
                                 <button onClick={this.handleClick}>ADD ACCOUNT</button>
                              </div>
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>
               <Exchange
                  exchanges={exchanges}
                  getTotalAssets={this.getTotalAssets}
                  removeExchange={this.removeExchange}
               />
            </div>
         )
         :
         (<AddAccount handleClick={this.handleClick} />)
   }
}

export default App;