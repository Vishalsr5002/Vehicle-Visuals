import { useEffect, useState } from "react";
import RealTimeClock from "./RealTimeClock";

const AnimationViewer = ({ animationUrl }) => {
  const [loading, setLoading] = useState(false);
  const [loopCount, setLoopCount] = useState(0);

  useEffect(() => {
    if (!animationUrl) return;
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [animationUrl]);
  useEffect(() => {
    if (animationUrl?.type !== "generateLoop") return;

    console.log("Loop started");

    const interval = setInterval(() => {
      setLoopCount((prev) => {
        console.log("Loop played:", prev + 1);
        return prev + 1;
      });
    }, 10000); 
    return () => clearInterval(interval);
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
        <p>Loading</p>
      </div>
    );
  }

  if (animationUrl.type === "search") {
    const interactiveLink = "https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/7011?show_menu=0&is_interactive=1&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0";
    const narratedLink = "https://motovisuals.com/thirdpartyapi/#!/viewAnimation/7011?show_menu=0&is_interactive=0&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0";

    return (
      <div className="panel">
        <h3>Animation Preview</h3>

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

  if (animationUrl.type === "share") {
    const data = animationUrl.data;

    if (!data?.video_url) {
      return <p>Invalid Share Data</p>;
    }

    const narratedLink = data.video_url;

    const interactiveLink =
      data.video_url.includes("is_interactive")
        ? data.video_url.replace("is_interactive=0", "is_interactive=1")
        : data.video_url + "&is_interactive=1";

    return (
      <div className="panel">
        <h3>{data.video_title}</h3>

        <div className="card">
          <p><strong>Unique ID:</strong> {data.unique_id || "N/A"}</p>

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
      <div className="panel" style={{ textAlign: "center" }}>
        <h3>Looped Animation</h3>
        <p><strong>Loop Count:</strong> {loopCount}</p>
        <a href={animationUrl.url} target="_blank" rel="noreferrer">
          {animationUrl.url}
        </a>

        <iframe
          src={animationUrl.url}
          width="100%"
          height="400"
          style={{ border: "none", marginTop: "20px" }}
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

  if (animationUrl.type === "usage") {
    const data = animationUrl.data || {};

    return (
      <div className="panel">
        <h3>Animation Usage</h3>

        {Object.keys(data).length === 0 ? (
          <p>No usage data found</p>
        ) : (
          Object.entries(data).map(([key, value]) => (
            <div key={key} className="card">
              <p><strong>{key}:</strong> {value}</p>
            </div>
          ))
        )}
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "15px"
            }}
          >
            {data.map((item) => {
              const formattedTime = item.track_date_time
                ? new Date(item.track_date_time).toLocaleString()
                : "N/A";

              return (
                <div key={item.id} className="card">
                  <h4>{item.animation_name}</h4>
                  <p>{formattedTime}</p>

                  <iframe
                    src={`https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${item.animation_id}?is_interactive=1`}
                    width="100%"
                    height="200"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return <p>Unsupported</p>;
};

export default AnimationViewer;
