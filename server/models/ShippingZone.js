import mongoose from "mongoose";

const shippingZoneSchema = new mongoose.Schema(
  {
    zoneName: { type: String, required: true }, // Vùng miền/địa phương
    shippingFee: { type: Number, required: true }, // Phí giao hàng cho vùng này
  },
  { timestamps: true }
);

const ShippingZone = mongoose.model("ShippingZones", shippingZoneSchema);
export default ShippingZone;
