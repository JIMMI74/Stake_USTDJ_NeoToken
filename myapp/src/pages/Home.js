import { useEffect, useState } from "react";
import "../App.css";
import Navbar from "../components/Navbar";
import Web3 from "web3";
import React from "react";
import {
  NotificationManager,
  NotificationContainer,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import NeoTokenInterface from "../utils/NeoTokenInterface";
import USTDJInterface from "../utils/USTDJInterface";
import IntermediaryInterface from "../utils/IntermediaryInterface";

export let web3;

// const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

const Home = () => {
  const [account, setAccount] = useState("");
  const [balanceNeoToken, setBalanceNeoToken] = useState(0);
  const [balanceUSTDJ, setBalanceUSTDJ] = useState(0);
  const [balance_investor, setBalance_investor] = useState(0);
  const [loading, setLoading] = useState(true);
  //per visual
  const [balanceStakeIntermediary, setStakeAmount] = useState(0);
  const [unStakeAmount, setUnStakeAmount] = useState(0);
  //per input
  const [amountToStake, setAmountToStake] = useState(0);
  const [amountToUnStake, setAmountToUnStake] = useState(0);

  useEffect(() => {
    loadWeb3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (account) {
      reloadAllBalances();
      //IntermediaryInterface.totalSupply().then((total)=>{console.log('neotoken in intermediay',total)})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  useEffect(() => {
    const eventStaked = IntermediaryInterface.Staked().on("data", (dati) => {
      console.log(dati);
      const blockNumber = dati.blockNumber;
      const { from, amount} = dati.returnValues;
      console.log("from", from,);
      if (from === account)
        NotificationManager.success(
          "Complimenti !! Hai messo in Staking " +
          (window.web3.utils.fromWei(amount, "ether")) +
            " USTDJ. BN: " +
            blockNumber
        );
      else
        NotificationManager.info(
          "Qualcuno ha messo in Stake " + (window.web3.utils.fromWei(amount, "ether")) + " USDTJ. BN: " + blockNumber
        );
    });
    const eventUnStaked = IntermediaryInterface.UnStaked().on(
      "data",
      (dati) => {
        console.log(dati);
        const blockNumber = dati.blockNumber;
        const { from, amount, reward } = dati.returnValues;
        if (from === account)
          NotificationManager.success(
            "Complimenti!! per il tuo staking hai ricevuto " +
            (window.web3.utils.fromWei(amount, "ether")) + "USDTJ" +
              " piu un bonus di " +
              (window.web3.utils.fromWei(reward, "ether")) +
              " USTDJ. BN: " +
              blockNumber
          );
        else
          NotificationManager.info(
            "Qualcuno ha messo fatto unSteke " +
            (window.web3.utils.fromWei(amount, "ether")) +
              " piu un bonus di " +
              (window.web3.utils.fromWei(reward, "ether")) +
              " neoToken. BN: " +
              blockNumber
          );
      }
    );
    return () => {
      eventStaked.unsubscribe();
      eventUnStaked.unsubscribe();
    };
  }, [account]);

  function reloadAllBalances() {
    loadBalanceNeoToken();
    loadMyBalanceUSTDJ();
    loadMyBalanceInvestor();
    loadMyStakeAmount();
  }

  async function loadWeb3() {
    setLoading(true);
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
    loadBlockchainData();
  }

  async function loadBlockchainData() {
    const web3 = window.web3;
    const account = await web3.eth.getAccounts();
    console.log("accounts", account);
    setAccount(account[0]);
    const networkId = await web3.eth.net.getId();
    console.log(networkId);
    setLoading(false);
  }

  async function loadBalanceNeoToken() {
    NeoTokenInterface.getBalanceOf(IntermediaryInterface.address)
      .then((risultato) => {
        //console.log('loadMyBalance',{risultato})
        if (risultato !== undefined) setBalanceNeoToken(window.web3.utils.fromWei(risultato, "ether"));
      })
      .catch((error) => {
        console.error("loadMyBalance", { error });
      });
  }
  async function loadMyBalanceUSTDJ() {
    USTDJInterface.getBalanceOf(account)
      .then((risultato) => {
        //console.log('loadMyBalance',{risultato})
        if (risultato !== undefined) setBalanceUSTDJ(window.web3.utils.fromWei(risultato, "ether"));
      })
      .catch((error) => {
        console.error("loadMyBalance", { error });
      });
  }

  async function loadMyBalanceInvestor() {
    // balance of investor
    USTDJInterface.getBalanceOfInvestor()
      .then((risultato) => {
        console.log("loadMyBalance", { risultato });
        if (risultato !== undefined) setBalance_investor(window.web3.utils.fromWei(risultato, "ether"));
      })
      .catch((error) => {
        console.error("loadMyBalance", { error });
      });
  }

  function loadMyStakeAmount() {
    console.log("loadMyStakeAmount");
    setLoading(true);
    IntermediaryInterface.getStakingBalance(account)
      .then((risultato) => {
        console.log("loadMyStakeAmount", { risultato });
        if (risultato !== undefined)
          setStakeAmount(window.web3.utils.fromWei(risultato, "ether"));
        setUnStakeAmount(window.web3.utils.fromWei(risultato, "ether"));
      })
      .catch((error) => {
        console.error("balanceStakeIntermediary", { error });
      });
  }

  async function stake() {
    //const amount = window.web3.utils.fromWei(amountToStake, 'wei')
    const amount = window.web3.utils.toWei(amountToStake, 'ether')
    console.log("stake", amount);
    setLoading(true);
    USTDJInterface.approve(account, amount).on(
      "transactionHash",
      async (hash) => {
        console.log("stake:hash:ustdj:transaction", { hash });
        await NeoTokenInterface.approve(account, amount).catch((e) => {
          console.error("stake:hash:catch_neo:transaction", e.message);
        });

        await NeoTokenInterface.checkAllowanceTo(account).then((r) =>
          console.log("allowanceto", r)
        );
        await NeoTokenInterface.checkAllowanceFrom(account).then((r) =>
          console.log("allowancefrom", r)
        );
        IntermediaryInterface.stake(account, amount)
          .on("transactionHash", (hash) => {
            console.log("stake:hash:int:transaction", { hash });
            reloadAllBalances();
            setLoading(false);
          })
          .catch((e) => {
            console.error("stake:hash:catch:transaction", e.message);
          });
      }
    );
  }

  async function unStake() {
    console.log("unStake", unStakeAmount, IntermediaryInterface.address);
    //let unStakeAmountInWei = window.web3.utils.toWei(unStakeAmount + 10, 'ether')
    const unStakeAmountInWei = window.web3.utils.toWei(unStakeAmount, "ether");
    setLoading(true);

    console.log({ unStakeAmountInWei });
    console.log(
      window.web3.utils.fromWei(
        await NeoTokenInterface.getBalanceOf(IntermediaryInterface.address),
        "ether"
      ),
      window.web3.utils.fromWei(
        await NeoTokenInterface.getBalanceOf(account),
        "ether"
      ),
      window.web3.utils.fromWei(
        await USTDJInterface.getBalanceOf(IntermediaryInterface.address),
        "ether"
      )
    );

    console.log(
      "deposit staking balance",
      await IntermediaryInterface.depositStakingBalance(account)
    );

    // allow the contract to spend the tokens

    console.log({ unStakeAmountInWei });
    let tx = await NeoTokenInterface.approve(account, unStakeAmountInWei);
    console.log("unStake:tx:neotoken:approve", { tx }, unStakeAmountInWei);
    console.log({ unStakeAmountInWei });
    console.log(
      "allowance: ",
      await NeoTokenInterface.checkAllowanceTo(
        account,
        IntermediaryInterface.address
      )
    );
    console.log(
      "allowance: ",
      await NeoTokenInterface.checkAllowanceFrom(
        account,
        IntermediaryInterface.address
      )
    );

    console.log({ unStakeAmountInWei });
    const bonus = await IntermediaryInterface.claim(account);
    const finalAmount = unStakeAmountInWei + bonus;
    // approvazione da account a ustdj
    let tx2 = await USTDJInterface.approve(account, finalAmount);
    console.log("unStake:tx:ustdj:approve", { tx2 }, unStakeAmountInWei);

    // approvazione da intermediary ad account
    /*await IntermediaryInterface.approveToken(account, finalAmount).catch(
      (e) => {
        console.error("unStake:tx:catch:approveToken", e.message);
      }
    );*/

    console.log({ unStakeAmountInWei });
    console.log({ IntermediaryInterface });
    // unstake
    IntermediaryInterface.unstake(account).on("transactionHash", (hash) => {
      console.log("unStake:hash:intermediary:transaction", { hash });
      reloadAllBalances();
      setLoading(false);
    });

    console.log({ unStakeAmountInWei });
  }

  return (
    <div className="main">
      <Navbar account={account} balance={0} />
      
      <div className="container">
      <h2>go to register and enter the address of your wallet to get more offers</h2>
        <div className="color-box">
          <h1 className="stake">
            <strong>Staking</strong>
          </h1>
        </div>
        <p className="word animation">Stake tokens to earn interest.</p>
      </div>
      <div className="insert">
        <span>
          {" "}
          <h2>Stake an amount of USDTJ</h2>
          <input
            type="number"
            placeholder="0"
            className="input"
            value={amountToStake}
            onChange={(e) => setAmountToStake(e.target.value)}
          />{" "}
        </span>
        <div className="DivStake">
        <button className="btnStake"
        onClick={() => {
          stake();
        }}            
      > Stake</button></div>

      <div className="DivStake">
      <button className="btnStake"
        onClick={() => {
          unStake();
        }}
      >Un-Stake
      </button>
      </div>
      </div>
      {/* {logo}<a href="paginaperInserimentoDati">Registrati</a> */}

      <div className="Result">
        <div className="Div">
          <h3 className="Texture">
            Intermediary NeoToken Balance = {balanceNeoToken.toLocaleString()}{" "}
            Eth
          </h3>
        </div>
      </div>
      <div className="Result">
      <div className="Div">
      <h3 className="Texture">
        Intermediary USTDJ Balance = {balance_investor.toLocaleString()} Eth
        </h3>
        </div>
      </div>
      <div className="Result">
      <div className="Div">
      <h3 className="Texture">
        MY USTDJ Balance = {balanceUSTDJ.toLocaleString()} Eth
        </h3>
        </div>
      </div>
      <div className="Result">
      <div className="Div">
      <h3 className="Texture">
        My StakingBalance = {balanceStakeIntermediary.toLocaleString()}
        </h3>
        </div>
      </div>
      <div
        className="load"
        hidden={!loading}
        style={{ position: "absolute", hight: 100, width: 100 }}
      >
        ...
      </div>
      <NotificationContainer />
    </div>
  );
};
export default Home;
