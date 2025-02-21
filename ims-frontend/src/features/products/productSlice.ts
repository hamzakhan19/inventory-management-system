import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_BASE_URL from "../../config/apiConfig"; // ✅ Ensure API_BASE_URL is imported

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  price: number;
  createdAt: string;
  createdBy: number;
  user: any;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

// ✅ Fetch Products API Call
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch products");
    }
  }
);

// ✅ Fix Delete Product API Call
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: number, thunkAPI) => {
    try {
      console.log("Deleting product ID:", id); // ✅ Debugging
      await axios.delete(`${API_BASE_URL}/products/${id}`);
      return id; // ✅ Return deleted product ID to remove from Redux store
    } catch (error) {
      console.error("Delete failed:", error); // ✅ Debugging
      return thunkAPI.rejectWithValue("Failed to delete product");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
      });
  },
});

export default productSlice.reducer;
