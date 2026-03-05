import Header from "./components/Header";
import {Sidebar} from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import {ParametersPanel} from "./components/ParametersPanel";
import "./styles.css";

function App() {
  return (
    <div className="app-container">

      <Header />

      <div className="main-layout">
        <Sidebar />
        <Dashboard />
        <ParametersPanel />
      </div>

    </div>
  );
}

export default App;