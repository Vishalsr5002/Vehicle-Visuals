import { useEffect, useState } from "react";
import RealTimeClock from "./RealTimeClock";
import { getVideoDetails } from "../services/api";
import { FileText } from "lucide-react";
import { trackAnimationView, getViewCount, getViewedReport, generateShortShareLink } from "../services/api";
import { Mail } from "lucide-react";

const EmailModal = ({
  showEmailModal,
  setShowEmailModal,
  emailForm,
  setEmailForm,
  handleSendEmail,
  interactiveLink,
  narratedLink,
  generatedShortLink
}) => {
  if (!showEmailModal) return null;
  return (
    <div className="email-modal-overlay">
      <div className="email-modal">
        <h2>Email Animation</h2>
        <input
          type="email"
          placeholder="From"
          value={emailForm.from}
          onChange={(e) =>
            setEmailForm({
              ...emailForm,
              from: e.target.value
            })
          }
        />
        <input
          type="email"
          placeholder="To"
          value={emailForm.to}
          onChange={(e) =>
            setEmailForm({
              ...emailForm,
              to: e.target.value
            })
          }
        />
        <input
          type="text"
          placeholder="CC"
          value={emailForm.cc}
          onChange={(e) =>
            setEmailForm({
              ...emailForm,
              cc: e.target.value
            })
          }
        />
        <input
          type="text"
          placeholder="Subject"
          value={emailForm.subject}
          onChange={(e) =>
            setEmailForm({
              ...emailForm,
              subject: e.target.value
            })
          }
        />

        <label>Animation Link</label>
        <textarea
          rows = "4"
          readOnly
          value ={generatedShortLink}
          />
        <div className="email-actions">
          <button
           onClick={() => handleSendEmail(
            emailForm.animationType === "interactive"
            ?interactiveLink
            :narratedLink
           )}
           > Send </button>
          <button
            onClick={() =>
              setShowEmailModal(false)
            }
          >
            Cancel
          </button>

        </div>
      </div>
    </div>
  );
};
const AnimationViewer = ({ animationUrl, goBack }) => {
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [viewedData, setViewedData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({ from: "", to: "", cc: "", subject: "", animationType: "interactive"});
  const [generatedShortLink, setGeneratedShortLink] = useState("");
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
  }
);
  const interactiveLink = animationUrl?.interactive || animationUrl?.data?.interactive || animationUrl?.shortInteractive || animationUrl?.data?.url || "";
  const narratedLink = animationUrl?.narrated || animationUrl?.data?.narrated || animationUrl?.shortNarrated || animationUrl?.data?.url || "";
// const partId = animationUrl?.data?.part_id || animationUrl?.partId || "7011";
// const interactiveLink =
//   `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}` +
//   `?show_menu=0` +
//   `&is_interactive=1` +
//   `&show_left_sidebar=0` +
//   `&show_description=0` +
//   `&video_only=0`;
// const narratedLink =
//   `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}` +
//   `?show_menu=0` +
//   `&is_interactive=0` +
//   `&show_left_sidebar=0` +
//   `&show_description=0` +
//   `&video_only=0`;
  useEffect(() => {
  if (animationUrl?.type !== "usage") return;
  const fetchCounts = async () => {
    try {
      const id = animationUrl?.jobId || animationUrl?.partId || "7011";
      const response = await getViewCount(id);
      console.log("View Count Response:",response);
      setLiveCount({
        interactive: response?.interactive || 0,
        narrated: response?.narrated || 0
      });
    } catch (err) {
      console.error("Count Error:", err);
    }
  };
  fetchCounts();
  const interval = setInterval(
    fetchCounts, 2000
  );
  return () => clearInterval(interval);
}, [animationUrl]);
  useEffect(() => {
    setTracked({
      interactive: false,
      narrated: false
    });
  }, [animationUrl]);
  useEffect(() => {
  if (animationUrl?.type !== "viewed") return;
  if (animationUrl?.data) {
    setViewedData(animationUrl.data);
  }
}, [animationUrl]);
  useEffect(() => {
  if (animationUrl?.type !== "share") return;
  const id = animationUrl?.data?.unique_id;
  //const url = animationUrl?.data?.video_url;
  if (!id) return;
  //const fetchCounts = async () => {
    //const counts = await getViewCount(id);
    //setLiveCount(counts);
    //setViewCount(counts);};
  //fetchCounts();
  //const interval = setInterval(fetchCounts, 2000);
  //return () => clearInterval(interval);
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
  
  const handleTrack = async (type, title = "") => {
  try {
    if (tracked[type]) return;
    const job_id =
      animationUrl?.data?.part_id ||
      animationUrl?.partId ||
      animationUrl?.jobId ||
      "7011";

    const animation_id =
      animationUrl?.data?.part_id ||
      animationUrl?.partId ||
      "7011";

    let animation_name = "";
    if (type === "interactive") {
      animation_name = title || "Clutch (Interactive Animation)";
    } else {
      animation_name = title || "Clutch (Narrated Animation)";
    }
    let video_url = "";
    if (type === "interactive") {
      video_url =
        animationUrl?.interactive ||
        animationUrl?.data?.interactive ||
        animationUrl?.shortInteractive ||
        "";
    } else {
      video_url =
        animationUrl?.narrated ||
        animationUrl?.data?.narrated ||
        animationUrl?.shortNarrated ||
        animationUrl?.normal ||
        "";
    }
    
    console.log("Tracking:", {
      job_id,
      animation_name,
      animation_id,
      type,
      video_url
    });
    
    await trackAnimationView(
      job_id,
      animation_name,
      type,
      animation_id,
      video_url
    );

    setTracked((prev) => ({
      ...prev,
      [type]: true
    }));
  } catch (err) {
    console.error("Track Error:", err);
  }
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
          rightText: data.description || "Default right content",
          image1: data.image1 || "http://localhost:5173/carimg.jpg",
          image2: data.image2 || "http://localhost:5173/spares.jpg"
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
//   const generateShortLink = async (
//     originalLink
//   ) => {
//   try {
//     const response = await fetch(
//       "http://localhost:5000/api/generate-share-link",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type":
//             "application/json"
//         },
//         body: JSON.stringify({
//           animationLink: originalLink
//         })
//       }
//     );
//     const data = await response.json();
//     console.log("SHORT LINK DATA:",data);
//     if (data.success) {
//       setGeneratedShortLink(
//         data.shortUrl
//       );
//     } else {
//       alert("Short URL generation failed");
//     }

//   } catch (err) {
//     console.error("SHORT LINK ERROR:", err);
//   }
// };
    const handleSendEmail = async (animationLink) => {
  try {
    const shortLinkResponse = await generateShortShareLink(animationLink);
    if (!shortLinkResponse.success) {
      alert("Short URL generation failed");
      return;
    }
    const shortUrl = shortLinkResponse.shortUrl;
    console.log("Generated Short URL:", shortUrl);
    const response = await fetch(
      "http://localhost:5000/api/send-animation-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...emailForm,
          animationLink: shortUrl
        })
      }
    );
    const data = await response.json();
    if (data.success) {
      alert("Email Sent Successfully");
      setShowEmailModal(false);
    } else {
      alert("Email Failed");
    }
  } catch (err) {
    console.error(err);
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
      }> Back</button>
      <FileText
        size={24}
        style={{ cursor: "pointer" }}
        onClick={handleGeneratePDF}
        title="Generate PDF"
      />
      <Mail
        size={24}
        style={{ cursor: "pointer", marginLeft: "15px" }}
        onClick={async () => {
          setShowEmailModal(true);
          const selectedLink = emailForm.animationType === "interactive"
      ? interactiveLink
      : narratedLink;

  const shortLinkResponse =
    await generateShortShareLink(
      selectedLink
    );
  if (shortLinkResponse.success) {
    setGeneratedShortLink(
      shortLinkResponse.shortUrl
    );
  } else {
    alert("Short URL generation failed");
  }
}}
        title="Send Email"
        />
    </div>
  );
   const GlobalEmailModal = (
    <EmailModal
      showEmailModal={showEmailModal}
      setShowEmailModal={setShowEmailModal}
      emailForm={emailForm}
      setEmailForm={setEmailForm}
      handleSendEmail={handleSendEmail}
      interactiveLink={interactiveLink}
      narratedLink={narratedLink}
      generatedShortLink={generatedShortLink}
    />
  );
  
  if (!animationUrl) {
    return (
      <div className="animation-box">
        <strong><p>Select an Animation to Preview</p></strong>
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
  //const data = animationUrl.data || {};
  const data = Array.isArray(animationUrl?.data)
  ? animationUrl.data : [];
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

//   if (animationUrl.type === "search") {
//   const data = animationUrl.data || [];
//   if (data.length === 0) {
//     return (
//       <div className="panel">
//         <HeaderBar />
//         <h3>No Animations Found</h3>
//       </div>
//     );
//   }
//   return (
//     <div className="panel">
//       <HeaderBar />
//       <h3>Animation Preview</h3>
//       {data.map((item, index) => {
//         const partId =
//           item.part_id ||
//           item.partId ||
//           "7011";
//         const interactiveLink = `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}` +
//           `?is_interactive=1`;
//         const narratedLink = `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}` +
//           `?is_interactive=0`;
//         return (
//           <div
//             key={index}
//             className="card"
//             style={{ marginBottom: "20px" }}
//           >
//             <h3>
//               {item.animation_name ||
//                 item.title ||
//                 "Animation"}
//             </h3>
//             <div className="viewer-box">
//               <h4>Interactive</h4>
//               <iframe
//                 src={interactiveLink}
//                 width="100%"
//                 height="400"
//                 onLoad={() =>
//                   handleTrack(
//                     "interactive",
//                     `${item.animation_name || "Animation"} (Interactive Animation)`
//                   )
//                 }
//               />
//             </div>
//             <div className="viewer-box">
//               <h4>Narrated</h4>
//               <iframe
//                 src={narratedLink}
//                 width="100%"
//                 height="400"
//                 onLoad={() =>
//                   handleTrack(
//                     "narrated",
//                     `${item.animation_name || "Animation"} (Narrated Animation)`
//                   )
//                 }
//               />
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

  if (animationUrl?.type === "emailLink") {
  const data = animationUrl || {};
  return (
    <div className="panel">
      <HeaderBar />
      {GlobalEmailModal}
      <h3>Generated Animation Links</h3>
      <div className="viewer-box">
        <h4>Clutch (Interactive Animation)</h4>
        <input
          type="text"
          value={data.shortInteractive || ""}
          readOnly
        />
        <div
          style={{
            display: "flex",
            gap: "10px",
            margin: "10px 0"
          }}
        >
          <button
            onClick={() =>
              navigator.clipboard.writeText(
                data.shortInteractive || ""
              )
            }
          >
            Copy
          </button>
          <a
            href={data.interactive}
            target="_blank"
            rel="noreferrer"
          >
            <button>Open</button>
          </a>
        </div>
        
        <iframe
          src={data.interactive}
          width="100%"
          height="300"
          allowFullScreen
          title="Interactive Animation"
          onLoad={() => handleTrack("interactive", "Clutch(Interactive Animation)")}
        />
      </div>
      <div className="viewer-box">
        <h4>Clutch (Narrated Animation)</h4>
        <input
          type="text"
          value={data.shortNarrated || ""}
          readOnly
        />
        
        <div
          style={{
            display: "flex",
            gap: "10px",
            margin: "10px 0"
          }}
        >
          <button
            onClick={() =>
              navigator.clipboard.writeText(
                data.shortNarrated || ""
              )
            }>
            Copy
          </button>
          <a
            href={data.narrated}
            target="_blank"
            rel="noreferrer">
            <button>Open</button>
          </a>
        </div>
        <iframe
          src={data.narrated}
          width="100%"
          height="300"
          allowFullScreen
          title="Narrated Animation"
          onLoad={() => handleTrack("narrated", "Clutch(Narrated Animation)")}
        />
      </div>
    </div>
  );
}
if (animationUrl.type === "share") {
  const data = animationUrl.data;
  if (!data?.unique_id) {
    return <p>Invalid Share Data</p>;
  }
  // const base = `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${data.part_id || "7011"}`;
  // const interactiveLink = `${base}` +
  //   `?show_menu=0` +
  //   `&is_interactive=1` +
  //   `&show_left_sidebar=0` +
  //   `&show_description=0` +
  //   `&video_only=0` +
  //   `&auto_play=0`;
  // const narratedLink = `${base}` +
  //   `?show_menu=0` +
  //   `&is_interactive=0` +
  //   `&show_left_sidebar=0` +
  //   `&show_description=0` +
  //   `&video_only=0` +
  //   `&auto_play=0`;

  return (
    <div className="panel">
      <HeaderBar />
      {GlobalEmailModal}
      <h3>{data.video_title || "Animation Share Links"}</h3>
      <div className="card">
        <p>
          <strong>Unique ID:</strong> {data.unique_id}
        </p>
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
          allowFullScreen
          onLoad={() => handleTrack("interactive", "Clutch(Interactive Animation)")}
        />
      </div>
      
      <div className="viewer-box">
        <h4>Narrated Animation</h4>
        
        <iframe
          src={narratedLink}
          width="100%"
          height="300"
          allowFullScreen
          onLoad={() => handleTrack("narrated", "Clutch(Narrated Animation)")}
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
        {GlobalEmailModal}
        <h3>{data.title}</h3>
        {videoData?.videoUrl ? (
          <video width="100%" height="400" controls autoPlay>
            <source src={videoData.videoUrl} type="video/mp4"
            //onPlay={() => trackAnimationView(animationUrl.partId, "interactive")} />
            onPlay={() => handleTrack("interactive")} />
          </video>
        ) : (
          <iframe 
          src={data.url} 
          width="100%" 
          height="400"
          onLoad={() => handleTrack("interactive")}
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
        {GlobalEmailModal}
        <h3>Looped Animation</h3>
        <a href={animationUrl.url} target="_blank" rel="noreferrer">
          {animationUrl.url}
        </a>
        <iframe 
        src={animationUrl.url} 
        width="80%"
        height="400"
        allowFullScreen
        //showFullScreen
        onLoad={() => handleTrack("interactive")}
        />
      </div>
    );
  }
  
  if (animationUrl.type === "dual") {
    return (
      <div>
        <HeaderBar />
        <RealTimeClock />
        {GlobalEmailModal}
        <div className="dual-view">
          <div className="viewer-box">
            <h4>Interactive</h4>
            <iframe src={animationUrl.interactive} 
            width="100%" 
            height="400"
            showFullScreen
            onLoad={() => handleTrack("interactive")}
            />
          </div>
          
          <div className="viewer-box">
            <h4>Narrated</h4>
            <iframe
            src={animationUrl.normal} 
            width="100%" 
            height="400"
            showFullScreen 
            onLoad={() => handleTrack("narrated")}
            />
          </div>
        </div>
      </div>
    );
  }
  
  if (animationUrl.type === "usage") {
  return (
    <div className="panel">
      <HeaderBar />
      {GlobalEmailModal}
      <h3>Animation Link Usage</h3>
      <div className="card">
        <h4>Live View Count</h4>
        <p>
          <strong>Interactive:</strong>{" "}
          {liveCount.interactive}
        </p>
        <p>
          <strong>Narrated:</strong>{" "}
          {liveCount.narrated}
        </p>
      </div>
    </div>
  );
}

  if (animationUrl.type === "viewed") {
  const data = Array.isArray(animationUrl?.data)
    ? animationUrl.data
    : [];
  return (
    <div className="panel">
      <HeaderBar />
      {GlobalEmailModal}
      <h3>Viewed Animations Report</h3>
      {data.length === 0 ? (
        <div className="card">
          <p>No viewed animations found</p>
        </div>
      ):(
        data.map((item, index) => {
          const dateObj = new Date(
            item.track_date_time
          );
          return (
            <div
              key={index}
              className="card"
              style={{
                marginBottom: "15px",
                padding: "15px"
              }}
            >
              <p>
                <strong>Animation:</strong>{" "}
                {item.animation_name}
              </p>
              <p>
                <strong>Type:</strong>{" "}
                {item.type}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {dateObj.toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {dateObj.toLocaleTimeString()}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
}

  if (animationUrl.type === "apiKey") {
  const response = animationUrl.data || {};
  return (
    <div className="panel">
      <HeaderBar />
      {GlobalEmailModal}
      <h3>API Key</h3>
      <div className="card">
        <p>
          <strong>Status:</strong>{" "}
          {response.api_key ? "Success" : "Failed"}
        </p>
        <p>
          <strong>API Key:</strong>{" "}
          {response.api_key || "No API Key"}
        </p>
        <button
        className="submit-Btn"
          onClick={() =>
            navigator.clipboard.writeText(
              response.api_key || ""
            )
          }
        >
          Copy API Key
        </button>
      </div>
    </div>
  );
} 

  return <p>Unsupported</p>;
};

export default AnimationViewer;
