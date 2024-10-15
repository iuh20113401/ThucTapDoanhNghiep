import ShippingZone from "../models/ShippingZone.js";

export const setShippingFee = async (req, res) => {
  const { city, district: districtName, shippingFee } = req.body;
  try {
    let zone = await ShippingZone.findOne({ city });

    if (!zone) {
      console.log(districtName === true);
      if (districtName)
        zone = new ShippingZone({
          city,
          districts: [{ districtName, shippingFee }],
          defaultFee: shippingFee,
        });
      else
        zone = new ShippingZone({
          city,
          defaultFee: shippingFee,
        });
    } else {
      const district = zone.districts.find(
        (d) => d.districtName === districtName
      );

      if (district) {
        district.shippingFee = shippingFee;
      } else {
        zone.districts.push({ districtName, shippingFee });
      }
    }

    await zone.save();
    res.status(200).json({
      status: "success",
      message: "Thêm phí vận chuyển thành công",
    });
  } catch (error) {
    console.error("Error setting shipping fee:", error);
    res.status(500).json({
      status: "error",
      message: "Thêm phí vận chuyển không thành công",
    });
  }
};
export const getShippingFee = async (req, res) => {
  const { city, district } = req.params;
  try {
    let zone = await ShippingZone.findOne({ city });
    if (!zone) {
      zone = await ShippingZone.findOne({ city: "Mặc định" });

      if (!zone) {
        const defaultZone = new ShippingZone({
          city: "Mặc định",
          districts: [],
          defaultFee: 30000,
        });
        await defaultZone.save();
        return res.status(200).json({ status: "success", data: 30000 });
      }
    }

    const districtData = zone.districts.find(
      (d) => d.districtName === district
    );

    if (districtData) {
      res
        .status(200)
        .json({ status: "success", data: districtData.shippingFee });
    } else {
      res.status(200).json({ status: "success", data: zone.defaultFee });
    }
  } catch (error) {
    console.error("Error fetching shipping fee:", error);
    res
      .status(500)
      .json({ status: "success", data: "Unable to fetch shipping fee" });
  }
};
export const getAllShippingFee = async (req, res) => {
  try {
    const zones = await ShippingZone.find(); // Get all shipping zones
    if (!zones.length) {
      const defaultZone = new ShippingZone({
        city: "Mặc định",
        districts: [],
        defaultFee: 30000,
      });
      await defaultZone.save();
      return res.status(200).json([defaultZone]);
    }

    const result = zones.flatMap((zone) => {
      const data = zone.districts.length
        ? [
            ...zone.districts.map((district) => ({
              city: zone.city,
              districtName: district.districtName,
              shippingFee: district.shippingFee,
            })),
            {
              city: zone.city,
              shippingFee: zone.defaultFee,
              districtName: "", // Default entry added after all districts
            },
          ]
        : [
            {
              city: zone.city,
              shippingFee: zone.defaultFee,
              districtName: zone.districts,
            },
          ];
      return data;
    });

    res.status(200).json(result); // Return all shipping fees, one row per district
  } catch (error) {
    console.error("Error fetching all shipping fees:", error);
    res.status(500).json({ error: "Unable to fetch shipping fees" });
  }
};
export const updateShippingFee = async (req, res) => {
  const { city, district } = req.params;
  const { newShippingFee } = req.body;
  try {
    const zone = await ShippingZone.findOne({ city });

    if (!zone) {
      return res.status(404).json({
        status: "error",
        message: "City not found",
      });
    }
    if (district !== "undefined") {
      const districtData = zone.districts.find(
        (d) => d.districtName === district
      );
      districtData.shippingFee = newShippingFee;

      if (!districtData) {
        return res.status(404).json({
          status: "error",
          message: "District not found",
        });
      }
    } else {
      zone.defaultFee = newShippingFee;
    }

    const data = await zone.save();
    res.status(200).json({
      status: "success",
      message: "Cập nhật phí vận chuyển thành công",
    });
  } catch (error) {
    console.error("Error updating shipping fee:", error);
    res.status(500).json({
      status: "error",
      message: "Cập nhật phí vận chuyển không thành công",
    });
  }
};
export const deleteShippingFee = async (req, res) => {
  const { city, district } = req.body;

  try {
    const zone = await ShippingZone.findOne({ city });

    if (!zone) {
      return res.status(404).json({
        status: "error",
        message: "City not found",
      });
    }

    const districtIndex = zone.districts.findIndex(
      (d) => d.districtName === district
    );

    if (districtIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: "District not found",
      });
    }

    // Remove the district from the zone
    zone.districts.splice(districtIndex, 1);
    await zone.save();

    res.status(200).json({
      status: "success",
      message: "Xóa phí vận chuyển thành công",
    });
  } catch (error) {
    console.error("Error deleting shipping fee:", error);
    res.status(500).json({
      status: "error",
      message: "Xóa phí vận chuyển không thành công",
    });
  }
};
