import Link from "next/link"

import { useEffect, useState } from "react";
import Web3 from "web3";
import ABI from "../../abi/contracts/Crud.json";

const contractAddress = "0x02B8795adCd58c03Fb6fcD2D08B5452710AA5D51";

function App() {
    const [account, setAccount] = useState(); // 设置账号的状态变量
    const [web3, setWeb3] = useState();
    const [netId, setNetId] = useState(); 
    const [contract, setContract] = useState();
    const [contractAddress, setContractAddress] = useState();
    
    const [totalUsers, setTotalUsers] = useState();
    const [createResult, setCreateResult] = useState();
    const [readResult, setReadResult] = useState();
    const [updateResult, setUpdateResult] = useState();
    const [deleteResult, setDeleteResult] = useState();

    useEffect(() => {
        async function load() {
            const web3 = new Web3(
                Web3.givenProvider || "http://localhost:7545"
            );
            const accounts = await web3.eth.requestAccounts();
            const netId = await web3.eth.net.getId();
            const contract = new web3.eth.Contract(
              ABI.abi,
              contractAddress
            )

            setAccount(accounts[0]);
            setWeb3(web3);
            setNetId(netId);
            setContract(contract);
            setTotalUsers((await contract.methods.nextId().call()) - 1);

        }

        load();
        window.ethereum.on('accountsChanged', accounts => {
          setAccount(accounts[0]);
        });
    }, []);

    async function queryUserNumber() {
        contract.methods.nextId().call()
        .then(result => {            
            console.log("Total users:", result-1);
            setTotalUsers(result - 1);
        })
        .catch( _e => {
            console.log("Reading user number error:", _e)
        });
    }

    
    async function create(e) {
        e.preventDefault();
        const name = e.target.elements[0].value;
        console.log("Create name:", name)
        contract.methods.create(name).send({from: account})
        .then(result => {
            setCreateResult(`New user ${name} created.`)
        })
        .catch( _e => {
            setCreateResult("Error when creating new user...")
        })
        .then( result => {
            queryUserNumber();
        });
    }

    async function read(e) {
        e.preventDefault();
        const id = e.target.elements[0].value;
        console.log("Reading ID: ", id)
        contract.methods.read(id).call()
        .then(result => {
            setReadResult(`ID: ${result[0]}, name: ${result[1]}`)
        })
        .catch( _e => {
            setReadResult(`Error when reading ID: ${id}`)
        })
        .then( result => {
            queryUserNumber();
        })
    }

    async function update(e) {
        e.preventDefault();
        const id = e.target.elements[0].value;
        const name = e.target.elements[1].value;
        console.log(`Update ID: ${id} with name: ${name}`)
        contract.methods.update(id, name).send({from: account})
        .then(result => {
            setUpdateResult(`Update ID: ${id} to name: ${name}`);
        })
        .catch( _e => {
            setUpdateResult(`Error when update ID: ${id}`)
        })
        .then( result => {
            queryUserNumber();
        })
    }

    async function delete_user(e) {
        e.preventDefault();
        const id = e.target.elements[0].value;
        contract.methods.destroy(id).send({from: account})
        .then( result => {
            setDeleteResult(`Delete user: ${id}`)
        })
        .catch( _e => {
            setDeleteResult("Error whe delete user")
        })
        .then( result => {
            queryUserNumber();
        })
    }

    return (<div>
      网络ID: {netId}
      <br/>
      当前账号： {account}
      <br/>
      合约地址: { contractAddress }
      <hr/>
      Total users: { totalUsers }
      <hr/>
      <form onSubmit={e => create(e)}>
        <label htmlFor="create"> Name </label>
        <input type="text" className="form-control" id="create" />
        <button type="submit" className="btn btn-primary">Create</button>
      </form>
      注册结果: {createResult}
      <hr/>
      <form onSubmit={e => read(e)}>
          <label htmlFor="read"> ID </label>
          <input type="text" className="form-control" id="read" />
          <button type="submit" className="btn btn-primary">Read</button>
      </form>
      读取结果: {readResult}
      <hr />
      <form onSubmit={e => update(e)}>
          <label htmlFor="update"> ID </label>
          <input type="text" className="form-control" id="update" />
          <label htmlFor="update"> Name </label>
          <input type="text" className="form-control" id="update" />
          <button type="submit" className="btn btn-primary"> Update </button>
      </form>
      更新结果: {updateResult}
      <hr />
      <form onSubmit={e => delete_user(e)}>
          <label htmlFor="delete"> ID </label>
          <input type="text" className="form-control" id='delete'/>
          <button type="submit" className="btn btn-primary"> Delete </button>
      </form>
      删除结果：{deleteResult}

    </div>);
}


export default function HelloWorld() {
    return (
        <>
        <h1>2. Crud</h1>
        <App />
        <h2>
            <Link href="/">
                <a>Back to Home</a>
            </Link>
        </h2>
        </>
    )
  }