import React from 'react'
import LaminatedList from '../components/LaminatedList'
import ScrapsInput from '../components/ScrapsInput';
import EodScrapList from '../components/EodScrapList';
import './Calculator.css'

const Calculator = ({products, updateProduct, setScraps, eodScrapProducts, scrapDoughs, doughsToMix}) => {

let totalDoughs = doughsToMix + scrapDoughs;


  return (
    <>
    <div className='calc-grid-container'>
    <div className='laminated-box'><LaminatedList products={products} updateProduct={updateProduct}/></div>
    <div className='scraps-input-box'><ScrapsInput  setScraps={setScraps}/></div>
    <div className='eod-scraps-box'><EodScrapList  eodScrapProducts={eodScrapProducts} updateProduct={updateProduct}/></div>
    <div><p>Total Doughs:</p> <h2>{totalDoughs}</h2></div>
    <div><p>Scrap Doughs:</p> <h2>{scrapDoughs}</h2></div>
    <span><p>Doughs to mix:</p><h1>{doughsToMix}</h1></span>
    </div>
    </>
  )
}

export default Calculator;