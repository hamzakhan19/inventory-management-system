import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Modal,
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
} from "@mui/material";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig"; // ✅ Centralized API URL

const categories = ["Accessories", "Displays", "Storage", "Audio"]; // ✅ Static category list

interface Product {
  Id?: number;
  Name: string;
  SKU: string;
  Category: string;
  Quantity: number;
  Price: number;
}

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onProductSaved: () => void; // ✅ Callback function to refresh product list
  product?: Product | null; // ✅ Pass product when editing
}

const validationSchema = yup.object().shape({
  Name: yup.string().required("Product name is required"),
  SKU: yup.string().required("SKU is required"),
  Category: yup
    .string()
    .oneOf(categories, "Invalid category")
    .required("Category is required"),
  Quantity: yup
    .number()
    .min(1, "Quantity must be at least 1")
    .required("Quantity is required"),
  Price: yup
    .string()
    .matches(/^\d+(\.\d{1,2})?$/, "Price must be a valid decimal (e.g., 99.99)")
    .required("Price is required"),
});

const AddProductModal: React.FC<AddProductModalProps> = ({
  open,
  onClose,
  onProductSaved,
  product,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // ✅ Prefill the form when editing
  useEffect(() => {
    if (product) {
      setValue("Name", product.Name);
      setValue("SKU", product.SKU);
      setValue("Category", product.Category);
      setSelectedCategory(product.Category); // ✅ Ensure category is updated
      setValue("Quantity", product.Quantity);
      setValue("Price", product.Price.toFixed(2));
    } else {
      reset();
      setSelectedCategory(""); // ✅ Reset category on Add mode
    }
  }, [product, setValue, reset]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (product?.Id) {
        // ✅ Update Product
        await axios.put(`${API_BASE_URL}/products/${product.Id}`, {
          ...data,
          Price: parseFloat(data.Price),
        });
      } else {
        // ✅ Add New Product
        await axios.post(`${API_BASE_URL}/products`, {
          ...data,
          CreatedBy: 2, // ✅ Auto-set CreatedBy = 2
          CreatedAt: new Date().toISOString(), // ✅ Auto-set timestamp
        });
      }

      reset();
      onClose();
      onProductSaved(); // ✅ Refresh product list after adding or updating
    } catch (error) {
      console.error("Failed to save product", error);
    }
    setLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
        <Typography variant="h6" className="mb-4 text-center font-semibold">
          {product ? "Edit Product" : "Add New Product"}
        </Typography>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-3"
        >
          <TextField
            label="Product Name"
            fullWidth
            {...register("Name")}
            error={!!errors.Name}
            helperText={errors.Name?.message}
          />
          <TextField
            label="SKU"
            fullWidth
            {...register("SKU")}
            error={!!errors.SKU}
            helperText={errors.SKU?.message}
          />

          {/* ✅ Fixed Category Prefill */}
          <TextField
            select
            label="Category"
            fullWidth
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setValue("Category", e.target.value);
            }}
            error={!!errors.Category}
            helperText={errors.Category?.message}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="number"
            label="Quantity"
            fullWidth
            {...register("Quantity")}
            error={!!errors.Quantity}
            helperText={errors.Quantity?.message}
          />
          <TextField
            label="Price"
            fullWidth
            {...register("Price")}
            error={!!errors.Price}
            helperText={errors.Price?.message}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? "Saving..." : product ? "Update Product" : "Add Product"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddProductModal;
