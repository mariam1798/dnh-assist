import logo from "../../assets/images/logo/Logo Xero.png";
import "./Nav.scss";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav__container">
        <div className="nav__side">
          <Sidebar />
          <Link to="/" className="nav__watermark">
            <img className="nav__logo" src={logo} alt="dnh logo" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
