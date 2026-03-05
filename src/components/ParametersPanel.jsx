import { useState } from "react";

export const ParametersPanel = () => {

  const [formData, setFormData] = useState({
    login: "",
    password: "",
    apiKey: "",
    partId: "",
    moduleName: "",
    methodName: "",
    lang: "",
    animationType: "",
    brand: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = () => {
    if (
      !formData.login ||
      !formData.password ||
      !formData.apiKey ||
      !formData.partId
    ) {
      setError("Please fill all required fields");
      return;
    }
    setError("");
    console.log("Form Data:", formData);
  };
  return (
    <div className="parameters">
      <h3>API Parameters</h3>
      {error && <p className="error">{error}</p>}

      <div className="form-group">
        <label>Login ID *</label>
        <input
          type="text"
          name="login"
          placeholder="Enter login id"
          value={formData.login}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Password *</label>
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>API Key *</label>
        <input
          type="text"
          name="apiKey"
          placeholder="Enter API Key"
          value={formData.apiKey}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Part ID *</label>
        <input
          type="text"
          name="partId"
          placeholder="Enter Part ID"
          value={formData.partId}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Module Name</label>
        <input
          type="text"
          name="moduleName"
          value={formData.moduleName}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Method Name</label>
        <input
          type="text"
          name="methodName"
          value={formData.methodName}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Language</label>
        <input
          type="text"
          name="lang"
          value={formData.lang}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Animation Type</label>
        <input
          type="text"
          name="animationType"
          value={formData.animationType}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Brand</label>
        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>RO Number</label>
        <input
          type="number"
          name="roNumber"
          value={formData.roNumber}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Is Interactive</label>
        <input
          type="number"
          name="isInteractive"
          value={formData.isInteractive}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Show Left Sidebar</label>
        <input
          type="number"
          name="showLeftSidebar"
          value={formData.showLeftSidebar}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Show Menu</label>
        <input
          type="number"
          name="showMenu"
          value={formData.showMenu}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Auto Play</label>
        <select
        name="autoPlay"
        value={formData.autoPlay}
        onChange={handleChange}>
        <option value="1">ON</option>
        <option value="0">OFF</option>
        </select>
        </div>
        
        <div className="form-group">
          <label>Video Only</label>
          <input
            type="number"
            name="videoOnly"
            value={formData.videoOnly}
            onChange={handleChange}
          />
        </div>

      <button className="submit-Btn" onClick={handleSubmit}>
        Run API
      </button>
    </div>
  );
};

//export default ParametersPanel;