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
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import "./PaymentModal.scss";

const PaymentModal = ({
  isOpen,
  handleCloseModal,
  clientSecret,
  bookingId,
  contactDetails,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [cardName, setCardName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState(""); // For the discount code input
  const [isDiscountApplied, setIsDiscountApplied] = useState(false); // To check if discount is applied
  const [price, setPrice] = useState(300); // Default price

  const handleDiscountCodeChange = (e) => {
    setDiscountCode(e.target.value);
  };

  const validateDiscountCode = () => {
    // Assuming 'DISCOUNT100' is the valid discount code
    if (discountCode === "DISCOUNT100") {
      setPrice(0); // Apply 100% discount
      setIsDiscountApplied(true);
      setErrorMessage(""); // Clear error if code is valid
    } else {
      setIsDiscountApplied(false);
      setPrice(300); // Reset price to original value
      setErrorMessage("Invalid discount code");
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage("Payment processor not initialized. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const cardNumberElement = elements.getElement(CardNumberElement);

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
        console.error("Stripe error:", error);
        setErrorMessage(error.message || "Payment failed. Please try again.");
        setLoading(false);
        return;
      }
      if (paymentIntent) {
        console.log("Payment Intent:", paymentIntent);
      }

      if (paymentIntent.status === "succeeded") {
        try {
          const response = await confirmPayment({
            bookingId,
            paymentId: paymentIntent.id,
            customerEmail: contactDetails?.email || "mariam.alneamah@gmail.com",
          });
          if (bookingId) {
            localStorage.setItem("bookingId", bookingId);
          }

          console.log("Payment confirmation response:", response);
          setSuccessMessage("Payment successful! Booking confirmed.");
          setErrorMessage("");

          // Redirect to profile page with bookingId
          setTimeout(() => {
            navigate(`/profile/${bookingId}`);
          }, 2000);
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

        {/* Discount Code Section */}
        <div className="modal__discount">
          <input
            type="text"
            value={discountCode}
            onChange={handleDiscountCodeChange}
            className="modal__input"
            placeholder="Enter Discount Code"
          />
          <button
            type="button"
            className="modal__apply"
            onClick={validateDiscountCode}
          >
            Apply Discount
          </button>
          {errorMessage && <p className="modal__error">{errorMessage}</p>}
        </div>

        {/* Displaying the price */}
        <p className="modal__price">
          Total Amount: <strong>£{price}</strong>
        </p>

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
            <button
              type="button"
              onClick={handleCloseModal}
              className="modal__cancel"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default PaymentModal;
