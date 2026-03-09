import { APIs } from "../data/apis";
import AnimationViewer from "../components/AnimationViewer";

const Dashboard = ({
  selectedOption,
  animationUrl,
  setAnimationUrl,
  setSelectedApi
}) => {
  const playAnimation = (api) => {
    const url =
      api.url + "?" + new URLSearchParams(api.params).toString();
    console.log("Generated URL:", url);
    setAnimationUrl(url);
    setSelectedApi(api);
  };
  const goBack = () => {
    setAnimationUrl("");
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
              />
              <h4>{api.name}</h4>
            </div>
          ))}
        </div>
      )}
      {animationUrl && (
        <div>
          <button
            className="btn"
            style={{ marginBottom: "15px" }}
            onClick={goBack}
          >
            ← Back to Animations
          </button>

          <AnimationViewer animationUrl={animationUrl} />

        </div>
      )}

    </div>
  );
};

export default Dashboard;
