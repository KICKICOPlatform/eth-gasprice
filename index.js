
const got = require('got');
const debug = require('debug')('eth-gasprice:lib');

const defaulOptions = {
  priceTTL: 10000 // time to keep prices cache
}

const apiUri = 'https://ethgasstation.info/json/ethgasAPI.json';

class EthGasPrice {

  constructor(web3 = false, options = {}) {
    //this.web3 = web3;
    if (web3) this.setWeb3(web3);
    this.options = {...defaulOptions, ...options};
    this.data = null;
    this.lastLoad = null;
  }

  async getRaw() {
  
    let now = Date.now();
    debug('now: ', now);
    if (this.lastLoad && this.lastLoad > (now - this.options.priceTTL) && this.data) {
      debug('return from cache');
      return this.data;
    }
    try {
      debug('load from ', apiUri);
      this.data = (await got(apiUri, {
        json: true
      })).body;
      this.lastLoad = Date.now();
      debug('loaded', this.data);
      return this.data;
    } catch(e) {
      if (this.data) {
        debug('got error. return old values');
        return this.data;
      } else {
        throw(e);
      }
    }
  }

  async getPrice(key = 'average') {
 
    switch(key) {
    
      case 'basic':
        if (!this.web3) throw new Error("No web3 to get basic price");
        return this.web3.gasPrice.toNumber();
        break;
      case 'safeLow':
      case 'average':
      case 'fast':
      case 'fastest':
        let raw = await this.getRaw();
        let valGwei = raw[key] / 10;
        let val;

        if (this.web3) {
          debug('web3: ', typeof (this.web3));
          let toWei = this.web3.utils ? this.web3.utils.toWei : this.web3.toWei;
          val = toWei('' + valGwei, 'gwei');
        } else {
          val = valGwei *  Math.pow(10, 9);
        }
        return val;
        break;
      default: 
        throw new Error("Unknow price key '" + key + "'");
        break;
    }
  }

  setWeb3(web3) {
    this.web3 = web3;
    return this;
  }
}

module.exports = new EthGasPrice;
