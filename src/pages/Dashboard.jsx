import { useState } from "react";
import { APIs } from "../data/apis";
import AnimationViewer from "../components/AnimationViewer";
//import { FaPlayCircle, FaFilm } from "react-icons/fa";
import { PlayIcon } from "lucide-react";

const Dashboard = ({
  selectedOption,
  animationUrl,
  setAnimationUrl
}) => {
  const [selectedView, setSelectedView] = useState(null);
  const playAnimation = (api) => {
    const query = new URLSearchParams(api.params).toString();
    const finalUrl = `${api.baseUrl}?${query}`;
    console.log("Generated Animation URL:", finalUrl);
    setAnimationUrl(finalUrl);
  };
  const goBack = () => {
    setAnimationUrl("");
    setSelectedView(null);
  };
  const handleSelectPart = (partId) => {
  const base = `https://motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}`;
  const interactive = base + "?show_menu=0&is_interactive=1&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0";
  const normal = base + "?show_menu=0&is_interactive=0&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0";
  setAnimationUrl({
    interactive,
    normal
  });
};
  return (
    <div className="dashboard">
      <h2>Vehicle Animation Viewer</h2>
      {selectedOption === "display" && animationUrl === "" && (
        <div className="animation-grid">
          {APIs.map((api) => (
            <div
              key={api.id}
              className="animation-card"
              onClick={() => playAnimation(api)}>
              <img
                src={api.image}
                alt={api.name}
                style={{
                  width: "100%",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "6px"
                }}/>
              <h4>{api.name}</h4>
            </div>
          ))}
        </div>
      )}
      {animationUrl?.showSelection && !selectedView && (
        <div className="card-container">
          <div
            className="animation-card enhanced"
            onClick={() => setSelectedView("interactive")}>
            <PlayIcon size={60} className="card-icon" />
            <h4>Clutch 1 Animation</h4>
            <p>Interactive Animation</p>
          </div>
          <div
            className="animation-card enhanced"
            onClick={() => setSelectedView("normal")}>
            <PlayIcon size={60} className="card-icon" />
            <h4>Clutch 2 Animation</h4>
            <p>Narrated Animation</p>
          </div>
        </div>
      )}
      
      {selectedView && (
        <div>
          <button
            className="btn"
            style={{ marginBottom: "15px" }}
            onClick={goBack}>
            Back to Animations
          </button>
          <AnimationViewer 
             animationUrl={animationUrl}
             handleSelectPart={handleSelectPart} />
        </div>
      )}
      {typeof animationUrl === "string" && animationUrl && (
        <div>
          <button
            className="btn"
            style={{ marginBottom: "15px" }}
            onClick={goBack}>
            Back to Animations
          </button>
          <AnimationViewer animationUrl={animationUrl} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
