import { AspectRatio, Box, Button, Flex, Grid, Heading, Image, Img, ScaleFade, Spinner, Text, VStack, useDisclosure, useToast } from "@chakra-ui/react"
import axios from "axios";
import { GetServerSideProps } from "next"
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '@/components/Input';
import { MaskedInput } from '@/components/MaskedInput';
import NextImage from 'next/image'
import { SocketContext } from "@/hooks/useSocket";
import { useRouter } from 'next/router';
import { api } from "@/api";


interface Params extends ParsedUrlQuery {
    productSlug: string
}

export interface Produto {
    produto: {
      id: string
      name: string
      imgSrc: string
      videoSrc: string
      description: string
      luckDay: string
      slug: string
      price: string
      quantidadeDeRifas: number
      rifasRestantes: number
      createdAt: string
      updatedAt: string
      rifas: Rifa[]
    }
  }

  export interface NewProduct {
    id: string
    name: string
    imgSrc: string
    videoSrc: string
    description: string
    luckDay: string
    slug: string
    price: string
    quantidadeDeRifas: number
    rifasRestantes: number
    createdAt: string
    updatedAt: string
    rifas: Rifa[]
  }
  
  export interface Rifa {
    id: string
    number: number
    isPaid: boolean
    productId: string
    createdAt: string
    updatedAt: string
    client: Client[]
  }
  
  export interface Client {
    id: string
    name: string
    socketId: string;
    numberPhone: string
    createdAt: string
    updatedAt: string
  }

  type ValidadeFormData = {
    name: string;
    numberPhone: string;
  };

const validateFormSchema = yup.object().shape({
    name: yup.string().required('O nome necessário'),
    numberPhone: yup
        .string()
        .required('Nº de Celular é obrigatório')
        .matches(
            /^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/,
            'Número de telefone inválido',
        )
});
  

export default function Product() {
    const [selectedRifas, setSelectedRifas] = useState<Rifa[]>([])
    const [qrCode, setQrcode] = useState({} as any)
    const [loadingQRCODE, setLoadingQRCOde] = useState(false)
    const [product, setProduct] = useState({} as NewProduct)
    const [reloadPage, setReloadPage] = useState(false)
    const [userSocketId, setUserSocketId] = useState('')
    const { query } = useRouter();
    const socket = useContext(SocketContext);

    useEffect(() => {
      if(!query.productSlug) {
        return;
      }

      api.get(`/products?productSlug=${query.productSlug}`)
      .then((response) => setProduct(response.data))

      socket.emit("room", query.productSlug);

    } ,[reloadPage, query, socket])


    socket.on("mySocketId", data => {
      setUserSocketId(data);
    });

    const toast = useToast();
    const { isOpen, onClose, onToggle } = useDisclosure()

    socket.on("updateRifas", () => {
      setReloadPage(!reloadPage)
    });    

    socket.on("client:reset", () => {
      setQrcode({})
      setLoadingQRCOde(false)
      setSelectedRifas([])
      onClose()
    });  

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<ValidadeFormData>({
        resolver: yupResolver(validateFormSchema),
      });

      const sendRifasForApi = async (client: ValidadeFormData) => {
        try {
          setLoadingQRCOde(true)
          const response = await api.post('/clients', {
            name: client.name,
            numberPhone: client.numberPhone,
            productId: product.id,
            socketId: userSocketId,
            rifas: selectedRifas.map(newRifas => newRifas.id)
          })
    
          toast({
            title: 'Rifas compradas com sucesso.',
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
    
          setQrcode(response.data)
          
        } catch(err: any) {
          toast({
            title: err.response.data.message,
            status: 'error',
            duration: 2000,
            isClosable: true,
          })
        }
      }

      async function copyTextToClipboard(text: string) {
    if ('clipboard' in navigator) {
      return navigator.clipboard.writeText(text);
    }
    return document.execCommand('copy', true, text);
  }

      const handleCopyClick = () => {
        copyTextToClipboard(qrCode.qrcode);
      };

    const handleSelectRifas = (rifa: Rifa) => {
        if (selectedRifas.includes(rifa)) {
          setSelectedRifas(selectedRifas.filter(item => item.id !== rifa.id))
          return
        }
        setSelectedRifas((prev) => [...prev, rifa])
      }

    const rifaJaComprada = () => {
        return toast({
          title: 'Essa rifa já foi comprada',
          status: 'error',
          duration: 2000,
          isClosable: true,
        })
      }

      const verifyRifas = () => {
        if(selectedRifas.length === 0) {
          return toast({
            title: 'Selecione ao menos um número...',
            status: 'warning',
            duration: 2000,
            isClosable: true,
          })
        }
        scroll(0, 100);
        onToggle()
      }

    return (
        <>
            <Head>
                <title>{product.name}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Flex  flexDir={['column', 'column', 'row']}>
                <VStack w={['100%', '100%', '300rem']} h="100%">
                <VStack justify={'center'} p={['10rem', '10rem', 0]} w={'100%'} align={['center', 'center', 'start', 'center']} h={['40vh', '40vh', '100vh']}>
                                <VStack pos={'relative'}>
                                  <VStack bg='#300E02' align={'start'} w={['20rem', '20rem', '20rem', '30rem']} borderRadius={'0.5rem'} p={'2rem'} mt={['3rem', '3rem', 0]}>
                                    <Text  fontSize={['2rem']}  overflowY={'auto'}>{product.name}</Text>
                                    <Text>Como participar:</Text>
                                    <Text>1º Selecione seus números.</Text>
                                    <Text>2º Clique em no botão Continuar.</Text>
                                    <Text>3º Insira seus dados.</Text>
                                    <Text>4º Clique em comprar, e pronto!</Text> 
                                    <Text>Seu número estará reservado até a data do sorteio.</Text>
                                  </VStack>
                                  <Img src="egg.png" alt="imagemChocolate" pos={'absolute'} top={['21rem', '21rem', '18rem', '16rem']} left={['18rem', '18rem', '17rem', '27rem' ]}  w={['3rem', '3rem', '5rem']} h={['3rem', '3rem', '5rem']} />
                                </VStack> 
                               
                            </VStack>
                </VStack>
                <Flex w={['100%', '100%', '150rem']} p='2rem' justify={'center'}>
                    {!isOpen ? (
                        <Flex justify={'center'}  flexDir={'column'} align={'center'}>
                            
                            
                            
                            {product.rifas?.length > 0 ? (
                                <Flex flexDir={'column'} justify={'center'} align={'center'}>
                                <Grid
                                mt={['5rem', '5rem', 0]}
                          
                                templateColumns={[
                                    '1fr 1fr 1fr 1fr 1fr 1fr',
                                    '1fr 1fr 1fr 1fr 1fr 1fr',
                                    '1fr 1fr 1fr 1fr 1fr',
                                    '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                                    '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                                    '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                                ]}
                      
                                gap="0.5rem"
                                >
                                    {product.rifas.sort((a, b) => a.number - b.number).map(rifa => (
                                        <Flex onClick={() => rifa.client[0]?.id.length > 0 ? rifaJaComprada() : handleSelectRifas(rifa)} cursor={rifa.client[0]?.id.length > 0 ? 'default' : 'pointer'} borderRadius={'1rem'} _hover={{
                                            bg: rifa.isPaid === true ? '#778899' : '#300E02',
                                            color: rifa.client[0]?.id.length > 0 ? '#300E02' : '#fff'
                                            
                                        }} w={['3rem', '3rem', '3rem', '3rem', '4rem']} h={['3rem', '3rem', '3rem','3rem', '4rem']} bg={rifa.isPaid === true ? '#778899' : rifa.client[0]?.id.length > 0 ? '#300E02' : selectedRifas.includes(rifa) ? '#300E02' : '#f6eccf'} justify={'center'} fontWeight={700} color={selectedRifas.includes(rifa) ? '#fff' : '#300E02'} align={'center'} key={rifa.id}>{rifa.number}</Flex>
                                        ))} 
                                </Grid>
                        
                                <Button
                                mt="2rem"
                                p='2rem'
                                w={['22rem', '22rem', '25rem']}
                                type="button"
                                bg="#f6eccf"
                                _hover={{ bg: '#5d2e27', color: '#fff' }}
                                color="#5d2e27"
                                size="lg"
                                onClick={verifyRifas}
                            >
                                Continuar
                            </Button>
                        </Flex>
                      ): <Spinner size={'lg'} /> 
                      }        
                  </Flex>
                    ) : 
                    <ScaleFade initialScale={0.9} in={isOpen}>
                    <Flex h="100%" p="1rem" flexDir={'column'} justify={'center'} align={'center'}>
                    
                    {!loadingQRCODE ?
                            <Flex   flexDir={'column'} justify={'center'} align={'center'}>
                             
                              <Flex flexDir={'column'} as="form" onSubmit={handleSubmit(sendRifasForApi)}
                              >
                                <Input
                                  color="#5d2e27"
                                  fontWeight={600}
                                  w={['22rem', '22rem', '25rem']}
                                  bg="#f6eccf"
                                  label="Nome"
                                  error={errors.name}
                                  {...register('name')}
                                />
                                <MaskedInput
                                  bg="#f6eccf"
                                  fontWeight={600}
                                  w={['22rem', '22rem', '25rem']}
                                  color="#5d2e27"
                                  label="Celular"
                                  mask={[
                                    '(',
                                    /\d/,
                                    /\d/,
                                    ')',
                                    ' ',
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                    '-',
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                  ]}
                                  error={errors.numberPhone}
                                  {...register('numberPhone')}
                                  />
                                  <Button
                                      mt="2rem"
                                      p='2rem'
                                      w={['22rem', '22rem', '25rem']}
                                      type="submit"
                                      bg="#f6eccf"
                                      _hover={{ bg: '#5d2e27', color: '#fff' }}
                                      color="#5d2e27"
                                      size="lg"
                                    >
                                      Comprar
                                    </Button>
                              </Flex>  
                              </Flex>
                              : 
                                  qrCode.imagemQrcode == null ? 
                                    <Spinner size={'lg'} /> 
                                  :
          
                                  <ScaleFade initialScale={0.9} in={isOpen}>
                                    <Flex flexDir={'column'} justify={'center'} align={'center'}>
                                      <Text>Pronto!!!</Text>
                                      <Text w={['15rem', '15rem', '25rem']}>No seu aplicativo do banco, selecione a opção de PIX QRCODE, aponte a camera do celular para o QRCODE e conclua o pagamento.</Text>
                                      <Image mt="2rem" alt='qrcode' src={qrCode.imagemQrcode} width={'12rem'}/>   
                                      <Text mt='2rem'>ou</Text>
                                      <Text mt='1rem' w={['15rem', '15rem', '25rem']}>Selecione a opção PIX Copia e Cola, copie o texto abaixo e conclua o pagamento.</Text>
                                      <Text
                                        background={'#1a202c'}
                                        p={'1rem'}
                                        mt='2rem'
                                        color='#fff'
                                        align="start"
                                        w={['15rem', '15rem', '25rem']}
                                      >
                                      {qrCode.qrcode}
                                    </Text>
          
                                    <Button
                                      mt="1rem" 
                                      _hover={{
                                        bg: '#1a202c',
                                      }}
                                      bg="#233142"
                                      color="#fff"
                                      onClick={handleCopyClick}
                                    >
                                      Copiar
                                    </Button>
                                  </Flex>   
                                </ScaleFade>
                                } 
                    </Flex>
                  </ScaleFade>
                    }
                </Flex>
            </Flex>
        </>
    )
}