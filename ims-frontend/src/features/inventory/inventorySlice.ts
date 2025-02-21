import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Inventory {
  id: number;
  productId: number;
  quantity: number;
}

interface InventoryState {
  inventory: Inventory[];
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  inventory: [],
  loading: false,
  error: null,
};

// Fetch Inventory API Call
export const fetchInventory = createAsyncThunk(
  "inventory/fetchInventory",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("http://localhost:7191/api/inventory");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch inventory");
    }
  }
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.inventory = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default inventorySlice.reducer;
