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
      this.getData = this.getData.bind(this);
      this.getTotalAssets = this.getTotalAssets.bind(this);
      this.removeExchange = this.removeExchange.bind(this);
      this.state = {
         addExchange: true,
         buttonLabel: 'ADD EXCHANGE',
         exchange: '',
         a_key: '',
         s_key: '',
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

   getData() {
      const exchanges = [];
      const promises = [];
      axios.get('/exchanges')
         .then(res => {
            const allexchanges = res.data
            allexchanges.forEach((exchange, index) => {
               promises.push(axios.get(`/${exchange}`)
                  .then(result => {
                     exchanges.push({ id: index, name: exchange, data: result.data })
                  })
               )
            })
            Promise.all(promises)
               .then(() => {
                  const sortExchanges = exchanges.sort((a, b) => a.id - b.id)
                  this.setState({
                     exchanges: sortExchanges
                  })
               })
         })
   }

   removeExchange(e) {
      const exchangeName = e.target.id;
      console.log(exchangeName)
      axios.put('/remove', { exchangeName: exchangeName })
         .then(() => {
            this.getData();
         })
   }

   componentDidMount() {
      this.getData();
   }

   handleClick() {
      const { addExchange } = this.state;
      const buttonLabel = this.state.buttonLabel === 'BACK' ? 'ADD EXCHANGE' : 'BACK'
      this.setState({
         addExchange: !addExchange,
         buttonLabel: buttonLabel
      })
   }

   handleInput(e) {
      const id = e.target.id;
      this.setState({
         [id]: e.target.value
      })
   }

   handleSubmit(e) {
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
      const { addExchange, buttonLabel, exchanges, totalAssets } = this.state;
      return addExchange === false ?
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
                                 <button onClick={this.handleClick}>{buttonLabel}</button>
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
         (<AddAccount handleClick={this.handleClick}/>)
   }
}

export default App;