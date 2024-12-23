import React, { useState } from "react";
import Modal from "react-modal";
import { confirmPayment } from "../../utils/axios";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import close from "../../assets/images/icons/close.svg";
import "./PaymentModal.scss";
import { BeatLoader } from "react-spinners";

const PaymentModal = ({
  isOpen,
  handleCloseModal,
  clientSecret,
  bookingId,
  contactDetails,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [cardName, setCardName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage("Payment processor not initialized. Please try again.");
      return;
    }

    setLoading(true);

    try {
      // Get the CardNumberElement instance
      const cardNumberElement = elements.getElement(CardNumberElement);

      // Confirm Stripe payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardNumberElement,
            billing_details: { name: cardName },
          },
        }
      );

      if (error) {
        // Handle Stripe error
        console.error("Stripe error:", error);
        setErrorMessage(error.message || "Payment failed. Please try again.");
        setLoading(false);
        return;
      }

      // Check payment status
      if (paymentIntent.status === "succeeded") {
        try {
          // Confirm payment in the backend
          const response = await confirmPayment({
            bookingId, // Ensure bookingId is passed correctly
            paymentId: paymentIntent.id,
            customerEmail: contactDetails?.email || "mariam.alneamah@gmail.com", // Use dynamic customer email
          });

          console.log("Payment confirmation response:", response);
          setSuccessMessage("Payment successful! Booking confirmed.");
          setErrorMessage("");
        } catch (backendError) {
          console.error("Backend confirmation error:", backendError);
          setErrorMessage(
            "Payment succeeded, but booking confirmation failed. Please contact support."
          );
        }
      } else {
        setErrorMessage(
          "Payment not completed. Please check your details and try again."
        );
      }
    } catch (error) {
      console.error("Unexpected error during payment:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      ariaHideApp={false}
      contentLabel="Payment Modal"
      onRequestClose={handleCloseModal}
      className="modal"
      overlayClassName="Overlay"
    >
      {loading && (
        <div className="modal__loading">
          <BeatLoader color="#cac4d0" size={30} aria-label="Loading Spinner" />
        </div>
      )}

      <div className="modal__icon">
        <img
          onClick={handleCloseModal}
          src={close}
          alt="close icon"
          className="modal__close"
        />
      </div>

      <div className="modal__container">
        <h2 className="modal__title">Confirm Payment</h2>
        <form className="modal__form" onSubmit={handlePayment}>
          <div className="modal__group">
            <label htmlFor="cardName" className="modal__label">
              Cardholder Name
            </label>
            <input
              type="text"
              id="cardName"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="modal__input"
              placeholder="Enter cardholder name"
              required
            />
          </div>

          <div className="modal__group">
            <label className="modal__label">Card Number</label>
            <CardNumberElement className="modal__card-element" />
          </div>

          <div className="modal__group">
            <label className="modal__label">Expiry Date</label>
            <CardExpiryElement className="modal__card-element" />
          </div>

          <div className="modal__group">
            <label className="modal__label">CVC</label>
            <CardCvcElement className="modal__card-element" />
          </div>

          {errorMessage && <p className="modal__error">{errorMessage}</p>}
          {successMessage && <p className="modal__success">{successMessage}</p>}

          <div className="modal__actions">
            <button
              type="submit"
              className="modal__submit"
              disabled={!stripe || loading}
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
            <button onClick={handleCloseModal} className="modal__cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default PaymentModal;
