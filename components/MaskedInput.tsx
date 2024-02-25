import {
    Input as ChakraInput,
    ComponentWithAs,
    FormControl,
    FormErrorMessage,
    FormLabel,
    InputProps as ChakraInputProps,
  } from '@chakra-ui/react';
  import { ComponentType, forwardRef, ForwardRefRenderFunction } from 'react';
  import { FieldError } from 'react-hook-form';
  import { IconBaseProps } from 'react-icons';
  import ReactMaskedInput from 'react-text-mask';
  
  interface MaskedInputProps extends ChakraInputProps {
    name: string;
    label?: string;
    error?: FieldError;
    bg?: string;
    mask: any;
    icon?: ComponentType<IconBaseProps>;
  }
  
  interface MaskedChakraInputProps extends Omit<ChakraInputProps, 'ref'> {
    ref?: React.RefCallback<
      (HTMLInputElement & { inputElement: HTMLInputElement }) | null
    >;
  }
  
  const MaskedChakraInput: ComponentWithAs<'input', MaskedChakraInputProps> =
    ChakraInput;
  
  const MaskedInputBase: ForwardRefRenderFunction<
    HTMLInputElement,
    MaskedInputProps
  > = ({ name, label, error = null, icon: Icon, bg, mask, ...rest }, ref) => {
    return (
      <FormControl isInvalid={!!error}>
        {!!label && (
          <FormLabel id={`label-${name}`} htmlFor={name}>
            {label}
          </FormLabel>
        )}
        <MaskedChakraInput
          as={ReactMaskedInput}
          _focus={{ 
            bg: '#f6eccf'
           }}
          border={'0'}
          guide={false}
          mask={mask}
          name={name}
          id={name}
          bg={bg}
          variant="filled"
          _hover={{
            bgColor: '#f6eccf',
          }}
          size="lg"
          ref={data => {
            if (typeof ref === 'function') {
              if (data && data.inputElement) {
                ref(data.inputElement);
              } else {
                ref(data);
              }
            }
          }}
          {...rest}
        />
        {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
      </FormControl>
    );
  };
  
  export const MaskedInput = forwardRef(MaskedInputBase);