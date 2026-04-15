import { useEffect, useState } from "react";
import { apiParameters } from "../config/apiParameters";
import { searchAnimations } from "../services/api";
import { getAnimationShareLink } from "../services/api";
import { updateAnimationLink } from "../services/api";
import { getAnimationLinkUsage } from "../services/api";
import { getUsageReport } from "../services/api";

export const ParametersPanel = ({
  selectedOption,
  setAnimationUrl,
  formData,
  setFormData
}) => {
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  // Reset on API change
  useEffect(() => {
    setFormData({});
    setStatus(null);
    setAnimationUrl(null);
  }, [selectedOption]);

  // Handle input
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  // Debounce search 
  useEffect(() => {
    if (selectedOption !== "search") return;
    const timer = setTimeout(() => {
      setDebouncedTerm(formData.term || "");
    }, 300);
    return () => clearTimeout(timer);
  }, [formData.term, selectedOption]);

  useEffect(() => {
    if (selectedOption === "search" && debouncedTerm.trim()) {
      handleSearch();
    }
  }, [debouncedTerm]);
  const handleSearch = async () => {
    try {
      setLoading(true);
      const results = await searchAnimations(debouncedTerm);
      setAnimationUrl({
        type: "search",
        data: results || []
      });
    } catch (err) {
      console.error(err);
      setAnimationUrl({ type: "search", data: [] });
    } finally {
      setLoading(false);
    }
  };
  const handleRun = async () => {
    if (!selectedOption) return;
    setLoading(true);
    setStatus(null);
    try {
      const partId = (formData.partId || formData.part_id || "").trim();
      // VIDEO DETAILS
      if (selectedOption === "videoDetails") {
        if (!partId) {
          alert("Part ID is required");
          return;
        }
        setAnimationUrl({
          type: "dual",
          interactive: `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}?show_menu=0&is_interactive=1&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0`,
          normal: `https://motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}?show_menu=0&is_interactive=0&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0`
        });
      }
      else if (selectedOption === "share") {
        if (!partId) {
          alert("Part ID required");
          return;
        }
        const res = await getAnimationShareLink(partId);
        if (res && res.unique_id) {
          setAnimationUrl({
            type: "share",
            data: res
          });
        } else {
          setStatus({ type: "error", msg: "Failed to generate link" });
        }
      }
      // UPDATE
      else if (selectedOption === "update") {
        const res = await updateAnimationLink({
          unique_id: formData.uniqueId,
          job_id: formData.jobId,
          ref_id: formData.referenceId,
          cost: formData.cost,
          track_type: formData.trackType || "email"
        });
        setStatus({
          type: res?.status ? "success" : "error",
          msg: res?.message || "Update failed"
        });
      }
      // USAGE
      else if (selectedOption === "usage") {
        const jobId = formData.jobId || formData.job_id;
        if (!jobId) {
          alert("Job ID required");
          return;
        }
        const res = await getAnimationLinkUsage(jobId);
        if (res?.status) {
          setAnimationUrl({
            type: "usage",
            data: res.data
          });
        } else {
          setAnimationUrl({ type: "usage", data: {} });
          setStatus({ type: "error", msg: "No usage found" });
        }
      }

      // VIEWED REPORT
      else if (selectedOption === "viewed") {
        const res = await getUsageReport({
          date_from: formData.dateFrom,
          date_to: formData.dateTo,
          unique_id: formData.uniqueId
        });
        if (res?.status) {
          setAnimationUrl({
            type: "viewed",
            data: res.data
          });
        } else {
          setAnimationUrl({ type: "viewed", data: [] });
          setStatus({ type: "error", msg: "No report found" });
        }
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", msg: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };
  const parameters = apiParameters[selectedOption] || [];
  return (
    <div className="search">
      <h3>API Parameters</h3>

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
          className="submit-Btn"
          onClick={handleRun}
          disabled={loading}
        >
          {loading ? "Processing" : "Run API"}
        </button>
      )}
      {status && (
        <div className={`update-status ${status.type}`}>
          {status.msg}
        </div>
      )}
    </div>
  );
};
