import { useState } from "react";
import { Box, Input, Text, Textarea } from "@chakra-ui/react";
import { FiEye, FiEyeOff } from "react-icons/fi";
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
  error,
  ...fieldProps
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

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
          focusBorderColor={error ? "red.500" : brandGold}
          borderColor={error ? "red.300" : undefined}
          minH="8rem"
          required={isRequired}
          _placeholder={{
            color: "gray.400",
          }}
          w={w}
          _focus={{
            borderColor: error ? "red.500" : brandGold,
            boxShadow: error
              ? `0 0 7px 1px rgba(229, 62, 62, 0.5)`
              : `0 0 7px 1px ${brandGold}`,
            transition: "box-shadow 0.2s ease, border-color 0.2s ease",
          }}
          {...fieldProps}
        />
      ) : isPassword ? (
        <Box position="relative" w={w || "full"}>
          <Input
            id={id}
            name={name ?? id}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            borderRadius="none"
            focusBorderColor={error ? "red.500" : brandGold}
            borderColor={error ? "red.300" : undefined}
            required={isRequired}
            w="full"
            pr="3.5rem"
            _focus={{
              borderSize: "1px",
              borderColor: error ? "red.500" : brandGold,
              boxShadow: error
                ? `0 0 7px 1px rgba(229, 62, 62, 0.5)`
                : `0 0 7px 1px ${brandGold}`,
              transition: "box-shadow 0.2s ease, border-color 0.2s ease",
            }}
            {...fieldProps}
          />
          <Box
            as="button"
            type="button"
            position="absolute"
            right="0.75rem"
            top="50%"
            transform="translateY(-50%)"
            zIndex={10}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowPassword(!showPassword);
            }}
            bg="transparent"
            border="none"
            cursor="pointer"
            p={1}
            color="gray.600"
            _hover={{ color: "gray.800", bg: "gray.100" }}
            borderRadius="md"
            h="2rem"
            w="2rem"
            minW="2rem"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <FiEyeOff size={20} style={{ display: "block" }} />
            ) : (
              <FiEye size={20} style={{ display: "block" }} />
            )}
          </Box>
        </Box>
      ) : (
        <Input
          id={id}
          name={name ?? id}
          type={type}
          placeholder={placeholder}
          borderRadius="none"
          focusBorderColor={error ? "red.500" : brandGold}
          borderColor={error ? "red.300" : undefined}
          required={isRequired}
          w={w}
          _focus={{
            borderSize: "1px",
            borderColor: error ? "red.500" : brandGold,
            boxShadow: error
              ? `0 0 7px 1px rgba(229, 62, 62, 0.5)`
              : `0 0 7px 1px ${brandGold}`,
            transition: "box-shadow 0.2s ease, border-color 0.2s ease",
          }}
          {...fieldProps}
        />
      )}
      {error && (
        <Text color="red.500" fontSize="xs" mt={1} ml={1}>
          {error}
        </Text>
      )}
    </Box>
  );
}
