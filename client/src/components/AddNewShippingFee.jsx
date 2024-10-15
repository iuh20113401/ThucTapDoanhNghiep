import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setShippingFee } from "../redux/actions/ShippingFeeActions";
import { Box, Button, Input, Select } from "@chakra-ui/react";

function AddNewShippingFee({ onClose }) {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [shippingFeeValue, setShippingFeeValue] = useState(0);

  const dispatch = useDispatch();

  // Fetch cities when the component is mounted
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("https://provinces.open-api.vn/api/p/"); // Example API for cities
        const data = await response.json();
        setCities(data); // Set the list of cities
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  const handleCityChange = async (event) => {
    const cityName = event.target.value;
    setSelectedCity(cityName);
    const cityCode = cities.filter((ct) => ct.name === cityName)?.[0]?.["code"];
    console.log(cityCode);
    try {
      const response = await fetch(
        `https://provinces.open-api.vn/api/p/${cityCode}?depth=2`
      ); // Fetch districts based on selected city
      const data = await response.json();
      setDistricts(data.districts || []);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleSubmit = () => {
    if (!selectedCity || !shippingFeeValue) {
      alert("Vui lòng chọn thành phố và nhập giá hợp lệ");
      return;
    }

    dispatch(setShippingFee(selectedCity, selectedDistrict, shippingFeeValue));
    onClose(); // Close the modal after submission
  };

  return (
    <Box>
      {/* City Dropdown */}
      <Select onChange={handleCityChange} value={selectedCity}>
        <option value="">Chọn tình / thành phố</option>
        {cities.map((city) => (
          <option key={city.code} value={city.name}>
            {city.name}
          </option>
        ))}
      </Select>

      {/* District Dropdown */}
      {districts.length > 0 && (
        <Select
          onChange={(e) => setSelectedDistrict(e.target.value)}
          value={selectedDistrict}
          mt={2}
        >
          <option value="">Chọn quận huyện (nếu cần)</option>
          {districts.map((district) => (
            <option key={district.code} value={district.name}>
              {district.name}
            </option>
          ))}
        </Select>
      )}

      <Input
        mt={2}
        type="number"
        placeholder="Nhập giá ship"
        value={shippingFeeValue}
        onChange={(e) => setShippingFeeValue(e.target.value)}
      />

      <Button mt={4} colorScheme="teal" onClick={handleSubmit}>
        Add Shipping Fee
      </Button>
    </Box>
  );
}

export default AddNewShippingFee;
