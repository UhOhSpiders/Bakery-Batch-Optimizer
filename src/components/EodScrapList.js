import React from 'react'
import EodScrapListItem from './EodScrapListItem'

const EodScrapList = ({eodScrapProducts, updateProduct}) => {
  const listItems = eodScrapProducts.map((product, id) => {return <EodScrapListItem product={product} key={id} updateProduct={updateProduct}/>
    
  })
    
    return (
      <>
      <h4>End-of-day Scrap Products</h4>
    <div>{listItems}</div>
    </>
  )
}

export default EodScrapList