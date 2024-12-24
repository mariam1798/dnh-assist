import { BrowserRouter, Route, Routes } from "react-router-dom";
import stripePromise from "./utils/StripePromise";
import { Elements } from "@stripe/react-stripe-js";
import { LoadScript } from "@react-google-maps/api";
import Nav from "./components/Nav/Nav";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import BookingPage from "./pages/BookingPage/BookingPage";
import "./App.scss";

const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

function App() {
  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={["places"]}>
      <BrowserRouter>
        <Elements stripe={stripePromise}>
          <Nav />
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/booking" element={<BookingPage />} />
          </Routes>
        </Elements>
      </BrowserRouter>
    </LoadScript>
  );
}

export default App;
