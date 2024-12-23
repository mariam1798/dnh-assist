import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

import "./Sidebar.scss";
import DashboardIcon from "../../assets/images/icons/dashboard.png";
import BookingsIcon from "../../assets/images/icons/calender.png";
import ProfileIcon from "../../assets/images/icons/profile.png";
import HelpIcon from "../../assets/images/icons/help.png";
import Logo from "../../assets/images/logo/Logo Xero.png";
import close from "../../assets/images/icons/close.svg";
import menu from "../../assets/images/icons/menu.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: DashboardIcon, label: "Dashboard", path: "/" },
    { icon: BookingsIcon, label: "Bookings", path: "/register" },
    { icon: ProfileIcon, label: "My Profile", path: "/profile" },
    { icon: HelpIcon, label: "Help & Support", path: "/help", id: "help" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="sidebar__toggle" onClick={toggleSidebar}>
        <img
          src={isOpen ? close : menu}
          alt={isOpen ? "Close Menu" : "Open Menu"}
          className="sidebar__icon"
        />
      </button>

      <div className="sidebar__container">
        <AnimatePresence>
          {isOpen && (
            <motion.aside
              className="sidebar sidebar--mobile"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
            >
              <div className="sidebar__menu">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={index}
                    className="sidebar__item"
                    onClick={() => handleNavigation(item.path)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.2 }}
                  >
                    <img
                      className="sidebar__image"
                      src={item.icon}
                      alt={`${item.label} Icon`}
                    />
                    <span className="sidebar__label">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <nav className="sidebar sidebar--horizontal">
          <Link to="/">
            <img className="sidebar__logo" src={Logo} alt="Logo" />
          </Link>
          <div className="sidebar__menu">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="sidebar__item"
                onClick={() => handleNavigation(item.path)}
              >
                <img
                  className="sidebar__image"
                  src={item.icon}
                  alt={`${item.label} Icon`}
                />
                <span className="sidebar__label">{item.label}</span>
              </div>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
