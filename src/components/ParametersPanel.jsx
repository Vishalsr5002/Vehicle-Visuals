import { useEffect, useState } from "react";
import { apiParameters } from "../config/apiParameters";
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
  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    if (selectedOption !== "search") return;
    const timer = setTimeout(() => {
      setDebouncedTerm(formData.term);
    }, 500); 
    return () => clearTimeout(timer); 
  }, [formData.term, selectedOption]);
  
  useEffect(() => {
    if (selectedOption === "search" && debouncedTerm) {
      handleSearch();
    }
  }, [debouncedTerm]);
  const handleSearch = async () => {
    try {
      const query = new URLSearchParams({
        api_key: formData.apiKey || "tg2zw99gwqb5",
        moduleName: "animation",
        methodName: "searchAnimation",
        term: debouncedTerm,
        lang: formData.lang || "en_US",
        brand: formData.brand || "generic"
      }).toString();
      const url = `https://interim.vehiclevisuals.com/api/animation_link/api/api.php?${query}`; 
      console.log("Search API:", url);
      const response = await fetch(url);
      try {
        const data = JSON.parse(text);
        setAnimationUrl({ searchResults: data });
      } 
      catch (err) {
        console.error("Invalid JSON:", err);
      }
    } catch (error) {
      console.error("Search API error:", error);
    }
  };
  const handleRun = async () => {
    if (!selectedOption) return;
    if (selectedOption === "videoDetails") {
      const partId = formData.part_id;
      if (!partId) {
        alert("Part ID is required");
        return;
      }
      const base = `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}`;
      const commonParams = {
        part_id: partId,
        module_name: "animation_page",
        show_menu: 0,
        show_left_sidebar: 0,
        show_description: 0,
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

      setAnimationUrl({
        interactive: interactiveUrl,
        normal: normalUrl,
        showSelection: true
      });
      return;
    }
    if (selectedOption === "search") {
      handleSearch();
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
        <button className="submit-Btn" onClick={handleRun}>
          Run API
        </button>
      )}
    </div>
  );
};
