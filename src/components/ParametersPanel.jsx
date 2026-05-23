import { useEffect, useState } from "react";
import { apiParameters } from "../config/apiParameters";
import { searchAnimations } from "../services/api";
import { getAnimationShareLink } from "../services/api";
import { updateAnimationLink } from "../services/api";  
import { getAnimationLinkUsage } from "../services/api";
import { useCallback } from "react";
//import { getUsageReport } from "../services/api";
import {
  getViewedAnimations,
  getUserDetails,
  getApiKey,
  getDynamicLink,
  generateLoopAnimation,
  getUserPreferences
  //getDisplayAnimation
} from "../services/api";

export const ParametersPanel = ({
  selectedOption,
  setAnimationUrl,
  formData,
  setFormData,
  apiKey,
  setApiKey,
  handleGetUserPreferences
}) => {
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [results, setResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
  setFormData({});
  setStatus(null);
  if (selectedOption === "search") {
    setAnimationUrl({
      type: "search",
      data: []
    });
  } else {
    setAnimationUrl(null);
  }}, [selectedOption]);

  useEffect(() => {
  if (
    selectedOption !== "search"
  ) return;
  if (!debouncedTerm.trim()) return;
  handleSearch(debouncedTerm);
  }, [debouncedTerm]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  useEffect(() => {
  if (selectedOption !== "search") return;
  const searchValue = formData.term?.trim();
  if (!searchValue) {
    setAnimationUrl({
      type: "search",
      data: []
    });
    return;
  }
  const timer = setTimeout(() => {
    setDebouncedTerm(searchValue);
  }, 500);
  return () => clearTimeout(timer);
}, [formData.term, selectedOption]);

  // useEffect(() => {
  //   if(selectedOption !== "search") return;
  //   if(!debouncedTerm.trim()) return;
  //   //const delay = setTimeout(() =>{
  //   //console.log("End Point", debouncedTerm);
  //   //handleSearch(debouncedTerm);
  //   //}, 800);
  //   //return () => clearTimeout(delay);
  // //}, [debouncedTerm]);
  
  const handleSearch = useCallback(
  async (searchTerm) => {
    try {
      setSearchLoading(true);
      const results = await searchAnimations(searchTerm);
      const filteredResults = results.filter(
          (item) =>
            item &&
            item.part_id
        );
      setAnimationUrl({
        type: "search",
        data: filteredResults,
        searchTerm
      });
    } catch (err) {
      console.error(err);
      setAnimationUrl({
        type: "search",
        data: []
      });
    } finally {
      setSearchLoading(false);
    }
  },
  []
);
  
  const buildAnimationLinks = (partId) => {
    const base = `https://motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}?show_menu=0&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0`;
    return {
      interactive: `${base}&is_interactive=1`,
      narrated: `${base}&is_interactive=0`
    };
  };
//   setAnimationUrl({
//   type: "generateLoop",
//   url: results.loopUrl
// });
  
  //const getAuthData = () => {
    //const username = formData.username || formData.login || formData.subscriber_login_id || "";
    //const password = formData.password || formData.loginPassword || formData.subscriber_password || "";
    //return { username, password };
    // };
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
    const handleRun = async () => {
      if (!selectedOption) return;
      setLoading(true);
      setStatus(null);
      setResults([]);
      try {
      const partId = (formData.partId || "").trim();
      if (selectedOption === "videoDetails") {
        if (!partId) return alert("Part ID is required");
        const { interactive, narrated } = buildAnimationLinks(partId);
        setAnimationUrl({
          type: "dual",
          interactive,
          normal: narrated
        });
    }
    else if (selectedOption === "share") {
        if (!partId) return alert("Part ID required");
        const res = await getAnimationShareLink(partId);
        if (!res || !res.video_url) {
          setStatus({ type: "error", msg: "Failed to generate link" });
          return;
        }
        const base = `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}?show_menu=0&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0`;
        setAnimationUrl({
          type: "share",
          data: {
            ...res,
            partId,
            interactive: `${base}&is_interactive=1`,
            narrated: `${base}&is_interactive=0`
          }
        });
      }
      else if (selectedOption === "generateLoop") {
        const { login, password, mute } = formData;
        if (!login || !password) {
          alert("Login and Password are Required");
          return;
        }
        console.log("CALLING BACKEND API");
        const res = await generateLoopAnimation({
          login,
          password,
          mute
        }
      );
      console.log("BACKEND RESPONSE:", res);
      if (!res.success) {
        setStatus({
          type: "error",
          msg: res.message || "Loop generation failed"
        });
        return;
      }
      setAnimationUrl({
        type: "looped",
        url: res.loopUrl
      }
    );
  }
      else if (selectedOption === "display") {
        const {login,password,partId,apiKey,interactive} = formData;
        if ( !login || !password || !partId || !apiKey) {
          return alert("Fill All the Required Fields");
        }
          const mode = interactive === "1"
        ? "interactive"
        : "narrated";
        const base = `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}` +`?show_menu=0` +`&show_left_sidebar=0` +
        `&show_description=0` +
        `&video_only=0` +
        `&auto_play=0`;
        const animationUrl = `${base}&is_interactive=${interactive}`;
        // const animationUrl = is_interactive === "1"
        // ? animation.interactive_url
        // : animation.narrated_url;
        setAnimationUrl({
          type: "display", mode,
          data: {
            title:
            mode === "interactive"
            ? "Interactive Animation"
            : "Narrated Animation",
            url: animationUrl,
            partId: partId
          }
        });
      }

      else if (selectedOption === "catalog") {
        const { login, password, apiKey, moduleName, methodName,
          lang,
          animationType,
          brand,
          partId
        } = formData;
        if (!partId) {
          return alert("Part ID missing");
        }
        const mode = animationType === "1"
        ? "interactive"
        : "narrated";
        const animationUrl = buildAnimationUrl(
          partId,
          animationType
        );
        setAnimationUrl({
          type: "single",
          data: {
            title:
            mode === "interactive"
            ? "Interactive Animation"
            : "Narrated Animation",
            url: animationUrl,
            type: mode,
            partId: partId,
            description:
            mode === "interactive"
            ? "Interactive Animation"
            : "Narrated Animation"
          }
        }
      );
    }
    
      else if (selectedOption === "update") {
        const res = await updateAnimationLink({
          unique_id: formData.uniqueId,
          job_id: formData.jobId,
          ref_id: formData.referenceId,
          cost: formData.cost,
          track_type: formData.trackType || "email",
          lang: "en_USA"
        }
      );
        setStatus({
          type: res?.status ? "success" : "error",
          msg: res?.message || "Update failed"
        }
      );
    }
      
      else if (selectedOption === "usage") {
        if (!formData.jobId) return alert("Job ID required");
        const res = await getAnimationLinkUsage(formData.jobId);
        setAnimationUrl({
          type: "usage",
          data: res?.data || {}
        }
      );
    }
    
      else if (selectedOption === "viewed") {
        if(!formData.dateFrom || !formData.dateTo){
           return alert("From Date and To Date Required");
      }
        const res = await getViewedAnimations({
          from_date: formData.from_date || formData.dateFrom,
          to_date: formData.to_date || formData.dateTo,
          unique_id: formData.uniqueId
        }
      );
      console.log("Viewed Animation Response", res);
        setAnimationUrl({
          type: "viewed",
          data: res?.data || []
        }
      );
    }

      else if (selectedOption === "details") {
        const username = formData.username || formData.login || formData.subscriber_login_id;
        const password = formData.password || formData.loginPassword || formData.subscriber_password;
        if (!username || !password) {
          return alert("Username & Password required");
        }
        const res = await getUserDetails(username, password);
        if (!res.status) {
          setStatus({
            type: "error",
            msg: res.message || "Invalid user"
          }
        );
        return;
        }
        setAnimationUrl({
          type: "userDetails",
          data: res
        });
      }
      else if (selectedOption === "get") {
        const username = formData.username;
        const password = formData.password;
        //const moduleName = formData.moduleName;
        //const methodName = formData.methodName;
        if (!username || !password) {
          return alert("Username & Password required");
        }
        //if(!moduleName || ! methodName){
          //return alert("Fill the Required Fields")
        //}
        const res = await getApiKey(username, password);
        if (!res?.status) {
          setStatus({
            type: "error",
            msg: res?.message || "Failed to get API key"
          });
          return;
        }
        setAnimationUrl({
          type: "apiKey",
          data: res.data
        }
      )
      setApiKey(res?.data.apiKey || "");
    }
    else if (selectedOption === "preference") {
      const { username,
        password,
        apiKey,
        moduleName = "user",
        methodName = "getUserPreferences",
        lang
      } = formData;
        if (
          !username ||
          !password ||
          !apiKey ||
          !moduleName ||
          !methodName
        ) {
          return alert("Fill all the Required Fields");
        }
        const res = await getUserPreferences({ username, password,
          apiKey,
          moduleName,
          methodName,
          lang
        });
        if (!res?.status) {
          setStatus({
            type: "error",
            msg: res?.message || "Failed to fetch preferences"
          });
          return;
        }
        setAnimationUrl({
          type: "preferences",
          data: res.data
        }
      );
    }
    else if (selectedOption === "links") {
        const partId = formData.partId;
        const roNumber = formData.roNumber;
        const apiKeyValue = formData.apiKey || apiKey;
        if (!apiKeyValue) {
          return alert("API Key required");
        }
        if (!partId) {
          return alert("Part ID required");
        }
        const res = await getDynamicLink({
          apiKey : apiKeyValue,
          partId,
          roNumber
        });
        console.log("LINK RESPONSE:", res);
        console.log("LINK DATA:", res?.data);
        if (!res?.status) {
          setStatus({
            type: "error",
            msg: res?.message || "Failed to generate link"
          });
          return;
        }
        setAnimationUrl({
          type: "emailLink",
          interactive: res.data?.interactive,
          narrated: res.data?.narrated,
          shortInteractive: res.data?.shortInteractive,
          shortNarrated: res.data?.shortNarrated
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        msg: err.message || "Something went wrong"
    });
    } finally {
      setLoading(false);
    }
    console.log("Selected Option:", selectedOption);
    //console.log("Parameters",apiParameters);
  };
  const parameters = apiParameters[selectedOption] || [];
  return (
    <div className="search">
      <h3>API Parameters</h3>
      {/* {selectedOption === "preference" && (
        <div className="form-group">
          <label>API Key *</label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter API Key"
          />
        </div>
      )
    } */}
      {parameters .filter( (param) => !(
        selectedOption === "search" &&
        param.name === "term"
      )
    )
    .map((param) => (
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
        <button
          className="submit-Btn"
          onClick={handleRun}
          disabled={loading}>
          {loading ? "Processing..." : "Run API"}
        </button>
      )
    }
      {status && (
        <div className={`update-status ${status.type}`}>
          {status.msg}
          {results.length > 0 && (
            <div className="getUsageReport-results">
              <pre>{JSON.stringify(results, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
