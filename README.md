The problem is I have invested cryptocurrency in multiple exchanges, every time I want to check my investments I have to login to all accounts. So this web will help me to tracking all of my investments in one page.

Setup 
Clone repo
npm install
npm run start for the server and database
npm run bundle for webpack
In browser navigate to http://localhost:3000

Add Account 
Click on 'ADD ACCOUNT' will lead to add account page
Select exchange
Fill out 'API KEY' and 'SECRET KEY', some exchange will need 'Pass phrase'
If that is sandbox or testnet account check on sandbox
Click on 'Add Account' button:
  Have notification if that account is invalid or added
  Return to main page if that account id valid
  
Main page
Main page will show all crypto balances greater than 0 and calculate total value, total balances and total assets
Response from exchange may take couple second to get account balances.


