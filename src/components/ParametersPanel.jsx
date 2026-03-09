import { useState, useEffect } from "react";
import { apiParameters } from "../config/apiParameters";

export const ParametersPanel = ({
  selectedOption,
  selectedApi,
  setAnimationUrl
}) => {
  const [formData, setFormData] = useState({});
  useEffect(() => {
    if (selectedApi) {
      setFormData(selectedApi.params);
    } else {
      setFormData({});
    }
  }, [selectedApi]);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleRun = () => {
    if (selectedApi) {
      const query = new URLSearchParams(formData).toString();
      const finalUrl = `${selectedApi.url}?${query}`;
      setAnimationUrl(finalUrl);
    }
  };
  const parameters =
    selectedApi
      ? Object.keys(selectedApi.params)
      : (apiParameters[selectedOption] || []);
  return (
    <div className="parameters">
      <h3>API Parameters</h3>
      {parameters.length === 0 && (
        <p>Select API to view parameters</p>
      )}
      {selectedApi && Object.entries(formData).map(([key, value]) => (
        <div className="form-group" key={key}>
          <label>{key}</label>
          <input
            type="text"
            name={key}
            value={value}
            onChange={handleChange}
          />
        </div>
      ))}
      {!selectedApi && parameters.map((param) => (
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
      {selectedApi && (
        <button
          className="submit-Btn"
          onClick={handleRun}>
          Run API
        </button>
      )}
    </div>
  );
};
