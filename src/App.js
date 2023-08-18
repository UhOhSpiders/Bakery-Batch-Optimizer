import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Calculator from './containers/Calculator';
import About from './containers/about';
import NavBar from './components/NavBar';
import Settings from './containers/Settings'

const App = () => {
  const [products, setProducts] = useState([]);
  const [eodScrapProducts, setEodScrapProducts] = useState([]);
  const [scrapLaminatedProducts, setScrapLaminatedProducts] = useState([]);
  const [doughsToMix, setDoughsToMix] = useState(null);
  const [scraps, setScraps] = useState(0);
  const [scrapDoughs, setScrapDoughs] = useState(0);
  const [assignedScrapsTotal, setAssignedScrapsTotal] = useState(0)
  const [splits, setSplits] = useState([]);

  useEffect(() => {
    loadProducts();
  },[])

  useEffect(() => {
    updateProduct();
  },[scraps])

  useEffect(() => {
    assignScrapDoughs(products);
  },[scrapDoughs])

  useEffect(() => {
    totalDoughsToMix(products);
  },[scrapDoughs])


const laminatedProducts = [
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
  yield: 26,
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
  setProducts(laminatedProducts);
  setEodScrapProducts(eodScrapProductSettings);
  setScrapLaminatedProducts(scrapLaminatedProductSettings);
}

// move this to calculator container?
// find cleaner way to do this
// have all products in single array & give each object a catergory key? 
const updateProduct = (updatedValue, product, formField) => {
  if(products.includes(product)){
    const id = product.id
    let updateProduct = products.findIndex((product => product.id === id));
    products[updateProduct][formField] = updatedValue;
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
  products.forEach((product) => product.requiredDoubles = Math.max(0,Math.ceil((product.orderCount-product.freezerCount)/product.yield)));
  // updates the total doughs required
  totalDoughsToMix(products);
  // updates available scrap doughs
  calcScrapDoughs(scrapLaminatedProducts);
  // assigned scrap doughs to batches based on what has been ordered
  assignScrapDoughs(products);
  // identifies what batches can be combined (eg half croissant/half pan suisse)
  getSplits(products);
}

const calcScrapDoughs = (scrapLaminatedProducts) => {
  // TO DO: an estimation of the scraps that will be created the following day during the lamination/shaping process
  let futureScraps = doughsToMix * 0.3
  // sets scraps aside for preferment (the scraps required for mixing fresh doughs),
  // and end of day scrap products
  let eodScrapsNeeded = 0
  eodScrapProducts.forEach((product) => eodScrapsNeeded += product.orderCount * product.weight)
  let availableScraps = Math.max(0,scraps - (doughsToMix * settings.prefermentWeight) - eodScrapsNeeded)
  // TO DO: put a cap on this so it returns only the number of scrap doughs required and doesn't go over
  setScrapDoughs(Math.floor(availableScraps/settings.scrapDoughWeight))
}

const totalDoughsToMix = (products) => {
  let total = 0;
  products.forEach((product) => total += product.requiredDoubles)
  products.forEach((product) => total += product.extras)
  setDoughsToMix(Math.max(0,((total)-scrapDoughs)))
}

const assignScrapDoughs = (products) => {
  let assignedScraps = 0
  let possibleScraps = 0

  // resets the scraps property for each product
  products.forEach((product) => {
    if(product.usesScraps){
      product.scraps = 0;
    }
  })
  // counts "possible" scraps - eg if there were unlimited scraps how many slots should be filled
  // this value is meant to stop the loop once all possible slots have been filled
  products.forEach((product) => {
    if(product.usesScraps){
      possibleScraps += product.requiredDoubles + product.extras;
      assignedScraps += product.scraps
    }
  })
  // this counter should dictate how many times the loop runs
  // if it gets to the end of the products array it should go back to the start and keep going until the counter is matched
  // at the minute though, "i" can still just keep getting larger than "counter" and it wont break the loop
  let counter = scrapDoughs - assignedScraps
  let i = 0;
  while(i < counter && assignedScraps < possibleScraps){
    products.forEach((product) => {
    if(product.usesScraps 
      && product.requiredDoubles + product.extras > 0 
      && product.scraps < product.requiredDoubles + product.extras 
      && i < counter
      ){
            product.scraps += 1;
            assignedScraps += 1;
            i += 1;
            console.log("counter after loop has started: " + counter)
            console.log("i after loop has started: " + i)
      }
    })
  }
}

const getSplits = (products) => {
let excessFraction = 0;
let splits = []
// assigns excess fraction
  products.forEach((product) => {
    excessFraction = product.requiredDoubles - ((product.orderCount - product.freezerCount)/product.yield)
  product.excessFraction = excessFraction
  product.paired = false
  }
  )
// looks for pairs based on whether two products have a large excess
  products.forEach((product) => {
    if(product.excessFraction > 0.5){

            products.forEach((pairProduct) => {
              if(pairProduct.excessFraction > 0.5 && pairProduct !== product && !product.paired){
                // console.log(product.name + pairProduct.name)
                pairProduct.paired = true
                splits.push(pairProduct)
              }
            })
    
    
    }
  })
setSplits(splits)
}

  return (
    <Router>
      <div className='App'>
    <NavBar/>
    <Routes>
     
     <Route path="/" element={<Calculator products={products} eodScrapProducts={eodScrapProducts} updateProduct={updateProduct} setScraps={setScraps} scrapDoughs={scrapDoughs} doughsToMix={doughsToMix} scrapLaminatedProducts={scrapLaminatedProducts}/>}/>
     
     <Route path="/about" element={<About/>}/>
     
     <Route path="/settings" element={<Settings/>}/>
     
     </Routes>
    </div>
    </Router>
  );
}

export default App;
