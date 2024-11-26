import React from "react";
import "./LoginPage.scss";
import placeholder from "../../assets/images/register.jpeg";
import Login from "../../components/Login/Login";

export default function LoginPage() {
  return (
    <main className="loginp">
      <div className="loginp___wrapper">
        <div className="loginp__wrap">
          <img
            className="loginp__image"
            src={placeholder}
            alt="dental placeholder"
          />
          <Login />
        </div>
      </div>
    </main>
  );
}
