import { useEffect, useState } from "react";
import RealTimeClock from "./RealTimeClock";

const AnimationViewer = ({ animationUrl }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!animationUrl) return;
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [animationUrl]);

  if (!animationUrl) {
    return (
      <div className="animation-box">
        <p>Select an animation to preview</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="animation-box">
        <p>Loading...</p>
      </div>
    );
  }
  if (animationUrl.type === "search") {
    const data = animationUrl.data || [];

    return (
      <div className="search-grid">
        {data.map((item) => (
          <div
            key={item.part_id}
            className="search-card"
            onClick={() => {
              const count =
                Number(localStorage.getItem(item.part_id)) || 0;
              localStorage.setItem(item.part_id, count + 1);

              window.open(
                `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${item.part_id}?is_interactive=1`,
                "_blank"
              );
            }}
          >
            <img src={item.image} alt={item.title} />
            <h4>{item.title}</h4>
          </div>
        ))}
      </div>
    );
  }
  
  if (animationUrl.type === "share") {
    const data = animationUrl.data;

    if (!data?.video_url) {
      return <p>Invalid Share Data</p>;
    }
    const narratedLink = data.video_url;
    const interactiveLink = data.video_url.replace("cc=1", "cc=0");

    return (
      <div className="panel">
        <h3>{data.video_title}</h3>

        <div className="card">
          <p><strong>Interactive Link:</strong></p>
          <input value={interactiveLink} readOnly />
          <p><strong>Narrated Link:</strong></p>
          <input value={narratedLink} readOnly />
        </div>

        <div className="viewer-box">
          <h4>Interactive</h4>
          <iframe src={interactiveLink} width="100%" height="300" />
        </div>

        <div className="viewer-box">
          <h4>Narrated</h4>
          <iframe src={narratedLink} width="100%" height="300" />
        </div>
      </div>
    );
  }
  if (animationUrl.type === "generateLoop") {
    return (
      <div className="panel">
        <h3>Looped Animation</h3>

        <iframe
          src={animationUrl.url}
          width="100%"
          height="400"
          style={{ border: "none" }}
        />
      </div>
    );
  }
  if (animationUrl.type === "dual") {
    return (
      <div>
        <RealTimeClock />

        <div className="dual-view">
          <div className="viewer-box">
            <h4>Interactive</h4>
            <iframe src={animationUrl.interactive} width="100%" height="300" />
          </div>

          <div className="viewer-box">
            <h4>Narrated</h4>
            <iframe src={animationUrl.normal} width="100%" height="300" />
          </div>
        </div>
      </div>
    );
  }
  if (animationUrl.type === "viewed") {
    const data = animationUrl.data || [];

    return (
      <div className="panel">
        <h3>Viewed Animations</h3>

        {data.length === 0 ? (
          <p>No data found</p>
        ) : (
          data.map((item) => (
            <div key={item.id} className="card">
              <h4>{item.animation_name}</h4>
              <p>{item.track_date_time}</p>

              <iframe
                src={`https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${item.animation_id}?is_interactive=1`}
                width="100%"
                height="200"
              />
            </div>
          ))
        )}
      </div>
    );
  }

  return <p>Unsupported</p>;
};

export default AnimationViewer;
