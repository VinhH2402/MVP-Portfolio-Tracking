# Portfolio Tracking
The problem is I have invested cryptocurrency in multiple exchanges, every time I want to check my investments I have to check on each particular exchange.
Portfolio Tracking is an web app able to tracking all investments in one page.

## Setup 
Clone repo
* npm install
* npm run start for the server and database
* npm run bundle for webpack
* In browser navigate to http://localhost:3000

## Main page
* Main page will show all crypto balances greater than 0 and calculate total value, total balances and total assets.
* Response from exchanges API may take couple second to get account balances.
![alt text](https://i.ibb.co/vc5NxfL/Screen-Shot-2022-02-20-at-10-51-02-AM.jpg)
* main page diagram
![alt text](https://i.ibb.co/XkfMxNr/Screen-Shot-2022-02-20-at-11-10-45-AM.jpg)

## Add Account page
![alt text](https://i.ibb.co/j8mHJNH/Screen-Shot-2022-02-20-at-10-51-12-AM.jpg)
* Click on 'ADD ACCOUNT' will lead to add account page 
* Select exchange
* Fill out 'API KEY' and 'SECRET KEY', some exchange will need 'Pass phrase'
* If that is sandbox or testnet account check on sandbox
* Click on 'Add Account' button:
  * Have notification if that account is invalid or added
  * Return to main page if that account id valid

* add account diagram
![alt text](https://i.ibb.co/CmH0mQg/Screen-Shot-2022-02-20-at-10-59-41-AM.jpg)



