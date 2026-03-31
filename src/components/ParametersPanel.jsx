import { useEffect, useState } from "react";
import { apiParameters } from "../config/apiParameters";
import { searchAnimations, getAnimationUrls } from "../services/api";
import { getStreamingVideo } from "../services/api";
export const ParametersPanel = ({
  selectedOption,
  setAnimationUrl,
  formData,
  setFormData
}) => {
  const [debouncedTerm, setDebouncedTerm] = useState("");
  useEffect(() => {
    setFormData({});
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
      const results = await searchAnimations(debouncedTerm);
      setAnimationUrl({
        type: "search",
        data: results
      });
    } catch (error) {
      console.error("Search error:", error);
    }
  };

const handleRun = async() => {
  if (!selectedOption) return;
  if (selectedOption === "videoDetails") {
    const partId = formData.part_id;
    if (!partId) {
      alert("Part ID is required");
      return;
    }
    const stream = getStreamingVideo (partId);
    if (stream?.videourl){
      setAnimationUrl({
        type: "single",
        url: stream.video_url
      });
    } else {
      console.error("Streaming failed");
    }}
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
        <button className="submit-Btn" onClick={handleRun}>
          Run API
        </button>
    </div>
  );
};
