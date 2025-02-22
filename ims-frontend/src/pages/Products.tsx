import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import {
  fetchProducts,
  deleteProduct,
} from "../features/products/productSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import AddProductModal from "../components/AddProductModal";

const Products = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: number | null;
  }>({
    open: false,
    id: null,
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = async (id?: number) => {
    if (!id) {
      console.error("❌ Product ID is undefined! Fix delete button.");
      return;
    }

    console.log("🟥 Deleting product ID:", id);

    try {
      await dispatch(deleteProduct(id)).unwrap();
      console.log("✅ Product deleted successfully!");
      dispatch(fetchProducts());
    } catch (error) {
      console.error("❌ Failed to delete product:", error);
    }
  };

  return (
    <div className="p-6">
      {/* ✅ Page Header */}
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold text-gray-800">
          📦 Product List
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedProduct(null);
            setOpen(true);
          }}
          sx={{
            backgroundColor: "#4CAF50",
            "&:hover": { backgroundColor: "#388E3C" },
          }}
        >
          New Product
        </Button>
      </div>

      {/* ✅ Loading & Error Handling */}
      {loading && <CircularProgress />}
      {error && <Typography className="text-red-500">{error}</Typography>}

      {/* ✅ Styled Table */}
      <TableContainer component={Paper} className="shadow-lg rounded-lg">
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976D2" }}>
              {" "}
              {/* Blue Background */}
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                #
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Name
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                SKU
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Category
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Quantity
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Price
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  <Typography variant="subtitle1" color="textSecondary">
                    No products available.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => (
                <TableRow
                  key={product.id || index}
                  className="hover:bg-gray-100"
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{product.Name}</TableCell>
                  <TableCell>{product.SKU}</TableCell>
                  <TableCell>{product.Category}</TableCell>
                  <TableCell>{product.Quantity}</TableCell>
                  <TableCell>
                    $
                    {product.Price
                      ? parseFloat(product.Price).toFixed(2)
                      : "0.00"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setSelectedProduct(product);
                        setOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() =>
                        setDeleteDialog({ open: true, id: product.id })
                      }
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✅ Add & Edit Product Modal */}
      <AddProductModal
        open={open}
        onClose={() => setOpen(false)}
        onProductSaved={() => dispatch(fetchProducts())}
        product={selectedProduct}
      />

      {/* ✅ Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
      >
        <DialogTitle className="text-center">
          🛑 Are you sure you want to delete this product?
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, id: null })}
            sx={{
              backgroundColor: "#1976D2",
              color: "white",
              "&:hover": { backgroundColor: "#115293" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDelete(deleteDialog.id);
              setDeleteDialog({ open: false, id: null });
            }}
            sx={{
              backgroundColor: "#D32F2F",
              color: "white",
              "&:hover": { backgroundColor: "#B71C1C" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Products;
