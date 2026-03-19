import { useState, useEffect } from "react";
import { apiParameters } from "../config/apiParameters";

export const ParametersPanel = ({
  selectedOption,
  setAnimationUrl,
  formData,
  setFormData
}) => {
  //const [formData, setFormData] = useState({});
  useEffect(() => {
  if (!selectedOption) {
    setFormData({});
  }
}, [selectedOption]);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleRun = () => {
  if (!selectedOption) return;
  const partId = formData.part_id;
  if (!partId) {
    alert("Part ID is required");
    return;
  }
  if (selectedOption === "videoDetails") {
    const base = `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}`;
    const commonParams = {
      show_menu: 0,
      show_left_sidebar: 0,
      show_description: 0,
      video_only: 0,
      auto_play: 0
    };

    const interactiveUrl =
      base +
      "?" +
      new URLSearchParams({
        ...commonParams,
        is_interactive: 1
      }).toString();

    const normalUrl =
      base +
      "?" +
      new URLSearchParams({
        ...commonParams,
        is_interactive: 0
      }).toString();
    console.log("Interactive:", interactiveUrl);
    console.log("Normal:", normalUrl);
    setAnimationUrl({
      interactive: interactiveUrl,
      normal: normalUrl
    });
    return;
  }
  const query = new URLSearchParams(formData).toString();
  const baseUrl = "https://dev.motovisuals.com/thirdpartyapi/#!/thirdPartyLogin";
  const finalUrl = `${baseUrl}?${query}`;
  setAnimationUrl(finalUrl);
};
  const parameters = apiParameters[selectedOption] || [];
  return (
    <div className="parameters">
      <h3>API Parameters</h3>

      {!selectedOption && (
        <p>Select API to view parameters</p>
      )}
      {selectedOption && parameters.length === 0 && (
        <p>No parameters available for this API</p>
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
          onClick={handleRun}>
          Run API
        </button>
      )}
    </div>
  );
};
