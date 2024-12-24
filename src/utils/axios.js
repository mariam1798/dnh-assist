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
const confirmPayment = async (data) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/payment/confirmPayment`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error confirming payment:", error);
    throw error.response?.data?.error || "Failed to confirm payment."; //
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

const googleMapsAxios = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api/place/autocomplete/json",
  params: {
    key: "AIzaSyDlKlilZtuqgY1LO_UuTmP2ekiNbt_m-tc", // Replace with your Google Maps API Key
    types: "geocode", // Restrict results to address types
    components: "country:gb", // Example: Restrict to UK. Adjust as needed.
  },
});

const getAddressSuggestions = async (input) => {
  try {
    const response = await googleMapsAxios.get("", { params: { input } });
    return response.data.predictions || [];
  } catch (error) {
    console.error("Error fetching address suggestions:", error);
    throw error;
  }
};
export {
  getBookedSlots,
  getProfile,
  handleRegister,
  postLogin,
  getUser,
  getUsers,
  createPaymentIntent,
  confirmPayment,
  getAddressSuggestions,
};
