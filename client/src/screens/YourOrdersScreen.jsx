import {
  Stack,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
  Button,
  ListItem,
  UnorderedList,
  AlertTitle,
  Wrap,
  Link,
  Flex,
  Box,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { getUserOrders } from "../redux/actions/userActions";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import formatPrice from "../utils/FormatVietNamCurrency";
import formatVietNameDate from "../utils/FormatVietNameDate";

const YourOrdersScreen = () => {
  const dispatch = useDispatch();
  const { loading, error, orders, userInfo } = useSelector(
    (state) => state.user
  );
  const location = useLocation();

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    if (userInfo) {
      dispatch(getUserOrders());
    }
  }, [dispatch, userInfo]);

  return userInfo ? (
    <>
      {loading ? (
        <Wrap
          direction="column"
          align="center"
          mt="20px"
          justify="center"
          minHeight="100vh"
        >
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
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>We are sorry!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        orders && (
          <Box minH="100vh" whiteSpace={"normal"} p={isMobile ? 2 : 10}>
            {orders.map((order) => (
              <Box
                key={order._id}
                borderWidth="1px"
                borderRadius="lg"
                p={4}
                mb={4}
                boxShadow="md"
                backgroundColor="white"
              >
                <Flex direction="column">
                  {/* Mã đơn hàng */}
                  <Text fontSize="md" fontWeight="bold">
                    Mã đơn hàng:
                  </Text>
                  <Text mb={2}>{order._id}</Text>

                  {/* Ngày tạo */}
                  <Text fontSize="md" fontWeight="bold">
                    Ngày tạo đơn:
                  </Text>
                  <Text mb={2}>{formatVietNameDate(order.createdAt)}</Text>

                  {/* Tình trạng thanh toán */}
                  <Text fontSize="md" fontWeight="bold">
                    Tình trạng thanh toán:
                  </Text>
                  <Flex
                    gap={6}
                    justifyContent={isMobile ? "space-between" : ""}
                    alignItems="center"
                  >
                    <Text>{order.paymentStatus}</Text>
                    {order.paymentStatus === "Đang chờ" && (
                      <Link
                        backgroundColor={"gray.200"}
                        p={2}
                        href={order.payUrl}
                      >
                        Thanh toán
                      </Link>
                    )}
                  </Flex>

                  {/* Tổng tiền */}
                  <Text fontSize="md" fontWeight="bold" mt={4}>
                    Tổng tiền:
                  </Text>
                  <Text mb={2}>{formatPrice(order.totalPrice)}</Text>

                  {/* Sản phẩm */}
                  <Text fontSize="md" fontWeight="bold" mt={4}>
                    Sản phẩm:
                  </Text>
                  <Box>
                    {order.orderItems.map((item) => (
                      <UnorderedList key={item._id}>
                        <ListItem>
                          {item.qty} x {item.name} ({formatPrice(item.price)}{" "}
                          mỗi cái)
                        </ListItem>
                      </UnorderedList>
                    ))}
                  </Box>

                  {/* Print Receipt Button */}
                  <Button
                    mt={4}
                    variant="outline"
                    size={isMobile ? "sm" : "md"}
                  >
                    Receipt
                  </Button>
                </Flex>
              </Box>
            ))}
          </Box>
        )
      )}
    </>
  ) : (
    <Navigate to="/login" replace={true} state={{ from: location }} />
  );
};

export default YourOrdersScreen;
