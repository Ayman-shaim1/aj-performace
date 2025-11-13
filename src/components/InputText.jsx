import { Box, Input, Text, Textarea } from "@chakra-ui/react";
import { brandGold } from "../theme/colors";

export default function InputText({
  id,
  label,
  type = "text",
  placeholder,
  isRequired = false,
  isTextarea = false,
  name,
  w,
  ...fieldProps
}) {
  return (
    <Box w="full">
      <Text
        as="label"
        htmlFor={id}
        display="block"
        fontSize="sm"
        textTransform="uppercase"
        color="gray.600"
        fontWeight="semibold"
        mb={2}
      >
        {label}
      </Text>
      {isTextarea ? (
        <Textarea
          id={id}
          name={name ?? id}
          placeholder={placeholder}
          borderRadius="none"
          focusBorderColor={brandGold}
          minH="8rem"
          required={isRequired}
          w={w}
          _focus={{
            borderColor: brandGold,
            boxShadow: `0 0 7px 1px ${brandGold}`,
            transition: "box-shadow 0.2s ease, border-color 0.2s ease",
          }}
          {...fieldProps}
        />
      ) : (
        <Input
          id={id}
          name={name ?? id}
          type={type}
          placeholder={placeholder}
          borderRadius="none"
          focusBorderColor={brandGold}
          required={isRequired}
          w={w}
          _focus={{
            borderSize: "1px",
            borderColor: brandGold,
            boxShadow: `0 0 7px 1px ${brandGold}`,
            transition: "box-shadow 0.2s ease, border-color 0.2s ease",
          }}
          {...fieldProps}
        />
      )}
    </Box>
  );
}
