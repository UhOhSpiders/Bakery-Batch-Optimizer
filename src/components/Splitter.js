import React from 'react'
import './LaminatedList.css'
import SplitProduct from './SplitProduct'

const Splitter = ({splits, updateSplitProduct}) => {
    const listItems = splits.map((splitProduct, id) => {
      return <SplitProduct splitProduct={splitProduct} key={id} updateSplitProduct={updateSplitProduct}/>
    })

  return (
    <>
    <div className='splitter-grid-container'>
      <header><h2>Optional Splits</h2><p>Combine two products into a single sheet to save time.</p></header>
    <hr className='hr'></hr>
      
      {splits.length > 0 ? listItems : <p className='no-splits'> No splits available. </p>}
      
      </div>
    </>
  )
}

export default Splitter