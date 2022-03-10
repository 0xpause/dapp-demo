import Link from "next/link"

import chalk from 'chalk';

import { useEffect, useState } from "react";
import Web3 from "web3";
// import { unlockAccount } from "./api/web3_utils";
import ABI from "../../abi/contracts/ERC20.json";
import UniswapV2FactoryABI from "../../abi/contracts/UniswapV2Factory.json";

const Token_Addr = "0x888EF71766ca594DED1F0FA3AE64eD2941740A20"; // FTM Solidly
const Factory_Addr = "0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3"; // FTM spooky factory;
const USDC_Addr = "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75"; // FTM USDC 
const wETH = "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83"; // FTm wFTM

function App() {
    const [account, setAccount] = useState(); // 设置账号的状态变量
    const [web3, setWeb3] = useState();
    const [netId, setNetId] = useState(); 
    const [contract, setContract] = useState();
    const [tokenAddress, setTokenAddress] = useState(Token_Addr);
    const [factoryContract, setFactoryContract] = useState();

    const [tokenName, setTokenName] = useState();
    const [balance, setBalance] = useState();
    const [decimals, setDecimals] = useState();
    const [symbol, setSymbol] = useState();

    useEffect(() => {
        async function load() {
            const web3 = new Web3(
                Web3.givenProvider || "http://localhost:7545"
            );
            const accounts = await web3.eth.requestAccounts();
            const netId = await web3.eth.net.getId();

            setAccount(accounts[0]);
            setWeb3(web3);
            setNetId(netId);
        }

        load();
        window.ethereum.on('accountsChanged', accounts => {
          setAccount(accounts[0]);
        });
    }, []);

    async function handleAdressChange(e) {
        e.preventDefault();
        const addr = e.target.value;
        if (addr === null || addr === undefined || addr === "") {
            return;
        }

        const _contract = new web3.eth.Contract(
            ABI.abi,
            addr
          )
        setContract(_contract);
        setTokenAddress(addr);

        // const token = await contract.methods.balanceOf('0x60DD478DE2a7c20820a7435c85d408A636Fd6EBF').call();
        const _name = await _contract.methods.name().call();
        setTokenName(_name);
        const _decimals = await _contract.methods.decimals().call();
        setDecimals(_decimals);
        const _symbol = await _contract.methods.symbol().call();
        setSymbol(_symbol);
        let _balance = await _contract.methods.balanceOf(account).call();
        _balance = _balance / (10**_decimals);
        setBalance(_balance);

        // uniswap factory info
        const factory = new web3.eth.Contract(UniswapV2FactoryABI.abi, Factory_Addr)
        const pairAddressx = await factory.methods.getPair(wETH, tokenAddress).call();
        console.log(chalk.blue(`pairAddress: ${pairAddressx}`));

    }

    return (<div>
      网络ID: {netId}
      <br/>
      当前账号： {account}
      <hr/>
      <form>
          <label>合约地址：</label>
          <input type="text" onChange={e => {handleAdressChange(e)}} />
      </form>
      
      合约地址: { tokenAddress }
      <br/>
      Token: {tokenName}
      <br/>
      symbol: {symbol}
      <br/>
      Balace: { balance }
      <br/>
      decimals: {decimals}
      <br/>       

      <hr/>
      
    </div>);
}


export default function Trader() {
    return (
        <>
        <h1>Trader</h1>
        <hr/>
        <App/>
        <hr/>
        <h2>
            <Link href="/">
                <a>Back to Home</a>
            </Link>
        </h2>
        </>
    )
  }