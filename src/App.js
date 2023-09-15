import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Calculator from './containers/Calculator';
import About from './containers/about';
import NavBar from './components/NavBar';
import Settings from './containers/Settings'

const App = () => {
  const [laminatedProducts, setLaminatedProducts] = useState([]);
  const [eodScrapProducts, setEodScrapProducts] = useState([]);
  const [scrapLaminatedProducts, setScrapLaminatedProducts] = useState([]);
  const [doughsToMix, setDoughsToMix] = useState(null);
  const [inputScraps, setInputScraps] = useState(0);
  const [scrapDoughs, setScrapDoughs] = useState(0);
  const [splits, setSplits] = useState([]);

  useEffect(() => {
    loadProducts();
  },[])

  useEffect(() => {
    updateProduct();
  },[inputScraps])

  useEffect(() => {
    assignScrapDoughs(laminatedProducts);
  },[scrapDoughs])

  useEffect(() => {
    totalDoughsToMix(laminatedProducts);
  },[scrapDoughs])

  useEffect(() => {
    totalDoughsToMix(laminatedProducts);
  },[splits])

  useEffect(() => {
    assignScrapDoughs(laminatedProducts);
  },[splits])


const laminatedProductsTemp = [
  {
    id: 1,
    name: "Croissant",
    pairs: [],
    yield: 26,
    usesScraps: false,
    scraps: 0,
    freezable: false,
    width: 26,
    folds: "bookBook",
    hidden: false,
    orderCount: 0,
    freezerCount: 0,
    requiredDoubles: 0,
    extras: 0,
  },
  {
    id: 2,
    name: "Pan Suisse",
    pairs: [],
    yield: 26,
    usesScraps: true,
    scraps: 0,
    freezable: true,
    width: 26,
    folds: "bookBook",
    hidden: false,
    orderCount: 0,
    freezerCount: 0,
    requiredDoubles: 0,
    extras: 0
  }
  ,
  {
    id: 3,
    name: "Bear Claw",
    pairs: [],
    yield: 26,
    usesScraps: true,
    scraps: 0,
    freezable: true,
    width: 26,
    folds: "bookBook",
    hidden: false,
    orderCount: 0,
    freezerCount: 0,
    requiredDoubles: 0,
    extras: 0
  }
  ,
  {
    id: 5,
    name: "Danish",
    pairs: [],
    yield: 26,
    usesScraps: true,
    scraps: 0,
    freezable: true,
    width: 26,
    folds: "bookBook",
    hidden: false,
    orderCount: 0,
    freezerCount: 0,
    requiredDoubles: 0,
    extras: 0
  }
]
const settings = {
  scrapDoughWeight: 1800,
  prefermentWeight: 150,
}
// End of Day scrap products
const eodScrapProductSettings = [{
  name: "Lemon Bun",
  id: 4,
  weight: 110,
  orderCount: 0,
  hidden: false
}]

const scrapLaminatedProductSettings = [{
  id: 8,
  name: "Morning Buns",
  yield: 40,
  usesScraps: false,
  minDoughWeight: 4000,
  freezable: false,
  hidden: false,
  orderCount: 0,
  freezerCount: 0,
  requiredDoubles: 0,
  extras: 0,
  category: "ScrapLaminatedProduct"
}]

const loadProducts = () => {
  setLaminatedProducts(laminatedProductsTemp);
  setEodScrapProducts(eodScrapProductSettings);
  setScrapLaminatedProducts(scrapLaminatedProductSettings);
}

// find cleaner way to do this
// have all products in single array & give each object a catergory key? 
const updateProduct = (updatedValue, product, formField, productCategory) => {
  if(laminatedProducts.includes(product)){
    const id = product.id
    let updateProduct = laminatedProducts.findIndex((product => product.id === id));
    laminatedProducts[updateProduct][formField] = updatedValue;
  }else if (eodScrapProducts.includes(product)){
    const id = product.id
    let updateProduct = eodScrapProducts.findIndex((product => product.id === id));
    eodScrapProducts[updateProduct][formField] = updatedValue;
  }else if (scrapLaminatedProducts.includes(product)){
    const id = product.id
    let updateProduct = scrapLaminatedProducts.findIndex((product => product.id === id));
    scrapLaminatedProducts[updateProduct][formField] = updatedValue;
  }

  // assigns requiredDoubles for each product
  laminatedProducts.forEach((product) => product.requiredDoubles = Math.max(0,Math.ceil((product.orderCount-product.freezerCount)/product.yield)));
  // updates the total doughs required
  totalDoughsToMix(laminatedProducts);
  // identifies what batches can be combined (eg half croissant/half pan suisse)
  getSplits(laminatedProducts);

  calcScrapLaminatedProducts(scrapLaminatedProducts);
  // updates available scrap doughs
  calcScrapDoughs(scrapLaminatedProducts);
  // assigned scrap doughs to batches based on what has been ordered
  assignScrapDoughs(laminatedProducts, splits);
  
}

const updateSplitProduct = (updatedSplitProduct, updatedValue) => {
    let name = updatedSplitProduct.name
    let updateProduct = splits.findIndex((product => product.name === name));
    splits[updateProduct].selected = updatedValue;
    splits[updateProduct].scraps = 0;
    {updatedValue ? splits[updateProduct].requiredDoubles = 1 : splits[updateProduct].requiredDoubles = 0}

    let updatedSplits = []
    splits.forEach((splitProduct) => {
      // This checks if the split product that has been selected has a component product which conflicts with a previously selected product, and then deselects the latter. The selector acts as a radio button OR checkbox depending on the combinations offered and allows the user to select more than one split if the combinations happen to allow for it
      if(splitProduct.componentProducts.some(r=>updatedSplitProduct.componentProducts.indexOf(r) >=0) && splitProduct !== updatedSplitProduct){
        splitProduct.requiredDoubles = 0;
        splitProduct.scraps = 0;
        splitProduct.selected = false;
        splitProduct.selectable = false;
        updatedSplits.push(splitProduct)
      }else{
        updatedSplits.push(splitProduct)
      }
    })
  setSplits(updatedSplits)
}

const calcScrapDoughs = (scrapLaminatedProducts) => {
  // TO DO: an estimation of the scraps that will be created the following day during the lamination/shaping process
  let futureScraps = doughsToMix * 0.3
  
  // sets scraps aside for end of day scrap products
  let eodScrapsNeeded = 0
  eodScrapProducts.forEach((product) => eodScrapsNeeded += product.orderCount * product.weight)
  
  // sets aside scraps needed for laminated products which exclusively use scraps
  let scrapLaminatedProductScraps = 0
  scrapLaminatedProducts.forEach((product) => {
      scrapLaminatedProductScraps += product.requiredDoubles * product.minDoughWeight
    })

    // sets scraps aside for preferment (the scraps required for mixing fresh doughs)
  let availableScraps = Math.max(0,inputScraps - (doughsToMix * settings.prefermentWeight) - eodScrapsNeeded - scrapLaminatedProductScraps)
  // TO DO: put a cap on this so it returns only the number of scrap doughs required and doesn't go over
  setScrapDoughs(Math.floor(availableScraps/settings.scrapDoughWeight))
}

const totalDoughsToMix = (products) => {
  let total = 0;

laminatedProducts.forEach((product) => product.requiredDoubles = Math.max(0,Math.ceil((product.orderCount-product.freezerCount)/product.yield)));

  splits.forEach((splitProduct) => {
    if(splitProduct.selected){
      total += splitProduct.requiredDoubles
      splitProduct.componentProducts.forEach((componentProduct) => {
      
        products.forEach((product) => {

          if(product == componentProduct){
            product.requiredDoubles -= 1
          }
        })
      })
    }
  })

  products.forEach((product) => {
    total += product.requiredDoubles
    total += product.extras
  })

  
  setDoughsToMix(Math.max(0,((total * 2)-scrapDoughs)))
}

const assignScrapDoughs = (products) => {
  let assignedScraps = 0
  let possibleScraps = 0

  // resets the scraps property for each product
  // counts "possible" scraps - eg if there were unlimited scraps how many slots should be filled
  // this value stops the loop once all possible slots have been filled
  products.forEach((product) => {
    if(product.usesScraps){
      product.scraps = 0;
      possibleScraps += product.requiredDoubles + product.extras;
      assignedScraps += product.scraps
    }
  })
if(splits){
   splits.forEach((splitProduct) => {
    if(splitProduct.selected){
      splitProduct.scraps = 0;
      possibleScraps += splitProduct.requiredDoubles;
      assignedScraps += splitProduct.scraps
    }
  })
}
  // this counter dictates how many times the loop runs
  // if it gets to the end of the products array it should go back to the start and keep going until the counter is matched
  let counter = scrapDoughs - assignedScraps
  let i = 0;
  while(i < counter && assignedScraps < possibleScraps){
    products.forEach((product) => {
    if(product.usesScraps 
      && product.scraps < product.requiredDoubles + product.extras 
      && i < counter
      ){
            product.scraps += 1;
            assignedScraps += 1;
            i += 1;
      }
    })
    
    if(splits){
    splits.forEach((splitProduct) => {
      if(splitProduct.componentProducts[0].usesScraps
        && splitProduct.selected
        && splitProduct.scraps < splitProduct.requiredDoubles 
        && i < counter
        ){
              splitProduct.scraps += 1;
              assignedScraps += 1;
              i += 1;
        }
      })
    }

  }
}

const getSplits = (products) => {
let excessFraction = 0;

// assigns excess fraction as a decimal
  products.forEach((product) => {
  excessFraction = product.requiredDoubles - ((product.orderCount - product.freezerCount)/product.yield)
  product.excessFraction = excessFraction
  product.paired = false
  }
  )
  let splits = []

  // looks for pairs based on whether two products have compatible excess
  products.forEach((product) => {
    if(product.excessFraction > 0.5){

            products.forEach((pairProduct) => {
              if(pairProduct.excessFraction + product.excessFraction > 1 && pairProduct !== product 
                // this stops every possible combination
                && !product.paired
                ){

                pairProduct.paired = true
                
                let splitProduct = 
                {
                  name: `${product.name} ${pairProduct.name}`,
                  componentProducts: [product, pairProduct],
                  scraps: 0,
                  selected: false,
                  requiredDoubles: 1,
                }
              splits.push(splitProduct)
              }
            })
    }
  })
setSplits(splits)
}

const calcScrapLaminatedProducts = (scrapLaminatedProducts) => {
  scrapLaminatedProducts.forEach((product) => 
    product.requiredDoubles = Math.max(0,Math.ceil((product.orderCount-product.freezerCount)/product.yield)
    ));
  }
    

  return (
    <Router>
      <div className='App'>
    <NavBar/>
    <Routes>
     
     <Route path="/" element={<Calculator products={laminatedProducts} eodScrapProducts={eodScrapProducts} updateProduct={updateProduct} setInputScraps={setInputScraps} scrapDoughs={scrapDoughs} doughsToMix={doughsToMix} scrapLaminatedProducts={scrapLaminatedProducts} splits={splits} updateSplitProduct={updateSplitProduct}/>}/>
     
     <Route path="/about" element={<About/>}/>
     
     <Route path="/settings" element={<Settings/>}/>
     
     </Routes>
    </div>
    </Router>
  );
}

export default App;
