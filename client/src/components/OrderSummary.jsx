import {
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link as ReactLink } from "react-router-dom";
import formatPrice from "../utils/FormatVietNamCurrency";

const OrderSummary = ({ checkoutSreen = false }) => {
  const { subtotal, shipping } = useSelector((state) => state.cart);
  const { shippingLocations } = useSelector((state) => state.shipping); // Get shipping data
  return (
    <Stack
      minWidth="300px"
      spacing="8"
      borderWidth="1px"
      borderColor={mode("cyan.500", "cyan.100")}
      rounded="lg"
      padding="8"
      w="full"
    >
      <Heading size="md">Tổng hóa đơn</Heading>
      <Stack spacing="6">
        <Flex justify="space-between">
          <Text fontWeight="medium" color={mode("gray.600", "gray.400")}>
            Sản phẩm
          </Text>
          <Text fontWeight="medium">{formatPrice(subtotal)}</Text>
        </Flex>
        <Flex justify="space-between">
          <Text fontWeight="medium" color={mode("gray.600", "gray.400")}>
            Phí vận chuyển
          </Text>
          <Text fontWeight="medium">
            {formatPrice(shipping || shippingLocations?.data)}
          </Text>
        </Flex>
        <Flex justify="space-between">
          <Text fontSize="xl" fontWeight="extrabold">
            Tổng
          </Text>
          <Text fontWeight="medium">
            {formatPrice(
              Number(subtotal) + Number(shipping || shippingLocations?.data)
            )}
          </Text>
        </Flex>
      </Stack>
      <Button
        hidden={checkoutSreen}
        as={ReactLink}
        to="/checkout"
        colorScheme="cyan"
        size="lg"
        rightIcon={<FaArrowRight />}
      >
        Checkout
      </Button>
    </Stack>
  );
};

export default OrderSummary;
