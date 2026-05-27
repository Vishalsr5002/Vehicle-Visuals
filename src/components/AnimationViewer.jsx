import { useEffect, useState } from "react";
import RealTimeClock from "./RealTimeClock";
import { getVideoDetails } from "../services/api";
import { FileText } from "lucide-react";
import { trackAnimationView, getViewCount, getViewedReport, generateShortShareLink, getAnimationsWithCounts } from "../services/api";
import { Mail } from "lucide-react";
import { useRef } from "react";

const EmailModal = ({
  showEmailModal,
  setShowEmailModal,
  emailForm,
  setEmailForm,
  handleSendEmail,
  //interactiveLink,
  //narratedLink,
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
        {/* <select
        value={emailForm.animationType}
        onChange={(e) =>
        setEmailForm({
        ...emailForm,
        animationType: e.target.value
    })
  }
>
  <option value="interactive">Interactive</option>
  <option value="narrated">Narrated</option>
  </select> */}
        <label>Animation Link</label>
        <textarea
          rows = "3"
          readOnly
          value ={generatedShortLink}
          />
        <div className="email-actions">
          <button
          onClick={()=>handleSendEmail(generatedShortLink)}
           > Send </button>
          <button
            onClick={() => setShowEmailModal(false)}
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
  const [animationResults, setAnimationResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  //const [selectedDate, setSelectedDate] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({ from: "", to: "", cc: "", subject: ""});
  const [generatedShortLink, setGeneratedShortLink] = useState("");
  const [selectedEmailLink, setSelectedEmailLink] = useState("");
  const [activeAnimation, setActiveAnimation] = useState("");
  const trackingRef = useRef({});
  //const [displayForm, setDisplayForm] = useState({ login: "motovisuals", password: "motovisuals", part_id:"7011", moduleName:"", methodName:"", api_key:"tg2zw99gwqb5", lang:"", is_interactive:"1"});
//   const [tracked, setTracked] = useState({
//     interactive: false,
//     narrated: false
//   }
// )
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
// const interactiveLink = `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}` +
//   `?show_menu=0` +
//   `&is_interactive=1` +
//   `&show_left_sidebar=0` +
//   `&show_description=0` +
//   `&video_only=0`;
// const narratedLink = `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}` +
//   `?show_menu=0` +
//   `&is_interactive=0` +
//   `&show_left_sidebar=0` +
//   `&show_description=0` +
//   `&video_only=0`;
  useEffect(() => {
  if (animationUrl?.type !== "usage" && animationUrl?.type !== "display") return;
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
  const interval = setInterval(fetchCounts, 2000);
  return () => clearInterval(interval);
}, [animationUrl]);

  // useEffect(() => {
  //   setTracked({
  //     interactive: false,
  //     narrated: false
  //   });
  // }, [animationUrl]);
  
  useEffect(() => {
  if (animationUrl?.type !== "viewed") return;
  if (animationUrl?.data) {
    setViewedData(animationUrl.data);
  }
}, [animationUrl]);
// useEffect(() => {
//   const loadAnimations = async () => {
//     if (animationUrl?.type !== "search") return;
//     setSearchLoading(true);
//     try {
//       const results = await getAnimationsWithCounts(
//         animationUrl?.searchTerm || ""
//       );
//       setAnimationResults(results);
//     } catch (err) {
//       console.error("Animation Load Error:", err);
//       setAnimationResults([]);
//     } finally {
//       setSearchLoading(false);
//     }
//   };
//   loadAnimations();
// }, [animationUrl]);
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
    const loadVideo = async () => {
      if (animationUrl?.partId) {
        const res = await getVideoDetails(animationUrl.partId);
        setVideoData(res);
      }};
      loadVideo();
    }, [animationUrl]);
  const handleTrack = async (type, title = "", passedUrl = "") => {
  try {
    let detectedType = type === "interactive"
        ? "interactive"
        : "narrated";
    const job_id = animationUrl?.data?.part_id ||
      animationUrl?.partId ||
      animationUrl?.jobId ||
      "7011";
    const animation_id = animationUrl?.data?.part_id ||
      animationUrl?.partId ||
      animationUrl?.jobId ||
      "7011";
    const video_url = passedUrl || "";
    if (typeof video_url === "string") {
      if (video_url.includes("is_interactive=0")) {
        detectedType = "narrated";
      }
      else if (video_url.includes("is_interactive=1")) {
        detectedType = "interactive";
      }
    }
    const animation_name = title ||
      (detectedType === "interactive"
        ? "Clutch (Interactive Animation)"
        : "Clutch (Narrated Animation)");
    const trackingKey = `${job_id}_${animation_id}_${detectedType}_${video_url}`;
    if (trackingRef.current[trackingKey]) return;
    trackingRef.current[trackingKey] = true;
    console.log("Tracking:", {
      job_id,
      animation_name,
      animation_id,
      type: detectedType,
      video_url
    });
    await trackAnimationView(
      job_id,
      animation_name,
      detectedType,
      animation_id,
      video_url
    );
    console.log("Tracking Success");
  } catch (err) {
    console.error("Track Error:", err);
  }
};
const openAnimation = (type, url, title) => {
  setActiveAnimation(url);
  trackingRef.current._pendingTrack = {
    type,
    title: title || "",
    url: url || ""
  };
};
  const handleGeneratePDF = async () => {
    try {
      const data = animationUrl?.data ||
          animationUrl?.selectedAnimation || {};
      const pdfDescription =
          data?.description ||
          data?.video_description ||
          data?.details_description ||
          data?.animation_description ||
          videoData?.data?.description ||
          videoData?.description ||
          videoData?.video_description ||
          videoData?.details_description ||
          animationUrl?.selectedAnimation?.description ||
          "No Description Available";
            console.log("Sending data:", data);
            console.log("PDF Description", pdfDescription);
            console.log("Video Data", videoData);
      const res = await fetch("http://localhost:5000/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: data.title || "Animation Report",
          //description: pdfDescription,
          leftText: pdfDescription,
          rightText: pdfDescription,
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
  //   const handleTrack = async (type, title = "", passedUrl = "") => {
  //   try {
  //   let detectedType = type === "interactive" ? "interactive" : "narrated";
  //   const job_id = animationUrl?.data?.part_id || animationUrl?.partId ||
  //     animationUrl?.jobId ||
  //     "7011";
  //   const animation_id = animationUrl?.data?.part_id || animationUrl?.partId ||
  //     animationUrl?.jobId ||
  //     "7011";
  //   const video_url = passedUrl || "";
  //   const animation_name = title ||
  //     (detectedType === "interactive"
  //       ? "Clutch (Interactive Animation)"
  //       : "Clutch (Narrated Animation)");
  //   const trackingKey = `${job_id}_${animation_id}_${detectedType}_${video_url}`;
  //   if (trackingRef.current[trackingKey]) return;
  //   trackingRef.current[trackingKey] = true;

  //   console.log("Tracking:", {
  //     job_id,
  //     animation_name,
  //     animation_id,
  //     type: detectedType,
  //     video_url
  //   });
  //   if (typeof video_url === "string") {
  //     if (video_url.includes("is_interactive=0")) {
  //       detectedType = "narrated";
  //     } else if (video_url.includes("is_interactive=1")) {
  //       detectedType = "interactive";
  //     }
  //   }
  //   const finalAnimationName = title ||
  //     (detectedType === "interactive"
  //       ? "Clutch (Interactive Animation)"
  //       : "Clutch (Narrated Animation)");

  //   await trackAnimationView(
  //     job_id,
  //     finalAnimationName,
  //     detectedType,
  //     animation_id,
  //     video_url
  //   );
  // } catch (err) {
  //   console.error("Track Error:", err);
  //   }
  // };
};
    const handleSendEmail = async (selectedLink) => {
      try {
        if (!selectedLink) {
          alert("Animation Link Missing");
          return;
        }
        const shortLinkResponse = await generateShortShareLink(selectedLink);
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
  const HeaderBar = ({
  showActions = true
}) => (
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
    {showActions && (
      <div style={{ display: "flex", gap: "15px" }}>
        <FileText
          size={24}
          style={{ cursor: "pointer" }}
          onClick={handleGeneratePDF}
          title="Generate PDF"
        />
        <Mail
          size={24}
          style={{ cursor: "pointer" }}
          onClick={async () => {
            const selectedLink = animationUrl?.type === "dual"
            ? interactiveLink
            : animationUrl?.selectedAnimation?.url || interactiveLink;
            setSelectedEmailLink(selectedLink);
            const shortLinkResponse = await generateShortShareLink(selectedLink);
            if (!shortLinkResponse?.success) {
              alert("Short URL generation failed");
              return;
            }
            setGeneratedShortLink(
              shortLinkResponse.shortUrl
            );
            setShowEmailModal(true);
          }}
          title="Send Email"
        />
      </div>
    )}
  </div>
);
  const GlobalEmailModal = (
    <EmailModal
      showEmailModal={showEmailModal}
      setShowEmailModal={setShowEmailModal}
      emailForm={emailForm}
      setEmailForm={setEmailForm}
      handleSendEmail={handleSendEmail}
      //interactiveLink={interactiveLink}
      //narratedLink={narratedLink}
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
        {animationUrl?.type === "single" && animationUrl?.selectedAnimation?.url && (
          <iframe
            src={animationUrl.selectedAnimation.url}
            width="100%"
            height="400"
            allowFullScreen
          />
        )}
      </div>
    );
  }
  if (animationUrl.type === "userDetails") {
  const data = animationUrl?.data || {};
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

if (animationUrl?.type === "search") {
  const data = animationUrl?.data || [];
  return (
    <div className="panel">
      <HeaderBar />
      <h3>Search Animations</h3>
      {searchLoading ? (
        <p>Loading Animations</p>
      ) : data.length === 0 ? (
      <p>No Animations Found</p>
    ) : (
        data.map((item, index) => {
          const partId = item.part_id || "7011";
          const interactiveLink = `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}` +
            `?show_menu=0` +
            `&is_interactive=1` +
            `&show_left_sidebar=0` +
            `&show_description=0` +
            `&video_only=0`;
          const narratedLink = `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}` +
            `?show_menu=0` +
            `&is_interactive=0` +
            `&show_left_sidebar=0` +
            `&show_description=0` +
            `&video_only=0`;
          return (
            <div
              key={index}
              className="card"
              style={{ marginBottom: "20px" }}>
              <h4>
                {item.animation_name || item.title || "Animation"}
              </h4>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: "10px"
                }}
              >
                <button
                  onClick={() =>
                    openAnimation(
                      "interactive",
                      interactiveLink,
                      `${item.animation_name} (Interactive Animation)`
                    )}
                >
                  Open Interactive
                </button>
                <button
                  onClick={() =>
                    openAnimation(
                      "narrated",
                      narratedLink,
                      `${item.animation_name} (Narrated Animation)`
                    )
                  }
                >
                  Open Narrated
                </button>
              </div>
              {/* {activeAnimation && (
                <iframe
                  src={activeAnimation}
                  width="100%"
                  height="400"
                  allowFullScreen
                  onLoad={() => {
                    const pending = trackingRef.current._pendingTrack;
                    if (!pending?.type) return;
                    handleTrack(pending.type, pending.title, pending.url);
                    trackingRef.current._pendingTrack = null;
                  }}
                />
              )} */}
            </div>
          );
        })
      )}
      {activeAnimation && (
        <div className="viewer-box">
          <h3>Animation Preview</h3>
          <iframe
          src={activeAnimation}
          width="100%"
          height="500"
          allowFullScreen
          onLoad={() => {
            const pending = trackingRef.current._pendingTrack;
            if (!pending?.type) return;
            handleTrack(
              pending.type,
              pending.title,
              pending.url
            );
            trackingRef.current._pendingTrack = null;
          }}
        />
      </div>
    )}
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
      <HeaderBar showActions={false} />
      {GlobalEmailModal}
      <h2
        style={{
          fontSize: "30px",
          fontWeight: "700",
          marginBottom: "25px"
        }}
      >
        Generated Animation Links
      </h2>
      <div className="share-preview-grid">
        <div className="share-preview-card">
          <div className="share-link-header">
            <h4>Interactive Animation</h4>
            <div className="share-actions">
              <button
                className="copy-btn"
                onClick={() =>
                  navigator.clipboard.writeText(
                    data.shortInteractive || ""
                  )}
              >
                Copy
              </button>
              <button
                className="open-btn"
                onClick={() =>
                  window.open(
                    data.interactive,
                    "_blank"
                  )}
              >
                Open
              </button>
            </div>
          </div>
          <input
            className="share-link-input"
            type="text"
            value={data.shortInteractive || ""}
            readOnly
          />
              <iframe
            src={data.interactive}
            className="preview-frame"
            allowFullScreen
            title="Interactive Animation"
            onLoad={() =>
              handleTrack(
                "interactive",
                "Clutch(Interactive Animation)"
              )}
          />
        </div>
        <div className="share-preview-card">
          <div className="share-link-header">
            <h4>Narrated Animation</h4>
            <div className="share-actions">
              <button
                className="copy-btn"
                onClick={() =>
                  navigator.clipboard.writeText(
                    data.shortNarrated || ""
                  )}
              >
                Copy
              </button>
              <button
                className="open-btn"
                onClick={() =>
                  window.open(
                    data.narrated,
                    "_blank"
                  )}
              >
                Open
              </button>
            </div>
          </div>
          <input
            className="share-link-input"
            type="text"
            value={data.shortNarrated || ""}
            readOnly
          />
          <iframe
            src={data.narrated}
            className="preview-frame"
            allowFullScreen
            title="Narrated Animation"
            onLoad={() =>
              handleTrack(
                "narrated",
                "Clutch(Narrated Animation)"
              )}
          />
        </div>
      </div>
    </div>
  );
}
if (animationUrl.type === "share") {
  const data = animationUrl.data;
  if (!data?.unique_id) {
    return <p>Invalid Share Data</p>;
  }
  return (
    <div className="panel">
      <HeaderBar showActions={false} />
      {GlobalEmailModal}
      <h2
        style={{
          fontSize: "30px",
          fontWeight: "700",
          marginBottom: "25px"
        }}
      >
        {data.video_title || "Animation Share Links"}
      </h2>
      <div className="share-id-card">
        <span className="share-id-label">
          Unique Share ID
        </span>
        <span className="share-id-value">
          {data.unique_id}
        </span>
      </div>
      <div className="share-preview-grid">
        <div className="share-preview-card">
          <div className="share-link-header">
            <h4>Interactive Animation</h4>
            <div className="share-actions">
              <button
                className="copy-btn"
                onClick={() =>
                  navigator.clipboard.writeText(
                    interactiveLink
                  )}
              >
                Copy
              </button>
              <button
                className="open-btn"
                onClick={() =>
                  window.open(
                    interactiveLink,
                    "_blank"
                  )}
              >
                Open
              </button>
            </div>
          </div>
          <input
            className="share-link-input"
            value={interactiveLink}
            readOnly
          />
          <iframe
            src={interactiveLink}
            className="preview-frame"
            allowFullScreen
            onLoad={() =>
              handleTrack(
                "interactive",
                "Clutch(Interactive Animation)"
              )
            }
          />
        </div>
        <div className="share-preview-card">
          <div className="share-link-header">
            <h4>Narrated Animation</h4>
            <div className="share-actions">
              <button
                className="copy-btn"
                onClick={() =>
                  navigator.clipboard.writeText(
                    narratedLink
                  )}
              >
                Copy
              </button>
              <button
                className="open-btn"
                onClick={() =>
                  window.open(
                    narratedLink,
                    "_blank"
                  )}
              >
                Open
              </button>
            </div>
          </div>
          <input
            className="share-link-input"
            value={narratedLink}
            readOnly
          />
          <iframe
            src={narratedLink}
            className="preview-frame"
            allowFullScreen
            onLoad={() =>
              handleTrack(
                "narrated",
                "Clutch(Narrated Animation)"
              )
            }
          />
        </div>
      </div>
    </div>
  );
}
  if (animationUrl.type === "single") {
    const data = animationUrl.selectedAnimation || animationUrl.data;
    return (
      <div className="panel" style={{ textAlign: "center" }}>
        <HeaderBar />
        {GlobalEmailModal}
        <h3>{data.title}</h3>
        {videoData?.videoUrl ? (
          <video width="100%" height="400" controls autoPlay
          onPlay={() => handleTrack(
            data?.type || "interactive",
            data?.title || ""
          )
        }>
          <source
          src={videoData.videoUrl}
          type="video/mp4"
          />
        </video>
        ) : (
          <iframe
            src={data.url}
            width="100%"
            height="400"
            onLoad={() => handleTrack(data?.type || "interactive", data?.title || "", data?.url || "")}
          />
        )}
        <p style={{marginTop: "15px"}}>{data.description}</p>
        </div>
        );
      }
      if (animationUrl.type === "looped" || animationUrl.type === "generateLoop") {
        console.log("Loop Url Recived", animationUrl.url);
        return (
          <div className="panel" style={{ textAlign: "center" }}>
          <HeaderBar showActions={false} />
        {GlobalEmailModal}
        <h3>Looped Animation</h3>
        <a href={animationUrl.url}>
          {animationUrl.url}
        </a>
        <object
        data={animationUrl.url}
        type="text/html"
        width="100%"
        height="700"
        style={{
          border: "none",
          borderRadius: "10px"
          }}
          >
            <p>Loop animation could not be loaded.</p>
            </object>
            </div>
            );
          }
          if (animationUrl.type === "dual") {
            return (
               <div>
                <HeaderBar showActions={false} />
                <RealTimeClock />
                {GlobalEmailModal}
                <div className="dual-view">
          <div className="viewer-box">
            <h4>Interactive</h4>
            <iframe src={animationUrl.interactive}
            width="100%"
            height="400"
            showFullScreen
            onLoad={() => handleTrack("interactive", "Clutch(Interactive Animation", animationUrl.interactive)}
            />
          </div>
          
          <div className="viewer-box">
            <h4>Narrated</h4>
            <iframe
            src={animationUrl.normal}
            width="100%"
            height="400"
            showFullScreen
            onLoad={() => handleTrack("narrated", "Clutch(Narrated Animation)", animationUrl.normal)}
            />
          </div>
        </div>
      </div>
    );
  }
  if (animationUrl.type === "usage") {
  return (
    <div className="panel">
      <HeaderBar showActions={false} />
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
      <HeaderBar showActions={false} />
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
        }))}
    </div>
  );
}

  if (animationUrl.type === "apiKey") {
  const response = animationUrl.data || {};
  return (
    <div className="panel">
      <HeaderBar showActions={false} />
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
        >Copy API Key
        </button>
      </div>
    </div>
  );
}

  if (animationUrl.type === "display") {
  const data = animationUrl.data;
  const pdfDescription = data?.description || data?.video_description || videoData?.description || videoData?.video_description || "No Description Available";
  return (
    <div className="panel">
      <HeaderBar />
      {GlobalEmailModal}
      <h3>{data.title}</h3>
      <div className="viewer-box">
        <iframe
          src={data.url}
          width="100%"
          height="500"
          allowFullScreen
          onLoad={() =>
            handleTrack(
              data.mode,
              data.title,
              data.url
            )
          }
        />
      </div>
      <div className="card">
        <p>
          <strong>Part ID:</strong>
          {" "}
          {data.partId}
        </p>
        <p style={{ marginTop: "15px" }}>
          {pdfDescription}
          </p>
        </div>
      </div>
    );
  }
  if (animationUrl.type === "preferences") {
    const data = animationUrl.data || {};
    return (
    <div className="panel">
      <HeaderBar showActions={false} />
      <h3>User Preferences</h3>
      <div className="card">
        <p>
          <strong>Status:</strong> Success
        </p>
        <p>
          <strong>Language:</strong>{" "}
          {data.default_lang || "N/A"}
        </p>
        <p>
          <strong>Brand:</strong>{" "}
          {data.brand || "N/A"}
        </p>
        <p>
          <strong>DriverSide:</strong>{" "}
          {(data.driverside || "N/A").toUpperCase()}
        </p>
      </div>
    </div>
  );
}
  return (
    <div className="panel">
      <p>Loading Animation</p>
    </div>
  );
};

export default AnimationViewer;
