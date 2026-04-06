const BASE_API_URL = "https://dev.motovisuals.com/api/animation_link/api/api.php";
const API_KEY = "tg2zw99gwqb5";
const normalizeSearchData = (data) => {
  if (!data || typeof data !== "object") return [];
  return Object.values(data);
};
export const searchAnimations = async (term, options = {}) => {
  if (!term) return [];
  try {
    const query = new URLSearchParams({
      api_key: options.apiKey || API_KEY,
      moduleName: "animation",
      methodName: "searchAnimation",
      //part_id: options.part_id || "",
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
    } catch {
      console.error("Invalid JSON from API");
      return [];
    }
    return normalizeSearchData(data);
  } catch (err) {
    console.warn("Search API failed, fallback used");
    return [
      {
        part_id: "7011",
        title: "Clutch System",
        image: "/clutchh.webp"
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
    const url = `${BASE_API_URL}?${query}`;
    console.log("Animation Details API:", url);
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch animation details", err);
    return null;
  }
};
export const getAnimationUrls = (partId) => {
  if (!partId) return null;
  const base = "https://dev.motovisuals.com/api/animation_link/view/interactive_animation.php";
  const params = {
    api_key: API_KEY,
    part_id: partId,
    show_menu: 0,
    show_left_sidebar: 0,
    video_only: 0,
    auto_play: 1
  };
  return {
    type: "dual",
    interactive:
      base +
      "?" +
      new URLSearchParams({
        ...params,
        is_interactive: 1
      }),
    normal:
      base +
      "?" +
      new URLSearchParams({
        ...params,
        is_interactive: 0
      })
  };
};
export const generateViewerLinks = (partId) => {
  if (!partId) return null;
  return {
    type: "dual",
    interactive: `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}?show_menu=0&is_interactive=1&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0`,
    normal: `https://motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}?show_menu=0&is_interactive=0&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0`
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
    if (Array.isArray(data)) return data[0];
    return data;
  } catch (err) {
    console.error("Share Link error:", err);
    return null;
  }};
export const updateAnimationLink = async ({
  unique_id,
  job_id,
  ref_id,
  cost,
  track_type = "email"
}) => {
  if (!unique_id) {
    console.error("unique_id is required");
    return null;
  }
  try {
    const payload = {
      api_key: API_KEY,
      moduleName: "emailananimation",
      methodName: "updateAnimationLink",
      unique_id: Array.isArray(unique_id)
        ? unique_id
        : [unique_id],

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
      ["videoUrl", "videoUrlHLS", "videoUrlDash"].forEach(
        (key) => {
          if (data[key]?.startsWith("aHR0")) {
            try {
              data[key] = atob(data[key]);
            } catch {}
          }
        }
      );
    }
    return data;
  } catch (err) {
    console.error("Video details error:", err);
    return null;
  }
};
