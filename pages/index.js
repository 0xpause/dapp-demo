import Head from 'next/head'
import Link from 'next/link'

import { 
  Center, 
  Flex, 
  Text, 
  Box, 
  Heading,
  Divider, 
  Button,
  VStack,
  SimpleGrid
} from '@chakra-ui/react';

import ProjectCard from '../components/project-card';

export default function Home() {
  return (
    <Box>
      <Head>
        <title>Learn dapp by examples</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Center>
        <VStack spacing={12}>
          <Heading>
            Learn dapp by examples
          </Heading>
          <SimpleGrid>
            <ProjectCard
              key={1}
              name={"Connect Wallet"}
              description={"Connect to wallet and get information of current account."}
              link={"/dapps/1-connect-wallet"}
              type={"Web App"}
            />
            <ProjectCard
              key={2}
              name={"CRUD"}
              description={"Interact with smart contract: Create, Retrieve, Update Delete."}
              link={"/dapps/2-crud"}
              type={"Web App"}
            />
          </SimpleGrid>
        </VStack>
      </Center>
    </Box>
  )
}
