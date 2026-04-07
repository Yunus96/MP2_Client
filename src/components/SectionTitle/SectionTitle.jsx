// src/components/SectionTitle.jsx
import "./SectionTitle.css";

export default function SectionTitle({ children }) {
  return (
    <div className="section-title">
      <span className="section-title__text">{children}</span>
      <div className="section-title__line" />
    </div>
  );
}
