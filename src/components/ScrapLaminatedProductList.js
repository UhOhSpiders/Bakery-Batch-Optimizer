import React from 'react'
import ScrapLaminatedProduct from './LaminatedListItem'
import './LaminatedList.css'

const ScrapLaminatedProductList = ({scrapLaminatedProducts, updateProduct}) => {
  const listItems = scrapLaminatedProducts.map((product, id) => {
    return <ScrapLaminatedProduct product={product} key={id} updateProduct={updateProduct}/>
  })
  
  
    return (
        <>
        <div className='table-grid-container'>
    {listItems}
    </div>
        </>
  )
}

export default ScrapLaminatedProductList