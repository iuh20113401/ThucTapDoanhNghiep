import {
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Link,
  Skeleton,
  Stack,
  useColorModeValue as mode,
  Text,
  Wrap,
  Spinner,
  Button,
} from "@chakra-ui/react";
import { FaArrowRight, FaTruck } from "react-icons/fa";
import { Link as ReactLink } from "react-router-dom";
import { BsPhoneFlip } from "react-icons/bs";
import { MdPayments } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getProductsHome } from "../redux/actions/productActions";
import ProductsSlider from "../components/HomeProductsSlider";

function LandingScreen() {
  const dispatch = useDispatch();
  const { loading, mostSaleOffProducts, mostSoldProducts } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(getProductsHome());
  }, [dispatch]);

  return (
    <Box maxW="8xl" mx="auto" p={{ base: "4", md: "8", lg: "12" }} minH="6xl">
      <Stack
        direction={{ base: "column-reverse", lg: "row" }}
        spacing={{ base: "8", lg: "20" }}
      >
        <Box
          width={{ lg: "sm" }}
          transform={{ base: "translateY(-50%)", lg: "none" }}
          bg={{ base: mode("cyan.50", "gray.700"), lg: "transparent" }}
          mx={{ base: "6", md: "8", lg: "0" }}
          px={{ base: "6", md: "8", lg: "0" }}
          py={{ base: "6", md: "8", lg: "12" }}
        >
          <Stack spacing={{ base: "8", lg: "10" }}>
            <Stack spacing={{ base: "2", lg: "4" }}>
              <Flex alignItems="center">
                <Icon
                  as={BsPhoneFlip}
                  h={12}
                  w={12}
                  color={mode("cyan.500", "yellow.200")}
                />
                <Text fontSize="4xl" fontWeight="bold">
                  Tech Lines
                </Text>
              </Flex>
              <Heading size="xl" fontWeight="normal">
                Nâng cấp thiết bị của bạn
              </Heading>
            </Stack>
            <HStack spacing="3">
              <Link
                as={ReactLink}
                to="/products"
                color={mode("cyan.500", "yellow.200")}
              >
                Khám phá ngay
              </Link>
              <Icon color={mode("cyan.500", "yellow.200")} as={FaArrowRight} />
            </HStack>
          </Stack>
        </Box>
        <Flex flex="1" overflow="hidden">
          <Image
            src={mode("images/landing-light.jpg", "images/landing-dark.jpg")}
            fallback={<Skeleton />}
            maxH="550px"
            minW="300px"
            objectFit="cover"
            flex="1"
          />
        </Flex>
      </Stack>

      <Stack spacing={12} py={10}>
        <Heading size="lg" textAlign="center">
          Tại sao chọn Tech Lines?
        </Heading>
        <Flex justify="space-around" align="center" wrap="wrap">
          <Box textAlign="center" w="full" maxW="300px" mb={{ base: 4, md: 0 }}>
            <Icon as={BsPhoneFlip} w={12} h={12} color="cyan.500" />
            <Text fontWeight="bold" mt={2}>
              Công nghệ tiên tiến
            </Text>
            <Text>Khám phá các sản phẩm công nghệ và phụ kiện mới nhất.</Text>
          </Box>
          <Box textAlign="center" w="full" maxW="300px" mb={{ base: 4, md: 0 }}>
            <Icon as={FaTruck} w={12} h={12} color="cyan.500" />
            <Text fontWeight="bold" mt={2}>
              Giao hàng nhanh chóng
            </Text>
            <Text>Nhận sản phẩm trong vòng 24 giờ ngay tại cửa nhà.</Text>
          </Box>
          <Box textAlign="center" w="full" maxW="300px">
            <Icon as={MdPayments} w={12} h={12} color="cyan.500" />
            <Text fontWeight="bold" mt={2}>
              Thanh toán an toàn
            </Text>
            <Text>
              Thanh toán dễ dàng và bảo mật với nhiều phương thức khác nhau.
            </Text>
          </Box>
        </Flex>
      </Stack>
      <Stack w="100%" overflowX="hidden">
        {loading ? (
          <Wrap justify="center">
            <Stack direction="row" spacing="4">
              <Spinner
                mt="20"
                thickness="2px"
                speed="0.65s"
                emptyColor="gray.200"
                color="cyan.500"
                size="xl"
              />
            </Stack>
          </Wrap>
        ) : (
          <>
            <ProductsSlider
              title="Sản phẩm bán chạy"
              products={mostSoldProducts}
            />
            <ProductsSlider title="Deal sốc" products={mostSaleOffProducts} />
          </>
        )}
      </Stack>
    </Box>
  );
}

export default LandingScreen;
