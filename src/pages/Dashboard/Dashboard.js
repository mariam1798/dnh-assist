import React from "react";
import Nav from "../../components/Nav/Nav";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Dashboard.scss";
import Main from "../../components/Main/Main";

export default function Dashboard() {
  return (
    <main className="dashboard">
      <div className="dashboard__container">
        <Sidebar />
        <div className="dashboard__main">
          <Nav />
          <div className="dashboard__content">
            <Main />
          </div>
        </div>
      </div>
    </main>
  );
}
