import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import {
  createBooking,
  getBookedSlots,
  createPaymentIntent,
  getBlockedDates,
  getBookingDetails,
  rescheduleBooking,
} from "../../utils/axios";
import { useParams, useNavigate } from "react-router-dom";
import stripePromise from "../../utils/StripePromise";
import { Elements } from "@stripe/react-stripe-js";
import "react-calendar/dist/Calendar.css";
import "./BookingPage.scss";
import PaymentModal from "../../components/PaymentModal/PaymentModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingPage = () => {
  const [date, setDate] = useState(new Date());
  const [chosenDateMessage, setChosenDateMessage] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [formattedDateTime, setFormattedDateTime] = useState("");
  const [isPaymentPending, setIsPaymentPending] = useState(false);
  const [contactDetails, setContactDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [clientSecret, setClientSecret] = useState("");
  const [bookingId, setBookingId] = useState(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [price, setPrice] = useState(5); // Default price
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);

  const navigate = useNavigate();
  const { bookingId: paramBookingId } = useParams();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTime("");
    setFormattedDateTime("");
    setIsPaymentPending(false);
  };

  // Check if we are in reschedule mode
  useEffect(() => {
    if (paramBookingId) {
      setBookingId(paramBookingId);
      setIsRescheduling(true);
      fetchBookingDetails(paramBookingId);
    }
  }, [paramBookingId]);

  const fetchBookingDetails = async (id) => {
    try {
      const response = await getBookingDetails(id);
      setDate(new Date(response.date));
      setSelectedTime(response.time);
      setChosenDateMessage(`Rescheduling booking: ${response.time}`);
    } catch (error) {
      setErrorMessage("Failed to fetch booking details.");
    }
  };

  useEffect(() => {
    const savedDetails = JSON.parse(localStorage.getItem("contactDetails"));
    if (savedDetails) setContactDetails(savedDetails);
  }, []);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const response = await getBookedSlots(date.toISOString().split("T")[0]);
        setAvailableSlots(response || []);
      } catch (error) {
        console.error("Error fetching available slots:", error);
      }
    };

    fetchAvailableSlots();
  }, [date]);

  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        const response = await getBlockedDates();
        const normalizedDates = response.map(
          (date) => new Date(date).toISOString().split("T")[0]
        );
        setBlockedDates(normalizedDates);
      } catch (error) {
        console.error("Error fetching blocked dates:", error);
      }
    };

    fetchBlockedDates();
  }, []);

  const handleDiscountCodeChange = (e) => {
    setDiscountCode(e.target.value);
  };

  const validateDiscountCode = () => {
    // Example: 'DISCOUNT100' is the valid discount code
    if (discountCode === "DISCOUNT100") {
      setPrice(1); // Apply 100% discount
      setIsDiscountApplied(true);
      setErrorMessage(""); // Clear error if the code is valid
      toast.success("Discount code applied successfully!");
    } else {
      setIsDiscountApplied(false);
      setPrice(5); // Reset price to the original value
      setErrorMessage("Invalid discount code");
      toast.error("Invalid discount code.");
    }
  };

  const isDateBlocked = (currentDate) => {
    const formattedDate = currentDate.toISOString().split("T")[0];
    const dayOfWeek = currentDate.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if the current date is blocked, weekend, or in the past
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return true; // Disable weekends (Saturday and Sunday)
    }

    if (currentDate < today || currentDate.getTime() === today.getTime()) {
      return true; // Disable past dates and today
    }

    if (blockedDates.includes(formattedDate)) {
      return true; // Disable blocked dates
    }

    return false;
  };

  const isCurrentDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    return selectedDate.getTime() === today.getTime();
  };

  const generateTimes = () => {
    const times = [];
    for (let hour = 9; hour <= 16; hour++) {
      times.push(`${String(hour).padStart(2, "0")}:00:00`);
      times.push(`${String(hour).padStart(2, "0")}:30:00`);
    }
    return times;
  };

  const filterAvailableTimes = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() === today.getTime()) {
      return [];
    }

    const allTimes = generateTimes();
    return allTimes.filter((time) => availableSlots.includes(time));
  };

  const formatDateTime = (date, time) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString(undefined, options);
    return `${formattedDate} at ${time.slice(0, 5)} ${
      parseInt(time.slice(0, 2)) >= 12 ? "PM" : "AM"
    }`;
  };

  const updateChosenMessage = (date, time) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString(undefined, options);

    if (!time) {
      setChosenDateMessage(`You have chosen: ${formattedDate}`);
    } else {
      setChosenDateMessage(
        `You have selected: ${formattedDate} at ${time.slice(0, 5)} ${
          parseInt(time.slice(0, 2)) >= 12 ? "PM" : "AM"
        }`
      );
    }
  };

  const handleBooking = async () => {
    if (!selectedTime) {
      setErrorMessage("Please select a time.");
      return;
    }

    if (
      !contactDetails ||
      !contactDetails.street ||
      !contactDetails.postcode ||
      !contactDetails.city ||
      !contactDetails.country
    ) {
      setErrorMessage("Please complete your contact details.");
      return;
    }

    const bookingDetails = {
      ...contactDetails,
      address: `${contactDetails.street}, ${contactDetails.postcode}, ${contactDetails.city}, ${contactDetails.country}`,
      date: date.toISOString().split("T")[0],
      time: selectedTime,
      bookingId,
    };

    try {
      if (isRescheduling) {
        const response = await rescheduleBooking(bookingDetails);
        setSuccessMessage(response.message);
        setErrorMessage("");
        setIsBookingComplete(true);
        setIsPaymentPending(false);
        toast.success("Booking Rescheduled successfully");
        setTimeout(() => {
          navigate(`/profile/${bookingId}`);
        }, 2000);

        return; // Skip payment modal for reschedule
      } else {
        const response = await createBooking(bookingDetails);
        if (response && response.message) {
          setSuccessMessage(response.message);
          setErrorMessage("");
          setBookingId(response.bookingId);

          const paymentResponse = await createPaymentIntent({
            bookingId: response.bookingId,
            amount: price,
            currency: "gbp",
          });

          setClientSecret(paymentResponse.clientSecret);
          setIsPaymentPending(true);
          openModal(); // Open the payment modal for new booking
          setIsBookingComplete(true);
        }
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setErrorMessage("Failed to create or reschedule booking.");
    }
  };

  const handleModalClose = () => {
    closeModal();
    resetBookingState(); // Reset the booking to a fresh state when the modal is closed
  };

  const resetBookingState = () => {
    // Reset booking-related state to allow for a fresh booking
    setSelectedTime("");
    setFormattedDateTime("");
    setIsPaymentPending(false);
    setIsBookingComplete(false);
    setBookingId(null); // Reset the bookingId to allow a fresh booking
  };

  return (
    <div className="booking">
      <h1 className="booking__title">Book an Appointment</h1>
      {errorMessage && <p className="booking__error">{errorMessage}</p>}
      {successMessage && <p className="booking__success">{successMessage}</p>}

      <div className="booking__calendar">
        <Calendar
          onChange={(newDate) => {
            setDate(newDate);
            setSelectedTime("");
            setFormattedDateTime("");
            updateChosenMessage(newDate, "");
          }}
          value={date}
          tileDisabled={({ date: currentDate }) => isDateBlocked(currentDate)}
        />
      </div>

      {chosenDateMessage && (
        <p className="booking__confirmation">{chosenDateMessage}</p>
      )}

      <div className="booking__times">
        <ul className="booking__list">
          {filterAvailableTimes().map((time) => (
            <li className="booking__item" key={time}>
              <button
                onClick={() => {
                  setSelectedTime(time);
                  const formatted = formatDateTime(date, time);
                  setFormattedDateTime(formatted);
                  updateChosenMessage(date, time);
                }}
                className={`booking__button ${
                  selectedTime === time ? "selected" : ""
                }`}
              >
                {time.slice(0, 5)}{" "}
                {parseInt(time.slice(0, 2)) >= 12 ? "PM" : "AM"}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="booking__discount">
        <input
          type="text"
          value={discountCode}
          onChange={handleDiscountCodeChange}
          className="booking__input"
          placeholder="Enter Discount Code"
        />
        <button
          type="button"
          className="booking__apply"
          onClick={validateDiscountCode}
        >
          Apply Discount
        </button>
      </div>

      {/* Displaying the price */}
      <p className="booking__price">
        Total Amount: <strong>£{price}</strong>
      </p>

      {!isCurrentDate() && !isBookingComplete ? (
        <button className="booking__confirm" onClick={handleBooking}>
          Confirm Booking
        </button>
      ) : null}

      {isBookingComplete && (
        <>
          <Elements stripe={stripePromise}>
            <PaymentModal
              isOpen={isModalOpen}
              handleCloseModal={handleModalClose}
              clientSecret={clientSecret}
              bookingId={bookingId}
              contactDetails={contactDetails}
            />
          </Elements>
        </>
      )}
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

export default BookingPage;
