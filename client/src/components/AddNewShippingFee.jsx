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
        const response = await fetch("https://vapi.vnappmob.com/api/province/"); // Example API for cities
        const data = await response.json();
        setCities(data.results); // Set the list of cities
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  const handleCityChange = async (event) => {
    const cityName = event.target.value;
    setSelectedCity(cityName);
    const cityCode = cities.filter(
      (ct) => ct.province_name === cityName
    )?.[0]?.["province_id"];
    console.log(cityCode);
    try {
      const response = await fetch(
        `https://vapi.vnappmob.com/api/province/district/${cityCode}`
      ); // Fetch districts based on selected city
      const data = await response.json();
      console.log(data);
      setDistricts(data.results || []);
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
    onClose();
  };

  return (
    <Box>
      <Select onChange={handleCityChange} value={selectedCity}>
        <option value="">Chọn tình / thành phố</option>
        {cities.map((city) => (
          <option key={city.province_id} value={city.province_name}>
            {city.province_name}
          </option>
        ))}
      </Select>

      {districts.length > 0 && (
        <Select
          onChange={(e) => setSelectedDistrict(e.target.value)}
          value={selectedDistrict}
          mt={2}
        >
          <option value="">Chọn quận huyện (nếu cần)</option>
          {districts.map((district) => (
            <option key={district.district_id} value={district.district_name}>
              {district.district_name}
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
