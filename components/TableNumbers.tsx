import { LuckNumber } from "@/interfaces/LuckNumber";
import { IProduct } from "@/interfaces/Product";
import { Button, Grid, Text, Tooltip, VStack, useToast } from "@chakra-ui/react"

interface TableNumbersProps {
  handlesetNumberSeleted: () => void;
  handlesetSelectedRifas: (numbers: any) => void;
  selectedRifas: LuckNumber[];
  product: IProduct;
}

export const TableNumbers  = ({ product, handlesetNumberSeleted, handlesetSelectedRifas, selectedRifas}: TableNumbersProps) => {
    const toast = useToast();
    
    const BlockedNumber = {
      bg: '#300E02',
      color: '#300E02'
    }
    
    function NotBlockedNumber(rifa: LuckNumber) { 
      if(rifa.client.length > 0) {
        return {
          bg: '#888888',
          color: '#fff',
        }
      }
      return {
        bg: selectedRifas.includes(rifa) ? '#300E02' : '#f6eccf',
        color: selectedRifas.includes(rifa) ? '#f6eccf' : '#300E02'
      }
    }

    const handleSelectRifas = (rifa: LuckNumber) => {
        if(product.isActivate === false) {
          return toast({
            title: 'O sorteio está desativado.',
            status: 'error',
            duration: 2000,
            isClosable: true,
          })
        }

        if(rifa.isPaid) {
          return toast({
            title: 'Este número já foi comprado',
            status: 'error',
            duration: 2000,
            isClosable: true,
          })
        }

        if(rifa.client.length > 0) {
          return toast({
            title: 'Este número já está reservado',
            description: 'Se em 180 segundos o pagamento não for efetuado, o número será disponibilizado.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
        }
          
        if (selectedRifas.includes(rifa)) {              
          handlesetSelectedRifas(selectedRifas.filter(item => item.id !== rifa.id))
          return
        }

        handlesetSelectedRifas((prev: any) => [...prev, rifa])
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
      handlesetNumberSeleted()
    }

    return (
        <VStack gap={3} pb={'2rem'}>
          <Grid             
            templateColumns={[
                '1fr 1fr 1fr 1fr 1fr 1fr',
                '1fr 1fr 1fr 1fr 1fr 1fr',
                '1fr 1fr 1fr 1fr 1fr 1fr',
                '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
            ]}
            gap="0.5rem"
            >
            {product.rifas.sort((a, b) => a.number - b.number).map(rifa => (
            <Tooltip key={rifa.id} 
            label={rifa.client[0]?.instagram ? rifa.client[0]?.instagram : rifa.client[0]?.name} 
            aria-label='A tooltip' bg={'#300E02'}>
            <Button 
                isDisabled={product.isActivate === false}
                colorScheme='none' 
                onClick={() => handleSelectRifas(rifa)} 
                className='my-box' 
                borderRadius={'0.5rem'}
                w={['3rem', '3rem', '3rem','3.4rem', '4rem']} 
                h={['3rem', '3rem', '3rem','3.4rem', '4rem']}
                sx={rifa.isPaid ? BlockedNumber : NotBlockedNumber(rifa)}
                fontWeight={700} 
                key={rifa.id}>{rifa.number}
            </Button>
            </Tooltip>
            ))} 
        </Grid>
          <Button
            isDisabled={product.isActivate === false}
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
        </VStack>
    )
}