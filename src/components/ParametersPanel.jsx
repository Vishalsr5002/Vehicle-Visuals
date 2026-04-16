import { useEffect, useState } from "react";
import { apiParameters } from "../config/apiParameters";
import {
  searchAnimations,
  getAnimationShareLink,
  updateAnimationLink,
  getAnimationLinkUsage,
  getUsageReport,
  generateLoopedAnimationLink  
} from "../services/api";

export const ParametersPanel = ({
  selectedOption,
  setAnimationUrl,
  formData,
  setFormData
}) => {
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setFormData({});
    setStatus(null);
    setAnimationUrl(null);
  }, [selectedOption]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
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
      const partId = (formData.partId || "").trim();
      if (selectedOption === "videoDetails") {
        if (!partId) return alert("Part ID is required");
        setAnimationUrl({
          type: "dual",
          interactive: `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}?is_interactive=1`,
          normal: `https://motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}?is_interactive=0`
        });
      }
      
      else if (selectedOption === "share") {
        if (!partId) return alert("Part ID required");
        const res = await getAnimationShareLink(partId);
        if (!res || !res.unique_id) {
          setStatus({ type: "error", msg: "Failed to generate link" });
          return;
        }
        setAnimationUrl({
          type: "share",
          data: { ...res, partId }
        });
      }
      else if (selectedOption === "generateLoop") {
        const { login, password, mute } = formData;
        if (!login || !password) {
          alert("Username & Password required");
          return;
        }
        const res = await generateLoopedAnimationLink({
          username: login,
          password: password,
          mute: mute || 1
        });

        console.log("LOOP RESPONSE →", res);

        if (!res || !res.status || !res.url) {
          setStatus({
            type: "error",
            msg: "Failed to generate loop link"
          });
          return;
        }

        setAnimationUrl({
          type: "looped", 
          url: res.url
        });
      }
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
      else if (selectedOption === "usage") {
        if (!formData.jobId) return alert("Job ID required");
        const res = await getAnimationLinkUsage(formData.jobId);
        setAnimationUrl({
          type: "usage",
          data: res?.data || {}
        });
      }
      else if (selectedOption === "viewed") {
        const res = await getUsageReport({
          date_from: formData.dateFrom,
          date_to: formData.dateTo,
          unique_id: formData.uniqueId
        });

        setAnimationUrl({
          type: "viewed",
          data: res?.data || []
        });
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
          {loading ? "Processing..." : "Run API"}
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
