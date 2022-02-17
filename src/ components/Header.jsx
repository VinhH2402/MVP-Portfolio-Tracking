import React from "react";

const Header = (props) => {
  const {totalAssets, handleClick} = props
  return (
    <><h1>PORTFOLIO TRACKING</h1><div>
      <table id="total_assets">
        <tbody>
          <tr>
            <td className='total_assets'>TOTAL ASSETS</td>
            <td className='assets_number'>{totalAssets}</td>
            <td>
              <div className='add_exchange'>
                <button onClick={handleClick}>ADD ACCOUNT</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div></>
  )
}

export default Header;