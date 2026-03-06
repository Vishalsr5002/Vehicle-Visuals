import { useState } from "react";
import { apiParameters } from "../config/apiParameters";

export const ParametersPanel = ({ selectedOption, baseUrl, setAnimationUrl }) => {
  const [formData, setFormData] = useState({});
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const parameters = apiParameters[selectedOption] || [];
  const handleRun = () => {
    const query = new URLSearchParams(formData).toString();
    const finalUrl = `${baseUrl}?${query}`;
    setAnimationUrl(finalUrl);
  };
  return (
    <div className="parameters">
      <h3>API Parameters</h3>
      {parameters.length === 0 && (
        <p>Select API to view parameters</p>
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
            onChange={handleChange} />
        </div>
      ))}
      {parameters.length > 0 && (
        <button
          className="submit-Btn"
          onClick={handleRun}>
          Run API
        </button>
      )}
    </div>
  );
};
