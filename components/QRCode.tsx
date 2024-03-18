import { Button, Flex, Image, Text } from "@chakra-ui/react"

interface Props {
    qrCode: {
        imagemQrcode: string;
        qrcode: string;
    }
}

export const QRCode = ({ qrCode }: Props) => {
    async function copyTextToClipboard(text: string) {
        if ('clipboard' in navigator) {
          return navigator.clipboard.writeText(text);
        }
        return document.execCommand('copy', true, text);
      }
    
    const handleCopyClick = () => {
        copyTextToClipboard(qrCode.qrcode);
    };

    return (
        <Flex flexDir={'column'} justify={'center'} color={'#fff'} align={'center'} bg='#300E02' p={'1.5rem'} borderRadius={'0.5rem'}>
        <Text w={['20rem', '20rem', '18rem', '25rem']}>No seu aplicativo do banco, selecione a opção de PIX QRCODE, aponte a camera do celular para o QRCODE e conclua o pagamento.</Text>
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
      <Text mt='1rem' w={['15rem', '15rem', '18rem', '25rem']} mb="1rem">Assim que concluir o pagamento, os números selecionados serão reservados e mudarão de cor no nosso sistema.</Text>
    </Flex>  
    )
}