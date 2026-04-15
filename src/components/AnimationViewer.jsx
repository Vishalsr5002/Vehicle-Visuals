import { useEffect, useState } from "react";
import RealTimeClock from "./RealTimeClock";

const AnimationViewer = ({ animationUrl }) => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!animationUrl) 
    return;
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
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
    const data = Array.isArray(animationUrl.data)
      ? animationUrl.data
      : [];
    if (data.length === 0) return <p>No results found</p>;
    return (
      <div className="search-grid">
        {data.map((item) => (
          <div
            key={item.part_id}
            className="search-card"
            onClick={() =>
              window.open(
                `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${item.part_id}?show_menu=0&is_interactive=1`,
                "_blank"
              )
            }>
            <img
              src={
                item.image || "https://img.freepik.com/premium-photo/various-car-parts-accessories-isolated-white-background_771335-35715.jpg"
              }
              alt={item.title}
            />
            <h4>{item.title}</h4>
          </div>
        ))}
      </div>
    );
  }
  if (animationUrl.type === "share") {
    const data = animationUrl.data;
    const uniqueId = data?.unique_id;
    //const partId = "7011";
    const interactiveLink = `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}?show_menu=0&is_interactive=1&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0`;
    const narratedLink = `https://motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}?show_menu=0&is_interactive=0&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0`;
    return (
      <div className="panel">
        <h3>{data?.video_title}</h3>
        <div className="card">
          <p><strong>Unique ID:</strong> {data?.unique_id}</p>
          <p><strong>Share URL:</strong></p>
          <input value={data?.video_url || ""} readOnly />
        </div>

        {/* INTERACTIVE */}
        <div className="viewer-box">
          <h4>Interactive Animation</h4>
          <iframe src={interactiveLink} />
        </div>

        {/* NARRATED */}
        <div className="viewer-box">
          <h4>Narrated Animation</h4>
          <iframe src={narratedLink} />
        </div>
      </div>
    );
  }
  if (animationUrl.type === "usage") {
    const usage = animationUrl.data?.usage || {};
    return (
      <div className="panel">
        <h3>Animation Link Usage</h3>
        {Object.keys(usage).length === 0 ? (
          <p>No usage found</p>
          //setLoading(false);
        ) : (
          Object.entries(usage).map(([name, count]) => (
            <div key={name} className="card">
              <h4>{name}</h4>
              <p>{count} views</p>
            </div>
          ))
        )}
      </div>
    );
  }
  if (animationUrl.type === "share") {
  const data = animationUrl.data;
  const uniqueId = data?.unique_id;
  const interactiveLink = `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${uniqueId}?show_menu=0&is_interactive=1&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0`;
  const narratedLink = `https://motovisuals.com/thirdpartyapi/#!/viewAnimation/${uniqueId}?show_menu=0&is_interactive=0&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0`;
  return (
    <div className="panel">
      <h3>{data?.video_title}</h3>
      <div className="card">
        <p><strong>Unique ID:</strong> {uniqueId}</p>
        <p><strong>Share URL:</strong></p>
        <input value={data?.video_url || ""} readOnly />
      </div>
      
      {/* INTERACTIVE */}
      <div className="viewer-box">
        <h4>Interactive Animation</h4>
        <button onClick={handleView}>Play</button>
        <iframe src={interactiveLink} />
      </div>

      {/* NARRATED */}
      <div className="viewer-box">
        <h4>Narrated Animation</h4>
        <button onClick={handleView}>Play</button>
        <iframe src={narratedLink} />
      </div>
      <div className="panel">
        <h4>Real-time Usage</h4>
        <p>Total Views: {viewCount}</p>
      </div>
    </div>
  );
}
  
  if (animationUrl.type === "dual") {
    return (
      <div>
        <RealTimeClock />

        <div className="dual-view">
          <div className="viewer-box">
            <h4>Interactive Animation</h4>
            <iframe src={animationUrl.interactive} />
          </div>

          <div className="viewer-box">
            <h4>Narrated Animation</h4>
            <iframe src={animationUrl.normal} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="animation-box">
      <p>Unsupported</p>
    </div>
  );
};

export default AnimationViewer;
