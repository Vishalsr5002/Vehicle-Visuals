import { useEffect, useState } from "react";
import { apiParameters } from "../config/apiParameters";
import { searchAnimations } from "../services/api";
import { getAnimationShareLink } from "../services/api";
import { updateAnimationLink } from "../services/api";  
import { getAnimationLinkUsage } from "../services/api";
import {
  //getUsageReport,
  getViewedAnimations,
  getUserDetails,
  getApiKey,
  getDynamicLink
} from "../services/api";

export const ParametersPanel = ({
  selectedOption,
  setAnimationUrl,
  formData,
  setFormData,
  apiKey,
  setApiKey,
  handleGetUserPreferences
}) => {
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [results, setResults] = useState([]);
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
  
  const buildAnimationLinks = (partId) => {
    const base = `https://motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}?show_menu=0&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0`;
    return {
      interactive: `${base}&is_interactive=1`,
      narrated: `${base}&is_interactive=0`
    };
  };
  
  //const getAuthData = () => {
    //const username = formData.username || formData.login || formData.subscriber_login_id || "";
    //const password = formData.password || formData.loginPassword || formData.subscriber_password || "";
    //return { username, password };
    // };
    
  const handleRun = async () => {
    if (!selectedOption) return;
    setLoading(true);
    setStatus(null);
    setResults([]);
    try {
      const partId = (formData.partId || "").trim();
      if (selectedOption === "videoDetails") {
        if (!partId) return alert("Part ID is required");
        const { interactive, narrated } = buildAnimationLinks(partId);
        setAnimationUrl({
          type: "dual",
          interactive,
          normal: narrated
        }
      );
    }
    
      else if (selectedOption === "share") {
        if (!partId) return alert("Part ID required");
        const res = await getAnimationShareLink(partId);
        if (!res || !res.video_url) {
          setStatus({ type: "error", msg: "Failed to generate link" });
          return;
        }
        const base = `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}?show_menu=0&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0`;
        setAnimationUrl({
          type: "share",
          data: {
            ...res,
            partId,
            interactive: `${base}&is_interactive=1`,
            narrated: `${base}&is_interactive=0`
          }
        });
      }
      
      else if (selectedOption === "generateLoop") {
        const { login, password, mute } = formData;
        if (!login || !password) {
          alert("Login & Password required");
          return;
        }
        const loopUrl = `https://interim.vehiclevisuals.com/looped-animations.php?username=${login}&password=${password}&mute=${mute || 1}`;
        setAnimationUrl({
          type: "generateLoop",
          url: loopUrl
        });
      }
      
      else if (selectedOption === "update") {
        const res = await updateAnimationLink({
          unique_id: formData.uniqueId,
          job_id: formData.jobId,
          ref_id: formData.referenceId,
          cost: formData.cost,
          track_type: formData.trackType || "email",
          lang: "en_USA"
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
        if(!formData.dateFrom || !formData.dateTo){
           return alert("From Date and To Date Required");
      }
        const res = await getViewedAnimations({
          from_date: formData.from_date || formData.dateFrom,
          to_date: formData.to_date || formData.dateTo,
          unique_id: formData.uniqueId
        });
      console.log("Viewed Animation Response", res);
        setAnimationUrl({
          type: "viewed",
          data: res?.data || []
        });
      }
      else if (selectedOption === "details") {
        const username = formData.username || formData.login || formData.subscriber_login_id;
        const password = formData.password || formData.loginPassword || formData.subscriber_password;
        if (!username || !password) {
          return alert("Username & Password required");
        }
        const res = await getUserDetails(username, password);
        if (!res.status) {
          setStatus({
            type: "error",
            msg: res.message || "Invalid user"
          }
        );
        return;
        }
        setAnimationUrl({
          type: "userDetails",
          data: res.data
        });
      }
      else if (selectedOption === "get") {
        const username = formData.username;
        const password = formData.password;
        if (!username || !password) {
          return alert("Username & Password required");
        }
        const res = await getApiKey(username, password);
        if (!res?.status) {
          setStatus({
            type: "error",
            msg: res?.message || "Failed to get API key"
          });
          return;
        }
        setAnimationUrl({
          type: "apiKey",
          data: res.data
        })
        setApiKey(res?.data.apiKey || "");
      }
      else if (selectedOption === "links") {
        const partId = formData.partId;
        const roNumber = formData.roNumber;
        const apiKeyValue = formData.apiKey || apiKey;
        if (!apiKeyValue) {
          return alert("API Key required");
        }
        if (!partId) {
          return alert("Part ID required");
        }
        const res = await getDynamicLink({
          apiKey : apiKeyValue,
          partId,
          roNumber
        });
        console.log("LINK RESPONSE:", res);
        console.log("LINK DATA:", res?.data);
        if (!res?.status) {
          setStatus({
            type: "error",
            msg: res?.message || "Failed to generate link"
          });
          return;
        }
        setAnimationUrl({
          type: "emailLink",
          interactive: res.data?.interactive,
          narrated: res.data?.narrated,
          shortInteractive: res.data?.shortInteractive,
          shortNarrated: res.data?.shortNarrated
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        msg: err.message || "Something went wrong"
    });
    } finally {
      setLoading(false);
    }
    console.log("Selected Option:", selectedOption);
  };
  const parameters = apiParameters[selectedOption] || [];
  return (
    <div className="search">
      <h3>API Parameters</h3>

      {selectedOption === "preference" && (
        <div className="form-group">
          <label>API Key *</label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter API Key"
          />
        </div>
      )}

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
          onClick={
            selectedOption === "preference"
              ? handleGetUserPreferences
              : handleRun
          }
          disabled={loading}
        >
          {loading ? "Processing..." : "Run API"}
        </button>
      )}

      {status && (
        <div className={`update-status ${status.type}`}>
          {status.msg}

          {results.length > 0 && (
            <div className="getUsageReport-results">
              <pre>{JSON.stringify(results, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
