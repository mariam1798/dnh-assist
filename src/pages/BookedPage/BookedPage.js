import React, { useEffect, useState } from "react";
import { getBookings } from "../../utils/axios";

const BookedPage = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookings();
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to fetch bookings. Please try again later.");
      }
    };

    fetchBookings();
  }, []);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="profile">
      <h1 className="profile__booking">My Bookings</h1>
      {error && <p className="profile__error">{error}</p>}
      <div className="profile__container">
        {bookings.map((booking, index) => (
          <div className="profile__card" key={booking.id}>
            <ul className="profile__list">
              <li className="profile__item profile__item--color">
                Booking Number:
                <strong className="profile__strong profile__strong--color">
                  {index + 1}
                </strong>
              </li>
              <li className="profile__item">
                Date:
                <strong className="profile__strong">
                  {new Date(booking.date).toLocaleDateString()}
                </strong>
              </li>
              <li className="profile__item">
                Time:
                <strong className="profile__strong">
                  {capitalizeFirstLetter(booking.time)}
                </strong>
              </li>
              <li className="profile__item">
                Payment status:
                <strong className="profile__strong">
                  {booking.payment_status}
                </strong>
              </li>
              <li className="profile__item">
                Dentist Name:
                <strong className="profile__strong">
                  {capitalizeFirstLetter(booking.dentist_name)}
                </strong>
              </li>
              <li className="profile__item">
                Patient Name:
                <strong className="profile__strong">
                  {capitalizeFirstLetter(booking.patient_name)}
                </strong>
              </li>
              <li className="profile__item">
                Email:
                <strong className="profile__strong">
                  {capitalizeFirstLetter(booking.email)}
                </strong>
              </li>
              <li className="profile__item">
                Phone Number:
                <strong className="profile__strong">{booking.phone}</strong>
              </li>
              <li className="profile__item">
                Address:
                <strong className="profile__strong profile__strong--address">
                  {capitalizeFirstLetter(booking.address)}
                </strong>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookedPage;
