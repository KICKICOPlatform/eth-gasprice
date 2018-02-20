# eth-gasprice
Loads current ETH gas price from ethgasstation.info

# Usage

```
  const Web3 = require('web3');
  const ethGasprice = require('../');
  var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  ethGasprice.setWeb3(web3);
  
  ethGasprice.getPrice('safeLow').then((price) => {
    // price is the current recomended low price from https://ethgasstation.info/ in wei
  });
```
@param string default: average
* safeLow
* average
* fast
* fastest
* basic - this is the basic web3 functionality (return web3.gasPrice)

setWeb3(web3) is not necessary. It used for basic price and Gwei -> Wei convertation
