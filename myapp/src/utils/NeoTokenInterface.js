import NeoToken from 'truffleBuild/contracts/NeoToken.json';
import IntermediaryInterface from './IntermediaryInterface';
const Contract = require('web3-eth-contract');
Contract.setProvider('ws://localhost:7545');
const abi = NeoToken.abi
export const networkId = Object.entries(NeoToken.networks)[0][0]
const address = NeoToken.networks[networkId].address

const NeoTokenContract = new Contract(abi, address)


async function getBalanceOf(address) {
  const result = await NeoTokenContract.methods.balanceOf(address).call()
  return result
}
function approve(address, amount) {
  return NeoTokenContract.methods.approve(IntermediaryInterface.address, amount).send({from: address,gas: 3000000})


}
// check del allowance passandogli l'account  da intermediary a
async function checkAllowanceTo(address) {
  return NeoTokenContract.methods.allowance(IntermediaryInterface.address,address ).call()
}
// check del allowance passandogli l'account  da  adress a intermediary 
async function checkAllowanceFrom(address) {
  return NeoTokenContract.methods.allowance(address,IntermediaryInterface.address).call()
}


const NeoTokenInterface = {getBalanceOf, approve, address, networkId,checkAllowanceTo,checkAllowanceFrom}
export default NeoTokenInterface
