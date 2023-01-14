import Intermediary from 'truffleBuild/contracts/Intermediary.json';
const Contract = require('web3-eth-contract');
Contract.setProvider('ws://localhost:7545');
const abi = Intermediary.abi
const networkId = Object.entries(Intermediary.networks)[0][0]
const address = Intermediary.networks[networkId].address

const IntermediaryContract = new Contract(abi, address)
console.log(IntermediaryContract.methods)


function stake(address, amount) {
  return  IntermediaryContract.methods.stake(amount).send({from: address,gas: 3000000})
} 
function unstake(address) {
  return IntermediaryContract.methods.unstake().send({from: address,gas: 3000000})
}
function claim(address) {
  return IntermediaryContract.methods.claim().call()
}

function Staked(){
  return IntermediaryContract.events.Staked()
}
function UnStaked(){
  return IntermediaryContract.events.UnStaked()
}
/*function approveToken(address, amount) {
  return IntermediaryContract.methods.approveToken( amount).send({from: address,gas: 3000000})
}*/

/*
IntermediaryInterface.Staked(address,10)
  .on('data',(data)=>{console.log(data)})
  .on('error',(error)=>{console.error(error)})
  .on('changed',(changed)=>{console.log(changed)}) 
  .on('connected',(connected)=>{console.log(connected)})
  */

async function getStakingBalance(address){
  const result = await IntermediaryContract.methods.getStakingBalance(address).call()
  return result
}

async function depositStakingBalance(address) {
  const result = await IntermediaryContract.methods.depositStakingBalance(address).call()
  return result
}


async function totalSupply(){
  const result = await IntermediaryContract.methods.totalSupply().call()
  return result
}

const IntermediaryInterface = { stake, unstake, getStakingBalance, totalSupply, Staked, UnStaked, address, networkId, depositStakingBalance, /*approveToken,*/claim}
export default  IntermediaryInterface;
