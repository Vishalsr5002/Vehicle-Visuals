import { useState } from "react";
import Header from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import Dashboard from "./Dashboard";
import AnimationViewer from "../components/AnimationViewer";
import { ParametersPanel } from "../components/ParametersPanel";
import ShareLinkPanel from "../components/ShareLinkPanel";
import UpdateLinkPanel from "../components/UpdateLinkPanel";
import ViewingAnimations from "../components/ViewingAnimations";
import { useParams } from "react-router-dom";
import { getOption } from "../utils/slugMap";

export default function MainLayout() {
  const { slug } = useParams();
  const selectedOption = slug
    ? getOption(slug) || "catalog"
    : "catalog";
  const [animationUrl, setAnimationUrl] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [apiKey, setApiKey] = useState("");
  const handleSelectPart = (partId) => {
    setAnimationUrl({
      type: "dual",
      interactive:
        `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}` +
        `?show_menu=0` +
        `&is_interactive=1` +
        `&show_left_sidebar=0` +
        `&show_description=0` +
        `&video_only=0` +
        `&auto_play=0`,
      narrated:
        `https://motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}` +
        `?show_menu=0` +
        `&is_interactive=0` +
        `&show_left_sidebar=0` +
        `&show_description=0` +
        `&video_only=0` +
        `&auto_play=0`
    });
  };
  return (
    <div className="app-container">
      <Header />
      <div className="main-layout">
        <Sidebar />
        <div className="center-content">
          {selectedOption === "viewing" && (
            <ViewingAnimations />
          )}

          {selectedOption === "catalog" && (
            !animationUrl || animationUrl.type !== "single" ? (
              <Dashboard
                selectedOption={selectedOption}
                setAnimationUrl={setAnimationUrl}
                handleSelectPart={handleSelectPart}
                animationUrl={animationUrl}
                formData={formData}
                setFormData={setFormData}
              />
            ) : (
              <AnimationViewer
                animationUrl={animationUrl}
                selectedOption={selectedOption}
                goBack={() => setAnimationUrl(null)}
                formData={formData}
                setFormData={setFormData}
              />
            )
          )}

          {selectedOption === "search" && (
            <>
              <div style={{ padding: "10px" }}>
                <input
                  type="text"
                  placeholder="Search animations"
                  value={formData.term || ""}
                  onChange={(e) => {
                    const value = e.target.value;

                    setFormData((prev) => ({
                      ...prev,
                      term: value
                    }));

                    setAnimationUrl((prev) => ({
                      ...prev,
                      type: "search",
                      data: prev?.data || []
                    }));
                  }}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc"
                  }}
                />
              </div>

              {!animationUrl ||
              animationUrl.type === "viewer" ||
              !animationUrl.selectedAnimation ? (
                <Dashboard
                  selectedOption={selectedOption}
                  setAnimationUrl={setAnimationUrl}
                  handleSelectPart={handleSelectPart}
                  animationUrl={animationUrl}
                  formData={formData}
                  setFormData={setFormData}
                />
              ) : (
                <AnimationViewer
                  animationUrl={animationUrl}
                  selectedOption={selectedOption}
                  goBack={() =>
                    setAnimationUrl({
                      type: "search",
                      data:
                        animationUrl.previousResults ||
                        animationUrl.data ||
                        []
                    })
                  }
                  formData={formData}
                  setFormData={setFormData}
                />
              )}
            </>
          )}

          {selectedOption === "share" && (
            <>
              <ShareLinkPanel />
              {animationUrl && (
                <AnimationViewer
                  animationUrl={animationUrl}
                  goBack={() => setAnimationUrl(null)}
                />
              )}
            </>
          )}

          {selectedOption === "update" && (
            <>
              <UpdateLinkPanel />
              {animationUrl && (
                <AnimationViewer
                  animationUrl={animationUrl}
                  goBack={() => setAnimationUrl(null)}
                />
              )}
            </>
          )}

          {selectedOption !== "catalog" &&
            selectedOption !== "search" &&
            selectedOption !== "share" &&
            selectedOption !== "update" &&
            selectedOption !== "viewing" &&
            animationUrl && (
              <AnimationViewer
                animationUrl={animationUrl}
                goBack={() => setAnimationUrl(null)}
              />
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
            apiKey={apiKey}
            setApiKey={setApiKey}
          />
        </div>
      </div>
    </div>
  );
}