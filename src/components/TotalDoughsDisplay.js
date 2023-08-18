import React from 'react'
import './SideInput.css'

const TotalDoughsDisplay = ({totalDoughs, scrapDoughs}) => {
  return (
    <div className='side box'>
    <div><p>Scrap Doughs:</p> <h2>{scrapDoughs}</h2></div>
    <div><p>Total Doughs:</p> <h2>{totalDoughs}</h2></div>
    </div>
  )
}

export default TotalDoughsDisplay