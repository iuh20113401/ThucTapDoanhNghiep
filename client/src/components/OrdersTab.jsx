import {
  Box,
  TableContainer,
  Th,
  Tr,
  Table,
  Td,
  Thead,
  Tbody,
  Button,
  useDisclosure,
  Alert,
  Stack,
  Spinner,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Wrap,
  Text,
  Flex,
  useToast,
  useBreakpointValue,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { CheckCircleIcon, DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrders,
  deleteOrder,
  resetErrorAndRemoval,
  setDelivered,
} from "../redux/actions/adminActions";
import ConfirmRemovalAlert from "./ConfirmRemovalAlert";
import { TbTruckDelivery } from "react-icons/tb";
import formatVietNameDate from "../utils/FormatVietNameDate";
import { Link } from "react-router-dom";
import formatPrice from "../utils/FormatVietNamCurrency";

const OrdersTab = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [orderToDelete, setOrderToDelete] = useState("");
  const dispatch = useDispatch();
  const { error, loading, orders, deliveredFlag, orderRemoval } = useSelector(
    (state) => state.admin
  );
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    dispatch(getAllOrders());
    dispatch(resetErrorAndRemoval());
    if (orderRemoval) {
      toast({
        description: "Order has been removed.",
        status: "success",
        isClosable: true,
      });
    }

    if (deliveredFlag) {
      toast({
        description: "Order has been set to delivered.",
        status: "success",
        isClosable: true,
      });
    }
  }, [dispatch, toast, orderRemoval, deliveredFlag]);

  const openDeleteConfirmBox = (order) => {
    setOrderToDelete(order);
    onOpen();
  };

  const onSetToDelivered = (order) => {
    dispatch(resetErrorAndRemoval());
    dispatch(setDelivered(order._id));
  };

  return (
    <Box>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Upps!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
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
      ) : isMobile ? (
        orders &&
        orders.map((order) => (
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
              <Text fontSize="md" fontWeight="bold">
                Họ tên:
              </Text>
              <Text mb={2}>{order.username}</Text>
              <Text fontSize="md" fontWeight="bold">
                Email:
              </Text>
              <Text mb={2}>{order.email}</Text>
              <Text fontSize="md" fontWeight="bold">
                Địa chỉ:
              </Text>
              <Text mb={2}>{order.shippingAddress.address}</Text>
              <Text fontSize="md" fontWeight="bold">
                Tình trạng thanh toán:
              </Text>
              <Text>{order.paymentStatus}</Text>
              <Text fontSize="md" fontWeight="bold" mt={4}>
                Tổng tiền:
              </Text>
              <Text mb={2}>{formatPrice(order.totalPrice)}</Text>
              <Text fontSize="md" fontWeight="bold" mt={4}>
                Sản phẩm:
              </Text>
              <Box>
                {order.orderItems.map((item) => (
                  <UnorderedList key={item._id}>
                    <ListItem>
                      {item.qty} x {item.name} ({formatPrice(item.price)} mỗi
                      cái)
                    </ListItem>
                  </UnorderedList>
                ))}
              </Box>{" "}
              <Text fontSize="md" fontWeight="bold" mt={4}>
                Tình trạng giao hàng:
              </Text>
              {order.isDelivered ? <CheckCircleIcon /> : "Đang chờ giao hàng"}
              <Flex direction="column">
                <Button
                  variant="outline"
                  onClick={() => openDeleteConfirmBox(order)}
                >
                  <DeleteIcon mr="5px" />
                  Remove Order
                </Button>
                {!order.isDelivered && (
                  <Button
                    mt="4px"
                    variant="outline"
                    onClick={() => onSetToDelivered(order)}
                  >
                    <TbTruckDelivery />
                    <Text ml="5px">Delivered</Text>
                  </Button>
                )}
              </Flex>
            </Flex>
          </Box>
        ))
      ) : (
        <Box>
          <TableContainer
            whiteSpace={"normal"}
            flexWrap={"wrap"}
            overflowWrap={"break-word"}
          >
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Ngày</Th>
                  <Th>Họ tên</Th>
                  <Th width={"10%"}>Email</Th>
                  <Th>Địa chỉ</Th>
                  <Th>Sản phẩm</Th>
                  <Th>Phí ship</Th>
                  <Th>Tổng tiền</Th>
                  <Th>Giao hàng</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders &&
                  orders.map((order) => (
                    <Tr key={order._id}>
                      <Td>{new Date(order.createdAt).toDateString()}</Td>
                      <Td>{order.username}</Td>
                      <Td wordBreak={"break-word"}>{order.email}</Td>
                      <Td>
                        <Text>
                          <i>Địa chỉ: </i> {order.shippingAddress.address}
                        </Text>
                        <Text>
                          <i>City: </i> {order.shippingAddress.postalCode}{" "}
                          {order.shippingAddress.city}
                        </Text>
                        <Text>
                          <i>Country: </i> {order.shippingAddress.country}
                        </Text>
                      </Td>
                      <Td>
                        {order.orderItems.map((item) => (
                          <Text key={item._id}>
                            {item.qty} x {item.name}
                          </Text>
                        ))}
                      </Td>
                      <Td>${order.shippingPrice}</Td>
                      <Td>${order.totalPrice}</Td>
                      <Td>
                        {order.isDelivered ? <CheckCircleIcon /> : "Đang chờ"}
                      </Td>
                      <Td>
                        <Flex direction="column">
                          <Button
                            variant="outline"
                            onClick={() => openDeleteConfirmBox(order)}
                          >
                            <DeleteIcon mr="5px" />
                            Remove Order
                          </Button>
                          {!order.isDelivered && (
                            <Button
                              mt="4px"
                              variant="outline"
                              onClick={() => onSetToDelivered(order)}
                            >
                              <TbTruckDelivery />
                              <Text ml="5px">Delivered</Text>
                            </Button>
                          )}
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </TableContainer>
          <ConfirmRemovalAlert
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            cancelRef={cancelRef}
            itemToDelete={orderToDelete}
            deleteAction={deleteOrder}
          />
        </Box>
      )}
    </Box>
  );
};

export default OrdersTab;
