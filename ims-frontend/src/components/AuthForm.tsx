import { TextField, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface AuthFormProps {
  title: string;
  onSubmit: (data: {
    username: string;
    email: string;
    password: string;
  }) => void;
  isSignup?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ title, onSubmit, isSignup }) => {
  const validationSchema = yup.object().shape({
    username: isSignup
      ? yup.string().required("Username is required")
      : yup.string().notRequired(),
    email: yup.string().email("Invalid email").required("Email is required"),
    confirmEmail: isSignup
      ? yup
          .string()
          .oneOf([yup.ref("email")], "Emails must match")
          .required("Confirm Email is required")
      : yup.string().notRequired(),
    password: yup
      .string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
    confirmPassword: isSignup
      ? yup
          .string()
          .oneOf([yup.ref("password")], "Passwords must match")
          .required("Confirm Password is required")
      : yup.string().notRequired(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const handleFormSubmit = (data: any) => {
    const { confirmEmail, confirmPassword, ...userData } = data; // ✅ Remove confirm fields before sending API request
    onSubmit(userData);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col space-y-4"
    >
      {isSignup && (
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          {...register("username")}
          error={!!errors.username}
          helperText={errors.username?.message}
        />
      )}
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      {isSignup && (
        <TextField
          label="Confirm Email"
          variant="outlined"
          fullWidth
          {...register("confirmEmail")}
          error={!!errors.confirmEmail}
          helperText={errors.confirmEmail?.message}
        />
      )}
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      {isSignup && (
        <TextField
          label="Confirm Password"
          type="password"
          variant="outlined"
          fullWidth
          {...register("confirmPassword")}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />
      )}
      <Button type="submit" variant="contained" color="primary" fullWidth>
        {title}
      </Button>
    </form>
  );
};

export default AuthForm;
