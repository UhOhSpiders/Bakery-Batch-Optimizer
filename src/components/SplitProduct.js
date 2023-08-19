import React from 'react'
import './LaminatedListItem.css'

const SplitProduct = ({splitProduct}) => {
  
    let filler = (1 - (1 - splitProduct.products[0].excessFraction) - (1 - splitProduct.products[1].excessFraction))/2
    let product0Percentage = (1 - splitProduct.products[0].excessFraction +filler)*100
    let product1Percentage = (1 - splitProduct.products[1].excessFraction +filler)*100
    
    let product0Style = {"width" : `${product0Percentage}%`}
    let product1Style = {"width" : `${product1Percentage}%`}
    
    return (
    <>
    <input type="checkbox" className='checkbox'></input>
    <div className='split-bar'>
        <div className='split product-0' style={product0Style}>{splitProduct.products[0].name}</div>
        <div className='split product-1' style={product1Style}>{splitProduct.products[1].name}</div>
    </div>
    <h1>1</h1>
    {splitProduct.scraps > 0 ? <p className='scraps pill'>  {splitProduct.scraps} Scrap </p> : <p className='no-scraps pill'>No scraps</p>}
    </>
  )
}

export default SplitProduct;