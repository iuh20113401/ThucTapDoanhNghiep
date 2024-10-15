import {
  Box,
  Heading,
  Stack,
  useBreakpointValue,
  IconButton,
} from "@chakra-ui/react";
import Slider from "react-slick";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons"; // Chakra UI icons

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "./ProductCard";

// Custom arrow component for the slider
const CustomPrevArrow = ({ onClick }) => {
  return (
    <IconButton
      aria-label="Previous"
      icon={<ArrowBackIcon />}
      position="absolute"
      top="50%"
      left={{ base: "5px", md: "15px" }} // Adjust position for mobile and desktop
      transform="translateY(-50%)"
      zIndex={1}
      onClick={onClick}
    />
  );
};

const CustomNextArrow = ({ onClick }) => {
  return (
    <IconButton
      aria-label="Next"
      icon={<ArrowForwardIcon />}
      position="absolute"
      top="50%"
      right={{ base: "5px", md: "15px" }} // Adjust position for mobile and desktop
      transform="translateY(-50%)"
      zIndex={1}
      onClick={onClick}
    />
  );
};
const ProductsSlider = ({ title, products }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: useBreakpointValue({ base: 2, sm: 2, md: 4 }),
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2, // Adjusted for mobile
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3, // Adjusted for tablet
        },
      },
    ],
  };

  return (
    <Stack py={10} position="relative" width="100%" overflowX="hidden">
      <Heading size="lg" textAlign="center" mb={6}>
        {title}
      </Heading>
      <Box mx="auto" w="100%" px={{ base: 2, md: 4 }} position="relative">
        <Slider {...settings}>
          {products.map((product) => (
            <Box key={product.id} p={{ base: 2, md: 4 }}>
              <ProductCard product={product} />
            </Box>
          ))}
        </Slider>
      </Box>
    </Stack>
  );
};

export default ProductsSlider;
