import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Calculator from "./containers/Calculator";
import About from "./containers/about";
import NavBar from "./components/NavBar";
import Settings from "./containers/Settings";
import laminatedProductsTemp from "./temp_data/laminatedProductsTemp";
import eodScrapProductsTemp from "./temp_data/eodScrapProductsTemp.json";
import scrapLaminatedProductsTemp from "./temp_data/scrapLaminatedProductsTemp.json";
import settingsTemp from "./temp_data/settingsTemp.json";

const App = () => {
  const [laminatedProducts, setLaminatedProducts] = useState(
    laminatedProductsTemp
  );
  const [eodScrapProducts, setEodScrapProducts] =
    useState(eodScrapProductsTemp);
  const [scrapLaminatedProducts, setScrapLaminatedProducts] = useState(
    scrapLaminatedProductsTemp
  );
  const [settings, setSettings] = useState(settingsTemp);
  const [doughsToMix, setDoughsToMix] = useState(null);
  const [inputScraps, setInputScraps] = useState(0);
  const [scrapDoughs, setScrapDoughs] = useState(0);
  const [splits, setSplits] = useState([]);

  useEffect(() => {
    recalculate();
  }, [inputScraps]);

  useEffect(() => {
    assignScrapDoughs(laminatedProducts);
    totalDoughsToMix();
  }, [scrapDoughs]);

  useEffect(() => {
    calcRequiredDoubles(laminatedProducts);
    totalDoughsToMix(scrapLaminatedProducts);
    assignScrapDoughs(laminatedProducts);
  }, [splits]);

  const updateProduct = (updatedValue, product, formField) => {
    const updateProductArrayById = (products) => {
      return products.map((p) => {
        // return updated product
        if (p.id == product.id) {
          return {
            ...p,
            [formField]: updatedValue,
          };
        }
        // not a match return original product
        else {
          return p;
        }
      });
    };
    switch (product.category) {
      case "laminated":
        const updatedLaminatedProducts =
        updateProductArrayById(laminatedProducts);
        setLaminatedProducts(updatedLaminatedProducts);
        calcRequiredDoubles(updatedLaminatedProducts);
        getSplits(updatedLaminatedProducts);
        break;
      case "scrapLaminated":
        const updatedScrapLaminatedProducts = updateProductArrayById(
          scrapLaminatedProducts
        );
        setScrapLaminatedProducts(updatedScrapLaminatedProducts);
        break;
      case "eodScrap":
        const updatedEodScrapProducts =
          updateProductArrayById(eodScrapProducts);
        setEodScrapProducts(updatedEodScrapProducts);
        break;
      default:
        console.log(`Error ${product.name}.`);
    }

    recalculate();
  };

  const calcScrapDoughs = (scrapLaminatedProducts) => {
    // TO DO: an estimation of the scraps that will be created the following day during the lamination/shaping process
    let futureScraps = doughsToMix * 0.3;

    // sets scraps aside for end of day scrap products
    let eodScrapsNeeded = 0;
    eodScrapProducts.forEach(
      (product) => (eodScrapsNeeded += product.orderCount * product.weight)
    );

    // sets aside scraps needed for laminated products which exclusively use scraps
    let scrapLaminatedProductScraps = 0;
    scrapLaminatedProducts.forEach((product) => {
      scrapLaminatedProductScraps +=
        product.requiredDoubles * product.minDoughWeight;
    });

    // sets scraps aside for preferment (the scraps required for mixing fresh doughs)
    let availableScraps = Math.max(
      0,
      inputScraps -
        doughsToMix * settings.prefermentWeight -
        eodScrapsNeeded -
        scrapLaminatedProductScraps
    );
    // TO DO: put a cap on this so it returns only the number of scrap doughs required and doesn't go over
    setScrapDoughs(Math.floor(availableScraps / settings.scrapDoughWeight));
  };

  const calcRequiredDoubles = (products) => {
    let productsCopy = [...products];
    productsCopy.map(
      (product) =>
        (product.requiredDoubles = Math.max(
          0,
          Math.ceil((product.orderCount - product.freezerCount) / product.yield)
        ))
    );
    splits.forEach((splitProduct) => {
      if (splitProduct.selected) {
        splitProduct.componentProducts.forEach((componentProduct) => {
          productsCopy.forEach((product) => {
            if (product == componentProduct) {
              product.requiredDoubles -= 1;
            }
          });
        });
      }
    });
    setLaminatedProducts(productsCopy);
  };

  const totalDoughsToMix = () => {
    let total = 0;
    laminatedProducts.forEach((product) => {
      total += product.requiredDoubles;
      total += product.extras;
    });
    setDoughsToMix(Math.max(0, total * 2 - scrapDoughs));
  };

  const assignScrapDoughs = (products) => {
    let assignedScraps = 0;
    let possibleScraps = 0;

    // resets the scraps property for each product
    // counts "possible" scraps - eg if there were unlimited scraps how many slots should be filled
    // this value stops the loop once all possible slots have been filled
    products.forEach((product) => {
      if (product.usesScraps) {
        product.scraps = 0;
        possibleScraps += product.requiredDoubles + product.extras;
        assignedScraps += product.scraps;
      }
    });
    if (splits) {
      splits.forEach((splitProduct) => {
        if (splitProduct.selected) {
          splitProduct.scraps = 0;
          possibleScraps += splitProduct.requiredDoubles;
          assignedScraps += splitProduct.scraps;
        }
      });
    }
    // this counter dictates how many times the loop runs
    // if it gets to the end of the products array it should go back to the start and keep going until the counter is matched
    let counter = scrapDoughs - assignedScraps;
    let i = 0;
    while (i < counter && assignedScraps < possibleScraps) {
      products.forEach((product) => {
        if (
          product.usesScraps &&
          product.scraps < product.requiredDoubles + product.extras &&
          i < counter
        ) {
          product.scraps += 1;
          assignedScraps += 1;
          i += 1;
        }
      });

      if (splits) {
        splits.forEach((splitProduct) => {
          if (
            splitProduct.componentProducts[0].usesScraps &&
            splitProduct.selected &&
            splitProduct.scraps < splitProduct.requiredDoubles &&
            i < counter
          ) {
            splitProduct.scraps += 1;
            assignedScraps += 1;
            i += 1;
          }
        });
      }
    }
  };

  const getSplits = (products, log) => {
    let excessFraction = 0;
    // assigns excess fraction as a decimal
    products.forEach((product) => {
      excessFraction =
        product.requiredDoubles -
        (product.orderCount - product.freezerCount) / product.yield;
      product.excessFraction = excessFraction;
      product.paired = false;
    });
    let splits = [];
    // looks for pairs based on whether two products have compatible excess
    products.forEach((product) => {
      excessFraction =
        product.requiredDoubles -
        (product.orderCount - product.freezerCount) / product.yield;
      product.excessFraction = excessFraction;
      product.paired = false;
      if (product.excessFraction > 0.5) {
        products.forEach((pairProduct) => {
          if (
            pairProduct.excessFraction + product.excessFraction > 1 &&
            pairProduct !== product &&
            // this stops every possible combination being shown
            !product.paired
          ) {
            pairProduct.paired = true;

            let splitProduct = {
              name: `${product.name} ${pairProduct.name}`,
              componentProducts: [product, pairProduct],
              scraps: 0,
              selected: false,
              requiredDoubles: 1,
            };
            splits.push(splitProduct);
          }
        });
      }
    });
    setSplits(splits);
  };

  const calcScrapLaminatedProducts = (scrapLaminatedProducts) => {
    scrapLaminatedProducts.forEach(
      (product) =>
        (product.requiredDoubles = Math.max(
          0,
          Math.ceil((product.orderCount - product.freezerCount) / product.yield)
        ))
    );
  };

  function recalculate() {
    // updates the total doughs required
    totalDoughsToMix();
    calcScrapLaminatedProducts(scrapLaminatedProducts);
    // updates available scrap doughs
    calcScrapDoughs(scrapLaminatedProducts);
    // assigned scrap doughs to batches based on what has been ordered
    assignScrapDoughs(laminatedProducts, splits);
  }

  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route
            path="/"
            element={
              <Calculator
                products={laminatedProducts}
                eodScrapProducts={eodScrapProducts}
                updateProduct={updateProduct}
                setInputScraps={setInputScraps}
                scrapDoughs={scrapDoughs}
                doughsToMix={doughsToMix}
                scrapLaminatedProducts={scrapLaminatedProducts}
                splits={splits}
                setSplits={setSplits}
              />
            }
          />

          <Route path="/about" element={<About />} />

          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
