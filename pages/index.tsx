import Head from 'next/head'
import { Box,  Flex, Grid, Heading, Img, Link, Text, VStack } from '@chakra-ui/react'
import { useEffect,  useState } from 'react'
import { api } from '@/api';


interface Product {
  id: string;
  name: string;
  luckDay: string;
  imgSrc: string;
  slug: string;
  price: string;
}


export default function Home() {
  const [products, setProducts] = useState<Product[]>([])


  const fetchAllData = async() => {
    try {
      const response = await api.get('/products')
      setProducts(response.data)
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchAllData()
  } ,[])

  return (
    <>
      <Head>
        <title>Cacau BOX</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex justify={'center'} align={'center'} p={'3rem'} flexDir={'column'}>
        <Heading>Sorteios Ativos</Heading>
        <Grid 
        p={'2rem'}
        justifyContent={'center'}
        alignContent={'center'}
        templateColumns={[
          '1fr',
          '1fr',
          '1fr 1fr',
          '1fr 1fr 1fr',
          '1fr 1fr 1fr 1fr',
        ]}
        gap="1rem"
        >
          {products.map(product => (
            <Link key={product.id} href={product.slug} _hover={{ textDecoration: "none" }}>
              <Flex cursor={'pointer'} border={'0.5rem solid #f6eccf'} borderRadius={'2rem'} pos={'relative'} w={'18rem'} align={'center'} justify={'center'} h={'18rem'} key={product.id}>
                <Img borderRadius={'0.5rem'} src={product.imgSrc} opacity={0.8} alt="imagemChocolate"  w={'100%'} h={'100%'} left={0} top={0} pos={'absolute'} />
                <VStack pos={'relative'} w={'100%'} h={'100%'}>                                   
                  <Text p={'0.5rem'} fontWeight={600} color={'#f6eccf'} fontSize={'1.5rem'}>{product.name}</Text>
                </VStack> 
              </Flex>
            </Link>
          ))}
        </Grid>
      </Flex>
    </>
  )
}

