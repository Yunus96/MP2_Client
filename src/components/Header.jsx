// src/components/Header.jsx
import "./Header.css";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <Link to="/dashboard" className="header__brand">
        <div className="header__logo">A</div>
        <div>
          <div className="header__title">Anvaya CRM</div>
          <div className="header__subtitle">Customer Relationship Management</div>
        </div>
      </Link>

      <div className="header__right">
        <span className="header__date">Mon, 23 March 2026</span>
        <div className="header__avatar">RK</div>
      </div>
    </header>
  );
}
