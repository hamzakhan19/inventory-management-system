import AuthForm from "../components/AuthForm";
import AuthHeading from "../components/AuthHeading";
import { useDispatch } from "react-redux";
import { signupUser } from "../features/auth/authSlice";
import { AppDispatch } from "../store/store";
import { Button, Card } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { Link } from "react-router-dom";
import { googleLoginApi } from "../api/auth";

const Signup = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSignup = (data: {
    username: string;
    email: string;
    password: string;
  }) => {
    dispatch(signupUser(data)); // ✅ Send only username, email, and password
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <Card className="w-full max-w-md p-8 shadow-xl rounded-lg bg-white">
        {/* ✅ Reusable Heading */}
        <AuthHeading title="Create an Account" />

        {/* ✅ Signup Form */}
        <AuthForm title="Sign Up" onSubmit={handleSignup} isSignup={true} />

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
            Sign up with Google
          </Button>
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold">
              Login here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
