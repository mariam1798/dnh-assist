import React from "react";
import "./Hero.scss";
import dentist from "../../assets/images/icons/dentist.png";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  const handleConnectClick = () => {
    navigate("/register");
  };

  return (
    <div className="hero">
      <div className="hero__content">
        <h1 className="hero__title">Book your Tupel Scan!</h1>
        <p className="hero__subtitle">
          Your First Step to High-Quality Treatments!
        </p>
        <div className="hero__actions">
          <button className="hero__primary" onClick={handleConnectClick}>
            Book Now
          </button>
          <button className="hero__secondary">Learn more</button>
        </div>
      </div>
      <div className="hero__image">
        <img
          className="hero__dentist"
          src={dentist}
          alt="Mentor smiling with thumbs up"
        />
      </div>
    </div>
  );
}
