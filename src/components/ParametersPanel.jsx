import { useEffect } from "react";
import { apiParameters } from "../config/apiParameters";

export const ParametersPanel = ({
  selectedOption,
  setAnimationUrl,
  formData,
  setFormData
}) => {

  useEffect(() => {
    setFormData({});
  }, [selectedOption]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRun = () => {
  if (!selectedOption) return;
  if (selectedOption === "videoDetails") {
    const partId = formData.part_id;
    if (!partId) {
      alert("Part ID is required");
      return;
    }
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
      });
    const normalUrl =
      base +
      "?" +
      new URLSearchParams({
        ...commonParams,
        is_interactive: 0
      });
    setAnimationUrl({
      interactive: interactiveUrl,
      normal: normalUrl,
      showSelection: true
    });
    return;
  }
  const query = new URLSearchParams(formData).toString();
  const baseUrl = "https://dev.motovisuals.com/thirdpartyapi/#!/thirdPartyLogin";
  setAnimationUrl(`${baseUrl}?${query}`);
};
  const parameters = apiParameters[selectedOption] || [];
  return (
    <div className="search">
      <h3>API Parameters</h3>
      {!selectedOption && <p>Select API to view parameters</p>}
      {selectedOption && parameters.length === 0 && (
        <p>No parameters available</p>
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
      )
      )}
      {selectedOption && (
        <button className="submit-Btn" onClick={handleRun}>
          Run API
        </button>
      )}
    </div>
  );
};
