import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getProducts,
  getProductsOverview,
} from "../redux/actions/productActions";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Spinner,
  Stack,
  VStack,
  Wrap,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Search2Icon, SearchIcon } from "@chakra-ui/icons";
import formatPrice from "../utils/FormatVietNamCurrency";

const ProductFilter = () => {
  const [name, setName] = useState("");

  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [brand, setBrand] = useState("");
  const [minReviews, setMinReviews] = useState("");
  const {
    loading,
    productBrands,
    productColors,
    productSizes,
    productRatings,
    minPrice: productMinPrice,
    maxPrice: productMaxPrice,
  } = useSelector((state) => state.product);
  const [priceRange, setPriceRange] = useState([
    productMinPrice || 0,
    productMaxPrice || 1000,
  ]);

  const handleSliderChange = (val) => {
    setPriceRange(val);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductsOverview());
  }, [dispatch]);

  const handleFilter = () => {
    const filters = {
      name: name || undefined,
      price: { gte: priceRange[0], lte: priceRange[1] },
      color: color || undefined,
      size: size || undefined,
      reviews: minReviews || undefined,
      brand: brand || undefined,
    };

    let filterString = "";
    Object.keys(filters).forEach((key) => {
      if (key === "name" && filters[key] !== undefined) {
        filterString += `name[regex]=${filters[key]}&`;
      }
      if (key === "price") {
        filterString += `price[gte]=${priceRange[0]}&price[lte]=${priceRange[1]}&`;
      }
      if (key === "color" && filters[key] !== undefined) {
        filterString += `colors.ten=${color}&`;
      }
      if (key === "size" && filters[key] !== undefined) {
        filterString += `sizes=${size}&`;
      }
      if (key === "reviews" && filters[key] !== undefined) {
        filterString += `rating[gte]=${minReviews}&`;
      }
      if (key === "brand" && filters[key] !== undefined) {
        filterString += `brand=${brand}&`;
      }
    });

    dispatch(getProducts(1, filterString));
  };
  const bgcolor = useColorModeValue("gray.100", "blackAlpha.400");
  return (
    <>
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
        <Box p={4} bg={bgcolor} w="100%" borderRadius="md">
          <VStack spacing={4}>
            <InputGroup>
              <InputLeftAddon>
                <SearchIcon />
              </InputLeftAddon>
              <Input
                placeholder="Nhập tên sản phẩm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </InputGroup>

            <VStack spacing={4}>
              {/* Display the current price range */}
              <Text>
                {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </Text>

              <RangeSlider
                min={productMinPrice || 0}
                max={productMaxPrice || 1000}
                defaultValue={priceRange}
                onChange={handleSliderChange}
              >
                <RangeSliderTrack>
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} />
                <RangeSliderThumb index={1} />
              </RangeSlider>

              {/* Other filters like brand, color, size, etc. */}
            </VStack>

            <Select
              placeholder="Thương hiệu"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            >
              {productBrands?.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </Select>

            <Select
              placeholder="Màu sắc"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            >
              {productColors?.map((colorOption) => (
                <option key={colorOption} value={colorOption}>
                  {colorOption}
                </option>
              ))}
            </Select>

            <Select
              placeholder="Dung lượng"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              {productSizes?.map((sizeOption) => (
                <option value={sizeOption} key={sizeOption}>
                  {sizeOption}
                </option>
              ))}
            </Select>

            <Select
              placeholder="Đánh giá"
              value={minReviews}
              onChange={(e) => setMinReviews(e.target.value)}
            >
              {productRatings?.map((rating) => (
                <option value={rating} key={rating}>
                  {rating} sao
                </option>
              ))}
            </Select>

            <Button
              leftIcon={<Search2Icon />}
              colorScheme="blue"
              onClick={handleFilter}
            >
              <span ml={3}>Tìm kiếm</span>
            </Button>
          </VStack>
        </Box>
      )}
    </>
  );
};

export default ProductFilter;
