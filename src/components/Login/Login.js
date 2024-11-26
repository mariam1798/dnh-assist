import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postLogin } from "../../utils/axios";
import "./Login.scss";

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = () => {
    setKeepMeLoggedIn(!keepMeLoggedIn);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrorMessage("You must provide your email and password");
      return;
    }

    try {
      const { data } = await postLogin(formData);

      if (keepMeLoggedIn) {
        localStorage.setItem("authToken", data.token);
      } else {
        sessionStorage.setItem("authToken", data.token);
      }

      navigate("/dashboard");
    } catch (error) {
      const message =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : "An error occurred. Please try again later.";
      setErrorMessage(message);
    }
  };

  return (
    <main className="login">
      <form className="login__container" onSubmit={handleSubmit}>
        <h2 className="login__title">Welcome Back!</h2>
        <div className="login__register">
          <h3 className="login__subtitle">Don't have an account yet?</h3>
          <Link className="login__navigate" to="/">
            Sign Up
          </Link>
        </div>
        <div className="login__group">
          <label className="login__label" htmlFor="email">
            Email
          </label>
          <input
            className="login__input"
            type="text"
            name="email"
            id="email"
            onChange={handleChange}
          />
        </div>
        <div className="login__group">
          <label className="login__label" htmlFor="password">
            Password
          </label>
          <input
            className="login__input"
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
          />
        </div>
        <div className="login__checkbox">
          <input type="checkbox" id="keepLoggedIn" />
          <label className="login__forget" htmlFor="keepLoggedIn">
            Keep me logged in
          </label>
        </div>
        <button className="login__button">Login</button>

        {errorMessage && <div className="login__message">{errorMessage}</div>}
      </form>
    </main>
  );
}
