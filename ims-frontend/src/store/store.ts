import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/products/productSlice"; // ✅ Ensure this file exists
import inventoryReducer from "../features/inventory/inventorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    inventory: inventoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
