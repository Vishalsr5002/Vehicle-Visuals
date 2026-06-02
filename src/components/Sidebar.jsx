import { useState } from "react";
import {
  Film,
  Key,
  RefreshCw,
  Mail,
  ChevronDown,
  ChevronRight,
  SquarePlus,
  View
} from "lucide-react";
export const Sidebar = ({ onSelectOption }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };
  return (
    <div className="sidebar">
      <h3>GET YOUR API KEY</h3>
      <h5>ANIMATIONS</h5>
      <div className="menu-item" onClick={() => toggleMenu("animations")}>
        <Film size={18} />
        <span>Animations</span>
        {openMenu === "animations" ? (
          <ChevronDown size={16} />
        ) : (
          <ChevronRight size={16} />
        )}
      </div>
      {openMenu === "animations" && (
        <ul className="submenu">
          <li onClick={() => onSelectOption("catalog")}>
            Animation Catalog
          </li>
          <li
            style={{ cursor: "pointer" }}
            onClick={() => onSelectOption("display")}>
            Displaying Animations
          </li>
          <li onClick={() => onSelectOption("links")}>
            Generating Links for sending
          </li>
          <li onClick={() => onSelectOption("videoDetails")}>
            Get Video Details
          </li>
          <li onClick={() => onSelectOption("search")}>
            Search Animations
          </li>
          <li onClick={() => onSelectOption("share")}>
            Get Animation Share Link
          </li>
          <li onClick={() => onSelectOption("update")}>
            Update Animation Link
          </li>
          <li onClick={() => onSelectOption("usage")}>
            Animation Link Usage
          </li>
          <li onClick={() => onSelectOption("viewed")}>
            Animations Viewed Report
          </li>
        </ul>
      )}
  
      <h5>LOOPED ANIMATIONS</h5>
      <div className="menu-item" onClick={() => toggleMenu("looped")}>
        <RefreshCw size={18} />
        <span>Looped Animations</span>
        {openMenu === "looped" ? (
          <ChevronDown size={16} />
        ) : (
          <ChevronRight size={16} />
        )}
      </div>
      {openMenu === "looped" && (
        <ul className="submenu">
          <li onClick={() => onSelectOption("generateLoop")}>
            Generate Looped Animations API Link
          </li>
          <li onClick={() => onSelectOption("autoLogin")}>
            Auto Login to Looped Animation Link
          </li>
        </ul>
      )}
      <h5>EMAIL AN ANIMATION</h5>
      <div className="menu-item" onClick={() => toggleMenu("email")}>
        <Mail size={18} />
        <span>Email An Animation</span>
        {openMenu === "email" ? (
          <ChevronDown size={16} />
        ):(
          <ChevronRight size={16} />
        )}
      </div>
      {openMenu === "email" && (
        <ul className="submenu">
          <li onClick={() => onSelectOption("emailAnimation")}>
            Auto Login to Email Animation Link
          </li>
        </ul>
      )}
      <h5>ADDITIONAL APIs</h5>
      <div className="menu-item" onClick={() => toggleMenu("additionalAPI")}>
        <SquarePlus size={18} />
        <span>Additional APIs</span>
        {openMenu === "additionalAPI" ? (
          <ChevronDown size={16} />
        ) : (
          <ChevronRight size={16} />
        )}
      </div>
      {openMenu === "additionalAPI" && (
        <ul className="submenu">
          <li onClick={() => onSelectOption("auto")}>
            Auto-Login
          </li>
          <li
            style={{ cursor: "pointer" }}
            onClick={() => onSelectOption("lookup")}>
            Website Lookup by API Key
          </li>
          <li onClick={() => onSelectOption("prompt")}>
            User Upgrade Prompt
          </li>
          <li onClick={() => onSelectOption("lite")}>
            Upgrade Lite User
          </li>
          <li onClick={() => onSelectOption("pdf")}>
            Animation PDF
          </li>
          <li onClick={() => onSelectOption("get")}>
            Get API Key
          </li>
          <li onClick={() => onSelectOption("preference")}>
            Get User Preference
          </li>
          <li onClick={() => onSelectOption("details")}>
            Get User Details
          </li>
        </ul>
      )}
      <h5>VIEWING ANIMATIONS</h5>
       <div className="menu-item" onClick={() => toggleMenu("viewing")}>
        <View size={18} />
        <span>Viewing Animations</span>
        {openMenu === "viewing" ? (
          <ChevronDown size={16} />
        ) : (
          <ChevronRight size={16} />
        )}
      </div>
      {openMenu === "viewing" && (
        <ul className="submenu">
          <li onClick={() => onSelectOption("viewing")}>
            Viewing Animations Page
          </li>
        </ul>
       )}
    </div>
  );
};
