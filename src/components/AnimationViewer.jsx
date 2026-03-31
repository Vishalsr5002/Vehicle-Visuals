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
  
  if (animationUrl.type === "search") {
    if (!Array.isArray(animationUrl.data) || animationUrl.data.length === 0) {
      return (
        <div className="animation-box">
          <p>No results found</p>
        </div>
      );
    }

    return (
      <div className="search-grid">
        {animationUrl.data.map((item) => (
          <div key={item.part_id} className="search-card">
            <img
              src={
                item.image ||
                item.thumbnail ||
                item.image_url ||
                "https://via.placeholder.com/200x120?text=No+Image"
              }
              alt={item.title}
            />
            <h4>{item.title}</h4>
          </div>
        ))}
      </div>
    );
  }
  
  if (animationUrl.type === "dual") {
    return (
      <div className="dual-wrapper">
        {loading && (
          <p className="loading-text">Loading animations...</p>
        )}

        <div className="dual-view">
          {/* Interactive */}
          <div className="viewer-box">
            <h4>Interactive</h4>

            <iframe
              key={animationUrl.interactive}
              src={animationUrl.interactive}
              width="100%"
              height="400px"
              style={{ border: "none" }}
              onLoad={() => setLoading(false)}
            />
          </div>

          {/* Non Interactive */}
          <div className="viewer-box">
            <h4>Non-Interactive</h4>

            <iframe
              key={animationUrl.normal}
              src={animationUrl.normal}
              width="100%"
              height="400px"
              style={{ border: "none" }}
            />
          </div>
        </div>
      </div>
    );
  }
  
  if (animationUrl.type === "single") {
    if (!animationUrl.url) {
      return (
        <div className="animation-box">
          <p>Invalid animation URL</p>
        </div>
      );
    }

    return (
      <div className="animation-box">
        {loading && <p className="loading-text">Loading animation...</p>}

        <iframe
          key={animationUrl.url}
          src={animationUrl.url}
          width="100%"
          height="500px"
          style={{ border: "none" }}
          onLoad={() => setLoading(false)}
        />
      </div>
    );
  }
  
  return (
    <div className="animation-box">
      <p>Unsupported view</p>
    </div>
  );
};

export default AnimationViewer;
