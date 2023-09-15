import React, { useState } from 'react'

const EodScrapListItem = ({product, updateProduct}) => {

const [inputOrderCount, setInputOrderCount] = useState();

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const d = new Date();
d.setDate(d.getDate() + 1 )
const oneDayFromNow = days[d.getDay()]
  
    
    const handleOrderCountChange = (event) => {
        setInputOrderCount(event.target.value)
        let updatedOrderCount = event.target.value;
        let formField = event.target.name
        updateProduct(updatedOrderCount, product, formField)
      }

  return (
    <>
    <span><p className='day'>{oneDayFromNow}'s </p> <p>{product.name} order:</p></span>
    <input onChange={handleOrderCountChange} type="number" name="orderCount"></input>
    </>
  )
}

export default EodScrapListItem