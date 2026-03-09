import { useState } from "react";
import Header from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import { ParametersPanel } from "./components/ParametersPanel";
import "./styles.css";

function App() {

  const [selectedOption, setSelectedOption] = useState("");
  const [animationUrl, setAnimationUrl] = useState("");
  const [selectedApi, setSelectedApi] = useState(null);

  return (
    <div className="app-container">

      <Header />

      <div className="main-layout">

        <Sidebar
          setSelectedOption={setSelectedOption}
          setAnimationUrl={setAnimationUrl}
          setSelectedApi={setSelectedApi}
        />

        <Dashboard
          selectedOption={selectedOption}
          animationUrl={animationUrl}
          setAnimationUrl={setAnimationUrl}
          setSelectedApi={setSelectedApi}
        />

        <ParametersPanel
          selectedOption={selectedOption}
          selectedApi={selectedApi}
          setAnimationUrl={setAnimationUrl}
        />

      </div>
    </div>
  );
}

export default App;
