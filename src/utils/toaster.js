import { createToaster } from "@chakra-ui/react";

export const toaster = createToaster({
  placement: "top", // Default to top-center
  pauseOnPageIdle: true,
  gap: 2,
  offset: { x: 0, y: 12 },
});

