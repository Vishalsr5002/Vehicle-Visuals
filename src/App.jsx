import { useState } from "react";
import Header from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import { ParametersPanel } from "./components/ParametersPanel";
import "./styles.css";

function App() {

  const [selectedOption, setSelectedOption] = useState("");
  const [animationUrl, setAnimationUrl] = useState("");
  const [baseUrl, setBaseUrl] = useState("");

  return (
    <div className="app-container">
      <Header baseUrl={baseUrl} setBaseUrl={setBaseUrl} />
      <div className="main-layout">
        <Sidebar
          setSelectedOption={setSelectedOption}/>
        <Dashboard animationUrl={animationUrl} />
        <ParametersPanel
          selectedOption={selectedOption}
          baseUrl={baseUrl}
          setAnimationUrl={setAnimationUrl}/>
      </div>
    </div>
  );
}

export default App;
