import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { Button } from "@mui/material";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-blue-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* ✅ Brand Logo / Title */}
        <Link to="/dashboard" className="text-2xl font-bold tracking-wide">
          Inventory Management
        </Link>

        {/* ✅ Navigation Links (Only if logged in) */}
        {token && (
          <div className="flex space-x-6 items-center">
            <Link
              to="/dashboard"
              className="hover:text-gray-300 transition duration-300"
            >
              Dashboard
            </Link>
            <Link
              to="/products"
              className="hover:text-gray-300 transition duration-300"
            >
              Products
            </Link>

            {/* ✅ Logout Button */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: "white",
                color: "#1976D2",
                "&:hover": { backgroundColor: "#E3F2FD" },
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
