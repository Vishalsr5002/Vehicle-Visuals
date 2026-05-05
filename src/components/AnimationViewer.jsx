import { useEffect, useState } from "react";
import RealTimeClock from "./RealTimeClock";
import { getVideoDetails } from "../services/api";
import { FileText } from "lucide-react";
import { trackAnimationView, getViewCount } from "../services/api";

const AnimationViewer = ({ animationUrl, goBack }) => {
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [tracked, setTracked] = useState({
    interactive: false,
    narrated: false
  }
)
  const [viewCount, setViewCount] = useState({
    interactive: 0, 
    narrated: 0
  }
);
  const [liveCount, setLiveCount] = useState({
    interactive: 0,
    narrated: 0
  });
  useEffect(() => {
  if (animationUrl?.type !== "usage") return;
  const id = animationUrl?.jobId;
  if (!id) return;
  const fetchCounts = async () => {
    const counts = await getViewCount(id);
    setLiveCount(counts);
  };
  fetchCounts();
  const interval = setInterval(fetchCounts, 2000);
  return () => clearInterval(interval);
}, [animationUrl]);
  useEffect(() => {
  if (animationUrl?.type !== "share") return;
  const id = animationUrl?.data?.unique_id;
  //const url = animationUrl?.data?.video_url;
  if (!id) return;
  const fetchCounts = async () => {
    const counts = await getViewCount(id);
    setViewCount(counts);
  };
  fetchCounts();
  const interval = setInterval(fetchCounts, 2000);
  return () => clearInterval(interval);
}, [animationUrl]);
  useEffect(() => {
    if (!animationUrl) return;
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [animationUrl]);

  useEffect(() => {
    const loadVideo = async () => {
      if (animationUrl?.partId) {
        const res = await getVideoDetails(animationUrl.partId);
        setVideoData(res);
      }
    };
    loadVideo();
  }, [animationUrl]);
  const handleTrack = (type) => {
  if (!data?.unique_id) return;
  if (tracked[type]) return;

  trackAnimationView(data.unique_id, type);

  setTracked(prev => ({
    ...prev,
    [type]: true
  }));
};
  const handleGeneratePDF = async () => {
    try {
      const data = animationUrl?.data || {};
      console.log("Sending data:", data);
      const res = await fetch("http://localhost:5000/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: data.title || "Animation Report",
          leftText: data.description || "Default left content",
          rightText: "Default right content",
          image1:
            data.image1 || "http://localhost:5173/carimg.jpg",
          image2:
            data.image2 || "http://localhost:5173/spares.jpg"
        })
      }
    );
      if (!res.ok) {
        const errText = await res.text();
        console.error("Server error:", errText);
        alert("PDF generation failed");
        return;
      }
      const blob = await res.blob();
      const fileURL = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = fileURL;
      a.download = "animation-report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("PDF error:", err);
      alert("Something went wrong");
    }
  };

  const HeaderBar = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px"
      }}
    >
      <button
        onClick={goBack}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          border: "none",
          background: "#333",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        Back
      </button>

      <FileText
        size={24}
        style={{ cursor: "pointer" }}
        onClick={handleGeneratePDF}
        title="Generate PDF"
      />
    </div>
  );

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
  if (animationUrl.type === "userDetails") {
  const data = animationUrl.data || {};
  return (
    <div className="panel">
      <h3>User Details</h3>
      <div className="card">
        <p>
          <strong>Status:</strong>{" "}
          {data.status ? "Valid User" : "Invalid User"}
        </p>

        <p>
          <strong>Message:</strong> {data.message || "No message"}
        </p>
      </div>
    </div>
  );
}
  
  if (animationUrl.type === "search") {
    const interactiveLink = "https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/7011?is_interactive=1";
    const narratedLink = "https://motovisuals.com/thirdpartyapi/#!/viewAnimation/7011?is_interactive=0";
    return (
      <div className="panel">
        <HeaderBar />
        <h3>Animation Preview</h3>
        <div className="viewer-box">
          <h4>Interactive</h4>
          <iframe 
          src={interactiveLink}
          width="100%"
          height="400"
          onLoad={() => trackAnimationView("search", "interactive")} 
          />
        </div>
        <div className="viewer-box">
          <h4>Narrated</h4>
          <iframe src={narratedLink} 
          width="100%" 
          height="400"
          onLoad={() => trackAnimationView("search", "narrated")} 
          />
        </div>
      </div>
    );
  }
  if (animationUrl?.type === "emailLink") {
  const data = animationUrl || {};
  return (
    <div className="panel">
      <HeaderBar />
      <h3>Generated Animation Links</h3>
      <div className="viewer-box">
        <h4>Clutch (Interactive Animation)</h4>
        <input
          type="text"
          value={data.shortInteractive || ""}
          readOnly
        />
        <div>
          <button onClick={() => navigator.clipboard.writeText(data.shortInteractive || "")}>
            Copy
          </button>
          <a href={data.interactive} target="_blank" rel="noreferrer">
            <button>Open</button>
          </a>
        </div>
        <iframe
          src={data.interactive}
          width="100%"
          height="300"
          allowFullScreen
          onLoad={() => trackAnimationView(data.id || "emailLink", "interactive")}
        />
      </div>
      <div className="viewer-box">
        <h4>Clutch (Narrated Animation)</h4>
        <input
          type="text"
          value={data.shortNarrated || ""}
          readOnly
        />
        <div>
          <button onClick={() => navigator.clipboard.writeText(data.shortNarrated || "")}>
            Copy
          </button>
          <a href={data.narrated} target="_blank" rel="noreferrer">
            <button>Open</button>
          </a>
        </div>
        <iframe
          src={data.narrated}
          width="100%"
          height="300"
          allowFullScreen
          onLoad={() => trackAnimationView(data.id ||"emailLink", "narrated")}
        />
      </div>
    </div>
  );
}

if (animationUrl.type === "share") {
  const data = animationUrl.data;
  if (!data?.video_url) return <p>Invalid Share Data</p>;
  //const narratedLink = data.video_url;
  const baseUrl = data.video_url;
  const interactiveLink = `${baseUrl}&is_interactive=1&_t=${Date.now()}`;
  const narratedLink = `${baseUrl}&is_interactive=0&_t=${Date.now()}`;
  //const interactiveLink = data.video_url.includes("is_interactive")
    //? data.video_url.replace("is_interactive=0", "is_interactive=1")
    //: data.video_url + "&is_interactive=1";
  const handleTrack = (type) => {
    if (data?.unique_id) {
      trackAnimationView(data.unique_id, type);
      //console.log(`Tracked ${type} view for ID:`, data.unique_id);
    }
  };
  //useEffect(() => {
    //if (!data?.unique_id) return;
    //const fetchCounts = async () => {
      //const counts = await getViewCount(data.unique_id);
      //setViewCount(counts);
    //};
    //fetchCounts();
    //const interval = setInterval(fetchCounts, 2000);
    //return () => clearInterval(interval);
  //}, [data?.unique_id]);

  return (
    <div className="panel">
      <HeaderBar />
      <h3>{data.video_title}</h3>

      <div className="card">
        <p><strong>Unique ID:</strong> {data.unique_id}</p>
        <h4>Interactive URL</h4>
        <input value={interactiveLink} readOnly />
        <h4>Narrated URL</h4>
        <input value={narratedLink} readOnly />
      </div>

      <div className="viewer-box">
        <h4>Interactive Animation</h4>
        <iframe
          src={interactiveLink}
          width="100%"
          height="300"
          onLoad={() => handleTrack("interactive")}
        />
      </div>

      <div className="viewer-box">
        <h4>Narrated Animation</h4>
        <iframe
          src={narratedLink}
          width="100%"
          height="300"
          onLoad={() => handleTrack("narrated")}
        />
      </div>
    </div>
  );
}

  if (animationUrl.type === "single") {
    const data = animationUrl.data;
    return (
      <div className="panel" style={{ textAlign: "center" }}>
        <HeaderBar />
        <h3>{data.title}</h3>
        {videoData?.videoUrl ? (
          <video width="100%" height="400" controls autoPlay>
            <source src={videoData.videoUrl} type="video/mp4"
            onPlay={() => trackAnimationView(animationUrl.partId, "interactive")} />
          </video>
        ) : (
          <iframe 
          src={data.url} 
          width="100%" 
          height="400"
          onLoad={() => trackAnimationView(animationUrl.partId, "narrated")}
          />
        )
      }
      <p style={{ marginTop: "15px" }}>{data.description}</p>
      </div>
    );
  }

  if (animationUrl.type === "looped") {
    return (
      <div className="panel" style={{ textAlign: "center" }}>
        <HeaderBar />
        <h3>Looped Animation</h3>
        <a href={animationUrl.url} target="_blank" rel="noreferrer">
          {animationUrl.url}
        </a>
        <iframe 
        src={animationUrl.url} 
        width="80%" 
        height="400"
        showFullScreen
        onLoad={() => trackAnimationView("looped", "interactive")}
        />
      </div>
    );
  }

  if (animationUrl.type === "dual") {
    return (
      <div>
        <HeaderBar />
        <RealTimeClock />
        <div className="dual-view">
          <div className="viewer-box">
            <h4>Interactive</h4>
            <iframe src={animationUrl.interactive} 
            width="100%" 
            height="400"
            onLoad={() => trackAnimationView("dual", "interactive")}
            />
          </div>

          <div className="viewer-box">
            <h4>Narrated</h4>
            <iframe 
            src={animationUrl.normal} 
            width="100%" 
            height="400" 
            onLoad={() => trackAnimationView("dual", "narrated")}
            />
          </div>
        </div>
      </div>
    );
  }

  if (animationUrl.type === "usage") {
  //useEffect(() => {
    //if (!animationUrl?.jobId) return;
    //const fetchCounts = async () => {
      //const counts = await getViewCount(animationUrl.jobId);
      //setLiveCount(counts);};
    //fetchCounts();
    //const interval = setInterval(fetchCounts, 2000);
    //return () => clearInterval(interval);
  //}, [animationUrl?.jobId]);
  return (
    <div className="panel">
      <HeaderBar />
      <h3>Animation Usage</h3>
      <div className="card">
        <h4>View Counts</h4>
        <p><strong>Clutch Interactive:</strong> {liveCount.interactive}</p>
        <p><strong>Clutch Narrated:</strong> {liveCount.narrated}</p>
      </div>
    </div>
  );
}

  if (animationUrl.type === "viewed") {
    const data = animationUrl.data || [];
    return (
      <div className="panel">
        <HeaderBar />
        <h3>Viewed Animations</h3>

        {data.map((item) => (
          <div key={item.id} className="card">
            <h4>{item.animation_name}</h4>
            <p>{new Date(item.track_date_time).toLocaleString()}</p>

            <iframe
              src={`https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${item.animation_id}?is_interactive=1`}
              width="100%"
              height="200"
            />
          </div>
        ))}
      </div>
    );
  }
  return <p>Unsupported</p>;
};

export default AnimationViewer;
