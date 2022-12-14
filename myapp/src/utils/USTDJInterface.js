import USTDJ from "truffleBuild/contracts/USDTJ.json";
import IntermediaryInterface from "./IntermediaryInterface";
const Contract = require("web3-eth-contract");
Contract.setProvider("ws://localhost:7545");
const abi = USTDJ.abi;
export const networkId = Object.entries(USTDJ.networks)[0][0]; // address contr
const address = USTDJ.networks[networkId].address;

const USTDJContract = new Contract(abi, address);

//const address_one = "0x76a9B5E8B353262aafc5B2aDCb99a7E686a64e75";

async function getBalanceOf(address) {
  const result = await USTDJContract.methods.balanceOf(address).call();
  return result;
}

async function getBalanceOfInvestor() {
  const balance_investor = await USTDJContract.methods
    .balanceOf(IntermediaryInterface.address)  //c'era address_one 1000 eth address one// ora passo il balance of dell'intermediary
    .call();
  return balance_investor;
}
function approve(spender, value) {
  console.log({USTDJContract})
  return  USTDJContract.methods.approve( IntermediaryInterface.address, value).send({from: spender,gas: 3000000});
}
const USTDJInterface = {USTDJContract, getBalanceOf, getBalanceOfInvestor, approve };
export default USTDJInterface
