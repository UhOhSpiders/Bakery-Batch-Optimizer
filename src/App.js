import './App.css';
import { useEffect, useState } from 'react';
import Calculator from './containers/Calculator';

const App = () => {
  const [products, setProducts] = useState([]);
  const [eodScrapProducts, setEodScrapProducts] = useState([]);
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
    removeScrapDoughs(products);
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

const loadProducts = () => {
  setProducts(laminatedProducts);
  setEodScrapProducts(eodScrapProductSettings);
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
  }
  // assigns requiredDoubles for each product
  products.forEach((product) => product.requiredDoubles = Math.max(0,Math.ceil((product.orderCount-product.freezerCount)/product.yield)));
  totalDoughsToMix(products);
  calcScrapDoughs();
  removeScrapDoughs(products);
  // assignScrapDoughs(products, product);
  getSplits(products);
}

const calcScrapDoughs = () => {
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

// Doesn't work if scraps weight is changed after order numbers 
const assignScrapDoughs = (products, assignedProduct) => {
  console.log(products)
  products.forEach((product) => {
    if(product.scraps > product.requiredDoubles + product.extras && assignedScrapsTotal > 0 && product === assignedProduct){
      product.scraps -= 1;
      let newReducedTotal = assignedScrapsTotal - 1
      setAssignedScrapsTotal(newReducedTotal)
      // console.log(newReducedTotal)
      console.log("subtracted 1 so new total is: " + newReducedTotal)
    }else if(product.usesScraps && product.requiredDoubles + product.extras > 0 && assignedScrapsTotal < scrapDoughs && product === assignedProduct){
      product.scraps += 1;
      let newTotal = assignedScrapsTotal + 1
      setAssignedScrapsTotal(newTotal)
      console.log("added 1 so new assignedScrapsTotal is: " + newTotal)
      console.log("scrap dough total is: " + scrapDoughs)
    }
  })
}



const removeScrapDoughs = (products) => {
  let assignedScraps = 0
  console.log("assinged scraps: " + assignedScraps)
  
  products.forEach((product) => {
    if(product.scraps > product.requiredDoubles + product.extras){
      product.scraps = product.requiredDoubles + product.extras;
    }})

  let possibleScraps = 0
  products.forEach((product) => {
    if(product.usesScraps){
      possibleScraps += product.requiredDoubles + product.extras;
      assignedScraps += product.scraps
    }
  })
  
  let counter = scrapDoughs - assignedScraps
  console.log("counter: "+counter)
  console.log("possible scraps : "  + possibleScraps)
  
  
  while(counter > 0 && assignedScraps < possibleScraps){
    products.forEach((product) => {
    if(product.usesScraps && 
      product.requiredDoubles + product.extras > 0 && 
      product.scraps < product.requiredDoubles + product.extras){
        
        product.scraps += 1;
        assignedScraps += 1
        counter -= 1
        console.log("counter: "+counter)
      
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
  // console.log(product.name + " excessFraction: " + product.excessFraction)
  }
  )
// looks for pairs
  products.forEach((product) => {
    if(product.excessFraction > 0.5){

            products.forEach((pairProduct) => {
              if(pairProduct.excessFraction > 0.5 && pairProduct !== product && !product.paired){
                // console.log(product.name + pairProduct.name)
                pairProduct.paired = true
                // product.pairs.push(pairProduct.name)
                splits.push(pairProduct)
              }
            })
    
    
    }
  })
// console.log(splits)
setSplits(splits)

}

  return (
    <div className="App">
    <h1>Dough Calculator</h1>
     <Calculator products={products} eodScrapProducts={eodScrapProducts} updateProduct={updateProduct} setScraps={setScraps} scrapDoughs={scrapDoughs} doughsToMix={doughsToMix}/>
    </div>
  );
}

export default App;
