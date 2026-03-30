import { useEffect, useState } from "react";
import { APIs } from "../data/apis";
import AnimationViewer from "../components/AnimationViewer";
import { getAnimationDetails, getAnimationUrls } from "../services/api";
import AnimationTree from "../components/AnimationTree";
import { getAnimationUrls } from "../services/api";
//import { PlayIcon } from "lucide-react";

const [treeData, setTreeData] = useState(null);
useEffect(() => {
  const loadTreeData = async () => {
    const data = await getAnimationDetails();
    setTreeData(data);
  }
  loadTreeData();
}, []);
const Dashboard = ({ selectedOption }) => {
  const [animationData, setAnimationData] = useState(null);
  const playAnimation = async (api) => {
    const data = await getAnimationUrls(api.part_id);
    setAnimationData(data);
  };
  const goBack = () => {
    setAnimationData(null);
  };
  return (
    <div className="dashboard">
      <h2>Vehicle Animation Viewer</h2>
      <div className="tree-section">
        <h3>Animation Catalog</h3>
        <AnimationTree
        data={treeData}
        onSelectPart={(partId) => {
          setAnimationUrl(getAnimationUrls(partId));
        }}/>
        </div>
      {selectedOption === "display" && !animationData && (
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

      {animationData && (
        <div>
          <button
            className="btn"
            style={{ marginBottom: "15px" }}
            onClick={goBack}>
            Back to Animations
          </button>

          <AnimationViewer animationUrl={animationData} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
