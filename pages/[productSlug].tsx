import { AspectRatio, Box, Button, Flex, Grid, Heading, Image, Img, ListItem, ScaleFade, Spinner, Text, Tooltip, UnorderedList, VStack, useDisclosure, useSafeLayoutEffect, useToast } from "@chakra-ui/react"
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
    instagram: string;
    numberPhone: string
    createdAt: string
    updatedAt: string
  }

  type ValidadeFormData = {
    name: string;
    numberPhone: string;
    instagram?: string;
  };

const validateFormSchema = yup.object().shape({
    name: yup.string().required('O nome necessário'),
    instagram: yup.string(),
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
            instagram: client.instagram,
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
          title: 'Este número já foi comprado',
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


            <Flex flexDir={['column', 'column', 'row']} gap={'3rem'} align={['center', 'center', 'start']} p={'5rem'}>
              <VStack w={'50%'}>
                <VStack bg='#300E02' align={'start'} w={['20rem', '20rem', '20rem', '30rem']} borderRadius={'0.5rem'} p={'2rem'}>
                  <Text  fontSize={['1.5rem']}  overflowY={'auto'}>Regulamento</Text>
                  <UnorderedList>
                    <ListItem>O sorteio será pela Loteria Federal</ListItem>
                    <Text fontSize={'0.8rem'} fontStyle={'italic'}>Serão considerados os 2 últimos dígitos do 1º sorteio. Caso não haja vencedor com este, serão utilizados os 2 últimos dígitos do 2º sorteito e assim por diante...</Text>
                    <ListItem mt={'1rem'}>O local de entrega do prêmio será a combinar em Vitória/ES</ListItem>
                    <ListItem mt={'1rem'}>Entrega até o dia 29/03/2024</ListItem>
                  </UnorderedList>
                </VStack>
                <VStack bg='#300E02' align={'start'} w={['20rem', '20rem', '20rem', '30rem']} borderRadius={'0.5rem'} p={'2rem'}>
                  <Text  fontSize={['1.5rem']}  overflowY={'auto'}>{product.name}</Text>
                  <Text>Como participar:</Text>
                  <Text>1º Selecione seus números.</Text>
                  <Text>2º Clique no botão Continuar.</Text>
                  <Text>3º Insira seus dados.</Text>
                  <Text>4º Clique em comprar, e pronto!</Text> 
                  <Text>Seu número estará reservado, após o pagamento, até a data do sorteio.</Text>
                </VStack>
                <Img src="egg.png" alt="imagemChocolate" pos={'relative'} top={['-2.5rem', '-2.5rem', '-2.5rem', '-2.5rem']} left={['10rem', '10rem', '9rem', '14.5rem']} w={['3rem', '3rem', '3rem', '3rem']} h={['3rem', '3rem', '3rem', '3rem']} />
              </VStack>
              <VStack w={'50%'}>
                
              {!isOpen ? (
                        <Flex justify={'center'}  flexDir={'column'} align={'center'}>
                          
                            {product.rifas?.length > 0 ? (
                                <Flex flexDir={'column'} justify={'center'} align={'center'}>
                                <Grid             
                                templateColumns={[
                                    '1fr 1fr 1fr 1fr 1fr 1fr',
                                    '1fr 1fr 1fr 1fr 1fr 1fr',
                                    '1fr 1fr 1fr 1fr 1fr 1f',
                                    '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                                    '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                                    '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                                ]}
                      
                                gap="0.5rem"
                                >
                                    {product.rifas.sort((a, b) => a.number - b.number).map(rifa => (
                                      <Tooltip key={rifa.id} label={rifa.client[0]?.instagram ? rifa.client[0]?.instagram : rifa.client[0]?.name} aria-label='A tooltip' bg={'#300E02'}>
                                      <Flex onClick={() => rifa.client[0]?.id.length > 0 ? rifaJaComprada() : handleSelectRifas(rifa)} cursor={rifa.client[0]?.id.length > 0 ? 'default' : 'pointer'} borderRadius={'0.5rem'} _hover={{
                                            bg: rifa.isPaid === true ? '#300E02' : '#80471C',
                                            color: rifa.client[0]?.id.length > 0 ? '#300E02' : '#fff'
                                            
                                        }} w={['3rem', '3rem', '3rem', '3rem', '4rem']} h={['3rem', '3rem', '3rem','3rem', '4rem']} bg={rifa.isPaid === true ? '#300E02' : rifa.client[0]?.id.length > 0 ? '#300E02' : selectedRifas.includes(rifa) ? '#80471C' : '#f6eccf'} justify={'center'} fontWeight={700} color={selectedRifas.includes(rifa) ? '#fff' : '#300E02'} align={'center'} key={rifa.id}>{rifa.number}
                                        </Flex>
                                    </Tooltip>
                                        
                                        ))} 
                                </Grid>
                        
                                <Button
                                mt="2rem"
                                mb="1rem"
                                p='2rem'
                                w={['20rem', '20rem', '20rem', '25rem']}
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
                    {!loadingQRCODE ?
                    <Flex flexDir={'column'} as="form" onSubmit={handleSubmit(sendRifasForApi)}
                    >
                      <Input
                        color="#5d2e27"
                        fontWeight={600}
                        w={['20rem', '20rem', '20rem', '25rem']}
                        bg="#f6eccf"
                        label="Nome"
                        error={errors.name}
                        {...register('name')}
                      />
                      <MaskedInput
                        bg="#f6eccf"
                        fontWeight={600}
                        w={['20rem', '20rem', '20rem', '25rem']}
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
                        <MaskedInput
                        bg="#f6eccf"
                        fontWeight={600}
                        w={['20rem', '20rem', '20rem', '25rem']}
                        color="#5d2e27"
                        label="Instagram"
                        mask={[
                          '@',
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/,
                          /^[-a-zA-Z0-9_.]$/
                        ]}
                        {...register('instagram')}
                        />
                        <Button
                            mt="2rem"
                            p='2rem'
                            w={['20rem', '20rem', '20rem', '25rem']}
                            type="submit"
                            bg="#f6eccf"
                            _hover={{ bg: '#5d2e27', color: '#fff' }}
                            color="#5d2e27"
                            size="lg"
                          >
                            Comprar
                          </Button>
                    </Flex>
                    : 
                    qrCode.imagemQrcode == null ? 
                      <Spinner size={'lg'} /> 
                    :
                    <ScaleFade initialScale={0.9} in={isOpen}>
                      <Flex flexDir={'column'} justify={'center'} align={'center'}>
                        <Text w={['15rem', '15rem', '18rem', '25rem']}>No seu aplicativo do banco, selecione a opção de PIX QRCODE, aponte a camera do celular para o QRCODE e conclua o pagamento.</Text>
                        <Image mt="2rem" alt='qrcode' src={qrCode.imagemQrcode} width={'12rem'}/>   
                        <Text mt='2rem'>ou</Text>
                        <Text mt='1rem'  w={['15rem', '15rem', '18rem', '25rem']}>Selecione a opção PIX Copia e Cola, copie o texto abaixo e conclua o pagamento.</Text>
                        <Text
                          background={'#f6eccf'}
                          p={'1rem'}
                          mt='2rem'
                          color='#5d2e27'
                          align="start"
                          w={['15rem', '15rem', '18rem', '25rem']}
                        >
                        {qrCode.qrcode}
                      </Text>

                      <Button
                        mt="1rem"
                        _hover={{ bg: '#5d2e27', color: '#fff' }}
                        bg="#f6eccf"
                        color="#5d2e27"
                        onClick={handleCopyClick}
                      >
                        Copiar
                      </Button>
                      <Text mt='1rem' w={['15rem', '15rem', '18rem', '25rem']}>Assim que concluir o pagamento, os números selecionados serão reservados e mudarão de cor no nosso sistema.</Text>
                    </Flex>   
                  </ScaleFade>
                  } 
                  </ScaleFade>
                }
              </VStack>

              {/* DESCOMENTE ESSA PARTE QUANDO O SORTEIO ESTIVER AGUARDANDO O RESULTADO
              <Flex w={'100%'} justify={'center'} align={'center'} h={'70vh'} flexDir={'column'}>
                <Heading>SORTEIO FINALIZADO!</Heading>
                <Text>Aguardando resultado da Loteria Federal</Text>
              </Flex> */}

              {/* DESCOMENTE ESSA PARTE QUANDO EXISTIR UM VENCEDOR
              <Flex w={'100%'} justify={'center'} align={'center'} h={'70vh'} flexDir={'column'}>
                <Text>Parabéns!!!</Text>
                <Heading>Nº XX</Heading>
                <Heading>VENCEDOR</Heading>
                
                <Text>Agradecemos a todos que participaram.</Text>
              </Flex> */}

            </Flex>
        </>
    )
}