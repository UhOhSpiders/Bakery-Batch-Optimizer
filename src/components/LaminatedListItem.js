import React, { useEffect, useState } from 'react'

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

  return (
    <div>
        <p>{product.name}</p>
        <input type="number" placeholder='orderCount' name='orderCount' onChange={handleOrderCountChange}></input>
        <input type="number" placeholder='freezerCount' name='freezerCount' onChange={handleFreezerCountChange}></input>
        <p>Doubles:  {product.requiredDoubles}</p>
        <p> ~ Excess: {excess > 1 ? excess : 0}</p>
        <p>{product.extras}</p>
        <button onClick={handleAddExtra} name="extras">+</button>
        <button onClick={handleSubtractExtra} name="extras">-</button>
    </div>
  )
}

export default LaminatedListItem;