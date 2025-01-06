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
const unblockBlockedDates = async (bookingId) => {
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_API_BASE_URL}/booking/blocked/${bookingId}`
    );

    return response.data;
  } catch (error) {
    console.error("Error unblocking dates:", error);
    throw new Error("Failed to unblock dates.");
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

const getBlockedDates = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/booking/block`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching blocked dates:", error);
    throw error;
  }
};
const getBookingDetails = async (bookingId) => {
  const response = await axios.get(
    `${process.env.REACT_APP_API_BASE_URL}/booking/${bookingId}`
  );
  return response.data;
};

const cancelBooking = async (bookingId) => {
  const response = await axios.delete(
    `${process.env.REACT_APP_API_BASE_URL}/booking/cancel/${bookingId}`
  );
  return response.data;
};

const rescheduleBooking = async (data) => {
  // Ensure that the bookingId is included in the data or passed explicitly
  const { bookingId } = data;

  // Validate bookingId
  if (!bookingId) {
    throw new Error("Booking ID is required to reschedule the booking.");
  }

  // Make the API request with the proper URL and data
  try {
    const response = await axios.patch(
      `${process.env.REACT_APP_API_BASE_URL}/booking/reschedule/${bookingId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error rescheduling booking:", error);
    throw new Error("Failed to reschedule the booking.");
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
  confirmPayment,
  getBlockedDates,
  rescheduleBooking,
  cancelBooking,
  getBookingDetails,
  unblockBlockedDates,
};
