// src/components/Sidebar.jsx
// Uses NavLink — active class is applied automatically by React Router
import "./Sidebar.css";
import { NavLink } from "react-router-dom";

const NAV_SECTIONS = [
  {
    label: "Activity",
    items: [
      { label: "Dashboard", icon: "🏠", path: "/dashboard" },
      { label: "Leads",     icon: "👥", path: "/leads",    badge: 10 },
      { label: "Sales",     icon: "📈", path: "/sales",    badge: 3  },
      { label: "Agents",    icon: "🧑‍💼", path: "/agents"             },
    ],
  },
  {
    label: "Analytics",
    items: [
      { label: "Reports",  icon: "📊", path: "/reports"  },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Settings", icon: "⚙️", path: "/settings" },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {NAV_SECTIONS.map((section) => (
        <div key={section.label}>
          <div className="sidebar__section-label">{section.label}</div>

          {section.items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
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
  );
}
