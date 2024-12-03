import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.scss";
import DashboardIcon from "../../assets/images/icons/dashboard.png";
import BookingsIcon from "../../assets/images/icons/calender.png";
import DentistsIcon from "../../assets/images/icons/dentists.png";
import MessagesIcon from "../../assets/images/icons/messages.png";
import ProfileIcon from "../../assets/images/icons/profile.png";
import HelpIcon from "../../assets/images/icons/help.png";
import Logo from "../../assets/images/logo/Logo Xero.png";

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: DashboardIcon, label: "Dashboard", path: "/dashboard" },
    { icon: BookingsIcon, label: "Bookings", path: "/bookings" },
    { icon: DentistsIcon, label: "Dentists", path: "/dentists" },
    { icon: MessagesIcon, label: "Messages", path: "/messages" },
    { icon: ProfileIcon, label: "My Profile", path: "/profile", id: "profile" },
    {
      icon: HelpIcon,
      label: "Help & Support",
      path: "/help",
      id: "help",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <img className="sidebar__dnh" src={Logo} alt="Logo" />
      </div>
      <ul className="sidebar__menu">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`sidebar__item ${
              item.id ? `sidebar__item--${item.id}` : ""
            }`}
            onClick={() => handleNavigation(item.path)}
          >
            <div className="sidebar__link">
              <span className="sidebar__icon">
                <img
                  className="sidebar__image"
                  src={item.icon}
                  alt={`${item.label} Icon`}
                />
              </span>
              <span className="sidebar__label">{item.label}</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
