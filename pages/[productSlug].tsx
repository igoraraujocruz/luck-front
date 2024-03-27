import { Flex, Heading, Image, ScaleFade, Spinner, Text, VStack } from "@chakra-ui/react"
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/hooks/useSocket";
import { TableNumbers } from "@/components/TableNumbers";
import { LuckNumber } from "@/interfaces/LuckNumber";
import { IProduct } from "@/interfaces/Product";
import { Regulation } from "@/components/Regulation";
import { ProductDesativated } from "@/components/ProductDisativated";
import { FormBuy } from "@/components/FormBuy";
import { QRCode } from "@/components/QRCode";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { AllBuyers } from "@/components/AllBuyers";

interface Props {
  producta: IProduct;
  productSlug: string;
}

export default function Product({ producta, productSlug }: Props) {
    const router = useRouter();
    const [selectedRifas, setSelectedRifas] = useState<LuckNumber[]>([])
    const [qrCode, setQrcode] = useState({} as any)
    const [loadingQRCODE, setLoadingQRCOde] = useState(false)
    const [userSocketId, setUserSocketId] = useState('')
    const socket = useContext(SocketContext);
    const [numberSeleted, setNumberSeleted] = useState(false)

    const handlesetSelectedRifas = (luckNumbers: LuckNumber[]) => {
      setSelectedRifas(luckNumbers)
    }

    const handlesetNumberSeleted = () => {
      setNumberSeleted(true)
    }

    const handleSetLoadingQRCOde = () => {
      setLoadingQRCOde(true)
    }

    const handleSetQrcode = (value: any) => {
      setQrcode(value)
    }

    useEffect(() => {
      socket.emit("room", productSlug);
    } ,[productSlug, socket])

    socket.on("mySocketId", data => {
      setUserSocketId(data);
    });

    socket.on("updateRifas", () => {
      router.replace(router.asPath);
    });    

    socket.on("client:reset", () => {
      setQrcode({})
      setLoadingQRCOde(false)
      setSelectedRifas([])
      setNumberSeleted(false)
    });        

    return (
        <>
            <Head>
                <title>{producta.name}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Flex flexDir={['column']} align={['center', 'center', 'start']} pt={'2.5rem'}>
              <Heading mb={'1rem'} fontFamily={'Madimi One, sans-serif;'} alignSelf={'center'}>{producta.name}</Heading>
              <Regulation />
  
              {producta.isActivate === false && (
                <VStack  w={'100%'} justify={'center'}>
                  <ProductDesativated />
                  <AllBuyers product={producta} />
                </VStack>
              )}

              <Flex flexDir={['column','column', 'row']} align={['center', 'center', 'start']} justify={'center'} gap={4} mt={'1rem'} w={'100%'}>
                
                <VStack opacity={producta.isActivate ? 1 : 0.5}>
                  <Image borderRadius={'2rem'} maxW={['22rem', '22rem', '24rem', '32rem', '33rem', '37rem']} 
                  src={producta.imgSrc} alt={producta.slug} />
                  <Text pos='relative' h={['11.5rem', '11.5rem', '10rem', '8rem']} top={['-12rem', '-12rem', '-12rem', '-10rem']}
                   bg={'rgba(48, 14, 2, 0.8)'} p={'0.5rem'} w={['22rem', '22rem', '23rem', '30rem']}
                   borderRadius={['2rem','2rem', '0.5rem']}>{producta.description}</Text>
                </VStack>
                  
                      
                <VStack mt={['-11rem', '-11rem', 0]} w={'45vw'}>
                  {!numberSeleted ? (
                    <Flex justify={'center'}  flexDir={'column'} align={'center'}>
                      <TableNumbers 
                        product={producta} 
                        handlesetNumberSeleted={handlesetNumberSeleted} 
                        handlesetSelectedRifas={handlesetSelectedRifas} 
                        selectedRifas={selectedRifas} />                          
                    </Flex>
                  ) : 
                  <ScaleFade initialScale={0.9} in={numberSeleted}>                    
                    {!loadingQRCODE ?
                      <FormBuy 
                        handleSetLoadingQRCOde={handleSetLoadingQRCOde} 
                        productId={producta.id} 
                        userSocketId={userSocketId}
                        selectedRifas={selectedRifas} 
                        handleSetQrcode={handleSetQrcode}
                      />
                    : 
                    qrCode.imagemQrcode == null ? 
                      <Spinner size={'lg'} /> 
                    :
                    <ScaleFade initialScale={0.9} in={numberSeleted}>
                      <QRCode qrCode={qrCode} /> 
                    </ScaleFade>
                } 
                </ScaleFade>
                  }
                </VStack>
                </Flex>
              </Flex>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ params }: any) => {

  const baseUrl =
  process.env.NODE_ENV === 'development'
    ? process.env.API_LOCALHOST
    : process.env.API_PRODUCTION;

  const { productSlug } = params;

  const response = await fetch(`${baseUrl}/products?productSlug=${productSlug}`)

  const producta = await response.json()
	
	return {
		props: 
      {
        producta,
        productSlug
      }
	}
}