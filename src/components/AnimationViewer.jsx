import { useState, useEffect } from "react";

const AnimationViewer = ({ animationUrl }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, [animationUrl]);

  if (!animationUrl) {
    return (
      <div className="animation-box">
        <p>Select an animation to preview</p>
      </div>
    );
  }

  return (
    <div
      className="animation-box"
      style={{
        position: "relative",
        height: "500px",
        width: "100%"
      }}
    >
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            fontSize: "14px",
            color: "#475569"
          }}
        >
          Loading animation...
        </div>
      )}

      <iframe
        key={animationUrl}
        src={animationUrl}
        title="Vehicle Animation"
        width="100%"
        height="100%"
        style={{border: "none"}}
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"

        onLoad={() => setLoading(false)}
      />
    </div>
  );
};

export default AnimationViewer;
