const BASE_API_URL = "https://motovisuals.com/api/animation_link/api/api.php";
const API_KEY = "tg2zw99gwqb5";

const normalizeSearchData = (data) => {
  if (!data || typeof data !== "object") return [];
  return Object.values(data).map((item) => {
    const isInteractive =
      String(
        item.is_interactive ??
        item.interactive ??
        0
      );
    return {
      part_id: item.part_id,
      title:
        item.en_US ||
        item.title ||
        item.name ||
        "No Title",
      description:
        item.description ||
        item.video_description ||
        item.details_description ||
        item.animation_description ||
        item.en_US_description ||
        item.summary ||
        item.desc ||
        "",
      image:
        item.image ||
        item.image_url ||
        item.thumbnail ||
        "https://img.freepik.com/premium-photo/various-car-parts-accessories-isolated-white-background_771335-35715.jpg",
      is_interactive: isInteractive,
      interaction_label: getInteractionLabel(isInteractive),
      viewed_count: item.viewed_count || 0,
      usage_count: item.usage_count || 0
    };
  });
};
const getInteractionLabel = (value) => {
  return String(value) === "1"
  ? "Interactive"
  : "Narrated";
}

export const searchAnimations = async (term, options = {}) => {
  if (!term) return [];
  try {
    const query = new URLSearchParams({
      api_key: options.apiKey || API_KEY,
      moduleName: "animation",
      methodName: "searchAnimation",
      term: term,
      lang: options.lang || "en_US",
      brand: options.brand || "generic"
    }).toString();
    const url = `${BASE_API_URL}?${query}`;
    console.log("Search API:", url);
    const res = await fetch(url);
    const text = await res.text();
    let data = {};
    try {
      data = JSON.parse(text);
      console.log("Raw Search Data", data);
      const actualData = data.data || data;
      return normalizeSearchData(actualData);
    } catch {
      console.error("Invalid JSON from API");
      return [];
    }
  } catch (err) {
    console.warn("Search API Failed");
    return [
      {
        part_id: "7011",
        //is_interactive: "1",
        title: "Clutch System",
        image: "/clutchh.webp"
      }
    ].filter((item) => item.title.toLowerCase().includes(term.toLowerCase())
    );
  }
};

export const getDisplayAnimation = async (payload) => {
  try {
    const query = new URLSearchParams({
      term: payload.partId || "",
      //key: payload.apiKey || "",
      lang: payload.lang || "en_US",
      brand: "generic"
    }
  );
    const response = await fetch(
      `http://localhost:5000/api/display-animations?${query}`
    );
    console.log("Display API Response:", await response.clone().json());
    return await response.json();
  } catch (err) {
    console.error("Display API Error:", err);
    return {
      status: false,
      message: err.message
    };
  }
};

export const getUserPreferences = async ({
  username,
  password,
  apiKey,
  moduleName,
  methodName,
  lang = "en_US"
}) => {
  try {
    const url = `http://localhost:5000/api/user-preferences` +
      `?username=${username}` +
      `&password=${password}` +
      `&apiKey=${apiKey}` +
      `&moduleName=${moduleName}` +
      `&methodName=${methodName}` +
      `&lang=${lang}`;
    console.log("User Preferences API:", url);
    const res = await fetch(url);
    const data = await res.json();
    console.log("User Preferences Response:", data);
    return data;
   }catch (err) {
    console.error("User Preferences Error:", err);
    return {
      status: false,
      message: err.message
    };
  }
};

export const generateLoopAnimation = async ({login, password, mute }) => {
  const response = await fetch(
    "http://localhost:5000/api/generate-loop-animation",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        login,
        password,
        mute
      })
    }
  );
  return await response.json();
};

export const getUserDetails = async (username, password) => {
  try {
    const url = `http://localhost:5000/api/user-details?loginId=${username}&password=${password}`;
    console.log("Calling User Details API:", url);
    const res = await fetch(url);
    const data = await res.json();
    //setLoading(false);
    return data;
  } catch (error) {
    console.error("User Details API error:", error);
    return {
      status: false,
      message: error.message
    };
  }
};

export const getAnimationsWithCounts = async (term = "") => {
  try {
    const query = new URLSearchParams({
      term
    });
    const response = await fetch(
      `http://localhost:5000/api/display-animations?${query}`
    );
    const data = await response.json();
    return data?.data || [];
  } catch (err) {
    console.error(
      "Get Animations With Counts Error:",
      err
    );
    return [];
  }
};

export const trackAnimationView = async (
  unique_id,
  animation_name,
  type,
  animation_id,
  video_url
) => {
  console.log("TRACK FUNCTION CALLED");
  console.log({
    unique_id,
    animation_name,
    type,
    animation_id,
    video_url
  }
);
  try {
    const response = await fetch(
      "http://localhost:5000/api/track-view",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          job_id: unique_id,
          animation_name,
          type,
          animation_id,
          video_url
        })
      }
    );
    const data = await response.json();
    console.log("TRACK API RESPONSE:", data);
  } catch (err) {
    console.error("Tracking error:", err);
  }
};
export const getViewCount = async (id = "all") => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/view-count/${id}`
    );
    const data = await res.json();
    console.log("VIEW COUNT:", data);
    return data.data;
  } catch (err) {
    console.error("VIEW COUNT ERROR:", err);
    return {
      status : false,
      data :{
      interactive: 0,
      narrated: 0
      }
    };
  }
};

export const getViewedReport = async (
  fromDate,
  toDate
) => {
  try {
    const url = `http://localhost:5000/api/viewed-animations` +
      `?from_date=${fromDate}` +
      `&to_date=${toDate}`;
    console.log(
      "Viewed Animations API:",
      url
    );
    const response = await fetch(url);
    const data = await response.json();
    console.log(
      "Viewed Animations Response:",
      data
    );
    return data;
  } catch (err) {
    console.error(
      "Viewed Report Error:",
      err
    );
    return {
      status: false,
      data: []
    };
  }
};

export const getApiKey = async (username, password) => {
  try {
    const url = `http://localhost:5000/api/get-api-key?loginId=${username}&password=${password}`;
    console.log("Getting API Key:", url);
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Get API Key error:", error);
    return {
      status: false,
      message: error.message
    };
  }
};
export const getDynamicLink = async ({
  apiKey,
  partId,
  roNumber = "",
  expireDays = 5
}) => {
  try {
    const url = `http://localhost:5000/api/generate-link?` +
    `apiKey=${apiKey}&partId=${partId}&roNumber=${roNumber}&expireDays=${expireDays}`;
    console.log("Generating Base Link:", url);
    const res = await fetch(url);
    const result = await res.json();
    if (!result?.status) {
      return result;
    }
    return result;
  } catch (error) {
    console.error("Dynamic Link Error:", error);
    return {
      status: false,
      message: error.message
    };
  }
};

export const getUsageReport = async (params = {}) => {
  try {
    const query = new URLSearchParams({
      api_key: API_KEY,
      moduleName: "user",
      methodName: "getUsageReport",
      ...(params.dateFrom && { date_from: params.dateFrom }),
      ...(params.dateTo && { date_to: params.dateTo }),
      ...(params.uniqueId && { unique_id: params.uniqueId }),
      ...(params.date_from && { date_from: params.date_from }),
      ...(params.date_to && { date_to: params.date_to }),
      ...(params.unique_id && { unique_id: params.unique_id })
    }).toString();
    const url = `${BASE_API_URL}?${query}`;
    console.log("Usage Report API:", url);
    const res = await fetch(url);
    const data = await res.json();
    console.log("Usage Report Response:", data);
    if (!data?.status) {
      return { status: false, data: [] };
    }
    return data;
  } catch (err) {
    console.error("Usage Report API error:", err);
    return { status: false, data: [] };
  }
};
export const getAnimationDetails = async () => {
  try {
    const query = new URLSearchParams({
      api_key: API_KEY,
      moduleName: "animation",
      methodName: "getAnimationDetails",
      lang: "en_US"
    }).toString();
    const url = `${BASE_API_URL}?${query}`;
    console.log("Animation Details API:", url);
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to Fetch Animation Details", err);
    return null;
  }
};
export const getAnimationLinkUsage = async (jobId) => {
  if (!jobId) return null;
  try {
    const query = new URLSearchParams({
      api_key: API_KEY,
      moduleName: "emailananimation",
      methodName: "getAnimationLinkUsage",
      job_id: jobId,
      //part_id : partId
    }).toString();
    const url = `${BASE_API_URL}?${query}`;
    console.log("Usage API:", url);
    const res = await fetch(url);
    const data = await res.json();
    console.log("Usage Response:", data);
    if (!data?.status) return null;
    return data;
  } catch (err) {
    console.error("Usage API error:", err);
    return null;
  }
};
export const getAnimationUrls = (partId) => {
  if (!partId) return null;
  const base = `https://motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}`;
  return {
    type: "dual",
    interactive:
      `${base}` +
      `?show_menu=0` +
      `&is_interactive=1` +
      `&show_left_sidebar=0` +
      `&show_description=0` +
      `&video_only=0` +
      `&auto_play=0`,
    narrated:
      `${base}` +
      `?show_menu=0` +
      `&is_interactive=0` +
      `&show_left_sidebar=0` +
      `&show_description=0` +
      `&video_only=0` +
      `&auto_play=0`
  };
};
export const generateViewerLinks = (partId) => {
  if (!partId) return null;
  return {
    type: "dual",
    interactive: `https://motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}?show_menu=0&is_interactive=1&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0`,
    narrated: `https://motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}?show_menu=0&is_interactive=0&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0`
  };
};

export const getAnimationShareLink = async (partId) => {
  if (!partId) return null;
  try {
    const query = new URLSearchParams({
      api_key: API_KEY,
      moduleName: "emailananimation",
      methodName: "getStreamingLink",
      part_id: partId,
      brand: "generic",
      lang: "en_US"
    }).toString();
    const url = `${BASE_API_URL}?${query}`;
    console.log("Share Link API:", url);
    const res = await fetch(url);
    const data = await res.json();
    console.log("Share API Response:", data);
    let result = null;
    if (Array.isArray(data))
      result = data[0];
    else if (data?.data && typeof data.data === "object")
      result = data.data;
    else if (data?.video_url)
      result = data;
    if (!result || !result.video_url) {
      console.error("Invalid Share API response:", data);
      return null;
    }
    return {
      unique_id: result.unique_id || result.uid || "",
      video_url: result.video_url,
      video_title: result.video_title || "Animation"
    };
  } catch (err) {
    console.error("Share Link error:", err);
    return null;
  }
};

export const generateShortShareLink = async (animationLink) => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/generate-share-link",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          animationLink
        })
      }
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Short Link Error:", err);
    return {
      success: false
    };
  }
};

export const updateAnimationLink = async ({
  unique_id,
  job_id,
  ref_id,
  cost,
  track_type = "email"
}) => {
  if (!unique_id) {
    console.error("Unique Id is required");
    return null;
  }
  try {
    const payload = {
      api_key: API_KEY,
      moduleName: "emailananimation",
      methodName: "updateAnimationLink",
      unique_id: Array.isArray(unique_id) ? unique_id : [unique_id],
      job_id,
      ref_id,
      cost,
      track_type
    };
    console.log("Update API Payload:", payload);
    const res = await fetch(BASE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log("Update Response:", data);
    return data;
  } catch (err) {
    console.error("Update API error:", err);
    return null;
  }
};

export const getViewedAnimations = async ({ from_date, to_date, unique_id }) => {
  try {
    const query = new URLSearchParams({
      ...(from_date && { from_date }),
      ...(to_date && { to_date }),
      ...(unique_id && { unique_id })
    }).toString();
    const url =`http://localhost:5000/api/viewed-animations?${query}`;
    console.log("Viewed Animations API:", url);
    const res = await fetch(url);
    const data = await res.json();
    console.log("Viewed Animations Response:", data);
    return data;
  } catch (err) {
    console.error("Viewed Animations Error:", err);
    return {
      status: false,
      data: []
    };
  }
};

export const getVideoDetails = async (partId, options = {}) => {
  if (!partId) return null;
  try {
    const query = new URLSearchParams({
      api_key: options.apiKey || API_KEY,
      moduleName: "animation",
      methodName: "getVideoDetails",
      part_id: partId,
      brand: options.brand || "generic",
      lang: options.lang || "en_US"
    }).toString();
    const url = `${BASE_API_URL}?${query}`;
    console.log("Video Details API:", url);
    const res = await fetch(url);
    const data = await res.json();
    if (data) {
      ["videoUrl", "videoUrlHLS", "videoUrlDash"].forEach((key) => {
        if (data[key]?.startsWith("aHR0")) {
          try {
            data[key] = atob(data[key]);
          } catch {}
        }
      });
    }
    return data;
  } catch (err) {
    console.error("Video details error:", err);
    return null;
  }
};

export const getLoopedAnimationLink = async ({
  login,
  //username,
  password,
  mute = 0
}) => {
  if (!login || !password) return null;
  try {
    //const url = `http://interim.vehiclevisuals.com/api/loopedanimations/generate_loopedanimation_link.php?username=${login}&password=${password}&mute=${mute}`;
    const url = `http://localhost:5000/api/loop/generate?username=${login}&password=${password}&mute=${mute}`;
    console.log("Looped API:", url);
    const res = await fetch(url);
    const text = await res.text();
    console.log("Looped API RAW:", text);
    try { 
      const data = JSON.parse(text);
      return data?.url || data?.link || null;
    } catch {
      return text.trim();
    }
  } catch (err) {
    console.error("Looped API error:", err);
    return null;
  }
};
export const generateLoopedAnimationLink = async ({
  username,
  password,
  mute = 1 || 0
}) => {
  try {
    const url = `http://localhost:5000/api/loop/generate?username=${username}&password=${password}&mute=${mute}`;
    //const url = `http://interim.vehiclevisuals.com/api/loopedanimations/generate_loopedanimation_link.php?username=${username}&password=${password}&mute=${mute}`;
    console.log("Loop API URL:", url);
    const res = await fetch(url);
    const text = await res.text();
    console.log("Loop API Raw Response:", text);
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return {
        status: true,
        url: text.trim()
      };
    }
    if (data?.url) {
      return {
        status: true,
        url: data.url
      };
    }
    if (data?.link) {
      return {
        status: true,
        url: data.link
      };
    }
    return { status: false };
  } catch (err) {
    console.error("Loop API error:", err);
    return { status: false };
  }
};
// export const generateShortShareLink = async (
//   animationLink
// ) => {
//   try {
//     const response = await fetch(
//       "http://localhost:5000/api/generate-share-link",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           animationLink
//         })
//       }
//     );
//     return await response.json();
//   } catch (err) {
//     console.error("Short Link Error:",err);

//     return {
//       success: false
//     };
//   }
// };
