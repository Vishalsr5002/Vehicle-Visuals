import { useEffect, useState } from "react";
import { apiParameters } from "../config/apiParameters";
import { getVideoDetails, searchAnimations } from "../services/api";
//import { getAnimationUrls } from "../services/api";
import { getAnimationShareLink } from "../services/api";
import { updateAnimationLink } from "../services/api";
//import {getVideoDetails } from "../services/api";
import { getAnimationLinkUsage } from "../services/api";

export const ParametersPanel = ({
  selectedOption,
  setAnimationUrl,
  formData,
  setFormData
}) => {
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState(null);
  useEffect(() => {
    setFormData({});
    setResult(null);
    setStatus(null);
  }, [selectedOption]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  useEffect(() => {
    if (selectedOption !== "search") return;
    const timer = setTimeout(() => {
      setDebouncedTerm(formData.term || "");
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.term, selectedOption]);
  useEffect(() => {
    if (selectedOption === "search" && debouncedTerm?.trim()) {
      handleSearch();
    }
  }, [debouncedTerm]);
  const handleSearch = async () => {
    try {
      setLoading(true);
      const results = await searchAnimations(debouncedTerm);
      setAnimationUrl({
        type: "search",
        data: results
      });
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }};
  const handleRun = async () => {
    if (!selectedOption)   
      return;
    setLoading(true);
    setResult(null);
    setStatus(null);
    try {
      if (selectedOption === "videoDetails") {
        const partId = (formData.partId || formData.part_id || "").trim();
        if (!partId) {
          alert("Part ID is required");
          setLoading(false);
          return;
        }
        const interactiveUrl = `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}?show_menu=0&is_interactive=1&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0`;
        const narratedUrl = `https://motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}?show_menu=0&is_interactive=0&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0`;
        setAnimationUrl({
          type: "dual",
          interactive: interactiveUrl,
          normal: narratedUrl
        });
        console.log("Generated URLs:", { interactiveUrl, narratedUrl });
        return;
        //console.log("Form Data:", formData);
      }
      if (selectedOption === "share") {
        const partId = formData.partId || formData.part_id;
        if (!partId) {
          alert("Part ID required");
          return;
        }
        const res = await getAnimationShareLink(partId);
        if (res) {
          setResult(res);
          setAnimationUrl({
            type: "share",
            data: res
          });
        } else {
          setStatus({
            type: "error",
            msg: "Failed to generate share link"
          });
        }}
      if (selectedOption === "update") {
        const payload = {
          unique_id: formData.uniqueId,
          job_id: formData.jobId,
          ref_id: formData.referenceId,
          cost: formData.cost,
          track_type: formData.trackType || "email"
        };
        const res = await updateAnimationLink(payload);
        if (res?.status) {
          setStatus({
            type: "success",
            msg: res.message
          });
        } else {
          setStatus({
            type: "error",
            msg: res?.message || "Update failed"
          });
        }
      }
      if (selectedOption === "usage") {
        const jobId = formData.jobId || formData.job_id;
        if (!jobId) {
          alert("Job ID required");
          setLoading(false);
          return;
        }
        const res = await getAnimationLinkUsage(jobId);
        if(res?.status){
          setResult(res.data);
          setAnimationUrl({
            type: "usage",
            data: res.data
          });
        }
        else {
          setStatus({
            type: "error",
            msg: "Failed to fetch usage data"
          });
        }
        //const res = await getAnimationLinkUsage(jobId);
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        msg: "Something went wrong"
      });
    } finally {
      setLoading(false);
    }
    console.log("Form Data:", formData);
  };
  const parameters = apiParameters[selectedOption] || [];
  return (
    <div className="search">
      <h3>API Parameters</h3>
      {!selectedOption && <p>Select API to view parameters</p>}
      {parameters.map((param) => (
        <div className="form-group" key={param.name}>
          <label>
            {param.label} {param.required && "*"}
          </label>
          <input
            type="text"
            name={param.name}
            value={formData[param.name] || ""}
            onChange={handleChange}
          />
        </div>
      ))}
      {selectedOption && (
        <button
          className={`submit-Btn ${loading ? "loading" : ""}`}
          onClick={handleRun}
          disabled={loading}>
          {loading
            ? "Processing..."
            : selectedOption === "update"
            ? "Update Link"
            : selectedOption === "share"
            ? "Generate Share Link"
            : "Run API"}
        </button>
      )}
      {result && selectedOption === "share" && (
        <div className="share-result-card">
          <h4>{result.video_title}</h4>
          <p><strong>Unique ID:</strong> {result.unique_id}</p>
          <div className="share-link-box">
            <input value={result.video_url} readOnly />
            <button
              className="copy-btn"
              onClick={() =>
                navigator.clipboard.writeText(result.video_url)
              }
            >
              Copy
            </button>
          </div>
        </div>
      )}
      {status && (
        <div
          className={`update-status ${
            status.type === "success"
              ? "update-success"
              : "update-error"
          }`}
        >
          {status.msg}
        </div>
      )}
    </div>
  );
};
