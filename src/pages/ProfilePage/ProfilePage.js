import React, { useEffect, useState } from "react";
import CancelModal from "../../components/CancelModal/CancelModal";
import {
  getBookingDetails,
  cancelBooking,
  unblockBlockedDates,
} from "../../utils/axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./ProfilePage.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const { bookingId } = useParams(); // Get bookingId from the URL parameters
  const [bookingDetails, setBookingDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal open state
  const [loading, setLoading] = useState(true);
  const [isCancelled, setIsCancelled] = useState(false);

  const navigate = useNavigate();
  const handleOpenModal = () => setIsModalOpen(true);

  // Close modal
  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setErrorMessage("No booking ID found. Please make a booking first.");
        setLoading(false);
        return;
      }

      try {
        const response = await getBookingDetails(bookingId); // Fetch booking details using bookingId from the URL
        setBookingDetails(response);
      } catch (error) {
        setErrorMessage(""); // Clear the error message when fetching fails (if canceled)
        setIsCancelled(true); // Ensure cancellation message shows when error occurs
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelBooking(bookingId); // Pass bookingId directly
      toast.success("Booking canceled successfully.");

      // Delay the state change for 2 seconds
      setTimeout(() => {
        setIsCancelled(true); // Update state after 2 seconds
      }, 1500); // 2000ms = 2 seconds
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };
  const handleRescheduleBooking = async () => {
    try {
      // Unblock the previous dates before navigating
      await unblockBlockedDates(bookingDetails.id); // Send request to unblock the dates

      // Navigate to the reschedule page
      navigate(`/booking/${bookingDetails.id}`);
    } catch (error) {
      console.error("Error unblocking dates:", error);
      setErrorMessage("Failed to unblock previous booking dates.");
    }
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  if (!bookingDetails) {
    return <div>No booking details available.</div>;
  }

  return (
    <div className="profile">
      {isCancelled ? (
        <div className="profile__message">
          <div className="profile__container">
            <h1 className="profile__title">
              Your booking has been cancelled successfully!
            </h1>
            <div className="profile__hold">
              <p className="profile__booking">
                If you'd like to make a new{" "}
                <Link className="profile__link" to="/booking">
                  Booking
                </Link>
              </p>
              <p className="profile__booking">
                Or if you'd like to go back to the{" "}
                <Link className="profile__link" to="/">
                  Homepage
                </Link>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="profile__container">
          <h1 className="profile__title">My Booking</h1>
          <ul className="profile__list">
            <li className="profile__item">
              Date:
              <strong className="profile__strong">
                {new Date(bookingDetails.date).toLocaleDateString()}
              </strong>
            </li>
            <li className="profile__item">
              Time:
              <strong className="profile__strong">
                {capitalizeFirstLetter(bookingDetails.time)}
              </strong>
            </li>
            <li className="profile__item">
              Payment status:
              <strong className="profile__strong">Paid</strong>
            </li>
            <li className="profile__item">
              Dentist Name:
              <strong className="profile__strong">
                {capitalizeFirstLetter(bookingDetails.dentist_name)}
              </strong>
            </li>
            <li className="profile__item">
              Patient Name:
              <strong className="profile__strong">
                {capitalizeFirstLetter(bookingDetails.patient_name)}
              </strong>
            </li>
            <li className="profile__item">
              Email:
              <strong className="profile__strong">
                {capitalizeFirstLetter(bookingDetails.email)}
              </strong>
            </li>
            <li className="profile__item">
              Phone Number:
              <strong className="profile__strong">
                {" "}
                {bookingDetails.phone}
              </strong>
            </li>
            <li className="profile__item">
              Address:
              <strong className="profile__strong profile__strong--address">
                {capitalizeFirstLetter(bookingDetails.address)}
              </strong>
            </li>
          </ul>
          <div className="profile__buttons">
            <button
              className="profile__cancel"
              onClick={handleOpenModal} // Open the modal for confirmation
            >
              Cancel Booking
            </button>
            <button
              className="profile__reschedule"
              onClick={handleRescheduleBooking}
            >
              Reschedule Booking
            </button>
          </div>
        </div>
      )}
      {/* Modal for canceling booking */}
      <CancelModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        onConfirm={() => {
          handleCancelBooking(bookingDetails.id); // Confirm cancel
          handleCloseModal(); // Close the modal
        }}
      />
      <ToastContainer
        position="top-center"
        autoClose={5000} // Duration before toast disappears
        hideProgressBar={false} // Show the progress bar (optional)
        newestOnTop={false} // Whether to show the newest toast on top
        closeOnClick={true} // Whether the toast should close when clicked
        rtl={false} // For RTL languages (optional)
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ProfilePage;
