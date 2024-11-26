import logo from "../../assets/images/logo/Logo Xero.png";
import "./Nav.scss";
import Search from "../Search/Search";
import Notification from "../Notification/Notification";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function Nav() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Mobile breakpoint
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav className="nav">
      <div className="nav__container">
        <div className="nav__side">
          <Link to="/" className="nav__watermark">
            <img className="nav__logo" src={logo} alt="dnh logo" />
          </Link>

          {isMobile && <Notification />}
          <div className="nav__component">
            <h1 className="nav__title">Dashboard</h1>
          </div>
        </div>
        <Search />

        {isTablet && <Notification />}
      </div>
    </nav>
  );
}
