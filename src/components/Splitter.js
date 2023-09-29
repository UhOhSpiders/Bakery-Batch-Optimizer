import React from 'react'
import './LaminatedList.css'
import SplitProduct from './SplitProduct'

const Splitter = ({splits, setSplits}) => {

    // This checks if the split product that has been selected has a component product which conflicts with a previously selected product, and then deselects the latter. The selector acts as a radio button OR checkbox depending on the combinations offered and allows the user to select more than one split if the combinations happen to allow for it
  const updateSplitProduct = (updatedSplitProduct, selected) => {
    let conflictingSplits = []
    const updatedSplits = splits.map(product => {
      // return updated product
      if (product.name == updatedSplitProduct.name) {
          // find all splits that are currently selected
        const selectedSplits = splits.filter(splitProduct => {return splitProduct.selected})
        conflictingSplits = selectedSplits.filter(splitProduct => {
            return splitProduct.componentProducts.filter(componentProduct => {
              // returns product if it has a matching component product
              return updatedSplitProduct.componentProducts.includes(componentProduct) && splitProduct !== updatedSplitProduct
            });
        });
        return {
          ...product,
          selected: selected,
          scraps: 0,
          requiredDoubles: selected ? 1 : 0
        };
      }
      else {
        return product
      }
    });
    // deselect all conflicting split products
    conflictingSplits.forEach(split => {
      const splitIndex = updatedSplits.findIndex((s => s.name === split.name));
      updatedSplits[splitIndex].selected = false;
    });

    setSplits(updatedSplits)
}


    const listItems = splits.map((splitProduct, id) => {
      return <SplitProduct splitProduct={splitProduct} key={id} updateSplitProduct={updateSplitProduct}/>
    })

  return (
    <>
    <div className='splitter-grid-container'>
      <header><h2>Optional Splits</h2><p>Combine two products into a single sheet to save time.</p></header>
    <hr className='hr'></hr>
      
      {splits.length > 0 ? listItems : <p className='no-splits'> No splits available. </p>}
      
      </div>
    </>
  )
}

export default Splitter