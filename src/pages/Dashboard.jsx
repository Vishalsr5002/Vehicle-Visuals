import { useEffect, useState } from "react";
import { getAnimationDetails } from "../services/api";
import { Folder, Layers, ArrowLeft } from "lucide-react";
//import { DiSafari } from "react-icons/di";

function Dashboard({ setAnimationUrl, selectedOption, handleSelectPart, animationUrl, formData, setFormData })
{
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
    const hasChildren = item?.children &&
      typeof item.children === "object" &&
      Object.keys(item.children).length > 0;
    if (hasChildren) {
      setBreadcrumb((prev) => [...prev, item]);
      setCurrentLevel(Object.values(item.children));
      return;
    }
    const partId = item.part_id || item.animation_Id;
    if (partId) {
      handleSelectPart(partId);
      return;
    }
    if (typeof item === "object") {
      //setBreadcrumb((prev) => [...prev, item]);
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
//   const searchTerm = animationUrl?.searchTerm || "";
//   const filteredCards = currentLevel.filter((item) => {
//   const name = (
//     item.en_US ||
//     item.title ||
//     ""
//   ).toLowerCase();
//   //filteredCards.map
//   return name.includes(searchTerm.toLowerCase());
// });
const buildAnimationUrl = (partId, animationType) => {
  return (
    `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}` +
    `?show_menu=0` +
    `&is_interactive=${animationType}` +
    `&show_left_sidebar=0` +
    `&show_description=0` +
    `&video_only=0` +
    `&auto_play=1` +
    `&mute=1`
  );
};
const searchCards = selectedOption === "search"
    ? animationUrl?.data || []
    : [];
  return (
    <div className="dashboard">
      <h2>Animations</h2>
      {/* {
      selectedOption === "search" &&
      animationUrl?.type === "search" && (
      <div className="animation-grid">
      {animationUrl.data?.map((item, index) => {
        const partId = item.part_id || item.partId;
        return (
          <div
            key={index}
            className="animation-card"
            onClick={() =>
              setAnimationUrl({
                type: "dual",
                partId,
                interactive: `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}?is_interactive=1`,
                normal: `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}?is_interactive=0`
              })
            }
          >
            <h4>
              {item.title || item.en_US}
            </h4>
          </div>
        )
      })}
    </div>
  )
} */}
      {breadcrumb.length > 0 && (
        <div className="breadcrumb">
          <button className="back-btn" onClick={goBack}>
            <ArrowLeft size={24} /> Back
          </button>
          <span className="crumb">
            {breadcrumb.map((b) => b.en_US).join(" / ")}
          </span>
        </div>
      )
    }
      {selectedOption === "search" ? (
      <div className="animation-grid">
        {animationUrl?.data?.length > 0 ? (
          animationUrl.data.map((item, index) => {
          const partId = item.part_id || item._partId || item.animation_id;
          return (
          <div
            key={index}
            className="animation-card"
            onClick={() => {
              const isInteractive = String(item.is_interactive ?? item.interactive)
              .trim() === "1";
              const animationType = isInteractive ? "1" : "0";
              const Cluttch = "The clutch master cylinder is a vital hydraulic component in manual transmission vehicles that acts as a translator between the driver’s foot and the clutch mechanism. When you press the clutch pedal, a pushrod connected to the pedal forces a piston inside the master cylinder to move. This mechanical movement compresses hydraulic fluid typically brake fluid within a sealed chamber, generating high hydraulic pressure. This pressurized fluid then travels through a hydraulic line to the clutch slave cylinder, which in turn actuates the clutch fork and release bearing to disengage the engine from the transmission.";
              console.log("SEARCH CARD DATA:", item);
              console.log("DESCRIPTION:", item.description);
              console.log("PDF DESCRIPTION:", item.pdfDescription);
              const animationUrlBuilt = buildAnimationUrl(partId, animationType);
              setAnimationUrl((prev) => ({
                ...prev,
                type: "single",
                selectedAnimation: {
                  title: item.customTitle || (isInteractive ? "Clutch 1" : "Clutch 2"),
                  url: animationUrlBuilt,
                  type: isInteractive ? "interactive" : "narrated",
                  partId,
                  animationType,
                  description: Cluttch
                },
                previousResults: animationUrl?.previousResults || animationUrl?.data || []
              }));
            }}>
            <div className="card-icon">
              <Folder size={48} />
            </div>
            <h4>{item.is_interactive === "1"
                 ? "Clutch 1"
                 : "Clutch 2"
                }
            </h4>
            <span className="badge">
              {item.customBadge || item.interaction_label || "Animation"}
            </span>
          </div>
        );
      })
    ) : formData?.term &&
    formData.term.trim().length > 2 &&
    animationUrl?.loading === false ? (
    <p>No Animations Found</p>
    ) : null}
    </div>
    ) : selectedOption === "catalog" ? (
      <div className="animation-grid">
    {[
      {
        title: "Clutch 1",
        badge: "Interactive",
        icon: <Folder size={48} />,
        params: {
          login: "motovisuals",
          password: "motovisuals",
          apiKey: "tg2zw99gwqb5",
          moduleName: "animation",
          methodName: "displayAnimation",
          lang: "en_US",
          animationType: "1",
          brand: "VV",
          partId: "7011"
        },
        data: {
          title: "Clutch (Interactive Animation)",
          description: "The clutch master cylinder is a vital hydraulic component in manual transmission vehicles that acts as a translator between the driver’s foot and the clutch mechanism. When you press the clutch pedal, a pushrod connected to the pedal forces a piston inside the master cylinder to move. This mechanical movement compresses hydraulic fluid typically brake fluid within a sealed chamber, generating high hydraulic pressure. This pressurized fluid then travels through a hydraulic line to the clutch slave cylinder, which in turn actuates the clutch fork and release bearing to disengage the engine from the transmission."
        }
      },
      {
        title: "Clutch 2",
        badge: "Narrated",
        icon: <Layers size={48} />,
        params: {
          login: "motovisuals",
          password: "motovisuals",
          apiKey: "tg2zw99gwqb5",
          moduleName: "animation",
          methodName: "displayAnimation",
          lang: "en_US",
          animationType: "0",
          brand: "VV",
          partId: "7011"
        },
        data: {
          title: "Clutch (Narrated Animation)",
          description: "The clutch master cylinder is a vital hydraulic component in manual transmission vehicles that acts as a translator between the driver’s foot and the clutch mechanism. When you press the clutch pedal, a pushrod connected to the pedal forces a piston inside the master cylinder to move. This mechanical movement compresses hydraulic fluid typically brake fluid within a sealed chamber, generating high hydraulic pressure. This pressurized fluid then travels through a hydraulic line to the clutch slave cylinder, which in turn actuates the clutch fork and release bearing to disengage the engine from the transmission."
        }
      }
    ].map((card, index) => (
      <div
        key={index}
        className="animation-card"
        onClick={() => {
          setFormData((prev) => ({
            ...prev,
            login: card.params.login,
            password: card.params.password,
            apiKey: card.params.apiKey,
            moduleName: card.params.moduleName,
            methodName: card.params.methodName,
            lang: card.params.lang,
            animationType: card.params.animationType,
            brand: card.params.brand,
            partId: card.params.partId
          })
        );
          const animationUrl = buildAnimationUrl(
            card.params.partId,
            card.params.animationType
          );
          const mode = card.params.animationType === "1"
              ? "interactive"
              : "narrated";
              console.log("CLICKED SEARCH ITEM:", item);
              console.log("ITEM DESCRIPTION:", item.description);
              console.log("ITEM PDF DESCRIPTION:", item.pdfDescription);
          setAnimationUrl((prev) => ({
            ...prev,
            type: "single",
            selectedAnimation: {
              ...card.data,
              url: animationUrl,
              type: mode,
              partId: card.params.partId,
              description: item.description,
              pdfDescription: item.pdfDescription
            }
          }));
        }}>
        <div className="card-icon">
          {card.icon}
        </div>
        <h4>{card.title}</h4>
        <span className="badge">
          {card.badge}
        </span>
      </div>
    ))}
  </div>
) : null}
  </div>
  );
}

export default Dashboard;
