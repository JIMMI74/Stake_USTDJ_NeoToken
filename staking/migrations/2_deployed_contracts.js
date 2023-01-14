const NeoToken = artifacts.require("NeoToken");
const USDTJ = artifacts.require("USDTJ");
const Intermediary = artifacts.require("Intermediary");
module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(NeoToken)
  const neoToken = await NeoToken.deployed() // ha  2000000000 * 10**decimals()

  console.log("Neo Token deployed: ", neoToken.address)

  await deployer.deploy(USDTJ)
  const usdtj = await USDTJ.deployed() //  2000000000 * 10**decimals()
  console.log("StableCoin USTDJ deployed: ", usdtj.address)

  // Intermediary  inizializato adress di neoToken e usdtj 
  await deployer.deploy(Intermediary, neoToken.address, usdtj.address)
  const intermediary = await Intermediary.deployed()
  console.log(" Intermediary deployed: ", intermediary.address)
  console.log((await neoToken.balanceOf(neoToken.address)).toString())
  // in neoToken l'adress = > 1000000000000000000000000
  //msg sender e accounts[0] di ganache
  await neoToken.transfer(intermediary.address, '1500000000000000000')
  await usdtj.transfer(intermediary.address,    '15000000000000000000')
  // TRSAFER PRENDE DA CHI CHIAMA E LO MANDA A                 
  //console.log(intermediary.address)
  // in usdtj l'adress = > 100000000000000000000
  await usdtj.transfer(accounts[1], '400000000000000001') //Accounts Uilizzato su Metamask

  await usdtj.transfer(accounts[2], '400000000000000001')   

  await usdtj.transfer(accounts[3], '5000000')
  
  
  //console.log(accounts[1], 'accounts number 1')


};