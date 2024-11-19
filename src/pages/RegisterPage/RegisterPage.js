import React from "react";
import Register from "../../components/Register/Register";
import placeholder from "../../assets/images/register.jpeg";
import "./RegisterPage.scss";

export default function RegisterPage() {
  return (
    <main className="registeration">
      <div className="registeration___wrapper">
        <img
          className="registeration__image"
          src={placeholder}
          alt="dental placeholder"
        />
        <Register />
      </div>
    </main>
  );
}
