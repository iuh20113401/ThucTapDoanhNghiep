import {
  Alert,
  AlertTitle,
  AlertIcon,
  AlertDescription,
  Box,
  Button,
  Center,
  Wrap,
  WrapItem,
  SimpleGrid,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../redux/actions/productActions";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import ProductFilter from "../components/FilterProduct";

const ProductsScreen = () => {
  const dispatch = useDispatch();
  const { loading, error, products, pagination, favoritesToggled } =
    useSelector((state) => state.product);

  useEffect(() => {
    !favoritesToggled && dispatch(getProducts(1));
  }, [dispatch, favoritesToggled]);

  const paginationButtonClick = (page) => {
    dispatch(getProducts(page));
  };

  const layoutDirection = useBreakpointValue({ base: "column", lg: "row" });

  return (
    <HStack
      p={{ base: 2, md: 4 }}
      spacing={4}
      align="start"
      flexDirection={layoutDirection}
      w="100%"
    >
      <Box w={{ base: "100%", lg: "20%" }} screens p={{ base: 2, md: 0 }}>
        <Center>
          <ProductFilter />
        </Center>
      </Box>

      <Box w={{ base: "100%", lg: "80%" }} screens p={{ base: 2, md: 0 }}>
        {products.length >= 1 && (
          <>
            {error ? (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle>We are sorry!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <SimpleGrid
                columns={{ base: 2, sm: 2, md: 3, lg: 4 }} // Responsive columns setup
                spacing={4} // Set proper spacing between items
              >
                {products.map((product) => (
                  <WrapItem key={product._id}>
                    <Center w="100%">
                      <ProductCard product={product} loading={loading} />
                    </Center>
                  </WrapItem>
                ))}
              </SimpleGrid>
            )}

            {!favoritesToggled && (
              <Wrap spacing="10px" justify="center" p="5">
                <Button
                  colorScheme="cyan"
                  onClick={() => paginationButtonClick(1)}
                  isDisabled={pagination.currentPage === 1}
                >
                  <ArrowLeftIcon />
                </Button>

                {Array.from(Array(pagination.totalPages), (e, i) => (
                  <Button
                    colorScheme={
                      pagination.currentPage === i + 1 ? "cyan" : "gray"
                    }
                    key={i}
                    onClick={() => paginationButtonClick(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}

                <Button
                  colorScheme="cyan"
                  onClick={() => paginationButtonClick(pagination.totalPages)}
                  isDisabled={pagination.currentPage === pagination.totalPages}
                >
                  <ArrowRightIcon />
                </Button>
              </Wrap>
            )}
          </>
        )}
      </Box>
    </HStack>
  );
};

export default ProductsScreen;
