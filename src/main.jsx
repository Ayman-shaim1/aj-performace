import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, defaultSystem, Toaster, ToastRoot, ToastTitle, ToastDescription, ToastCloseTrigger, ToastIndicator, Box, Flex } from "@chakra-ui/react";
import "./index.css";
import App from "./App.jsx";
import { toaster } from "./utils/toaster";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <App />
      <Toaster toaster={toaster}>
        {(toast) => {
          // Get colors based on toast type
          const getToastColors = (type) => {
            switch (type) {
              case "success":
                return {
                  bg: "green.500",
                  textColor: "white",
                  descColor: "white",
                };
              case "error":
                return {
                  bg: "red.500",
                  textColor: "white",
                  descColor: "white",
                };
              case "warning":
                return {
                  bg: "orange.500",
                  textColor: "white",
                  descColor: "white",
                };
              case "info":
              default:
                return {
                  bg: "blue.500",
                  textColor: "white",
                  descColor: "white",
                };
            }
          };

          const colors = getToastColors(toast.type);

          return (
            <ToastRoot 
              key={toast.id} 
              toast={toast}
              bg={colors.bg}
              color={colors.textColor}
              borderRadius="none"
              boxShadow="lg"
              p={4}
              minW="280px"
              maxW="600px"
            >
              <Flex gap={3} align="flex-start" justify="space-between">
                <Flex gap={3} align="flex-start" flex="1">
                  <ToastIndicator 
                    fontSize="lg" 
                    mt={toast.description && !toast.title ? 0.5 : 0}
                  />
                  <Box flex="1">
                    {toast.title && toast.title.trim() !== "" && (
                      <ToastTitle 
                        fontWeight="semibold" 
                        fontSize="sm" 
                        mb={toast.description ? 1 : 0}
                        color={colors.textColor}
                        lineHeight="1.4"
                      >
                        {toast.title}
                      </ToastTitle>
                    )}
                    {toast.description && (
                      <ToastDescription 
                        fontSize="sm" 
                        color={colors.descColor || colors.textColor}
                        lineHeight="1.5"
                        opacity={1}
                        fontWeight={toast.title && toast.title.trim() !== "" ? "normal" : "medium"}
                      >
                        {toast.description}
                      </ToastDescription>
                    )}
                    {!toast.description && toast.title && (
                      <ToastTitle 
                        fontWeight="medium" 
                        fontSize="sm" 
                        color={colors.textColor}
                        lineHeight="1.5"
                      >
                        {toast.title}
                      </ToastTitle>
                    )}
                  </Box>
                </Flex>
                <ToastCloseTrigger 
                  color={colors.textColor}
                  _hover={{ opacity: 0.7 }}
                  size="sm"
                  opacity={0.8}
                />
              </Flex>
            </ToastRoot>
          );
        }}
      </Toaster>
    </ChakraProvider>
  </StrictMode>
);
