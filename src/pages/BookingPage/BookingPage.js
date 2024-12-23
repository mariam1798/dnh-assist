import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import {
  createBooking,
  getBookedSlots,
  createPaymentIntent,
} from "../../utils/axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "react-calendar/dist/Calendar.css";
import "./BookingPage.scss";
import PaymentModal from "../../components/PaymentModal/PaymentModal";

const stripePromise = loadStripe(
  "pk_test_51PLKOFS8qWjUhD08L7a5HC49cEmivRfTAEdOSDrckA03Mb7HgjuzpvvgEbZRREoobCaZU8w7aY2BWvxGPrPgFqnC00GgJfzme2"
);

const BookingPage = () => {
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [formattedDateTime, setFormattedDateTime] = useState("");
  const [contactDetails, setContactDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [clientSecret, setClientSecret] = useState("");
  const [bookingId, setBookingId] = useState(""); // NEW: State to store bookingId
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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

  const generateTimes = () => {
    const times = [];
    for (let hour = 9; hour <= 16; hour++) {
      times.push(`${String(hour).padStart(2, "0")}:00:00`);
      times.push(`${String(hour).padStart(2, "0")}:30:00`);
    }
    return times;
  };

  const filterAvailableTimes = () => {
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

  const handleBooking = async () => {
    if (!selectedTime) {
      setErrorMessage("Please select a time.");
      return;
    }

    const bookingDetails = {
      ...contactDetails,
      date: date.toISOString().split("T")[0],
      time: selectedTime,
    };

    try {
      const response = await createBooking(bookingDetails);
      if (response && response.message) {
        setSuccessMessage(response.message);
        setErrorMessage("");
        setBookingId(response.bookingId); // Store bookingId in state

        // Create Stripe Payment Intent
        const paymentResponse = await createPaymentIntent({
          bookingId: response.bookingId,
          amount: 5000, // Amount in pence
          currency: "gbp",
        });

        setClientSecret(paymentResponse.clientSecret);
        openModal();
        setIsBookingComplete(true);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setErrorMessage("Failed to create booking.");
    }
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
          }}
          value={date}
        />
      </div>

      <div className="booking__times">
        <ul className="booking__list">
          {filterAvailableTimes().map((time) => (
            <li className="booking__item" key={time}>
              <button
                onClick={() => {
                  setSelectedTime(time);
                  setFormattedDateTime(formatDateTime(date, time));
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

      {formattedDateTime && (
        <p className="booking__confirmation">
          You have selected: <strong>{formattedDateTime}</strong>
        </p>
      )}

      {!isBookingComplete ? (
        <button className="booking__confirm" onClick={handleBooking}>
          Confirm Booking
        </button>
      ) : (
        <Elements stripe={stripePromise}>
          <PaymentModal
            isOpen={isModalOpen}
            handleCloseModal={closeModal}
            clientSecret={clientSecret}
            bookingId={bookingId} // Pass bookingId to the modal
            contactDetails={contactDetails}
          />
        </Elements>
      )}
    </div>
  );
};

export default BookingPage;
