import { useState } from "react";
import Header from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AnimationViewer from "./components/AnimationViewer";
import { ParametersPanel } from "./components/ParametersPanel";
import ShareLinkPanel from "./components/ShareLinkPanel";   
import UpdateLinkPanel from "./components/UpdateLinkPanel"; 
import { generateViewerLinks } from "./services/api";
import "./styles.css";

function App() {
  const [selectedOption, setSelectedOption] = useState("");
  const [animationUrl, setAnimationUrl] = useState("");
  const [formData, setFormData] = useState({});
  const [searchResults, setSearchResults] = useState([]);

  const handleSelectPart = (partId) => {
    if (!partId) {
      console.error("Invalid partId");
      return;
    }
    const viewer = generateViewerLinks(partId);
    if (viewer) {
      setAnimationUrl(viewer);
    } else {
      console.error("Viewer generation failed");
    }
  };
  return (
    <div className="app-container">
      <Header />

      <div className="main-layout">
        <Sidebar
          onSelectOption={(option) => {
            setSelectedOption(option);
            setAnimationUrl(""); // reset viewer
          }}
        />
        <div className="center-content">
          {selectedOption === "catalog" && (
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
          {selectedOption === "share" && <ShareLinkPanel />}
          {selectedOption === "update" && <UpdateLinkPanel />}
          {selectedOption !== "catalog" &&
            selectedOption !== "share" &&
            selectedOption !== "update" && (
              <div className="empty-state">
                Select API from right panel
              </div>
            )}
        </div>
        
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
