import React, { useEffect, useState } from 'react'
import './LaminatedListItem.css'

const LaminatedListItem = ({product, updateProduct}) => {

const [inputOrderCount, setInputOrderCount] = useState();
const [inputFreezerCount, setInputFreezerCount] = useState();
const [extras, setExtras] = useState();


const handleOrderCountChange = (event) => {
  setInputOrderCount(event.target.value)
  let updatedOrderCount = event.target.value;
  let formField = event.target.name
  updateProduct(updatedOrderCount, product, formField)
}

const handleFreezerCountChange = (event) => {
  setInputFreezerCount(event.target.value)
  let updatedFreezerCount = event.target.value;
  let formField = event.target.name
  updateProduct(updatedFreezerCount, product, formField)
}

const handleAddExtra = (event) => {
  setExtras(product.extras + 1)
  let extras = product.extras + 1;
  let formField = event.target.name
  updateProduct(extras, product, formField)
}

const handleSubtractExtra = (event) => {
  if(product.extras > 0){
  setExtras(product.extras - 1)
  let extras = product.extras - 1;
  let formField = event.target.name
  updateProduct(extras, product, formField)
  }
}

let required = product.orderCount - product.freezerCount
let howManyMade = (product.requiredDoubles + product.extras) * product.yield
let excess = howManyMade - required
let doubles = product.requiredDoubles + product.extras

if(!product.category){  
return (
  
    <>
        <p>{product.name}</p>
        <input type="number" placeholder='orderCount' name='orderCount' onChange={handleOrderCountChange}></input>
        <input type="number" placeholder='freezerCount' name='freezerCount' onChange={handleFreezerCountChange}></input>
        
        <span className='doubles-cell-container'>
        <h2 className='doubles-text'>{doubles}</h2>
        <button title='Add extras' className={product.extras > 0 ? 'hasExtras' : 'button'} onClick={handleAddExtra} name="extras">+</button> 
        <button title='Subtract extras'onClick={handleSubtractExtra} name="extras">-</button>
        </span>


        <p className='excess pill'> ~{excess > 1 ? excess : 0} excess</p>
        {product.scraps > 0 ? <p className='scraps pill'>  {product.scraps} Scrap </p> : <p className='no-scraps pill'>No scraps</p>}
        </>
  )
}
else{
  return(
    <>
    <p>{product.name}</p>
    <input type="number" placeholder='orderCount' name='orderCount' onChange={handleOrderCountChange}></input>
    <input type="number" placeholder='freezerCount' name='freezerCount' onChange={handleFreezerCountChange}></input>
    <h2>{doubles}</h2>
    <p className='excess pill'> ~{excess > 1 ? excess : 0} excess</p>
    {/* <p className='scraps pill'>  Over 4000g available </p> */}
    </>
  )
}



}

export default LaminatedListItem;