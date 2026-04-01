const BASE_API_URL = "https://dev.motovisuals.com/api/animation_link/api/api.php";
const API_KEY = "tg2zw99gwqb5";

const normalizeSearchData = (data) => {
  if (!data || typeof data !== "object") return [];
  return Object.values(data);
};
//export const getStreamingVideo = getAnimationShareLink;
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
    let fetching = {};
    try {
      fetching = JSON.parse(text);
    } catch (err) {
      console.error("Invalid JSON from API");
      return [];
    }return normalizeSearchData(fetching);
  } catch (err) {
    console.warn("API failed, using mock data");
    return [
      {
        part_id: "7011",
        title: "Clutch System 1",
        is_interactive: 1,
        image: "/clutchh.webp"
      },
      {
        part_id: "7011",
        title: "Clutch System",
        is_interactive: 0,
        image: "/clutchh.webp"
      },
      {
        part_id: "7012",
        title: "Transmission System",
        image: "/spares.jpg"
      }
    ].filter((item) =>
      item.title.toLowerCase().includes(term.toLowerCase())
    );
  }};
export const getAnimationDetails = async () => {
  try {
    const query = new URLSearchParams({
      api_key: API_KEY,
      moduleName: "animation",
      methodName: "getAnimationDetails",
      lang: "en_US"
    }).toString();
    const res = await fetch(`${BASE_API_URL}?${query}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch animation tree", err);
    return null;
  }};
export const getAnimationUrls = (partId) => {
  if (!partId) {
    console.error("Invalid partId for animation");
    return null;
  }
  const base ="https://dev.motovisuals.com/api/animation_link/view/interactive_animation.php";
  const params = {
    api_key: API_KEY,
    part_id: partId,
    show_menu: 0,
    show_left_sidebar: 0,
    video_only: 0,
    auto_play: 1};
  const interactiveUrl = base + "?" + new URLSearchParams({
      ...params,
      is_interactive: 1
    });
  const normalUrl = base + "?" + new URLSearchParams({
      ...params,
      is_interactive: 0
    });         
  console.log("Interactive URL:", interactiveUrl);
  console.log("Normal URL:", normalUrl);
  return {
    type: "dual",
    interactive: interactiveUrl,
    normal: normalUrl
  };
};
export const generateViewerLinks = (partId) => {
  if (!partId) return null;
  //const inter = "https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation";
  ///const non-inter = "https://motovisuals.com/thirdpartyapi/#!/viewAnimation";
  return {
    type: "dual",
    interactive: `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation${inter}/${partId}?show_menu=0&is_interactive=1&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0`,
    normal: `https://motovisuals.com/thirdpartyapi/#!/viewAnimation${non-inter}/${partId}?show_menu=0&is_interactive=0&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0`
  };
}; 
export const getAnimationShareLink = async (partId) => {
  if (!partId) {
    console.error("partId required for streaming");
    return null;}
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
    //console.log("Share Link Response:", data);
    if (Array.isArray(data)) {
      return data[0];
    }
    return data;
  } catch (err) {
    console.error("Share Link error:", err);
    return null;
  }
};
export const updateAnimationLink = async ({
  unique_id,
  job_id,
  ref_id,
  cost,
  track_type = "email"
}) => {
  if (!unique_id || unique_id.length === 0) {
    console.error("unique_id is required");
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
export const generateShareLink = async (partId, options = {}) => {
  if (!partId) {
    console.error("partId is required");
    return null;
  }
  try {
    const query = new URLSearchParams({
      api_key: options.apiKey || API_KEY,
      part_id: partId,
      ro_number: options.ro_number || "RO123",
      moduleName: "emailananimation",
      methodName: "getDynamicGeneratedUrl",
      expire_in_days: options.expire_in_days || 7
    }).toString();
    const url = `${BASE_API_URL}?${query}`;
    console.log("Share Link API:", url);
    const res = await fetch(url);
    const data = await res.json();
    return data?.url || null;
  } catch (err) {
    console.error("Failed to generate share link", err);
    return null;
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
        if (data[key] && data[key].startsWith("aHR0")) {
          try {
            data[key] = atob(data[key]);
          } catch (e) {
            console.warn("Failed to decode", key);
          }
        }
      });
    }
    console.log("Video Details Response:", data);
    return data;
  } catch (err) {
    console.error("Failed to fetch video details", err);
    return null;
  }
};
