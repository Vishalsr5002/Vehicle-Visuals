import { useEffect, useState } from "react";
import { apiParameters } from "../config/apiParameters";

export const ParametersPanel = ({
  selectedOption,
  setAnimationUrl,
  formData,
  setFormData,
  //searchResults
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
      try {
        const response = await fetch(url);
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          
          setAnimationUrl({
            type: "search",
            data: data?.results || data || []
          });

        } catch (err) {
          console.error("Invalid JSON:", err);
        }

      } catch (err) {
        console.warn("CORS blocked → using mock data");
        const mockData = [
          {
            part_id: "7011",
            title: "Clutch System",
            image: "/clutchh.webp"
          },
          {
            part_id: "7012",
            title: "Brake System",
            image: "/clutch.webp"
          }
        ];

        const filtered = mockData.filter((item) =>
          item.title.toLowerCase().includes(debouncedTerm.toLowerCase())
        );

        setAnimationUrl({
          type: "search",
          data: filtered
        });
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
        show_menu: 0,
        show_left_sidebar: 0,
        show_description: 0,
        auto_play: 0
      };

      const interactive =
        base +
        "?" +
        new URLSearchParams({
          ...commonParams,
          is_interactive: 1
        });

      const normal =
        base +
        "?" +
        new URLSearchParams({
          ...commonParams,
          is_interactive: 0
        });
        
      setAnimationUrl({
        type: "single",
        url: interactive
      });

      return;
    }
    
    if (selectedOption === "search") {
      const term = formData.term?.toLowerCase();

      if (!term) {
        alert("Enter search term");
        return;
      }

      const mockData = [
        {
          part_id: "7011",
          title: "Clutch System",
          image: "/clutchh.webp"
        },
        {
          part_id: "7012",
          title: "Brake System",
          image: "/clutch.webp"
        }
      ];

      const filtered = mockData.filter((item) =>
        item.title.toLowerCase().includes(term)
      );

      setAnimationUrl({
        type: "search",
        data: filtered
      });

      return;
    }
    const query = new URLSearchParams(formData).toString();
    const baseUrl ="https://dev.motovisuals.com/thirdpartyapi/#!/thirdPartyLogin";
    setAnimationUrl({
      type: "single",
      url: `${baseUrl}?${query}`
    });
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
