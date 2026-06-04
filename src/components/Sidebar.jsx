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
import { useNavigate } from "react-router-dom";
import { getSlug } from "../utils/slugMap.js";
export const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
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
          <li onClick={() => 
            navigate(
              `/animations/${getSlug("catalog")}`
              )}>
            Animation Catalog
          </li>
          <li
            style={{ cursor: "pointer" }}
            onClick={() => 
              navigate(
                `/animations/${getSlug("display")}`
              )}>
            Displaying Animations
          </li>
          <li onClick={() => 
            navigate(
              `/animations/${getSlug("links")}`
            )}>
            Generating Links for sending
          </li>
          <li onClick={() =>
            navigate(
              `/animations/${getSlug("videoDetails")}`
            )}>
            Get Video Details
          </li>
          <li onClick={() => 
            navigate(
              `/animations/${getSlug("search")}`
            )}>
            Search Animations
          </li>
          <li onClick={() => 
            navigate(
              `/animations/${getSlug("share")}`
            )}>
            Get Animation Share Link
          </li>
          <li onClick={() => 
            navigate(
              `/animations/${getSlug("update")}`
            )}>
            Update Animation Link
          </li>
          <li onClick={() => 
            navigate(
              `/animations/${getSlug("usage")}`
            )}>
            Animation Link Usage
          </li>
          <li onClick={() => 
            navigate(
              `/animations/${getSlug("viewed")}`
            )}>
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
          <li onClick={() => 
            navigate(
              `/looped/${getSlug("generateLoop")}`
            )}>
            Generate Looped Animations API Link
          </li>
          <li onClick={() => 
            navigate(
              `/looped/${getSlug("autoLogin")}`
            )}>
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
          <li onClick={() => navigate(
            `/email/${getSlug("emailAnimation")}`
          )}>
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
          <li onClick={() => navigate(
            `/additionalAPI/${getSlug("auto")}`
          )}>
            Auto-Login
          </li>
          <li
            style={{ cursor: "pointer" }}
            onClick={() => navigate(
              `/additionalAPI/${getSlug("lookup")}`
            )}>
            Website Lookup by API Key
          </li>
          <li onClick={() => navigate(
            `/additionalAPI/${getSlug("prompt")}`
          )}>
            User Upgrade Prompt
          </li>
          <li onClick={() => navigate(
            `/additionalAPI/${getSlug("lite")}`
          )}>
            Upgrade Lite User
          </li>
          <li onClick={() => navigate(
            `/additionalAPI/${getSlug("pdf")}`
          )}>
            Animation PDF
          </li>
          <li onClick={() => navigate(
            `/additionalAPI/${getSlug("get")}`
          )}>
            Get API Key
          </li>
          <li onClick={() => navigate(
            `/additionalAPI/${getSlug("preference")}`
          )}>
            Get User Preference
          </li>
          <li onClick={() => navigate(
            `/additionalAPI/${getSlug("details")}`
          )}>
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
          <li onClick={() => navigate(
            `/viewing/${getSlug("viewing")}`
          )}>
            Viewing Animations Page
          </li>
        </ul>
       )}
    </div>
  );
};
