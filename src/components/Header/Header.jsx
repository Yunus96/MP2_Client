import "./Header.css";
import { Link } from "react-router-dom";
import { useSidebar } from "../../context/Sidebarcontext";

export default function Header() {
  const { toggle } = useSidebar();

  return (
    <header className="header">
      {/* Hamburger — only visible on mobile */}
      <button
        className="header__hamburger"
        onClick={toggle}
        aria-label="Toggle menu"
      >
        <span className="header__hamburger-line" />
        <span className="header__hamburger-line" />
        <span className="header__hamburger-line" />
      </button>

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