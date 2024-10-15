import mongoose from "mongoose";

const ShippingZoneSchema = new mongoose.Schema({
  city: { type: String, required: true }, // City name
  districts: [
    {
      districtName: { type: String },
      shippingFee: { type: Number }, // Shipping fee for that district
    },
  ],
  defaultFee: { type: Number, required: true, default: 30000 },
});
const ShippingZone = mongoose.model("ShippingZones", ShippingZoneSchema);
export default ShippingZone;
