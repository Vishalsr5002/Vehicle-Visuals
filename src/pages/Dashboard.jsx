import { useState } from "react";
import {APIs} from "../data/apis";
import AnimationViewer from "../components/AnimationViewer";
import { getAnimationUrls } from "../services/api";
import { PlayIcon } from "lucide-react";
 
const getAnimationUrls = (partId) => {
  const base = `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}`;
  const commonParams = {
    show_menu: 0,
    show_left_sidebar: 0,
    show_description: 0,
    video_only: 0,
    auto_play: 1,
    mute: 1
  };

  return {
    type: "dual",
    interactive:
      base +
      "?" +
      new URLSearchParams({
        ...commonParams,
        is_interactive: 1
      }),
    normal:
      base +
      "?" +
      new URLSearchParams({
        ...commonParams,
        is_interactive: 0
      })
  };
};
const Dashboard = ({ selectedOption }) => {
  const [animationData, setAnimationData] = useState(null);
  const playAnimation = (api) => {
    const data = getAnimationUrls(api.part_id);
    setAnimationData(data);
  };

  const goBack = () => {
    setAnimationData(null);
  };

  return (
    <div className="dashboard">
      <h2>Vehicle Animation Viewer</h2>
      
      {selectedOption === "display" && !animationData && (
        <div className="animation-grid">
          {APIs.map((api) => (
            <div
              key={api.id}
              className="animation-card"
              onClick={() => playAnimation(api)}
            >
              <img
                src={api.image}
                alt={api.name}
                style={{
                  width: "100%",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "6px"
                }}
              />
              <h4>{api.name}</h4>
            </div>
          ))}
        </div>
      )}
      
      {animationData && (
        <div>
          <button
            className="btn"
            style={{ marginBottom: "15px" }}
            onClick={goBack}
          >
            Back to Animations
          </button>

          <AnimationViewer
            animationUrl={animationData}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
