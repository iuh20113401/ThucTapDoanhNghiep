import { Box, Stack, Heading } from "@chakra-ui/react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import AddNewProduct from "../components/AddNewProduct";
function AddNewProductScreen() {
  const { userInfo } = useSelector((state) => state.user);
  const location = useLocation();
  return userInfo && userInfo.isAdmin ? (
    <Box p="20px" minH="100vh">
      <Stack
        direction={{ base: "column", lg: "row" }}
        align={{ lg: "flex-start" }}
      >
        <Stack
          pr={{ base: "0", md: "14" }}
          spacing={{ base: "8", md: "10" }}
          flex="1.5"
          mb={{ base: "12", md: "none" }}
        >
          <Heading fontSize="2xl" fontWeight="extrabold">
            Add new Item
          </Heading>
          <Box pr="20px" pl="20px" minH="100vh">
            <AddNewProduct />
          </Box>
        </Stack>
      </Stack>
    </Box>
  ) : (
    <Navigate to="/" replace={true} state={{ from: location }} />
  );
}

export default AddNewProductScreen;
