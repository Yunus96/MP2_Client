// src/components/Sidebar.jsx
import "./Sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useSidebar } from "../context/Sidebarcontext";

const NAV_SECTIONS = [
  {
    label: "Activity",
    items: [
      { label: "Dashboard", icon: "🏠", path: "/dashboard" },
      { label: "Leads",     icon: "👥", path: "/leads" },
      //{ label: "By Status", icon: "🗂",  path: "/leads/status"            },
      //{ label: "Sales",     icon: "📈", path: "/sales",        badge: 3  },
      { label: "Agents",    icon: "🧑‍💼", path: "/agents"                  },
    ],
  },
  {
    label: "Analytics",
    items: [
      { label: "Reports", icon: "📊", path: "/reports" },
    ],
  },
  /*{
    label: "Account",
    items: [
      { label: "Settings", icon: "⚙️", path: "/settings" },
    ],
  },*/
];

export default function Sidebar() {
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Dark backdrop — visible on mobile when sidebar is open */}
      {isOpen && (
        <div className="sidebar__backdrop" onClick={close} aria-hidden="true" />
      )}

      <aside className={`sidebar${isOpen ? " sidebar--open" : ""}`}>

        {/* Mobile close button */}
        <button
          className="sidebar__close-btn"
          onClick={close}
          aria-label="Close menu"
        >
          ✕
        </button>

        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <div className="sidebar__section-label">{section.label}</div>

            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                // Close sidebar when a nav item is tapped on mobile
                onClick={close}
                className={({ isActive }) =>
                  `sidebar__item${isActive ? " sidebar__item--active" : ""}`
                }
              >
                <span className="sidebar__icon">{item.icon}</span>
                {item.label}
                {item.badge && (
                  <span className="sidebar__badge">{item.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}

        <div className="sidebar__footer">Anvaya CRM v2.1</div>
      </aside>
    </>
  );
}