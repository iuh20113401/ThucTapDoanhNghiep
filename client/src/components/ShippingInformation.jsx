import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  FormControl,
  VStack,
  Select,
  Flex,
  FormLabel,
} from "@chakra-ui/react";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { setAddress, setPayment } from "../redux/actions/orderActions";
import TextField from "./TextField";
import { getShippingFee } from "../redux/actions/ShippingFeeActions"; // Import your action
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ShippingInformation = () => {
  const { shippingAddress } = useSelector((state) => state.order);
  const { shippingCity } = useSelector((state) => state.cart);
  const [selectedCity, setSelectedCity] = useState(shippingCity?.city);
  const [selectedDistrict, setSelectedDistrict] = useState(
    shippingCity?.district || ""
  );
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  // Fetch cities when the component is mounted
  const fetchDistrics = useCallback(async () => {
    const cityCode = cities.filter(
      (ct) => ct.province_name === selectedCity
    )?.[0]?.["province_id"];
    try {
      const response = await fetch(
        `https://vapi.vnappmob.com/api/province/district/${cityCode}`
      );
      const data = await response.json();
      setDistricts(data.results || []);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  }, [cities, selectedCity]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("https://vapi.vnappmob.com/api/province/"); // Example API for cities
        const data = await response.json();
        setCities(data.results); // Set the list of cities
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    if (!cities.length) fetchCities();
    if (selectedCity) {
      fetchDistrics();
    }
  }, [cities.length, districts.length, fetchDistrics, selectedCity]);

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    if (selectedCity && selectedDistrict) {
      dispatch(getShippingFee(selectedCity, selectedDistrict));
    }
  }, [selectedCity, selectedDistrict, dispatch]);

  const onSubmit = async (values) => {
    dispatch(setAddress(values));
    dispatch(setPayment());

    // Navigate to the payment page after form submission
    navigate("/payment");
  };

  const handleCityChange = async (event) => {
    const cityName = event.target.value;
    setSelectedCity(cityName);
  };

  return (
    <Formik
      initialValues={{
        address: shippingAddress ? shippingAddress.address : "",
        city: selectedCity || (shippingAddress ? shippingAddress.city : ""),
        district: selectedDistrict || "",
      }}
      validationSchema={Yup.object({
        address: Yup.string()
          .required("We need an address.")
          .min(2, "This address is too short."),

        city: Yup.string().required("We need a city."),
        district: Yup.string().required("We need a district."),
      })}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <>
          <VStack as="form">
            <FormControl>
              {/* City Dropdown */}
              <FormLabel>Tỉnh / Thành phố</FormLabel>
              <Select
                value={shippingCity.city || selectedCity}
                onChange={handleCityChange}
              >
                <option value="">Chọn tỉnh / thành phố</option>
                {cities.map((city) => (
                  <option key={city.province_id} value={city.province_name}>
                    {city.province_name}
                  </option>
                ))}
              </Select>
              <FormLabel>Quận / Huyện</FormLabel>

              {/* District Dropdown */}
              {(shippingCity.city !== undefined || districts.length > 0) && (
                <Select
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  value={selectedDistrict}
                  mt={2}
                >
                  <option value="">Chọn quận huyện </option>
                  {districts.map((district) => (
                    <option
                      key={district.district_id}
                      value={district.district_name}
                    >
                      {district.district_name}
                    </option>
                  ))}
                </Select>
              )}
              <TextField
                name="address"
                placeholder="Street Address"
                label="Street Address"
              />
            </FormControl>
          </VStack>

          <Flex
            alignItems="center"
            gap="2"
            direction={{ base: "column", lg: "row" }}
          >
            <Button
              variant="outline"
              colorScheme="cyan"
              w="100%"
              onClick={formik.handleSubmit}
            >
              Thanh toán
            </Button>
          </Flex>
        </>
      )}
    </Formik>
  );
};

export default ShippingInformation;
