import React from "react";
import coinbaseLogo from "../logo/coinbasepro_logo.png";
import gateioLogo from "../logo/gateio_logo.png";
import binanceusLogo from "../logo/binanceus_logo.png";
import kucoinLogo from "../logo/kucoin_logo.png"
import binanceLogo from "../logo/binance_logo.png"

const ExchangeLogo = (props) => {
  const logoURL = {
    binance: binanceLogo,
    kucoin: kucoinLogo,
    coinbasepro: coinbaseLogo,
    gateio: gateioLogo,
    binanceus: binanceusLogo
  }
  const exchange = props.exchange.toLowerCase().replace('.', '');
  const url = logoURL[exchange]

  return (
    <div className="exchange-logo">
      <img alt={exchange} src={url}></img>
    </div>
  )
}

export default ExchangeLogo;