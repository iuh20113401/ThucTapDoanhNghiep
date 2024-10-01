import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getProducts } from "../redux/actions/productActions";
import {
  Box,
  Button,
  filter,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  VStack,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const ProductFilter = () => {
  const [name, setName] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [minReviews, setMinReviews] = useState("");

  const dispatch = useDispatch();

  const handleFilter = () => {
    const filters = {
      name: name || undefined,
      price: { gte: minPrice || undefined, lte: maxPrice || undefined },
      color: color || undefined,
      size: size || undefined,
      reviews: minReviews || undefined,
    };
    let filterString = "";
    Object.keys(filters).map((key) => {
      if (key === "name" && filters[key] !== undefined)
        filterString += `name[regex]=${name}`;
      if (key === "name" && minPrice !== undefined && minPrice !== "")
        filterString += `price[gte]=${minPrice}`;
      if (key === "name" && maxPrice !== undefined && maxPrice !== "")
        filterString += `price[lte]=${maxPrice}`;
    });
    dispatch(getProducts(1, filterString)); // Send filters to the backend
  };

  return (
    <Box p={4} bg="gray.100" w="100%" borderRadius="md">
      <VStack spacing={4}>
        <InputGroup>
          <InputLeftAddon>
            <SearchIcon />
          </InputLeftAddon>
          <Input
            placeholder="Nhập tên sản phẩm "
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </InputGroup>

        <Input
          placeholder="Min Price"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <Input
          placeholder="Max Price"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <Select
          placeholder="Select Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        >
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          {/* Add more color options */}
        </Select>

        <Select
          placeholder="Select Size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          {/* Add more sizes */}
        </Select>

        <Select
          placeholder="Min Review Rating"
          value={minReviews}
          onChange={(e) => setMinReviews(e.target.value)}
        >
          <option value="1">1 Star & Up</option>
          <option value="2">2 Stars & Up</option>
          <option value="3">3 Stars & Up</option>
          <option value="4">4 Stars & Up</option>
          <option value="5">5 Stars</option>
        </Select>

        <Button colorScheme="blue" onClick={handleFilter}>
          Apply Filters
        </Button>
      </VStack>
    </Box>
  );
};

export default ProductFilter;
