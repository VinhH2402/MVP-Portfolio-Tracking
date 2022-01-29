import React from "react";

const ExchangeLogo = (props) => {
  const logoURL = {
    binance: 'https://i.ibb.co/vVMFdqz/Binance-Logo.png',
    kucoin: 'https://i.ibb.co/MMQXyPc/download.png',
    coinbase: 'https://i.ibb.co/1Lp5vNZ/Coinbase-Logo.png',
    gateio: 'https://i.ibb.co/Kjy1sqz/1628073447307621687gateio-h-4.png',
    binanceus: 'https://i.ibb.co/Jt7CGpD/binanceus7514.jpg'
  }
  const exchange = props.exchange.toLowerCase().replace('.', '');
  const url = logoURL[exchange];

  return (
    <div className="exchange-logo">
      <img src={url}></img>
    </div>
  )
}

export default ExchangeLogo;