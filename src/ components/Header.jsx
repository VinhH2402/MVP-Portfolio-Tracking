import React from "react";

const Header = (props) => {
  const { totalAssets, handleClick } = props
  return (
    <><h1>PORTFOLIO TRACKING</h1><div>
      <div id="total-assets">
        <div className='total-assets'>TOTAL ASSETS</div>
        <div className='assets-number'>{totalAssets}</div>
        <div className='add-exchange'>
          <button onClick={handleClick}>ADD ACCOUNT</button>
        </div>
      </div>
    </div></>
  )
}

export default Header;