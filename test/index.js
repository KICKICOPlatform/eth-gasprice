
const assert = require('assert');
const Web3 = require('web3');
const lib = require('../');


var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

describe("Test gasprice", () => {

  before(() => {

    /*
    lib.setWeb3(web3)
      .setOptions({
      priceTTL: 10000 // 10 sec
    });
    */
  });

  it("Must have keys", async () => {
    let raw = await lib.getRaw();
    assert(raw.safeLow, "no safeLow wkey");
    assert(raw.average, "no avarage wkey");
    assert(raw.fast, "no fast wkey");
    assert(raw.fastest, "no fastest wkey");
  });

  // This may be not correct in future. Now is 19.02.2018
  let priceDiapasons = {
    safeLow: [1, 8],
    average: [1, 15],
    fast: [5, 25],
    fastest: [8, 40]
  }
  for (let priceKey in priceDiapasons) {
    let min = priceDiapasons[priceKey][0];
    let max = priceDiapasons[priceKey][1];
    let minW = web3.utils.toWei('' + min, 'gwei');
    let maxW = web3.utils.toWei('' + max, 'gwei');
    it(priceKey + " must be between " + min + " and " + max + " gwei" , async () => {
    
      let price = await lib.getPrice(priceKey);
      assert(minW <= price, "price " + priceKey + " is too small: " + web3.utils.fromWei('' + price, 'gwei'));
      assert(maxW >= price, "price " + priceKey + " is too big: " + web3.utils.fromWei('' + price, 'gwei'));
    });
  }

  it("Must return average price if key not set", async () => {
  
    let avg = await lib.getPrice('average');
    let price = await lib.getPrice();

    assert.equal(avg, price, "Must return average price by default");
  });

  it("Must throw if try get basic price witout web3", async () => {
  
    try {
      let price = await lib.getPrice('basic');
      assert(false, "Must throw");
    } catch(e) {
      assert.equal("No web3 to get basic price", e.message, "Must throw getPrice('basic') with no web3");
    }
  });

  it("Must get standard price with web3 and basic key", async () => {
  
    let check = web3.getPrice;

    lib.setWeb3(web3);
    let price = await lib.getPrice('basic');
    assert.equal(check, price, "Return wrong basic price " + check + " != " + price);
  });

});
