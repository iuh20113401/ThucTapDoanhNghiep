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
  Checkbox,
  Image,
  Tag,
  TagLabel,
  TagCloseButton,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetErrorAndRemoval,
  updateProduct,
  uploadProduct,
} from "../redux/actions/adminActions";
import { useEffect, useRef, useState } from "react";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { getProduct, resetProductError } from "../redux/actions/productActions";
import { useParams } from "react-router-dom";

const createSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

const AddNewProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, productInsert, productUpdate } = useSelector(
    (state) => state.product
  );
  useEffect(() => {
    if (id) dispatch(getProduct(id));
  }, [dispatch, id]);
  const { loading, error } = useSelector((state) => state.admin);
  const [colors, setColors] = useState(product ? product.colors : []);
  const [sizes, setSizes] = useState(product ? product.sizes : []);
  const [colorInput, setColorInput] = useState("");
  const [colorNameInput, setColorNameInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [coverImage, setCoverImage] = useState(
    product ? product.coverImage : null
  );
  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState(
    product ? product.images.map((img) => img.url) : []
  );
  const [slug, setSlug] = useState(product ? product.slug : "");
  const [productIsSale, setProductIsSale] = useState(
    product ? product.productIsSaleOff : false
  );
  const [productIsNew, setProductIsNew] = useState(
    product ? product.productIsNew : false
  );
  useEffect(() => {
    if (product) {
      setColors(product.colors);
      setSizes(product.sizes);
      setProductIsNew(product.productIsNew);
      setProductIsSale(product.productIsSaleOff);
      setCoverImage(product.coverImage);
      setImageFiles(product.images);
      setSlug(product.slug);
    }
  }, [product]);

  const formikRef = useRef(null);
  const toast = useToast();

  const addColor = () => {
    if (colorInput && colorNameInput && !colors.includes(colorInput)) {
      setColors([...colors, { color: colorInput, ten: colorNameInput }]);
      setColorInput("");
      setColorNameInput("");
    }
  };
  // Assuming reset() is a custom function to reset all form fields and state variables
  const reset = () => {
    setColors([]);
    setSizes([]);
    setColorInput("");
    setColorNameInput("");
    setSizeInput("");
    setCoverImage(null);
    setImageFiles([]);
    setPreviewImages([]);
    setSlug("");
    setProductIsSale(false);
    setProductIsNew(false);
  };

  useEffect(() => {
    if (!loading && !error && (productInsert || productUpdate)) {
      toast({
        description: "Thêm sản phẩm thành công",
        status: "success",
        isClosable: "true",
      });
      formikRef.current.resetForm();
      reset();
      dispatch(resetErrorAndRemoval());
      dispatch(resetProductError());
    }
  }, [loading, error, dispatch, toast, productInsert, productUpdate]);
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
  const onSubmit = (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("brand", values.brand);
    formData.append("category", values.category);
    formData.append("price", values.price);
    formData.append("stock", values.stock);
    formData.append("description", values.description);
    formData.append("slug", createSlug(values.name));
    formData.append("productIsNew", productIsNew);
    formData.append("productIsSale", productIsSale);

    colors.forEach((color, index) => {
      formData.append(`colors[${index}][color]`, color.color);
      formData.append(`colors[${index}][ten]`, color.ten);
    });

    sizes.forEach((size) => {
      formData.append("sizes[]", size);
    });

    if (coverImage) {
      console.log(coverImage);
      formData.append("coverImage", coverImage);
    }
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    if (productIsSale && values.salePrice) {
      formData.append("salePrice", values.salePrice);
    }

    if (product) {
      // If product exists, update it
      dispatch(updateProduct(product._id, formData));
    } else {
      // Otherwise, create a new product
      dispatch(uploadProduct(formData));
    }
  };
  const initialState = {
    name: product ? product.name : "",
    brand: product ? product.brand : "",
    category: product ? product.category : "",
    price: product ? product.price : "",
    stock: product ? product.stock : "",
    salePrice: product ? product.salePrice : "",
    description: product ? product.description : "",
  };
  return (
    <Formik
      initialValues={initialState}
      validationSchema={Yup.object({
        name: Yup.string()
          .required("Please enter a product name")
          .min(2, "Too short"),
        brand: Yup.string().required("Please enter the brand"),
        category: Yup.string().required("Please enter a category"),
        price: Yup.number().required("Please enter a price"),
        stock: Yup.number().required("Please enter stock quantity"),
        salePrice: Yup.number().when("productIsSale", {
          is: true,
          then: Yup.number().required("Please enter sale price"),
        }),
        description: Yup.string().required(
          "Please enter a product description"
        ),
      })}
      onSubmit={onSubmit}
      innerRef={formikRef}
      enableReinitialize
    >
      {({ handleSubmit, handleChange, values, setFieldValue }) => (
        <VStack
          spacing={4}
          as="form"
          onSubmit={handleSubmit}
          align="stretch"
          width="100%"
        >
          {error && <Box color="red.500">Lỗi: {error}</Box>}
          <HStack spacing="24px">
            <FormControl>
              <FormLabel>Tên sản phẩm</FormLabel>
              <Field name="name">
                {({ field, form }) => (
                  <Tooltip label={"Enter your product name"} fontSize="sm">
                    <Input
                      {...field}
                      onChange={(e) => {
                        setFieldValue("name", e.target.value);
                        setSlug(createSlug(e.target.value));
                      }}
                    />
                  </Tooltip>
                )}
              </Field>
            </FormControl>
            <Box w="150px" h="100px">
              <Tooltip label={"Select a cover image"} fontSize="sm">
                <Box
                  w="150px"
                  h="100px"
                  onClick={() =>
                    document.getElementById("coverImageInput").click()
                  }
                  cursor="pointer"
                >
                  {coverImage ? (
                    <Image
                      src={
                        typeof coverImage === "object"
                          ? URL?.createObjectURL(coverImage)
                          : coverImage
                      }
                      alt="Cover Image"
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
                      Ảnh đại diện
                    </Box>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    id="coverImageInput"
                    display="none"
                    onChange={handleCoverImageChange}
                  />
                </Box>
              </Tooltip>
            </Box>
          </HStack>
          <HStack spacing={5}>
            <Checkbox
              isChecked={productIsNew}
              onChange={(e) => setProductIsNew(e.target.checked)}
            >
              Hàng mới
            </Checkbox>
            <Checkbox
              isChecked={productIsSale}
              onChange={(e) => setProductIsSale(e.target.checked)}
            >
              Giảm giá
            </Checkbox>
          </HStack>
          {/* Brand, Category, Price, Stock */}
          <FormControl>
            <FormLabel>Thương hiệu</FormLabel>
            <Field name="brand">
              {({ field }) => (
                <Input {...field} placeholder="Enter brand name" />
              )}
            </Field>
          </FormControl>
          <FormControl>
            <FormLabel>Danh mục</FormLabel>
            <Field name="category">
              {({ field }) => <Input {...field} placeholder="Enter category" />}
            </Field>
          </FormControl>
          <FormControl>
            <FormLabel>Giá</FormLabel>
            <Field name="price">
              {({ field }) => <Input {...field} placeholder="Enter price" />}
            </Field>
          </FormControl>
          {productIsSale && (
            <FormControl>
              <FormLabel>Giá sau khi giảm</FormLabel>
              <Field name="salePrice">
                {({ field }) => (
                  <Input {...field} placeholder="Enter sale price" />
                )}
              </Field>
            </FormControl>
          )}
          <FormControl>
            <FormLabel>Số lượng tồn kho</FormLabel>
            <Field name="stock">
              {({ field }) => (
                <Input {...field} placeholder="Enter stock quantity" />
              )}
            </Field>
          </FormControl>
          {/* Colors */}
          <FormControl>
            <FormLabel>Màu sắc</FormLabel>
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
                Thêm
              </Button>
            </HStack>
            <HStack mt={2}>
              {colors.map((color, index) => (
                <Tag
                  key={index}
                  size="sm"
                  variant="solid"
                  bgColor={color.color}
                >
                  <TagLabel>{color.ten}</TagLabel>
                  <TagCloseButton onClick={() => removeColor(index)} />
                </Tag>
              ))}
            </HStack>
          </FormControl>
          {/* Sizes */}
          <FormControl>
            <FormLabel>Kích thước / dung lượng</FormLabel>
            <HStack>
              <Input
                size="sm"
                placeholder="Enter size"
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
              />
              <Button size="sm" onClick={addSize}>
                Thêm
              </Button>
            </HStack>
            <HStack mt={2}>
              {sizes.map((size) => (
                <Tag key={size} size="sm">
                  <TagLabel>{size}</TagLabel>
                  <TagCloseButton onClick={() => removeSize(size)} />
                </Tag>
              ))}
            </HStack>
          </FormControl>
          {/* Description */}
          <FormControl>
            <FormLabel>Mô tả</FormLabel>
            <Field name="description">
              {({ field }) => <Textarea {...field} />}
            </Field>
          </FormControl>
          {/* Additional Images */}
          <FormControl>
            <FormLabel>Hình ảnh sản phẩm</FormLabel>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              id="fileInput"
            />
            <Button
              onClick={() => document.getElementById("fileInput").click()}
            >
              Thêm ảnh
            </Button>
            <Box mt={2} display="flex" flexWrap="wrap">
              {previewImages.map((preview, index) => (
                <Image
                  key={index}
                  src={preview}
                  alt={`Preview ${index}`}
                  boxSize="100px"
                  objectFit="cover"
                  mr={2}
                />
              ))}
            </Box>
          </FormControl>
          <Button type="submit" colorScheme="blue">
            Thêm sản phẩm
          </Button>
        </VStack>
      )}
    </Formik>
  );
};

export default AddNewProduct;
