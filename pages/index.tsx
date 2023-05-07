import Head from 'next/head'
import { Box, Button, Flex, Grid, Heading, Image, ScaleFade, Spinner, Text, VStack, useDisclosure, useToast } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { MaskedInput } from '../components/MaskedInput'
import { Input } from '@/components/Input';
import axios from 'axios';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { api } from '@/api';

interface Client {
  id: string;
  name: string;
}

interface Rifas {
  id: string;
  number: number;
  client: Client;
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


export default function Home() {
  
  const [selectedRifas, setSelectedRifas] = useState<Rifas[]>([])
  const [rifas, setRifas] = useState<Rifas[]>([])
  const [qrCode, setQrcode] = useState({} as any)
  const [loadingQRCODE, setLoadingQRCOde] = useState(false)

  const toast = useToast();

  const { isOpen, onToggle } = useDisclosure()

  const router = useRouter();

  const sellerUserName = router.query.coisa;

  console.log(sellerUserName)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidadeFormData>({
    resolver: yupResolver(validateFormSchema),
  });

  const handleSelectRifas = (rifa: Rifas) => {
    if (selectedRifas.includes(rifa)) {
      setSelectedRifas(selectedRifas.filter(item => item.id !== rifa.id))
      return
    }
    setSelectedRifas((prev) => [...prev, rifa])
  }

  const fetchAllData = async() => {
    try {
      const response = await api.get('/rifas')
      setRifas(response.data)
    } catch(err) {
      //
    }
  }

  useEffect(() => {
    fetchAllData()
  } ,[])

  const sendRifasForApi = async (client: ValidadeFormData) => {
    try {
      setLoadingQRCOde(true)
      const response = await api.post('/clients', {
        name: client.name,
        numberPhone: client.numberPhone,
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

  async function copyTextToClipboard(text: string) {
    if ('clipboard' in navigator) {
      return navigator.clipboard.writeText(text);
    }
    return document.execCommand('copy', true, text);
  }

  const handleCopyClick = () => {
    copyTextToClipboard(qrCode.qrcode);
  };

  const rifaJaComprada = () => {
    return toast({
      title: 'Essa rifa já foi comprada',
      status: 'error',
      duration: 2000,
      isClosable: true,
    })
  }


  return (
    <>
      <Head>
        <title>Rifa de Páscoa</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex flexDir={['column', 'column', 'row']}>
        <Box boxShadow={'20px 0 40px 10px black inset'}  w={'100%'} bgSize={'cover'} backgroundImage={'https://tfbrnp.vtexassets.com/arquivos/ids/158828/CHOCOLATE.png?v=637747301904770000'}>
          <Flex mt={'5rem'}  justify={'center'}>
            <Text fontSize={'5rem'}>Ovo de Páscoa</Text>
          </Flex>
          
        </Box>
        <Flex w={'100%'} h={["146rem", "146rem", "75rem"]} justify={'center'}>
          <Text>teste</Text>
        </Flex>
      </Flex>
    </>
  )
}

