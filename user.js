import express from "express";
import fetch from "node-fetch";
const router = express.Router();
const viewStore = {};
//const STORE={};
//const VIEW_LOGS = [];
const BASE_URL = "https://motovisuals.com/api/animation_link/api/api.php";
router.get("/user-details", async (req, res) => {
  try {
    const { loginId, password } = req.query;
    if (!loginId || !password) {
      return res.status(400).json({
        status: false,
        message: "Fill the Required Fields"
      });
    }
    const url = `${BASE_URL}?subscriber_login_id=${loginId}&subscriber_password=${password}&moduleName=user&methodName=getUserDetails`;
    console.log("User Details API:", url);
    const response = await fetch(url);
    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error("User Details Error", err);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch user details"
    });
  }}
);
router.get("/get-api-key", async (req, res) => {
  try {
    const { loginId, password } = req.query;
    if (!loginId || !password) {
      return res.status(400).json({
        status: false,
        message: "Fill the Required Fields"
      });
    }
    const url = `${BASE_URL}?subscriber_login_id=${loginId}&subscriber_password=${password}&moduleName=user&methodName=getApiKey`;
    console.log("Get API Key API:", url);
    const response = await fetch(url);
    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error("Error in Fetching API Key:", err);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch API key"
    });
  }}
);

  router.get("/generate-link", async (req, res) => {
  try {
    const {
      apiKey,
      partId,
      roNumber = "",
      expireDays = 7
    } = req.query;
    if (!apiKey || !partId) {
      return res.status(400).json({
        status: false,
        message: "Api Key and Part Id is required"
      });
    }
    const apiUrl = `https://dev.motovisuals.com/api/animation_link/api/api.php` +
      `?api_key=${apiKey}` +
      `&moduleName=emailananimation` +
      `&methodName=getStreamingLink` +
      `&part_id=${partId}` +
      `&ro_number=${roNumber}` +
      `&expire_days=${expireDays}`;
    console.log("GENERATE LINK API:", apiUrl);
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log("GENERATE LINK RESPONSE:", data);
    let result = null;
    if (Array.isArray(data)) {
      result = data[0];
    } else if (data?.data) {
      result = data.data;
    } else {
      result = data;
    }
    if (!result) {
      return res.status(500).json({
        status: false,
        message: "Invalid API response"
      });
    }
    const unique_id = result.unique_id || "";
    const baseUrl = `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}`;
    const interactive =
      `${baseUrl}` +
      `?show_menu=0` +
      `&is_interactive=1` +
      `&show_left_sidebar=0` +
      `&show_description=0` +
      `&video_only=0` +
      `&auto_play=0`;
    const narrated =
      `${baseUrl}` +
      `?show_menu=0` +
      `&is_interactive=0` +
      `&show_left_sidebar=0` +
      `&show_description=0` +
      `&video_only=0` +
      `&auto_play=0`;
    console.log("INTERACTIVE URL:", interactive);
    console.log("NARRATED URL:", narrated);
    const shortBase = `https://dev.motovisuals.com/video_link_vv.php?num=${result.unique_id}&cc=1`;
    return res.json({
      status: true,
      data: {
        unique_id : result.unique_id,
        part_id : partId,
        interactive,
        narrated,
        shortInteractive: `${shortBase}&is_interactive=1`,
        shortNarrated: `${shortBase}&is_interactive=0`
      }
    });
  } catch (err) {
    console.error("GENERATE LINK ERROR:", err);
    return res.status(500).json({
      status: false,
      message: err.message || "Failed to generate link"
    });
  }
});

export default router;
