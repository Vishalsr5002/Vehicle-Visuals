import { useEffect, useState } from "react";
import RealTimeClock from "./RealTimeClock";
import { getVideoDetails } from "../services/api";
import { FileText } from "lucide-react";
//import pdfRoutes from "./routes/pdf.js"; 

const AnimationViewer = ({ animationUrl, goBack }) => {
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);
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
    });
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
        }
      }
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
        <p>Loading...</p>
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
          <iframe src={interactiveLink} width="100%" height="400" />
        </div>

        <div className="viewer-box">
          <h4>Narrated</h4>
          <iframe src={narratedLink} width="100%" height="400" />
        </div>
      </div>
    );
  }
  if (animationUrl.type === "share") {
    const data = animationUrl.data;
    if (!data?.video_url) return <p>Invalid Share Data</p>;
    const narratedLink = data.video_url;
    const interactiveLink = data.video_url.includes("is_interactive")
      ? data.video_url.replace("is_interactive=0", "is_interactive=1")
      : data.video_url + "&is_interactive=1";
  
    return (
      <div className="panel">
        <HeaderBar />
        <h3>{data.video_title}</h3>

        <div className="card">
          <p><strong>Unique ID:</strong> {data.unique_id}</p>
          <input value={interactiveLink} readOnly />
          <input value={narratedLink} readOnly />
        </div>

        {videoData?.videoUrl ? (
          <video width="100%" height="350" controls autoPlay>
            <source src={videoData.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <iframe src={interactiveLink} width="100%" height="300" />
        )}
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
            <source src={videoData.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <iframe src={data.url} width="100%" height="400" />
        )}
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
            <iframe src={animationUrl.interactive} width="100%" height="400" />
          </div>

          <div className="viewer-box">
            <h4>Narrated</h4>
            <iframe src={animationUrl.normal} width="100%" height="400" />
          </div>
        </div>
      </div>
    );
  }
  if (animationUrl.type === "usage") {
    const data = animationUrl.data || {};

    return (
      <div className="panel">
        <HeaderBar />
        <h3>Animation Usage</h3>

        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="card">
            <h4>{key}</h4>
            <p>{JSON.stringify(value)}</p>
          </div>
        ))}
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
