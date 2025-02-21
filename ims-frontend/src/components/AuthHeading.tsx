import { Typography } from "@mui/material";

interface AuthHeadingProps {
  title: string;
}

const AuthHeading: React.FC<AuthHeadingProps> = ({ title }) => {
  return (
    <Typography
      variant="h5"
      className="font-bold text-gray-700 text-center mb-6"
    >
      {title}
    </Typography>
  );
};

export default AuthHeading;
