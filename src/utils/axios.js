import axios from "axios";
const getProfile = (token) => {
  return axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
const createPaymentIntent = async (paymentDetails) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/payment/createPayment`,
      paymentDetails
    );
    return response.data;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw (
      error.response?.data || error.message || "Failed to create payment intent"
    );
  }
};
const handleRegister = (uploadData) => {
  return axios.post(
    `${process.env.REACT_APP_API_BASE_URL}/users/register`,
    uploadData
  );
};
const postLogin = (formData) => {
  return axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
    email: formData.email,
    password: formData.password,
  });
};

export const createBooking = async (bookingDetails) => {
  const response = await axios.post(
    `${process.env.REACT_APP_API_BASE_URL}/booking/booking`,
    bookingDetails
  );
  return response.data;
};
const getBookedSlots = async (date) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/booking/available`,
      {
        params: { date },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    throw error;
  }
};

const getUser = (userId) => {
  return axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/${userId}`);
};
const getUsers = () => {
  return axios.get(`${process.env.REACT_APP_API_BASE_URL}/users`);
};

export {
  getBookedSlots,
  getProfile,
  handleRegister,
  postLogin,
  getUser,
  getUsers,
  createPaymentIntent,
};
