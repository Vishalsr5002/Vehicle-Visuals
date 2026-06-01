import { useState } from "react";

function ViewingAnimations() {
  const [animationLink, setAnimationLink] = useState("");
  const [loadedLink, setLoadedLink] = useState("");
  const Clutch_Description = "The clutch master cylinder is a vital hydraulic component in manual transmission vehicles that acts as a translator between the driver's foot and the clutch mechanism.";
  const INTERACTIVE_URL = "https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/7011?show_menu=0&is_interactive=1&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0";
  const NARRATED_URL = "https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/7011?show_menu=0&is_interactive=0&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0";
  const handleLoadAnimation = () => {
    if (!animationLink.trim()) {
      alert("Please Enter an Animation URL");
      return;
    }
    setLoadedLink(animationLink.trim());
    console.log("Loaded Animation URL:", animationLink);
    console.log( animationLink.includes("is_interactive=1")
        ? "Interactive Animation Loaded"
        : "Narrated Animation Loaded"
      );
    };
  const interactiveSrc = loadedLink && loadedLink.includes("is_interactive=1")
    ? loadedLink
    : INTERACTIVE_URL;
  const narratedSrc = loadedLink && loadedLink.includes("is_interactive=0")
    ? loadedLink
    : NARRATED_URL;
  const showInteractive = !loadedLink || loadedLink.includes("is_interactive=1");
  const showNarrated = !loadedLink || loadedLink.includes("is_interactive=0");
  return (
    <div className="animation-page">
      <div className="animation-loader-card">
        <h3>Load Animation</h3>
        <div className="animation-loader-row">
          <input
            type="text"
            placeholder="Enter Your URL Here"
            value={animationLink}
            onChange={(e) => setAnimationLink(e.target.value)}
            className="animation-input"
          />
          <button
            onClick={handleLoadAnimation}
            className="load-animation-btn">
            Load Animation
          </button>
        </div>
      </div>
      {showInteractive && (
      <div className="animation-row">
        <div className="animation-content">
          <span className="animation-badge">
            Interactive Animation
          </span>
          <h2>Clutch Master Cylinder</h2>
          <p>{Clutch_Description}</p>
          <a
            href={interactiveSrc}
            target="_blank"
            rel="noreferrer"
            className="animation-link">
            View Animation
          </a>
        </div>
        <div className="animation-frame">
          <iframe
            src={interactiveSrc}
            key={interactiveSrc}
            title="Interactive Animation"
            allowFullScreen
          />
        </div>
      </div>
      )}
      {showNarrated && (
      <>
      <hr className="animation-divider" />
      <div className="animation-row reverse">
      <div className="animation-frame">
        <iframe
          src={narratedSrc}
          title="Narrated Animation"
          allowFullScreen />
        </div>
        <div className="animation-content">
          <span className="animation-badge narrated">
          Narrated Animation
          </span>
          <h2>Clutch Master Cylinder</h2>
          <p>{Clutch_Description}</p>
          <a
          href={narratedSrc}
          target="_blank"
          rel="noreferrer"
          className="animation-link">
          View Animation
          </a>
        </div>
      </div>
    </>
   )}
    </div>
  );
}

export default ViewingAnimations;