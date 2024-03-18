import { Button, Flex, useToast } from "@chakra-ui/react"
import { MaskedInput } from "./MaskedInput"
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from "@/api";
import { LuckNumber } from "@/interfaces/LuckNumber";
import { Input } from "./Input";

interface Props { 
    handleSetLoadingQRCOde: () => void;
    handleSetQrcode: (value: any) => void;
    productId: string;
    userSocketId: string;
    selectedRifas: LuckNumber[];
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

export const FormBuy = ({ handleSetLoadingQRCOde, productId, userSocketId, selectedRifas, handleSetQrcode }: Props) => {
    const toast = useToast();
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<ValidadeFormData>({
        resolver: yupResolver(validateFormSchema),
      });
      
      const sendRifasForApi = async (client: ValidadeFormData) => {
        
        try {
            handleSetLoadingQRCOde()
            
          const response = await api.post('/clients', {
            name: client.name,
            numberPhone: client.numberPhone,
            productId,
            socketId: userSocketId,
            instagram: client.instagram,
            rifas: selectedRifas.map(newRifas => newRifas.id)
          })

          console.log(response)
    
          toast({
            title: 'Número(s) comprado(s) com sucesso.',
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
    
          handleSetQrcode(response.data)
          
        } catch(err: any) {
          toast({
            title: err.response.data.message,
            status: 'error',
            duration: 2000,
            isClosable: true,
          })
        }
      }

    return (
        <Flex flexDir={'column'} id="formComprar" as="form" onSubmit={handleSubmit(sendRifasForApi)}>
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
                              mb='1rem'
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
    )
}