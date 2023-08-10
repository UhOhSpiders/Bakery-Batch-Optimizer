import './App.css';
import { useEffect, useState } from 'react';
import Calculator from './containers/Calculator';

const App = () => {
  const [products, setProducts] = useState([]);
  const [eodScrapProducts, setEodScrapProducts] = useState([]);
  const [doughsToMix, setDoughsToMix] = useState(null);
  const [scraps, setScraps] = useState(0);
  const [scrapDoughs, setScrapDoughs] = useState(0);

  useEffect(() => {
    loadProducts();
  },[])

  useEffect(() => {
    calcScrapDoughs();
  },[scraps])

  useEffect(() => {
    totalDoughsToMix(products);
  },[scrapDoughs])


const laminatedProducts = [
  {
    id: 1,
    name: "Croissant",
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
    let updateProduct = products.findIndex((product => product.id == id));
    products[updateProduct][formField] = updatedValue;
  }else if (eodScrapProducts.includes(product)){
    const id = product.id
    let updateProduct = eodScrapProducts.findIndex((product => product.id == id));
    eodScrapProducts[updateProduct][formField] = updatedValue;
  }
  // assigns requiredDoubles for each product
  products.forEach((product) => product.requiredDoubles = Math.max(0,Math.ceil((product.orderCount-product.freezerCount)/product.yield)));
  calcScrapDoughs();
  totalDoughsToMix(products);
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
  assignScrapDoughs(products);
}

const totalDoughsToMix = (products) => {
  let total = 0;
  products.forEach((product) => total += product.requiredDoubles)
  products.forEach((product) => total += product.extras)
  setDoughsToMix(Math.max(0,((total)-scrapDoughs)))
  // TO DO: move this to calcScrapDoughs?
  // assignScrapDoughs(products);
}

const assignScrapDoughs = (products) => {
  let count = scrapDoughs;
  let assignedScrapsTotal = 0
  products.forEach((product) => assignedScrapsTotal += product.scraps)
  products.forEach(product => {
    if(product.usesScraps && product.orderCount + product.extras > 0 && assignedScrapsTotal < count){
      product.scraps += 1;
  }else if (product.scraps > product.requiredDoubles + product.extras){
    product.scraps -= 1;
  }
})
}

  return (
    <div className="App">
    <h1>Dough Calculator</h1>
     <Calculator products={products} eodScrapProducts={eodScrapProducts} updateProduct={updateProduct} setScraps={setScraps} scrapDoughs={scrapDoughs} doughsToMix={doughsToMix}/>
    </div>
  );
}

export default App;
