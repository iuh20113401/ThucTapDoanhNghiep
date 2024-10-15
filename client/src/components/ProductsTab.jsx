import {
  Box,
  Image,
  Text,
  Badge,
  Stack,
  Spinner,
  Wrap,
  SimpleGrid,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Flex,
  Heading,
  Button,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProduct,
  getProducts,
  resetProductError,
} from "../redux/actions/productActions";
import formatPrice from "../utils/FormatVietNamCurrency";
import { Link, useNavigate } from "react-router-dom";

const ProductsTab = () => {
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.admin);
  const { products, productUpdate } = useSelector((state) => state.product);
  const toast = useToast();

  useEffect(() => {
    dispatch(getProducts());
    dispatch(resetProductError());

    if (productUpdate) {
      toast({
        description: "Product has been updated.",
        status: "success",
        isClosable: true,
      });
    }
  }, [dispatch, toast, productUpdate]);

  return (
    <Box p={4}>
      {/* Error Handling */}
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          <AlertTitle>Oops! Something went wrong.</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <Wrap justify="center" mt={10}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="cyan.500"
            size="xl"
          />
        </Wrap>
      ) : (
        <Box>
          {" "}
          <Flex justify="space-between" align="center" mb={6}>
            <Link to="addnewproduct">
              <Button colorScheme="cyan">Thêm sản phẩm mới</Button>
            </Link>
          </Flex>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
            {products.length > 0 ? (
              products.map((product) => (
                <CompactProductCard key={product._id} product={product} />
              ))
            ) : (
              <Text>No products available. Please add new products.</Text>
            )}
          </SimpleGrid>
        </Box>
      )}
    </Box>
  );
};

// Compact Product Card Component
const CompactProductCard = ({ product }) => {
  const { name, stock, price, coverImage, category, brand } = product;

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      as={Link}
      to={`updateProduct/${product._id}`}
      overflow="hidden"
      p={2}
      boxShadow="sm"
      _hover={{ boxShadow: "md" }}
      cursor={"pointer"}
    >
      <Flex>
        <Image
          src={coverImage || "https://via.placeholder.com/50"}
          alt={name}
          boxSize="50px"
          objectFit="cover"
          mr={4}
        />

        <Stack spacing={1} fontSize="sm">
          <Text fontWeight="bold" noOfLines={1}>
            {name}
          </Text>

          <Text color="cyan.500" fontWeight="semibold">
            {formatPrice(price)}
          </Text>

          <Text>
            {stock > 0 ? (
              <Badge colorScheme="green">In Stock: {stock}</Badge>
            ) : (
              <Badge colorScheme="red">Out of Stock</Badge>
            )}
          </Text>

          <Text>
            <strong>Brand:</strong> {brand}
          </Text>
          <Text noOfLines={1}>
            <strong>Categories:</strong> {category}
          </Text>
        </Stack>
      </Flex>
    </Box>
  );
};

export default ProductsTab;
