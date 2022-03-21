import Link from "next/link"

import { 
    Center, Flex, Text, Box, Heading, Divider, 
    Button, VStack, HStack,
    Input,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    SimpleGrid,
    Form,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
} from '@chakra-ui/react';

import { useEffect, useState } from "react";
import Web3 from "web3";
import ABI from "../../abi/contracts/Crud.json";

const targetNetId = 3; // Ropsten
const contractAddress = "0x02B8795adCd58c03Fb6fcD2D08B5452710AA5D51";

function App() {
    const [account, setAccount] = useState(); // 设置账号的状态变量
    const [web3, setWeb3] = useState();
    const [netId, setNetId] = useState(); 
    const [contract, setContract] = useState();
    
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

    const checkNetId = () => {
        if (netId != targetNetId) {
            return (
                <Alert status='error'>
                <AlertIcon />
                <AlertTitle mr={2}>Wrong network!</AlertTitle>
                <AlertDescription>Please connect to Ropsten test network.</AlertDescription>
                </Alert>
            )
        } else {
            return (<></>)
        }
    }
    return (
        <Box>
            网络ID: {netId}
            {checkNetId()}
            <br/>
            当前账号： {account}
            <br/>
            合约地址: { contractAddress }
            <hr/>
            Total users: { totalUsers }
            <hr/>
            <SimpleGrid columns={1} spacing={5}>
                <Box>
                    <form onSubmit={e => create(e)}>
                        <FormControl >
                            <FormLabel htmlFor="create"> Create </FormLabel>
                            <Input placeholder="New user's name" />                            
                            <Button type="submit" colorScheme='blue'>Create</Button>
                            <FormHelperText>Create result: {createResult}</FormHelperText>
                        </FormControl>                    
                    </form>
                </Box>
                <Box>
                    <form onSubmit={e => read(e)}>
                        <FormControl >
                            <FormLabel htmlFor="read"> Retrieve </FormLabel>
                            <Input placeholder="User ID" />
                            <Button type="submit" colorScheme='blue'>Retrieve</Button>
                            <FormHelperText>Retrieve result: {readResult}</FormHelperText>
                        </FormControl>
                    </form>
                </Box>
                <Box>
                    <form onSubmit={e => update(e)}>
                        <FormControl >
                            <FormLabel htmlFor='update'>Update</FormLabel>
                            <Input placeholder="User ID" />
                            <Input placeholder="New user name" />
                            <Button type="submit" colorScheme='blue'>Update</Button>
                            <FormHelperText>Update result: {updateResult}</FormHelperText>
                        </FormControl>
                    </form>
                </Box>
                <Box>
                    <form onSubmit={e => delete_user(e)}>
                        <FormControl>
                            <FormLabel htmlFor="delete"> Delete </FormLabel>
                            <Input placeholder="User ID" />
                            <Button type="submit" colorScheme='blue'> Delete </Button>
                            <FormHelperText>Delete result: {deleteResult}</FormHelperText>
                        </FormControl>
                    </form>
                </Box>
            </SimpleGrid>
        </Box>
    );
}


export default function CRUD() {
    return (
        <Box>
            <VStack spacing={12}>
                <Heading
                    fontWeight="semibold"
                    mb="1rem"
                    textAlign="left"
                    fontSize={["4xl", "4xl", "5xl", "5xl"]}
                >
                    CRUD
                </Heading>

                <App />             
                <Text
                    color="pink.800"
                    fontWeight="semibold"
                    mb="1rem"
                    textAlign="left"
                    textDecoration="underline"
                    fontSize={["1xl", "1xl", "2xl", "2xl"]}
                >
                    <Link href="/">
                        <a>Back to Home</a>
                    </Link>
                </Text>   
            </VStack> 
        </Box>
    )
  }