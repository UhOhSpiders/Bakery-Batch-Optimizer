import React from 'react'
import LaminatedProduct from './LaminatedListItem'
import './LaminatedList.css'

const LaminatedList = ({products, updateProduct}) => {
    const listItems = products.map((product, id) => {
      return <LaminatedProduct product={product} key={id} updateProduct={updateProduct}/>
    })

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const d = new Date();
d.setDate(d.getDate() + 2 )
const twoDaysFromNow = days[d.getDay()]
  
return (
    <>
    <div className='table-grid-container'>
    <h3>Product</h3>
    <h3>Order Quantity for {twoDaysFromNow} </h3>
    <h3>Current Freezer Levels</h3>
    <h3>Double Batches</h3>
    <></>
    <></>
    <hr></hr>
    
    {listItems}
    </div>
    </>
  )
}

export default LaminatedList;