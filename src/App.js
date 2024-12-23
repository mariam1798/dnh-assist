import { BrowserRouter, Route, Routes } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import BookingPage from "./pages/BookingPage/BookingPage";
import "./App.scss";

const stripePromise = loadStripe(
  "pk_test_51PLKOFS8qWjUhD08L7a5HC49cEmivRfTAEdOSDrckA03Mb7HgjuzpvvgEbZRREoobCaZU8w7aY2BWvxGPrPgFqnC00GgJfzme2"
);

function App() {
  return (
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/booking" element={<BookingPage />} />
        </Routes>
      </Elements>
    </BrowserRouter>
  );
}

export default App;
