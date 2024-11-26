import bell from "../../assets/images/icons/bells.png";
import bellnot from "../../assets/images/icons/bellsnot.png";
import message from "../../assets/images/icons/message.png";
import messagenot from "../../assets/images/icons/messagenot.png";
import "./Notification.scss";

import profileImage from "../../assets/images/icons/Mohan-muruge.jpg";

const Notification = () => {
  const notifications = {
    message: false,
    bell: false,
  };
  return (
    <div className="notification">
      <div className="notification__icons">
        <img
          src={notifications.message ? messagenot : message}
          alt="Message Icon"
          className="notification__icon"
        />

        <img
          src={notifications.bell ? bellnot : bell}
          alt="bell Icon"
          className="notification__icon"
        />
      </div>
      <div className="notification__user">
        <h3 className="notification__name">Mohan</h3>
        <img
          src={profileImage}
          alt="Profile"
          className="notification__profile"
        />
      </div>
    </div>
  );
};

export default Notification;
