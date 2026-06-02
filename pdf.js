import express from "express";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
router.post("/generate-pdf", async (req, res) => {
  try {
    console.log("PDF ROUTE HIT");
    console.log("BODY:", req.body);
    const {
      title = "Default Title",
      leftText = "",
      rightText = "",
      image1 = "",
      image2 = ""
    } = req.body || {};
    const templatePath = path.join(__dirname, "../template.html");
    if (!fs.existsSync(templatePath)) {
      return res.status(500).json({
        error: "Template file not found"
      });
    }
    let html = fs.readFileSync(templatePath, "utf8");
    html = html
      .replace(/{{title}}/g, title)
      .replace(/{{leftText}}/g, leftText)
      .replace(/{{rightText}}/g, rightText)
      .replace(/{{image1}}/g, image1)
      .replace(/{{image2}}/g, image2);
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.evaluate(async () => {
      const images = Array.from(document.images);
      await Promise.all(
        images.map(img => {
          if (img.complete) return;
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }));
    });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true
    });
    await browser.close();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=animation-report.pdf"
    );
    res.send(pdf);

  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).json({ error: "PDF generation failed" });
  }
});

export default router;
