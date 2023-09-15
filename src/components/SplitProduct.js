import React, { useState } from 'react'
import './LaminatedListItem.css'

const SplitProduct = ({splitProduct, updateSplitProduct}) => {

  const [selectionInput, setSelectionInput] = useState(false);
  
    let filler = (1 - (1 - splitProduct.componentProducts[0].excessFraction) - (1 - splitProduct.componentProducts[1].excessFraction))/2

    let product0Percentage = (1 - splitProduct.componentProducts[0].excessFraction + filler)*100
    let product1Percentage = (1 - splitProduct.componentProducts[1].excessFraction + filler)*100
    
    let product0Style = {"width" : `${product0Percentage}%`}
    let product1Style = {"width" : `${product1Percentage}%`}
    
    let product0Yield = Math.round(splitProduct.componentProducts[0].yield * (1 - splitProduct.componentProducts[0].excessFraction + filler))
    let product1Yield = Math.round(splitProduct.componentProducts[1].yield * (1 - splitProduct.componentProducts[1].excessFraction + filler))

    const handleSelection = () => {
      setSelectionInput(!splitProduct.selected)
      let selected = !splitProduct.selected
      updateSplitProduct(splitProduct, selected)
    }
    
    let backgoundColor = "grey"
    if (splitProduct.selected){
      backgoundColor = "green"
    }else if (!splitProduct.selected){
      backgoundColor = "grey"
    }

    let barOutlineStyle = {"backgroundColor" : `${backgoundColor}`}
    let unchecked = <i class="fa-regular fa-square"></i>
    let checked = <i class="fas fa-check-square"></i>
    return (
    <>
  { !splitProduct.selected ? 
    <button className="split-button" onClick={handleSelection}>{unchecked}</button> : 
    <><button className="split-button" onClick={handleSelection}>{checked}</button></>}
    
    <div className='split-bar' style={barOutlineStyle}>
        <div className='split product-0' style={product0Style}>~{product0Yield}  {splitProduct.componentProducts[0].name} </div>
        <div className='split product-1' style={product1Style}>~{product1Yield}  {splitProduct.componentProducts[1].name}</div>
    </div>
    {splitProduct.scraps > 0 ? <p className='scraps pill'>  {splitProduct.scraps} Scrap </p> : <p className='no-scraps pill'>No scraps</p>}
    </>
  )
}

export default SplitProduct;