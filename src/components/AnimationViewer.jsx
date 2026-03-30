import { useState, useEffect } from "react";

const AnimationViewer = ({ animationUrl, onSelectPart }) => {
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
        {animationUrl.data.map((item) => {
          const imageSrc =
            item.image ||
            item.thumbnail ||
            item.image_url ||
            "https://via.placeholder.com/200x120?text=No+Image";

          return (
            <div
              key={item.part_id}
              className="search-card"
              onClick={() => onSelectPart?.(item.part_id)}>
              <img
                src={imageSrc}
                alt={item.title}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/200x120?text=Image+Error";
                }}
              />
              <h4>{item.title}</h4>
            </div>
          );
        })}
      </div>
    );
  }
  
  if (animationUrl.type === "dual") {
    return (
      <div className="dual-wrapper">
        {loading && (
          <p className="loading-text">Loading animations</p>
        )}

        <div className="dual-view">
          {/* Interactive */}
          <div className="viewer-box">
            <h4>Interactive</h4>

            {animationUrl.interactive?.includes(".mp4") ? (
              <video
                width="100%"
                height="400px"
                controls
                autoPlay
                onLoadedData={() => setLoading(false)}
              >
                <source src={animationUrl.interactive} type="video/mp4" />
              </video>
            ) : (
              <iframe
                key={animationUrl}
                src={animationUrl.interactive}
                width="100%"
                height="400px"
                style={{ border: "none" }}
                onLoad={() => setLoading(false)}
              />
            )}
          </div>

          {/* Non Interactive */}
          <div className="viewer-box">
            <h4>Non-Interactive</h4>

            {animationUrl.normal?.includes(".mp4") ? (
              <video width="100%" height="400px" controls>
                <source src={animationUrl.normal} type="video/mp4" />
              </video>
            ) : (
              <iframe
                key={animationUrl}
                src={animationUrl.normal}
                width="100%"
                height="400px"
                style={{ border: "none" }}
              />
            )}
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

        {animationUrl.url.includes(".mp4") ? (
          <video
            width="100%"
            height="500px"
            controls
            autoPlay
            onLoadedData={() => setLoading(false)}
          >
            <source src={animationUrl.url} type="video/mp4" />
          </video>
        ) : (
          <iframe
            src={animationUrl.url}
            width="100%"
            height="500px"
            style={{ border: "none" }}
            onLoad={() => setLoading(false)}
          />
        )}
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
