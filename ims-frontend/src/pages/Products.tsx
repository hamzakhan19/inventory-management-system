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
  }>({ open: false, id: null });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = async () => {
    if (deleteDialog.id) {
      console.log("Attempting to delete product ID:", deleteDialog.id); // ✅ Debugging
      await dispatch(deleteProduct(deleteDialog.id)).unwrap();
      setDeleteDialog({ open: false, id: null });
      dispatch(fetchProducts()); // ✅ Refresh list after deleting
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Product List</h2>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => {
            setSelectedProduct(null);
            setOpen(true);
          }}
        >
          New Product
        </Button>
      </div>

      {loading && <CircularProgress />}
      {error && <p className="text-red-500">{error}</p>}

      <TableContainer component={Paper} className="shadow-lg rounded-lg">
        <Table>
          <TableHead>
            <TableRow className="bg-gray-200">
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={product.id || index} className="hover:bg-gray-100">
                <TableCell>{index + 1}</TableCell>
                <TableCell>{product.Name}</TableCell>
                <TableCell>{product.SKU}</TableCell>
                <TableCell>{product.Category}</TableCell>
                <TableCell>{product.Quantity}</TableCell>
                <TableCell>
                  ${product.Price ? product.Price.toFixed(2) : "0.00"}
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
            ))}
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
        <DialogTitle>Are you sure you want to delete this product?</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, id: null })}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Products;
