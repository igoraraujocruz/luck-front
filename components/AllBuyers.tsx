import { IProduct } from "@/interfaces/Product";
import { VStack, Text, Grid, Link } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface Props {
    product: IProduct
}

export const AllBuyers = ({ product }: Props) => {
    const [hydrated, setHydrated] = useState(false);
    
    useEffect(() => {
        setHydrated(true);
    }, []);

    if (!hydrated) {
        return null;
    }
    return (
        <VStack>
        <Grid             
            templateColumns={[
                '1fr 1fr 1fr',
                '1fr 1fr 1fr',
                '1fr 1fr 1fr 1fr 1fr 1fr',
                '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
            ]}
            gap="0.5rem"
            >
        {product.rifas.map(rifa => (
            rifa.isPaid && (
                <VStack textAlign={'center'} key={rifa.id} bg={'#5d2e27'} p='0.5rem'>       
                    {rifa.client[0].instagram ? (
                        <Link href={`https://instagram.com/${rifa.client[0].instagram.substring(1)}`} isExternal>
                        <Text>{rifa.number}</Text>
                        <Text w="6rem"
                    overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap">{rifa.client[0].instagram}</Text>
                    </Link>
                    ) :
                
                    <VStack>
                        <Text>{rifa.number}</Text>
                        <Text w="4rem"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap">{rifa.client[0].name}
                        </Text>
                    </VStack>    
                }
                    
                </VStack>
            )
        ))}
        </Grid>
    </VStack>
    )
}