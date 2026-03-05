import { useState } from "react";
import { Film, Key, RefreshCw, Mail, ChevronDown, ChevronRight } from "lucide-react";

export const Sidebar = () => {

  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="sidebar">
      <h3>GET YOUR API KEY</h3>

      <div className="menu-item" onClick={() => toggleMenu("api")}>
        <Key size={18} />
        <span>API key details</span>
        {openMenu === "api" ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
      </div>

      {openMenu === "api" && (
        <ul className="submenu">
          <li>API key details</li>
        </ul>
      )}
      <h5>ANIMATIONS</h5>

      <div className="menu-item" onClick={() => toggleMenu("animations")}>
        <Film size={18} />
        <span>Animations</span>
        {openMenu === "animations" ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
      </div>

      {openMenu === "animations" && (
        <ul className="submenu">
          <li>Animation Catalog</li>
          <li>Displaying Animations</li>
          <li>Generating Links</li>
          <li>Get Video Details</li>
          <li>Search Animations</li>
        </ul>
      )}
      <h5>LOOPED ANIMATIONS</h5>

      <div className="menu-item" onClick={() => toggleMenu("looped")}>
        <RefreshCw size={18} />
        <span>Looped Animations</span>
        {openMenu === "looped" ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
      </div>

      {openMenu === "looped" && (
        <ul className="submenu">
          <li>Generate Looped Animations API Link</li>
          <li>Auto Login to Looped Animation Link</li>
        </ul>
      )}
      <h5>EMAIL AN ANIMATION</h5>

      <div className="menu-item" onClick={() => toggleMenu("email")}>
        <Mail size={18} />
        <span>Email An Animation</span>
        {openMenu === "email" ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
      </div>

      {openMenu === "email" && (
        <ul className="submenu">
          <li>Auto Login to Email Animation Link</li>
        </ul>
      )}

    </div>
  );
};