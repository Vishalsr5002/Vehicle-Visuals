import { useState } from "react";
import {getAnimationShareLink} from "../services/api";
import {updateAnimationLink} from "../services/api";

const ShareLinkPanel = () => {
  const [partId, setPartId] = useState("");
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState("");
  const [refId, setRefId] = useState("");
  const [cost, setCost] = useState("");
  const [trackType, setTrackType] = useState("email");

  // GENERATE SHARE LINK
  const handleGenerate = async () => {
    if (!partId) {
      alert("Please enter Part ID");
      return;
    }
    setLoading(true);
    const res = await getAnimationShareLink(partId);
    setLinks(res || []);
    setLoading(false);
  };

  // UPDATE LINK
  const handleUpdate = async () => {
    if (!links.length) {
      alert("Generate link first");
      return;
    }
    const uniqueIds = links.map((l) => l.unique_id);
    const payload = {
      unique_id: uniqueIds,
      job_id: jobId,
      ref_id: refId,
      cost: cost,
      track_type: trackType
    };

    const res = await updateAnimationLink(payload);
    if (res?.message) {
      alert(res.message);
    } else {
      alert("Update failed");
    }
  };

  return (
    <div className="share-panel">
      <h2>Get Animation Share Link</h2>

      {/* INPUT */}
      <div className="form-group">
        <input
          type="text"
          placeholder="Enter Part ID"
          value={partId}
          onChange={(e) => setPartId(e.target.value)}
        />
        <button onClick={handleGenerate}>
          {loading ? "Loading..." : "Generate Link"}
        </button>
      </div>

      {/* RESULTS */}
      <div className="results">
        {links.length > 0 &&
          links.map((item, index) => (
            <div key={index} className="result-card">
              <h4>{item.video_title}</h4>

              <img
                src={item.banner_url}
                alt="banner"
                className="thumbnail"
              />

              <p>
                <strong>Unique ID:</strong> {item.unique_id}
              </p>

              <a
                href={item.video_url}
                target="_blank"
                rel="noreferrer"
                className="link-btn"
              >
                 View Video
              </a>
            </div>
          ))}
      </div>

      {/* UPDATE SECTION */}
      {links.length > 0 && (
        <div className="update-section">
          <h3>Update Link</h3>

          <div className="form-grid">
            <input
              placeholder="Job ID"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
            />

            <input
              placeholder="Ref ID"
              value={refId}
              onChange={(e) => setRefId(e.target.value)}
            />

            <input
              placeholder="Cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />

            <select
              value={trackType}
              onChange={(e) => setTrackType(e.target.value)}
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
            </select>
          </div>

          <button className="update-btn" onClick={handleUpdate}>
            Update Animation Link
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareLinkPanel;