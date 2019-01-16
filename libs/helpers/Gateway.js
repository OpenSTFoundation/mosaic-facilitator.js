'use strict';

const Web3 = require('web3');
const MosaicTbd = require('@openstfoundation/mosaic-tbd');
const AbiBinProvider = MosaicTbd.AbiBinProvider;
const ContractName = 'EIP20Gateway';

class Gateway {
  constructor(web3, gateway) {
    const oThis = this;

    if (typeof web3 === 'string') {
      web3 = new Web3(sourceWeb3);
    }
    if (web3 instanceof Web3) {
      oThis.web3 = web3;
    } else {
      let err = new Error("Mandatory Parameter 'web3' is missing or invalid");
      throw err;
    }

    if (!Web3.utils.isAddress(gateway)) {
      let err = new Error("Mandatory Parameter 'gateway' is missing or invalid.");
      throw err;
    }

    oThis.gateway = gateway;

    let abiBinProvider = new AbiBinProvider();
    let jsonInterface = abiBinProvider.getABI(ContractName);
    oThis.contract = new web3.eth.Contract(jsonInterface, oThis.gateway);

    if (!oThis.contract) {
      let err = new Error("Could not load Gateway contract for: ", oThis.gateway);
      throw err;
    }
  }

  proveGateway(blockHeight, rlpAccount, rlpParentNodes, txOptions) {
    const oThis = this;

    return oThis._proveGatewayRawTx(blockHeight, rlpAccount, rlpParentNodes, txOptions).then(function(tx) {
      return tx
        .send(tx.txOptions)
        .on('transactionHash', function(transactionHash) {
          console.log('\t - transaction hash:', transactionHash);
        })
        .on('receipt', function(receipt) {
          console.log('\t - Receipt:\n\x1b[2m', JSON.stringify(receipt), '\x1b[0m\n');
        })
        .on('error', function(error) {
          console.log('\t !! Error !!', error, '\n\t !! ERROR !!\n');
          return Promise.reject(error);
        });
    });
  }

  _proveGatewayRawTx(blockHeight, rlpAccount, rlpParentNodes, txOptions) {
    const oThis = this;

    txOptions = Object.assign(
      {
        gasPrice: '0x5B9ACA00',
        gas: '1000000'
      },
      txOptions || {}
    );

    if (!txOptions.from || !Web3.utils.isAddress(txOptions.from)) {
      let err = new Error("Mandatory Parameter 'facilitator' is missing or invalid.");
      return Promise.reject(err);
    }

    let contract = oThis.contract;

    return new Promise(function(onResolve, onReject){
      let tx = contract.methods.proveGateway(blockHeight, rlpAccount, rlpParentNodes);
      tx.txOptions = txOptions;
      onResolve(tx);
    });
  }

  progressStake(messageHash, unlockSecret, txOptions) {
    const oThis = this;

    return oThis._proveGatewayRawTx(messageHash, unlockSecret, txOptions).then(function(tx) {
      return tx
        .send(tx.txOptions)
        .on('transactionHash', function(transactionHash) {
          console.log('\t - transaction hash:', transactionHash);
        })
        .on('receipt', function(receipt) {
          console.log('\t - Receipt:\n\x1b[2m', JSON.stringify(receipt), '\x1b[0m\n');
        })
        .on('error', function(error) {
          console.log('\t !! Error !!', error, '\n\t !! ERROR !!\n');
          return Promise.reject(error);
        });
    });
  }

  _progressStakeRawTx(messageHash, unlockSecret, txOptions) {
    const oThis = this;

    txOptions = Object.assign(
      {
        gasPrice: '0x5B9ACA00',
        gas: '1000000'
      },
      txOptions || {}
    );

    if (!txOptions.from || !Web3.utils.isAddress(txOptions.from)) {
      let err = new Error("Mandatory Parameter 'facilitator' is missing or invalid.");
      return Promise.reject(err);
    }

    let contract = oThis.contract;

    return new Promise(function(onResolve, onReject){
      let tx = contract.methods.progressStake(messageHash, unlockSecret);
      tx.txOptions = txOptions;
      onResolve(tx);
    });
  }
}

module.exports = Gateway;