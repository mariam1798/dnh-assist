import React from "react";
import { Link } from "react-router-dom";

const HelpPage = () => {
  return (
    <div className="profile">
      <div className="profile__container">
        <h1 className="profile__title">Help and Support</h1>
        <p className="profile__subtitle">
          If you have any questions or concerns about our services, privacy
          policy, or data practices, please contact us using the details below:
        </p>
        <ul className="profile__list">
          <li className="profile__item">
            Address:
            <strong className="profile__strong">
              Chessington Business Centre, 37 Cox Lane, KT9 1SD
            </strong>
          </li>
          <li className="profile__item">
            Email:
            <strong className="profile__strong">
              <a className="profile__links" href="mailto:info@dnh.dental">
                info@dnh.dental
              </a>
            </strong>
          </li>
          <li className="profile__item">
            Phone:
            <strong className="profile__strong">
              <a className="profile__links" href="tel:+447386132263">
                +44 7386 132263
              </a>
            </strong>
          </li>
        </ul>
        <div className="profile__buttons">
          <p className="profile__booking">
            If you'd like to return to the{" "}
            <Link className="profile__link" to="/">
              Homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
