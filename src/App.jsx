import { useState } from "react";
import Header from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AnimationViewer from "./components/AnimationViewer";
import { ParametersPanel } from "./components/ParametersPanel";
import ShareLinkPanel from "./components/ShareLinkPanel";
import UpdateLinkPanel from "./components/UpdateLinkPanel";
//import { generateViewerLinks } from "./services/api";
import "./styles.css";

function App() {
  const [selectedOption, setSelectedOption] = useState("");
  const [animationUrl, setAnimationUrl] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const handleSelectPart = () => {
  setAnimationUrl({
    type: "dual",
    interactive: "https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/7011?show_menu=0&is_interactive=1&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0",
    normal: "https://motovisuals.com/thirdpartyapi/#!/viewAnimation/7011?show_menu=0&is_interactive=0&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0"
  });
};

  return (
    <div className="app-container">
      <Header />

      <div className="main-layout">
        
        {/* SIDEBAR */}
        <Sidebar
          onSelectOption={(option) => {
            setSelectedOption(option);
            setAnimationUrl(null);
          }}
        />

        {/* CENTER CONTENT */}
        <div className="center-content">
          {selectedOption === "search" && (
            <div style={{ padding: "10px" }}>
              <input
              type="text"
              placeholder="Search animations..."
              value={formData.term || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  term: e.target.value
                }))
              }
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc"
              }}
              />
            </div>
          )
        }
          {/* CATALOG */}
          {(selectedOption === "catalog" || selectedOption === "search") && (
            <>
            <Dashboard
              selectedOption={selectedOption}
              setAnimationUrl={setAnimationUrl}
              handleSelectPart={handleSelectPart}
            />
            {animationUrl && (
              <AnimationViewer
              animationUrl={animationUrl}
              selectedOption={selectedOption}
            />
            )}
            </>
          )}

          {/* SHARE PANEL */}
          {selectedOption === "share" && <ShareLinkPanel />}

          {/* UPDATE PANEL */}
          {selectedOption === "update" && <UpdateLinkPanel />}
          {animationUrl && (
            <AnimationViewer
              animationUrl={animationUrl}
              selectedOption={selectedOption}
            />
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <ParametersPanel
            key={selectedOption}
            selectedOption={selectedOption}
            formData={formData}
            setFormData={setFormData}
            setAnimationUrl={setAnimationUrl}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
          />
        </div>

      </div>
    </div>
  );
}

export default App;
