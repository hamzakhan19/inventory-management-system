import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { RootState, AppDispatch } from "../store/store";
import { Button, Card } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { Link, useNavigate } from "react-router-dom";
import { googleLoginApi } from "../api/auth";
import AuthForm from "../components/AuthForm";
import AuthHeading from "../components/AuthHeading";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth); // ✅ Get token from Redux

  const handleLogin = async (data: { email: string; password: string }) => {
    const result = await dispatch(loginUser(data)).unwrap();
    if (result) {
      console.log("✅ Login Successful:", result);
      navigate("/dashboard"); // ✅ Redirect after login success
    }
  };

  // ✅ If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      {/* ✅ Single Clean Card */}
      <Card className="w-full max-w-md p-8 shadow-xl rounded-lg bg-white">
        {/* ✅ Reusable Heading */}
        <AuthHeading title="Inventory Management System" />

        {/* ✅ Login Form */}
        <AuthForm title="Login" onSubmit={handleLogin} />

        {/* ✅ Google Sign-In & Links */}
        <div className="flex flex-col items-center mt-4 space-y-3">
          <Button
            onClick={googleLoginApi}
            variant="contained"
            sx={{
              backgroundColor: "#4285F4",
              color: "#ffffff",
              "&:hover": { backgroundColor: "#357ae8" },
            }}
            startIcon={<GoogleIcon />}
            className="w-full"
          >
            Sign in with Google
          </Button>
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-semibold">
              Sign up here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
