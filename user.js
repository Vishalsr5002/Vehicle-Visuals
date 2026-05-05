import express from "express";
import fetch from "node-fetch";
const router = express.Router();
const viewStore = {}; 
const BASE_URL = "https://motovisuals.com/api/animation_link/api/api.php";
router.get("/user-details", async (req, res) => {
  try {
    const { loginId, password } = req.query;
    if (!loginId || !password) {
      return res.status(400).json({
        status: false,
        message: "Missing loginId or password"
      });}
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
  }});
router.get("/get-api-key", async (req, res) => {
  try {
    const { loginId, password } = req.query;
    if (!loginId || !password) {
      return res.status(400).json({
        status: false,
        message: "Missing UserName or Password"
      });
    }
    const url = `${BASE_URL}?subscriber_login_id=${loginId}&subscriber_password=${password}&moduleName=user&methodName=getApiKey`;
    console.log("Get API Key API:", url);
    const response = await fetch(url);
    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error("GET API KEY ERROR:", err);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch API key"
    });
  }});

  router.get("/generate-link", async (req, res) => {
  try {
    const { apiKey, partId } = req.query;

    if (!apiKey || !partId) {
      return res.status(400).json({
        status: false,
        message: "Missing apiKey or partId"
      });
    }
    const interactive = `https://dev.motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}?show_menu=0&is_interactive=1&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0`;
    const narrated = `https://motovisuals.com/thirdpartyapi/#!/viewAnimation/${partId}?show_menu=0&is_interactive=0&show_left_sidebar=0&show_description=0&video_only=0&auto_play=0`;
    console.log("INTERACTIVE:", interactive);
    console.log("NARRATED:", narrated);
    const shortInteractiveRes = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(interactive)}`
    );
    const shortInteractive = await shortInteractiveRes.text();
    const shortNarratedRes = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(narrated)}`
    );
    const shortNarrated = await shortNarratedRes.text();
    console.log("SHORT INTERACTIVE:", shortInteractive);
    console.log("SHORT NARRATED:", shortNarrated);
    return res.json({
      status: true,
      data: {
        interactive,
        narrated,
        shortInteractive,
        shortNarrated
      }
    });

  } catch (err) {
    console.error("GENERATE LINK ERROR:", err);
    return res.status(500).json({
      status: false,
      message: "Failed to generate link"
    });
  }
});
router.get("/view-count/:id", (req, res) => {
  const id = req.params.id;
  return res.json({
    status: true,
    data: viewStore[id] || {
      interactive: 0,
      narrated: 0
    }
  });
});

router.post("/track-view", async (req, res) => {
  try {
    const { job_id, type } = req.body;
    if (!job_id || !type) {
      return res.status(400).json({
        status: false,
        message: "Missing job_id or type"
      });
    }

    if (!viewStore[job_id]) {
      viewStore[job_id] = {
        interactive: 0,
        narrated: 0
      };
    }
    viewStore[job_id][type] += 1;
    console.log("STORE:", viewStore);
    return res.json({
      status: true
    });
  } catch (err) {
    console.error("TRACK VIEW ERROR:", err);
    res.status(500).json({ status: false });
  }
});

export default router;