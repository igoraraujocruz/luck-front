import type { AppProps } from 'next/app'
import { theme } from '../styles/theme'
import { ChakraProvider } from '@chakra-ui/react';
import { SocketProvider } from '@/hooks/useSocket';
 
export default function App({ Component, pageProps }: AppProps) {
  return (
		<SocketProvider>
			<ChakraProvider theme={theme}>
				<Component {...pageProps} />
			</ChakraProvider>	
		</SocketProvider>
	)
}
