import axios from "axios";
import API_BASE_URL from "../config/apiConfig"; // ✅ Use the centralized base URL

export const loginUserApi = async (data: {
  email: string;
  password: string;
}) => {
  return axios.post(`${API_BASE_URL}/auth/login`, data);
};

export const signupUserApi = async (data: {
  email: string;
  password: string;
}) => {
  return axios.post(`${API_BASE_URL}/auth/register`, data);
};

export const googleLoginApi = async () => {
  window.location.href = `${API_BASE_URL}/auth/google-login`; // Redirects to backend
};
