// Example: Sidebar component
import React from "react";
import { SIDEBAR_MENU } from "../constants/seo";

export default function Sidebar({ activeSection, setActiveSection }) {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        {SIDEBAR_MENU.map(item => (
          <li key={item.key}>
            <a
              href="#"
              className={activeSection === item.key ? "active" : ""}
              onClick={e => {e.preventDefault(); setActiveSection(item.key);}}
            >
              <i className={`fas ${item.icon}`}></i> {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
