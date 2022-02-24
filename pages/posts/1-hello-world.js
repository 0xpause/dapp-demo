import Link from "next/link"

// import './App.css';
// import {Message, Button} from "semantic-ui-react"
import { useEffect, useState } from "react";
import Web3 from "web3";
// import { unlockAccount } from "./api/web3_utils";
import HelloWorldABI from "../../abi/contracts/HelloWorld.json";

const HelloWorld_ADDR = "0xb9f74Fe40bb320672E38406e09327343E29d403C";

function App() {
    const [account, setAccount] = useState(); // 设置账号的状态变量
    const [web3, setWeb3] = useState();
    const [netId, setNetId] = useState(); 
    const [contract, setContract] = useState();
    const [greetWord, setGreetWord] = useState();

    useEffect(() => {
        async function load() {
            const web3 = new Web3(
                Web3.givenProvider || "http://localhost:7545"
            );
            const accounts = await web3.eth.requestAccounts();
            const netId = await web3.eth.net.getId();
            const contract = new web3.eth.Contract(
              HelloWorldABI.abi,
              HelloWorld_ADDR
            )
            const greetWord = await contract.methods.greet().call();

            setAccount(accounts[0]);
            setWeb3(web3);
            setNetId(netId);
            setContract(contract);
            setGreetWord(greetWord);
        }

        load();
        window.ethereum.on('accountsChanged', accounts => {
          setAccount(accounts[0]);
        });
    }, []);

    return (<div>
      网络ID: {netId}
      <br/>
      当前账号： {account}
      <hr/>
      <form>
        <input type="text"/>
      </form>
      合约地址: { HelloWorld_ADDR }
      <br/>
      初次见面: { greetWord }
      <ul>
        <li onClick={() => {window.alert()}}>HelloWorld</li>
      </ul>
    </div>);
}


export default function HelloWorld() {
    return (
        <>
        <h1>1. Hello world</h1>
        <App />
        <h2>
            <Link href="/">
                <a>Back to Home</a>
            </Link>
        </h2>
        </>
    )
  }