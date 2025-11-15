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
              boxShadow="xl"
              p={4}
              minW="260px"
              maxW="600px"
            >
              <Flex gap={3} align="center" justify="space-between">
                <Flex gap={3} align="center" flex="1">
                  <ToastIndicator fontSize="md" />
                  <Box>
                    {toast.title && (
                      <ToastTitle 
                        fontWeight="medium" 
                        fontSize="md" 
                        mb={toast.description ? 2 : 0}
                        color={colors.textColor}
                        lineHeight="1.5"
                      >
                        {toast.title}
                      </ToastTitle>
                    )}
                    {toast.description && (
                      <ToastDescription 
                        fontSize="sm" 
                        color={colors.descColor}
                        lineHeight="1.5"
                        opacity={1}
                        fontWeight="normal"
                      >
                        {toast.description}
                      </ToastDescription>
                    )}
                  </Box>
                </Flex>
                <ToastCloseTrigger 
                  color={colors.textColor}
                  _hover={{ opacity: 0.8 }}
                  size="sm"
                />
              </Flex>
            </ToastRoot>
          );
        }}
      </Toaster>
    </ChakraProvider>
  </StrictMode>
);
