import express from "express";
const router = express.Router();

const STORE = {};
const VIEW_LOGS = [];

router.post("/track-view", (req, res) => {
  try {
    const { job_id, type, animation_name } = req.body;

    if (!job_id || !type) {
      return res.status(400).json({
        status: false,
        message: "job_id and type are required"
      });
    }

    if (!STORE[job_id]) {
      STORE[job_id] = {
        interactive: 0,
        narrated: 0
      };
    }

    if (type === "interactive" || type === "narrated") {
      STORE[job_id][type] += 1;
    }

    // Save log for viewed report
    VIEW_LOGS.push({
      job_id,
      type,
      animation_name: animation_name || job_id,
      track_date_time: new Date().toISOString()
    });

    console.log("STORE:", STORE);

    res.json({
      status: true,
      message: "View tracked successfully"
    });

  } catch (err) {
    console.error("Track error:", err);
    res.status(500).json({ status: false });
  }
});

router.get("/view-count/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (id === "all") {
      let totalInteractive = 0;
      let totalNarrated = 0;

      Object.values(STORE).forEach(item => {
        totalInteractive += item.interactive || 0;
        totalNarrated += item.narrated || 0;
      });

      return res.json({
        interactive: totalInteractive,
        narrated: totalNarrated
      });
    }

    const result = STORE[id] || {
      interactive: 0,
      narrated: 0
    };

    res.json(result);

  } catch (err) {
    console.error("View count error:", err);
    res.status(500).json({ status: false });
  }
});
router.get("/viewed-animations", (req, res) => {
  try {
    const { from_date, to_date } = req.query;

    if (!from_date || !to_date) {
      return res.status(400).json({
        status: false,
        message: "from_date and to_date are required"
      });
    }

    const from = new Date(from_date);
    const to = new Date(to_date);
    to.setHours(23, 59, 59, 999);

    const filtered = VIEW_LOGS.filter(item => {
      const d = new Date(item.track_date_time);
      return d >= from && d <= to;
    });

    res.json({
      status: true,
      count: filtered.length,
      data: filtered
    });

  } catch (err) {
    console.error("Viewed animations error:", err);
    res.status(500).json({ status: false });
  }
});

export default router;

