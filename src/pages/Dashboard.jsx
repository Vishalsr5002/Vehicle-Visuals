import { APIs } from "../data/apis";
import AnimationViewer from "../components/AnimationViewer";

const Dashboard = ({
  selectedOption,
  animationUrl,
  setAnimationUrl,
  setSelectedApi
}) => {
  const playAnimation = (api) => {

  const query = new URLSearchParams(api.params).toString();

  const finalUrl = `${api.baseUrl}?${query}`;

  console.log("Playing animation:", finalUrl);

  setAnimationUrl(finalUrl);
  setSelectedApi(api);
};
  const goBack = () => {
    setAnimationUrl("");
    setSelectedApi(null);
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
      {animationUrl && (
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
