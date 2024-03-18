import { Flex, Heading, Text } from "@chakra-ui/react";

export const ProductNotFound = () => (
    <Flex gap={2} justify={'center'} flexDir={'column'} p={'10rem'} align='center' h={'100vh'}>
        <Heading>Sorteio não encontrado!</Heading>
        <Text>Verifique se o site está correto</Text>
    </Flex>
)