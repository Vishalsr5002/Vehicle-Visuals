import { useEffect, useState } from "react";
import { getAnimationDetails } from "../services/api";
import { Folder, Layers, ArrowLeft } from "lucide-react";

const Dashboard = ({ setAnimationUrl, selectedOption, handleSelectPart }) => {
  const [treeData, setTreeData] = useState(null);
  const [currentLevel, setCurrentLevel] = useState([]);
  const [breadcrumb, setBreadcrumb] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getAnimationDetails();
      if (data) {
        setTreeData(data);
        const root = Array.isArray(data)
          ? data
          : Object.values(data || {});
        setCurrentLevel(root);
      }
    };
    loadData();
  }, []);

  const handleClick = (item) => {
    console.log("Clicked item:", item);
    const hasChildren =
      item?.children &&
      typeof item.children === "object" &&
      Object.keys(item.children).length >= 0;
    if (hasChildren) {
      setBreadcrumb((prev) => [...prev, item]);
      setCurrentLevel(Object.values(item.children));
      return;
    }
    const partId = item.part_id || item.animation_id;
    if (partId) {
      handleSelectPart(partId);
      return;
    }
    if (typeof item === "object") {
      setCurrentLevel(Object.values(item)); 
      return;
    }
    console.warn("Invalid item clicked:", item);
  };
  const goBack = () => {
    if (breadcrumb.length === 0) return;
    const newBreadcrumb = [...breadcrumb];
    newBreadcrumb.pop();
    setBreadcrumb(newBreadcrumb);
    if (newBreadcrumb.length === 0) {
      setCurrentLevel(
        Array.isArray(treeData)
          ? treeData
          : Object.values(treeData || {})
      );
    } else {
      const last = newBreadcrumb[newBreadcrumb.length - 1];
      setCurrentLevel(Object.values(last.children || {}));
    }
  };
  return (
    <div className="dashboard">
      <h2>Animation Catalog</h2>

      {/* BREADCRUMB */}
      {breadcrumb.length > 0 && (
        <div className="breadcrumb">
          <button className="back-btn" onClick={goBack}>
            <ArrowLeft size={24} /> Back
          </button>

          <span className="crumb">
            {breadcrumb.map((b) => b.en_US).join(" / ")}
          </span>
        </div>
      )}

      {/* CARDS */}
      <div className="animation-grid">
        {currentLevel
          ?.filter((item) => item && Object.keys(item).length > 0)
          .map((item, index) => {
            const hasChildren =
              item?.children &&
              Object.keys(item.children || {}).length > 0;

            return (
              <div
                key={item.part_id || item.tag_name || index}
                className="animation-card"
                onClick={() => handleClick(item)}
              >
                {/* ICON */}
                <div className="card-icon">
                  {hasChildren ? (
                    <Folder size={38} />
                  ) : (
                    <Layers size={38} />
                  )}
                </div>

                {/* TITLE */}
                <h4>{item.en_US || item.title || "Unnamed"}</h4>

                {/* TYPE */}
                <span className="badge">
                  {hasChildren ? "System" : "Part"}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Dashboard;
