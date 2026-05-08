import express from "express";

const router = express.Router();
const STORE = {};
const VIEW_LOGS = [];
console,log("Track.js file Loaded");
router.post("/track-view", (req, res) => {
  try {
    const { job_id, animation_name, type, animation_id,video_url} = req.body;
    if (!job_id || !type) {
      return res.status(400).json({
        status: false,
        message: "Fill the Required Fields"
      });
    }
    
    if (!STORE[job_id]) {
      STORE[job_id] = {
        interactive: 0,
        narrated: 0
      };
    }

    if (type === "interactive") {
      STORE[job_id].interactive += 1;
    }

    if (type === "narrated") {
      STORE[job_id].narrated += 1;
    }

    VIEW_LOGS.push({ job_id, animation_name: animation_name || `Animation ${animation_id}`, animation_id, video_url, type, track_date_time: new Date().toISOString()});
    console.log("VIEW LOGS:", VIEW_LOGS);
    res.json({
      status: true,
      message: "Tracked Successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false
    });
  }
});
 
router.get("/view-count/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (id === "all") {
      let interactive = 0;
      let narrated = 0;

      Object.values(STORE).forEach((item) => {
        interactive += item.interactive || 0;
        narrated += item.narrated || 0;
      });

      return res.json({
        interactive,
        narrated
      });
    }

    return res.json(
      STORE[id] || {
        interactive: 0,
        narrated: 0
      }
    );
  } catch (err) {
    res.status(500).json({
      status: false
    });
  }
});

router.get("/viewed-animations", (req, res) => {
  try {
    const { from_date, to_date } = req.query;
    let filtered = VIEW_LOGS;
    if (from_date && to_date) {
      const from = new Date(from_date);
      const to = new Date(to_date);
      to.setHours(23, 59, 59, 999);
      filtered = VIEW_LOGS.filter((item) => {
        const d = new Date(item.track_date_time);
        return d >= from && d <= to;
      });
    }

    filtered.sort(
      (a, b) =>
        new Date(b.track_date_time) -
        new Date(a.track_date_time)
    );

    res.json({
      status: true,
      count: filtered.length,
      data: filtered
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      status: false
    });
  }
});

export default router;
