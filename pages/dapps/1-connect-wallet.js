import Link from "next/link"

import { useEffect, useState } from "react";
import { 
    Center, Flex, Text, Box, Heading, Divider, 
    Button, VStack
} from '@chakra-ui/react';

import Web3 from "web3";

function App() {
    const [account, setAccount] = useState(); // 设置账号的状态变量
    const [web3, setWeb3] = useState();
    const [netId, setNetId] = useState(); 

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

    async function handleConnect(e) {
        await window.ethereum.enable();
    } 

    return (
        <Box>
            <Button onClick={e => handleConnect(e) }> Connect </Button>
            <Text
                fontWeight="semibold"
                mb="1rem"
                textAlign="left"
                fontSize={["1xl", "1xl", "2xl", "2xl"]}
            >
                网络ID: {netId}
                <br/>
                当前账号： {account}
            </Text>
        </Box>
    );
}


export default function HelloWorld() {
    return (
        <Box>
            <VStack spacing={12}>
                <Heading
                    fontWeight="semibold"
                    mb="1rem"
                    textAlign="left"
                    fontSize={["4xl", "4xl", "5xl", "5xl"]}
                >
                    Connect to Metamask
                </Heading>

            <App />             
            <Text
                color="pink.800"
                fontWeight="semibold"
                mb="1rem"
                textAlign="left"
                textDecoration="underline"
                fontSize={["2xl", "2xl", "3xl", "3xl"]}
            >
                <Link href="/">
                    <a>Back to Home</a>
                </Link>
            </Text>   
            </VStack> 
        </Box>
    )
  }