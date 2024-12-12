import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { createBooking } from "../../utils/axios";
import "react-calendar/dist/Calendar.css";
import "./BookingPage.scss";

const BookingPage = () => {
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [contactDetails, setContactDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const savedDetails = JSON.parse(localStorage.getItem("contactDetails"));
    if (savedDetails) {
      setContactDetails(savedDetails);
    }
  }, []);

  const convertTo24HourFormat = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");

    if (modifier === "PM" && hours !== "12") {
      hours = parseInt(hours, 10) + 12;
    } else if (modifier === "AM" && hours === "12") {
      hours = "00";
    }

    return `${String(hours).padStart(2, "0")}:${minutes}:00`;
  };

  const generateTimes = () => {
    const times = [];
    for (let hour = 9; hour <= 16; hour++) {
      times.push(
        `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"}`
      );
      times.push(
        `${hour > 12 ? hour - 12 : hour}:30 ${hour >= 12 ? "PM" : "AM"}`
      );
    }
    return times;
  };

  const isWeekend = (date) => {
    const day = date.getDay(); // 0 for Sunday, 6 for Saturday
    return day === 0 || day === 6;
  };

  const handleBooking = async () => {
    if (!selectedTime) {
      setErrorMessage("Please select a time.");
      return;
    }

    if (isWeekend(date)) {
      setErrorMessage("Bookings are not allowed on weekends.");
      return;
    }

    const bookingDetails = {
      ...contactDetails,
      date: date.toISOString().split("T")[0],
      time: convertTo24HourFormat(selectedTime),
    };

    try {
      const response = await createBooking(bookingDetails);
      console.log("Response from createBooking:", response);

      if (response && response.message) {
        setSuccessMessage(response.message);
        setErrorMessage("");
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
      <h1>Book an Appointment</h1>

      {errorMessage && <p className="booking__error">{errorMessage}</p>}
      {successMessage && <p className="booking__success">{successMessage}</p>}

      <div className="booking__calendar">
        <h2>Select a Date</h2>
        <Calendar
          onChange={(newDate) => {
            if (isWeekend(newDate)) {
              setErrorMessage("Bookings are not allowed on weekends.");
              setSelectedTime("");
            } else {
              setErrorMessage("");
            }
            setDate(newDate);
          }}
          value={date}
        />
        <h3>Selected Date: {currentDate}</h3>
      </div>

      <div className="booking__times">
        <h2>Available Times</h2>
        <ul className="booking__time-list">
          {generateTimes().map((time) => (
            <li key={time}>
              <button
                onClick={() => setSelectedTime(time)}
                className={`booking__time ${
                  selectedTime === time ? "booking__time--selected" : ""
                }`}
                disabled={isWeekend(date)}
              >
                {time}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedTime && !isWeekend(date) && (
        <p className="booking__confirmation">
          You have selected: <strong>{selectedTime}</strong>
        </p>
      )}

      <button
        onClick={handleBooking}
        className="booking__confirm"
        disabled={!selectedTime || isWeekend(date)}
      >
        Confirm Booking
      </button>
    </div>
  );
};

export default BookingPage;
