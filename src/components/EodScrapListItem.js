import React, { useState } from 'react'

const EodScrapListItem = ({product, updateProduct}) => {

const [inputOrderCount, setInputOrderCount] = useState();
    
    const handleOrderCountChange = (event) => {
        setInputOrderCount(event.target.value)
        let updatedOrderCount = event.target.value;
        let formField = event.target.name
        updateProduct(updatedOrderCount, product, formField)
      }

  return (
    <>
    <p>Monday's {product.name} order:</p>
    <input onChange={handleOrderCountChange} name="orderCount"></input>
    </>
  )
}

export default EodScrapListItem