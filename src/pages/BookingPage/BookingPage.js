import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { createBooking, getBookedSlots } from "../../utils/axios";
import "react-calendar/dist/Calendar.css";
import "./BookingPage.scss";

const BookingPage = () => {
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [contactDetails, setContactDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    const savedDetails = JSON.parse(localStorage.getItem("contactDetails"));
    if (savedDetails) {
      setContactDetails(savedDetails);
    }
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

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const isInvalidDate = (selectedDate) => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 3);
    return selectedDate < minDate;
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

    console.log("Booking Details Sent to Backend:", bookingDetails);

    try {
      const response = await createBooking(bookingDetails);
      if (response && response.message) {
        setSuccessMessage(response.message);
        setErrorMessage("");
        setSelectedTime("");

        setAvailableSlots((prevSlots) =>
          prevSlots.filter((time) => time !== selectedTime)
        );
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error occurred:", error);

      const message =
        error.response?.data?.error ||
        error.message ||
        "Failed to create booking.";
      setErrorMessage(message);
      setSuccessMessage("");
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const currentDate = formatDate(date);

  return (
    <div className="booking">
      <h1 className="booking__title">Book an Appointment</h1>

      {errorMessage && <p className="booking__error">{errorMessage}</p>}
      {successMessage && <p className="booking__success">{successMessage}</p>}

      <div className="booking__calendar">
        <h2>Select a Date</h2>
        <Calendar
          onChange={(newDate) => {
            setDate(newDate);
            setSelectedTime("");
            setErrorMessage("");
          }}
          value={date}
          tileDisabled={({ date }) => isWeekend(date) || isInvalidDate(date)}
        />
        <h3>Selected Date: {currentDate}</h3>
      </div>

      <div className="booking__times">
        <h2>Available Times</h2>
        <ul className="booking__list">
          {filterAvailableTimes().map((time) => (
            <li className="booking__item" key={time}>
              <button
                onClick={() => setSelectedTime(time)}
                className={`booking__time ${
                  selectedTime === time ? "booking__time--selected" : ""
                }`}
              >
                {time.slice(0, 5)}{" "}
                {parseInt(time.slice(0, 2)) >= 12 ? "PM" : "AM"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedTime && (
        <p className="booking__confirmation">
          You have selected: <strong>{selectedTime}</strong>
        </p>
      )}

      <button
        onClick={handleBooking}
        className="booking__confirm"
        disabled={!selectedTime}
      >
        Confirm Booking
      </button>
    </div>
  );
};

export default BookingPage;
