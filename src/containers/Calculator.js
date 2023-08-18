import React from 'react'
import LaminatedList from '../components/LaminatedList'
import ScrapsInput from '../components/ScrapsInput';
import EodScrapList from '../components/EodScrapList';
import './Calculator.css'
import Splitter from '../components/Splitter';
import ScrapLaminatedProductList from '../components/ScrapLaminatedProductList';
import TotalDoughsDisplay from '../components/TotalDoughsDisplay';
import DoughsToMix from '../components/DoughsToMix';

const Calculator = ({products, updateProduct, setScraps, eodScrapProducts, scrapDoughs, doughsToMix, scrapLaminatedProducts}) => {

let totalDoughs = doughsToMix + scrapDoughs;


  return (
    <>
    <div className='calc-grid-container'>
        
        <div className='laminated-box'>
          <LaminatedList products={products} updateProduct={updateProduct}/>
          <br></br>
          <ScrapLaminatedProductList scrapLaminatedProducts={scrapLaminatedProducts} updateProduct={updateProduct}/>
          <br></br>
          <Splitter/>
        </div>
        
        <div className='side-bar'>
          <ScrapsInput  setScraps={setScraps}/>
          <EodScrapList  eodScrapProducts={eodScrapProducts} updateProduct={updateProduct}/>
          <TotalDoughsDisplay scrapDoughs={scrapDoughs} totalDoughs={totalDoughs}/>
          <DoughsToMix doughsToMix={doughsToMix}/>
        </div>
    </div>
    </>
  )
}

export default Calculator;