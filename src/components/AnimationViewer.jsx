import { useState } from "react";
const AnimationViewer = ({ animationUrl }) => {

  const [loading, setLoading] = useState(true);

  if (!animationUrl) {
    return (
      <div className="animation-box">
        <p>Select an animation to preview</p>
      </div>
    );
  }

  return (
    <div className="animation-box">

      {loading && (
        <div
          style={{
            position: "absolute",
            textAlign: "center",
            fontSize: "14px",
            color: "#475569"
          }}
        >
          Loading animation...
        </div>
      )}

      <iframe
        src={animationUrl}
        title="Vehicle Animation"
        width="100%"
        height="100%"
        style={{
          border: "none",
          borderRadius: "6px"
        }}
        allowFullScreen
        onLoad={() => setLoading(false)}
      />

    </div>
  );
};

export default AnimationViewer;
