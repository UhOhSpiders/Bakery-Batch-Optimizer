import React from 'react'
import EodScrapListItem from './EodScrapListItem'
import './SideInput.css'

const EodScrapList = ({eodScrapProducts, updateProduct}) => {
  const listItems = eodScrapProducts.map((product, id) => {return <EodScrapListItem product={product} key={id} updateProduct={updateProduct}/>
    
  })
    
    return (
      <div className='side box'>
    <h4>End-of-day Scrap Products</h4>
    <div>{listItems}</div>
    </div>
  )
}

export default EodScrapList