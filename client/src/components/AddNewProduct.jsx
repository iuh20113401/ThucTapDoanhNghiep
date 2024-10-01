import {
  Button,
  VStack,
  Textarea,
  Tooltip,
  Input,
  FormControl,
  FormLabel,
  HStack,
  Box,
  Heading,
  Checkbox,
  Image,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { uploadProduct } from "../redux/actions/adminActions";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
const createSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
    .replace(/(^-|-$)+/g, ""); // Remove leading/trailing hyphens
};
const AddNewProduct = () => {
  const dispatch = useDispatch();
  const { handleSubmit, control, reset, watch } = useForm();
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colorInput, setColorInput] = useState("");
  const [colorNameInput, setColorNameInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [coverImage, setCoverImage] = useState(null); // For cover image
  const [imageFiles, setImageFiles] = useState([]); // For additional images
  const [previewImages, setPreviewImages] = useState([]);
  // Inside your component
  const [slug, setSlug] = useState("");

  useEffect(() => {
    // Watch the `name` field for changes and update the slug
    const subscription = watch((value, { name }) => {
      if (name === "name") {
        setSlug(createSlug(value.name));
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);
  const addColor = () => {
    if (colorInput && colorNameInput && !colors.includes(colorInput)) {
      setColors([...colors, { color: colorInput, ten: colorNameInput }]);
      setColorInput("");
      setColorNameInput("");
    }
  };

  const removeColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const addSize = () => {
    if (sizeInput && !sizes.includes(sizeInput)) {
      setSizes([...sizes, sizeInput]);
      setSizeInput("");
    }
  };

  const removeSize = (sizeToRemove) => {
    setSizes(sizes.filter((size) => size !== sizeToRemove));
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prevFiles) => [...prevFiles, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prevPreviews) => [...prevPreviews, ...previews]);
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("brand", data.brand);
    formData.append("category", data.category);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("productIsNew", data.productIsNew);
    formData.append("description", data.description);
    formData.append("slug", slug);

    colors.forEach((color, index) => {
      formData.append(`colors[${index}][color]`, color.color);
      formData.append(`colors[${index}][ten]`, color.ten);
    });
    sizes.forEach((size) => {
      formData.append("sizes[]", size);
    });
    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    // Dispatch the form data to the uploadProduct action
    dispatch(uploadProduct(formData));

    // reset();
    // setCoverImage(null);
    // setImageFiles([]);
    // setPreviewImages([]);
    // setColors([]);
    // setSizes([]);
  };

  return (
    <VStack
      spacing={4}
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      align="stretch"
      width="100%"
    >
      <HStack spacing="24px">
        <FormControl>
          <FormLabel>Tên sản phẩm</FormLabel>
          <Tooltip label={"Nhập tên sản phẩm của bạn"} fontSize="sm">
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input variant="flushed" size="md" {...field} />
              )}
            />
          </Tooltip>
        </FormControl>

        {/* Cover Image */}
        <Box w="150px" h="100px">
          <Tooltip label={"Chọn hình ảnh đại diện sản phẩm"} fontSize="sm">
            <Controller
              name="coverImage"
              control={control}
              render={({ field }) => (
                <Box
                  w="150px"
                  h="100px"
                  onClick={() =>
                    document.getElementById("coverImageInput").click()
                  }
                  cursor="pointer"
                >
                  <Tooltip label={"Chọn hình ảnh đại diện"} fontSize="sm">
                    <>
                      {coverImage ? (
                        <Image
                          src={URL.createObjectURL(coverImage)}
                          alt="Hình ảnh đại diện"
                          boxSize="100px"
                          objectFit="cover"
                        />
                      ) : (
                        <Box
                          w="100px"
                          h="100px"
                          border="1px solid gray"
                          textAlign="center"
                          lineHeight="100px"
                          bgColor="gray.100"
                        >
                          Hình đại diện
                        </Box>
                      )}{" "}
                      <Input
                        type="file"
                        accept="image/*"
                        id="coverImageInput"
                        display="none"
                        onChange={handleCoverImageChange}
                      />
                    </>
                  </Tooltip>
                </Box>
              )}
            />
          </Tooltip>
        </Box>
      </HStack>

      <HStack spacing={5}>
        <Controller
          name="productIsNew"
          control={control}
          defaultValue={false}
          render={({ field }) => <Checkbox {...field}>New</Checkbox>}
        />
        <Checkbox colorScheme="red" defaultChecked>
          Sale off
        </Checkbox>
      </HStack>

      <Heading as="h5" size="xs">
        Thông tin sản phẩm
      </Heading>

      <FormControl>
        <FormLabel>Hãng sản xuất</FormLabel>
        <Controller
          name="brand"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input size="sm" placeholder="Apple or Samsung etc." {...field} />
          )}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Danh mục</FormLabel>
        <Controller
          name="category"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input size="sm" placeholder="Smartphone" {...field} />
          )}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Giá gốc</FormLabel>
        <Controller
          name="price"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input size="sm" placeholder="299.99" {...field} />
          )}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Số lượng hàng tồn</FormLabel>
        <Controller
          name="stock"
          control={control}
          defaultValue=""
          render={({ field }) => <Input size="sm" {...field} />}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Colors</FormLabel>
        <HStack align="center">
          <Input
            size="sm"
            placeholder="Color Name"
            value={colorNameInput}
            onChange={(e) => setColorNameInput(e.target.value)}
          />
          <Input
            size="sm"
            type="color"
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
          />
          <Button size="sm" onClick={addColor}>
            Add
          </Button>
        </HStack>
        <HStack mt={2}>
          {colors.map((color, index) => (
            <Tag key={index} size="sm" variant="solid" bgColor={color.color}>
              <TagLabel>{color.ten}</TagLabel>
              <TagCloseButton onClick={() => removeColor(index)} />
            </Tag>
          ))}
        </HStack>
      </FormControl>

      <FormControl>
        <FormLabel>Sizes</FormLabel>
        <HStack>
          <Input
            size="sm"
            placeholder="Add size"
            value={sizeInput}
            onChange={(e) => setSizeInput(e.target.value)}
          />
          <Button size="sm" onClick={addSize}>
            Add
          </Button>
        </HStack>
        <HStack mt={2}>
          {sizes.map((size) => (
            <Tag key={size} size="sm" variant="solid" colorScheme="green">
              <TagLabel>{size}</TagLabel>
              <TagCloseButton onClick={() => removeSize(size)} />
            </Tag>
          ))}
        </HStack>
      </FormControl>
      {/* Additional Images */}
      <FormControl>
        <FormLabel>Thêm nhiều hình ảnh</FormLabel>
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />
        <HStack mt={2}>
          {previewImages.map((src, index) => (
            <Image
              key={index}
              src={src}
              alt={`Hình ${index + 1}`}
              boxSize="100px"
              objectFit="cover"
            />
          ))}
        </HStack>
      </FormControl>

      <FormControl>
        <FormLabel>Mô tả sản phẩm</FormLabel>
        <Controller
          name="description"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Textarea size="sm" placeholder="Mô tả sản phẩm" {...field} />
          )}
        />
      </FormControl>

      <VStack>
        <Button type="submit" variant="outline" w="160px" colorScheme="cyan">
          Lưu sản phẩm
        </Button>
      </VStack>
    </VStack>
  );
};

export default AddNewProduct;
