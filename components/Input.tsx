import {
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input as ChakraInput,
    InputProps as ChakraInputProps,
  } from '@chakra-ui/react';
  import {
    ComponentType,
    forwardRef,
    ForwardRefRenderFunction,
    useState,
  } from 'react';
  import { FieldError } from 'react-hook-form';
  import { IconBaseProps } from 'react-icons';
  
  interface InputProps extends ChakraInputProps {
    name: string;
    label?: string;
    error?: FieldError;
    bg?: string;
    icon?: ComponentType<IconBaseProps>;
  }
  
  const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
    { name, label, error = null, icon: Icon, bg, ...rest },
    ref,
  ) => {
  
    return (
      <FormControl isInvalid={!!error}>
        {!!label && (
          <FormLabel id={`label-${name}`} htmlFor={name}>
            {label}
          </FormLabel>
        )}
        <Flex
          align="center"
          bgColor="inputBg"
        >
          {Icon && (
            <Flex mr="1rem">
              <Icon size={20} />
            </Flex>
          )}
          <ChakraInput
            _focus={{ 
              bg: '#f6eccf'
             }}

            name={name}
            id={name}
            border="0"
            bg={bg}
            variant="filled"
            _hover={{
              bgColor: '#f6eccf'
            }}
            size="lg"
            {...rest}
            ref={ref}
          />
        </Flex>
        {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
      </FormControl>
    );
  };
  
  export const Input = forwardRef(InputBase);