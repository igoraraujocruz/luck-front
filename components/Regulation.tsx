import { Flex, ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react";

export const Regulation = () =>
 (
        <Flex gap={3} flexDir={['column', 'column', 'row']} w={'100%'} align={'center'} justify={'center'}>
                    <VStack bg='#300E02' align={'start'} p="2rem" w={['20rem', '20rem', '20rem', '30rem']} h={'24rem'} borderRadius={'0.5rem'}>
                    <Text  fontSize={['1.5rem']}>Regulamento</Text>
                    <UnorderedList>
                      <ListItem>O sorteio será pela Loteria Federal (Estimativa: Até o dia 27/03/24)</ListItem>
                      <Text fontSize={'0.8rem'} fontStyle={'italic'}>Serão considerados os 2 últimos dígitos do 1º sorteio. Caso não haja vencedor com este, serão utilizados os 2 últimos dígitos do 2º sorteito e assim por diante.
                      A estimativa é que o sorteio aconteça no dia 27/03/24. Se todos os números forem vendidos, o sorteio poderá ser antecipado (A nova data será divulgada no instagram).
                      </Text>
                      <ListItem mt={'0.5rem'}>O local de entrega do prêmio será a combinar em Vitória/ES</ListItem>
                      <ListItem mt={'0.5rem'}>Entrega até o dia 29/03/2024</ListItem>
                    </UnorderedList>
                  </VStack>
                  <VStack align={'start'} bg='#300E02' w={['20rem', '20rem', '20rem', '30rem']} h={['17rem', '17rem', '24rem']} borderRadius={'0.5rem'} p={'1.5rem'}>
                  <Text  fontSize={['1.5rem']}>Como participar:</Text>
                    <Text>1º Selecione seus números.</Text>
                    <Text>2º Clique no botão Continuar.</Text>
                    <Text>3º Insira seus dados.</Text>
                    <Text>4º Clique em comprar, e pronto!</Text> 
                    <Text>Seu número estará reservado, após o pagamento, até a data do sorteio.</Text>
                  </VStack>
                </Flex>
    )