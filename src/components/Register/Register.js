import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.scss";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (value.trim().length < 2) {
          error = "Name must be at least 2 characters long.";
        }
        break;
      case "email":
        if (
          !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value.trim())
        ) {
          error = "Enter a valid email address.";
        }
        break;
      case "phone":
        if (
          !/^((\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3})$/.test(
            value.trim()
          )
        ) {
          error = "Enter a valid UK phone number.";
        }
        break;
      default:
        break;
    }

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData({ ...formData, [name]: value });

    // Validate the field
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if there are any errors
    const hasErrors = Object.values(formErrors).some((error) => error);
    const hasEmptyFields = Object.values(formData).some(
      (value) => !value.trim()
    );

    if (hasErrors || hasEmptyFields) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        global: "Please fill out all fields correctly.",
      }));
      return;
    }

    // Save data and navigate to booking page
    localStorage.setItem("contactDetails", JSON.stringify(formData));
    navigate("/booking");
  };

  return (
    <form className="register" onSubmit={handleSubmit}>
      <h2>Contact Details</h2>

      {formErrors.global && (
        <p className="register__error">{formErrors.global}</p>
      )}

      <label className="register__label">
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`register__input ${
            formErrors.name ? "register__input--error" : ""
          }`}
          placeholder="Enter your name"
        />
      </label>
      {formErrors.name && <p className="register__error">{formErrors.name}</p>}

      <label className="register__label">
        Email Address:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`register__input ${
            formErrors.email ? "register__input--error" : ""
          }`}
          placeholder="Enter your email"
        />
      </label>
      {formErrors.email && (
        <p className="register__error">{formErrors.email}</p>
      )}

      <label className="register__label">
        Phone Number:
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`register__input ${
            formErrors.phone ? "register__input--error" : ""
          }`}
          placeholder="Enter your phone number"
        />
      </label>
      {formErrors.phone && (
        <p className="register__error">{formErrors.phone}</p>
      )}

      <button className="register__submit" type="submit">
        Next
      </button>
    </form>
  );
}
