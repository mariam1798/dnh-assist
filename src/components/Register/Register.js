import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddressSearch from "../AddressSearch/AddressSearch";
import "./Register.scss";
import { useEffect } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    patientName: "",
    email: "",
    phone: "",
    street: "",
    postcode: "",
    city: "",
    country: "",
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
      case "patientName":
        if (value.trim().length < 2) {
          error = "Patient name must be at least 2 characters long.";
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
          !/^((\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3})$|^(?:\+44\s?1\d{2}|0\d{2})\s?\d{3,4}\s?\d{3,4}$/.test(
            value.trim()
          )
        ) {
          error = "Enter a valid UK phone number.";
        }
        break;

      case "street":
      case "postcode":
      case "city":
      case "country":
        if (!value.trim()) {
          error = `${
            name.charAt(0).toUpperCase() + name.slice(1)
          } is required.`;
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

  const handleAddressChange = (parsedAddress) => {
    setFormData((prevData) => ({
      ...prevData,
      ...parsedAddress,
    }));

    // Validate the address fields
    validateField("street", parsedAddress.street);
    validateField("postcode", parsedAddress.postcode);
    validateField("city", parsedAddress.city);
    validateField("country", parsedAddress.country);
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
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
      if (!formData[key].trim()) {
        newErrors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required.`;
      }
    });

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

    // Combine address fields into a single address string (optional)
    const fullAddress = `${formData.street}, ${formData.postcode}, ${formData.city}, ${formData.country}`;

    // Prepare the final data to send
    const finalData = {
      ...formData,
      fullAddress, // Add combined address if needed
    };

    // Save all data to local storage
    localStorage.setItem("contactDetails", JSON.stringify(finalData));
    navigate("/booking");
  };
  useEffect(() => {
    const hasErrors = Object.values(formErrors).some((error) => error);
    if (!hasErrors) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        global: "",
      }));
    }
  }, [formErrors]);

  return (
    <form className="register" onSubmit={handleSubmit}>
      <h2 className="register__title">Contact Details</h2>

      <div className="register__container">
        <h3 className="register__subtitle">
          Please fill in your details to book our product
        </h3>

        <label className="register__label">
          Dentist Name:
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
          {formErrors.name && (
            <p className="register__error">{formErrors.name}</p>
          )}
        </label>

        <label className="register__label">
          Patient Name:
          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            className={`register__input ${
              formErrors.patientName ? "register__input--error" : ""
            }`}
            placeholder="Enter the patient name"
          />
          {formErrors.patientName && (
            <p className="register__error">{formErrors.patientName}</p>
          )}
        </label>

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
          {formErrors.email && (
            <p className="register__error">{formErrors.email}</p>
          )}
        </label>

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
          {formErrors.phone && (
            <p className="register__error">{formErrors.phone}</p>
          )}
        </label>

        <AddressSearch
          onAddressChange={handleAddressChange}
          errors={{
            street: formErrors.street,
            postcode: formErrors.postcode,
            city: formErrors.city,
            country: formErrors.country,
          }}
        />

        <div className="register__address">
          <div className="register__hold">
            <label className="register__label register__label--address">
              House number and Street:
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className={`register__input ${
                  formErrors.street ? "register__input--error" : ""
                }`}
                placeholder="Enter your street"
              />
              {formErrors.street && (
                <p className="register__error">{formErrors.street}</p>
              )}
            </label>
          </div>

          <label className=" register__label register__label--address">
            Postcode:
            <input
              type="text"
              name="postcode"
              value={formData.postcode}
              onChange={handleChange}
              className={`register__input ${
                formErrors.postcode ? "register__input--error" : ""
              }`}
              placeholder="Enter your postcode"
            />
            {formErrors.postcode && (
              <p className="register__error">{formErrors.postcode}</p>
            )}
          </label>
        </div>

        <div className="register__address">
          <label className="register__label register__label--address">
            City:
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`register__input ${
                formErrors.city ? "register__input--error" : ""
              }`}
              placeholder="Enter your city"
            />
            {formErrors.city && (
              <p className="register__error">{formErrors.city}</p>
            )}
          </label>

          <label className="register__label register__label--address">
            Country:
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`register__input ${
                formErrors.country ? "register__input--error" : ""
              }`}
              placeholder="Enter your country"
            />
            {formErrors.country && (
              <p className="register__error">{formErrors.country}</p>
            )}
          </label>
        </div>
        {formErrors.global && (
          <p className="register__error">{formErrors.global}</p>
        )}

        <button className="register__submit" type="submit">
          Next
        </button>
      </div>
    </form>
  );
}
