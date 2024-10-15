import {
  Box,
  Image,
  Text,
  Badge,
  Flex,
  IconButton,
  Skeleton,
  useToast,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react";
import { BiExpand } from "react-icons/bi";
import React, { useState, useEffect } from "react";
import {
  addToFavorites,
  removeFromFavorites,
} from "../redux/actions/productActions";
import { useSelector, useDispatch } from "react-redux";
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from "react-icons/md";
import { Link as ReactLink } from "react-router-dom";
import { addCartItem } from "../redux/actions/cartActions";
import { TbShoppingCartPlus } from "react-icons/tb";

const SERVER_URI = "http://localhost:5000";
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const ProductCard = ({ product, loading }) => {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.product);
  const [isShown, setIsShown] = useState(false);
  const { cartItems } = useSelector((state) => state.cart);
  const toast = useToast();
  const [cartPlusDisabled, setCartPlusDisabled] = useState(false);

  const imageHeight = useBreakpointValue({ base: "150px", md: "200px" });
  const fontSizeTitle = useBreakpointValue({ base: "sm", md: "lg", lg: "xl" });
  const fontSizeSubtitle = useBreakpointValue({ base: "xs", md: "md" });
  const priceFontSize = useBreakpointValue({ base: "sm", md: "lg", lg: "xl" });

  useEffect(() => {
    const item = cartItems.find((cartItem) => cartItem.id === product._id);
    if (item && item.qty === product.stock) {
      setCartPlusDisabled(true);
    }
  }, [product, cartItems]);

  const addItem = (id) => {
    if (cartItems.some((cartItem) => cartItem.id === id)) {
      const item = cartItems.find((cartItem) => cartItem.id === id);
      dispatch(addCartItem(id, item.qty + 1));
    } else {
      dispatch(addCartItem(id, 1));
    }
    toast({
      description: "Item has been added.",
      status: "success",
      isClosable: true,
    });
  };
  return (
    <Skeleton isLoaded={!loading}>
      <Box
        _hover={{ transform: "scale(1.05)", transitionDuration: "0.5s" }}
        borderWidth="1px"
        overflow="hidden"
        p={{ base: "2", md: "4" }} // Responsive padding
        shadow="md"
      >
        <Image
          onMouseEnter={() => setIsShown(true)}
          onMouseLeave={() => setIsShown(false)}
          fallbackSrc="https://via.placeholder.com/150"
          crossOrigin="anonymous"
          src={`${SERVER_URI}${product.coverImage}`}
          alt={product.name}
          height={imageHeight} // Responsive height
        />
        <Flex mt="2" justify={"space-between"}>
          {product.stock < 5 ? (
            <Badge colorScheme="yellow">only {product.stock} left</Badge>
          ) : product.stock < 1 ? (
            <Badge colorScheme="red">Sold out</Badge>
          ) : (
            <Badge colorScheme="green">In Stock</Badge>
          )}
          {product.productIsNew && (
            <Badge ml="2" colorScheme="purple">
              new
            </Badge>
          )}
        </Flex>
        <Badge colorScheme="cyan">{product.category}</Badge>{" "}
        <Text
          noOfLines={3}
          fontSize={fontSizeTitle} // Responsive font size
          fontWeight="semibold"
          mt="2"
          height={{ base: "80px", md: "100px" }}
        >
          {product.brand} {` `} {product.name}
        </Text>
        <Text noOfLines={1} fontSize={fontSizeSubtitle} color="gray.600">
          {product.subtitle}
        </Text>
        <Flex
          justify={{ base: "center", md: "space-between" }}
          mt="2"
          flexDirection={{ base: "column", md: "row" }}
        >
          <Text fontSize={priceFontSize} fontWeight="semibold" color="cyan.600">
            {product.salePrice ? (
              <Flex align="center">
                <Text
                  as="span"
                  mr="2"
                  color="gray.500"
                  fontSize="md"
                  textDecoration="line-through"
                >
                  {formatPrice(product.price)}
                </Text>
                <Text as="span" color="cyan.600">
                  {formatPrice(product.salePrice)}
                </Text>
              </Flex>
            ) : (
              <Text>{formatPrice(product.price)}</Text>
            )}
          </Text>
        </Flex>
        <Flex justify="space-between" mt="2">
          {favorites.includes(product._id) ? (
            <IconButton
              icon={<MdOutlineFavorite size="20px" />}
              colorScheme="cyan"
              size="sm"
              onClick={() => dispatch(removeFromFavorites(product._id))}
            />
          ) : (
            <IconButton
              icon={<MdOutlineFavoriteBorder size="20px" />}
              colorScheme="cyan"
              size="sm"
              onClick={() => dispatch(addToFavorites(product._id))}
            />
          )}

          <IconButton
            icon={<BiExpand size="20" />}
            as={ReactLink}
            to={`/product/${product._id}`}
            colorScheme="cyan"
            size="sm"
          />

          <Tooltip
            isDisabled={!cartPlusDisabled}
            hasArrow
            label={
              !cartPlusDisabled
                ? "You reached the maximum quantity of the product."
                : product.stock <= 0
                ? "Out of stock"
                : ""
            }
          >
            <IconButton
              isDisabled={product.stock <= 0 || cartPlusDisabled}
              onClick={() => addItem(product._id)}
              icon={<TbShoppingCartPlus size="20" />}
              colorScheme="cyan"
              size="sm"
            />
          </Tooltip>
        </Flex>
      </Box>
    </Skeleton>
  );
};

export default ProductCard;
