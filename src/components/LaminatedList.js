import React from 'react'
import LaminatedProduct from './LaminatedListItem'
import './LaminatedList.css'

const LaminatedList = ({products, updateProduct}) => {
    const listItems = products.map((product, id) => {
      return <LaminatedProduct product={product} key={id} updateProduct={updateProduct}/>
    })

  return (
    <>
    <div className='table-grid-container'>
    <h3>Product</h3>
    <h3>Order Quantity for Tuesday</h3>
    <h3>Current Freezer Levels</h3>
    <h3>Doubles</h3>
    <h3>Extras</h3>
    <p></p>
    <hr></hr>
    
    {listItems}
    </div>
    </>
  )
}

export default LaminatedList;