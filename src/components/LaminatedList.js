import React from 'react'
import LaminatedProduct from './LaminatedListItem'

const LaminatedList = ({products, updateProduct}) => {
    const listItems = products.map((product, id) => {
      return <LaminatedProduct product={product} key={id} updateProduct={updateProduct}/>
    })

  return (
    <div>{listItems}</div>
  )
}

export default LaminatedList;