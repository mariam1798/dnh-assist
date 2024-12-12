import React from "react";
import "./Hero.scss";
import dentist from "../../assets/images/icons/dentist.png";

export default function Hero() {
  return (
    <div className="hero">
      <div className="hero__content">
        <h1 className="hero__title">Connect with Mentors!</h1>
        <p className="hero__subtitle">Provide higher quality treatments now!</p>
        <div className="hero__actions">
          <button className="hero__primary">Connect</button>
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
