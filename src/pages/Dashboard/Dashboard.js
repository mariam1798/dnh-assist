import React from "react";
import "./Dashboard.scss";
import Main from "../../components/Main/Main";

export default function Dashboard() {
  return (
    <main className="dashboard">
      <div className="dashboard__container">
        <div className="dashboard__main">
          <div className="dashboard__content">
            <Main />
          </div>
        </div>
      </div>
    </main>
  );
}
