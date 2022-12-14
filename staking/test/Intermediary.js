// il problema era questo import 
//const { it } = require('node:test')

const USDTJ = artifacts.require('USDTJ')
const Intermediary = artifacts.require('Intermediary')
const NeoToken = artifacts.require('NeoToken')

require('chai')
    .use(require('chai-as-promised'))
    .should()

/*
usdtj  methods: {
      'allowance(address,address)': [Function],
      'approve(address,uint256)': [Function],
      'balanceOf(address)': [Function],
      'decimals()': [Function],
      'decreaseAllowance(address,uint256)': [Function],
      'increaseAllowance(address,uint256)': [Function],
      'name()': [Function],
      'owner()': [Function],
      'symbol()': [Function],
      'totalSupply()': [Function],
      'transfer(address,uint256)': [Function],
      'transferFrom(address,address,uint256)': [Function]
    },
neoToken     methods: {
      'allowance(address,address)': [Function],
      'approve(address,uint256)': [Function],
      'balanceOf(address)': [Function],
      'decimals()': [Function],
      'decreaseAllowance(address,uint256)': [Function],
      'increaseAllowance(address,uint256)': [Function],
      'name()': [Function],
      'owner()': [Function],
      'symbol()': [Function],
      'totalSupply()': [Function],
      'transfer(address,uint256)': [Function],
      'transferFrom(address,address,uint256)': [Function],
      'transferTo1(address,uint256)': [Function],
      'transferFrom1(address,uint256)': [Function]
    },
intermediary     methods: {
      'depositStakingBalance(address)': [Function],
      'investors(uint256)': [Function],
      'isStaking(address)': [Function],
      'name()': [Function],
      'owner()': [Function],
      'reward(address)': [Function],
      'staked(address)': [Function],
      'stake(uint256)': [Function],
      'unstake()': [Function],
      'claim()': [Function],
      'getBalance(address)': [Function],
      'getReward(address)': [Function],
      'getStakingBalance(address)': [Function]
    },
*/
contract('Intermediary', ([customer, owner]) => {
    let neoToken, usdtj, intermediary

    function tokens(number) {
        return web3.utils.toWei(number, 'ether')
    }

    before(async () => {
        // Load Contracts
        usdtj = await USDTJ.new({from:owner})
        neoToken = await NeoToken.new({from:owner})
        intermediary = await Intermediary.new(neoToken.address, usdtj.address,{from:owner})

        await neoToken.transfer(intermediary.address, tokens('1000000'),{from:owner})

        await usdtj.transfer(customer, tokens('100'), { from: owner })
    })
    

    describe('USDTJ Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await usdtj.name()
            assert.equal(name, 'USDTJ')
        })
    })

    describe('NeoToken Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await neoToken.name()
            assert.equal(name, 'NeoToken')
        })
    })

    describe('Intermediary Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await intermediary.name()
            assert.equal(name, 'Intermediary')
        })

        it('contract has tokens', async () => {
            let balance = await neoToken.balanceOf(intermediary.address)
            assert.equal(balance.toString(), '1000000000000000000000000')
        })
        it('staking',async()=>{
            await usdtj.approve(intermediary.address,10)
            await intermediary.stake(10);
        })
        it('unstake',async()=>{
            await intermediary.unstake();
        })
        describe('Yield Farming', async () => {
            return true;
            it('rewards tokens for staking', async () => {
                let result

                // Check Investor Balance
                result = await usdtj.balanceOf(customer)
                assert.equal(result.toString(), tokens('100'), 'customer USDTJ wallet balance before staking')

                // Check Staking For Customer of 100 tokens
                await usdtj.approve(intermediary.address, tokens('100'), { from: customer })
                await intermediary.stake(tokens('100'), { from: customer })
                // Check Updated Balance of Customer
                result = await usdtj.balanceOf(customer)
                assert.equal(result.toString(), tokens('0'), 'customer mock wallet balance after staking 100 tokens')

                // Check Updated Balance
                result = await usdtj.balanceOf(intermediary.address)
                assert.equal(result.toString(), tokens('100'), 'intermediary  wallet balance after staking from customer')

                // Check Staking Balance
                result = await intermediary.depositStakingBalance(customer)
                assert.equal(result.toString(), tokens('100'), 'customer staking balance after staking 100 tokens')

                // Is Staking   
                result = await intermediary.isStaking(customer)
                assert.equal(result.toString(), 'true', 'customer is staking')

                 //claim Tokens
               // await intermediary.claim({ from: owner })

                // Check Balance after issuance
                //result = await neoToken.balanceOf(customer)
                // assert.equal(result.toString(), tokens('100'), 'customer NeoToken wallet balance after issuance')

                // Ensure only owner can issue tokens
                await intermediary.claim({ from: customer }).should.be.rejected;

                // Unstake Tokens
                await intermediary.unstake({ from: customer })
                






                
            })
        })
    })
})



