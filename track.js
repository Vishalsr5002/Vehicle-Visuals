import express from "express";

const router = express.Router();
const STORE = {};
const VIEW_LOGS = [];
console.log("Track.js Loaded");
router.post("/track-view", (req, res) => {
  try {
    const {
      job_id,
      animation_name,
      type,
      animation_id,
      video_url
    } = req.body;

    if (!job_id || !type) {
      return res.status(400).json({
        status: false,
        message: "Required fields missing"
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
    VIEW_LOGS.push({
      job_id,
      animation_name: animation_name || `Animation ${animation_id}`,
      animation_id,
      video_url,
      type,
      track_date_time: new Date().toISOString()
    });
    console.log("STORE:", STORE);
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
        status: true,
        data: {
          interactive,
          narrated
        }
      });
    }
    return res.json({
      status: true,
      data:
        STORE[id] || {
          interactive: 0,
          narrated: 0
        }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false
    });
  }
});
router.get("/viewed-animations", (req, res) => {
  try {
    const { from_date, to_date } = req.query;
    //if(!from_date && !to_date)
      //return alert("Enter the From Date and To Date");
    let filtered = VIEW_LOGS;
    if (from_date && to_date) {
      filtered = VIEW_LOGS.filter((item) => {
        const itemDate = new Date(
          item.track_date_time
        )
          .toISOString()
          .split("T")[0];
        return (
          itemDate >= from_date &&
          itemDate <= to_date
        );
      });
    }
    filtered.sort(
      (a, b) =>
        new Date(b.track_date_time) -
        new Date(a.track_date_time)
    );
    console.log("FILTERED REPORT:", filtered);
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
