import Head from 'next/head'
import { Box,  Flex, Grid, Img, Link, Text, VStack } from '@chakra-ui/react'
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
      <Flex justify={'center'}>
        <Grid 
        p={'6rem'}
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
            <Link key={product.id} href={product.slug}>
              <Flex cursor={'pointer'} pos={'relative'} w={'20rem'} align={'center'} justify={'center'} h={'15rem'} key={product.id}>
                <Img borderRadius={'0.5rem'} src={product.imgSrc} opacity={0.4} alt="imagemChocolate"  w={'100%'} h={'100%'} left={0} top={0} pos={'absolute'} />
                <VStack pos={'relative'}>                                   
                  <Text p={'0.5rem'} fontWeight={600} bg={'#f6eccf'} color={'#5d2e27'} fontSize={'1.5rem'}>{product.name}</Text>
                </VStack> 
              </Flex>
            </Link>
          ))}
        </Grid>
      </Flex>
    </>
  )
}

