import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
	colors: {
	    gray: {
	      "900": "#181B23",
	      "800": "#1F2029",
	      "700": "#353646",
	      "600": "#4B4D63",
	      "500": "#616480",
	      "400": "#797D9A",
	      "300": "#9699B0",
	      "200": "#B3B5C6",
	      "100": "#D1D2DC",
	      "50": "#EEEEF2",
	    }
	  },
	styles: {
		global: {
			body: {
				bg: 'radial-gradient(circle at 24.1% 68.8%, rgb(50, 50, 50) 0%, rgb(0, 0, 0) 99.4%);',
				color: '#fff',
				fontFamily: 'Rubik',
			}	
		}	
	}			
})