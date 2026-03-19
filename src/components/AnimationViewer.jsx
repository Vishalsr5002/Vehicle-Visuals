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
  if (typeof animationUrl === "object") {
    return (
      <div style={{ display: "flex", gap: "20px" }}>
        
        <div style={{ flex: 1 }}>
          <h4>Interactive</h4>
          <iframe
            //key={animationUrl.interactive} 
            src={animationUrl.interactive}
            width="100%"
            height="400px"
            style={{ border: "none" }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <h4>Non-Interactive</h4>
          <iframe
            //key={animationUrl.normal}
            src={animationUrl.normal}
            width="100%"
            height="400px"
            style={{ border: "none" }}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="animation-box" style={{ height: "500px" }}>
      {loading && <p>Loading animation...</p>}

      <iframe
        //key={animationUrl}
        src={animationUrl}
        width="100%"
        height="100%"
        style={{ border: "none" }}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};

export default AnimationViewer;
