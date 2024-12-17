import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const PaymentPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const { amount, bookingId } = location.state;
  const [clientSecret, setClientSecret] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Fetch client secret for payment intent
    const fetchClientSecret = async () => {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId, amount }),
      });
      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
    };

    fetchClientSecret();
  }, [bookingId, amount]);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: "Customer Name", // Replace with dynamic name
          },
        },
      }
    );

    if (error) {
      setErrorMessage(error.message);
    } else if (paymentIntent.status === "succeeded") {
      setSuccessMessage("Payment successful!");
    }
  };

  return (
    <div className="payment">
      <h1>Pay Now</h1>
      <form onSubmit={handlePayment}>
        <CardElement />
        <button type="submit" disabled={!stripe || !clientSecret}>
          Pay £{(amount / 100).toFixed(2)}
        </button>
      </form>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
    </div>
  );
};

export default PaymentPage;
