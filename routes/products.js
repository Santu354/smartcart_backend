const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// --- Mock function to generate random price ---
function randomPrice(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Generate platform search links ---
function generateLink(platform, query) {
  const encoded = encodeURIComponent(query);
  switch (platform.toLowerCase()) {
    case "amazon":
      return `https://www.amazon.in/s?k=${encoded}`;
    case "flipkart":
      return `https://www.flipkart.com/search?q=${encoded}`;
    case "snapdeal":
      return `https://www.snapdeal.com/search?keyword=${encoded}`;
    case "myntra":
      return `https://www.myntra.com/${query
        .trim()
        .replace(/ /g, "-")
        .toLowerCase()}`;
    default:
      return "#";
  }
}

// --- Keywords for detecting electronics ---
const electronicsKeywords = [
  "phone",
  "laptop",
  "tv",
  "camera",
  "headphone",
  "speaker",
  "watch",
  "tablet",
  "console",
  "keyboard",
  "mouse",
  "monitor",
  "earbuds",
];

// --- Compare route ---
router.get("/compare", (req, res) => {
  const { query, platform } = req.query;
  if (!query) return res.status(400).json({ deals: [] });

  const isElectronics = electronicsKeywords.some((keyword) =>
    query.toLowerCase().includes(keyword)
  );

  // Choose platforms based on type
  let platforms = [];
  if (platform) {
    platforms = [platform];
  } else {
    platforms = isElectronics
      ? ["Amazon", "Flipkart"]
      : ["Amazon", "Flipkart", "Snapdeal", "Myntra"];
  }

  const deals = platforms.map((p) => {
    const priceRange = isElectronics ? [30000, 70000] : [500, 3000];
    return {
      platform: p,
      price: randomPrice(priceRange[0], priceRange[1]),
      link: generateLink(p, query),
    };
  });

  res.json({ deals });
});

// --- Image Upload Setup (Multer) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// --- Detect route ---
router.post("/detect", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    console.log("📸 Image uploaded:", req.file.path);

    // Simple filename-based detection (mock)
    const filename = req.file.originalname.toLowerCase();
    let detectedProduct = "unknown";

    if (filename.includes("phone")) detectedProduct = "smartphone";
    else if (filename.includes("laptop")) detectedProduct = "laptop";
    else if (filename.includes("watch")) detectedProduct = "smartwatch";
    else if (filename.includes("headphone")) detectedProduct = "headphones";
    else if (filename.includes("tv")) detectedProduct = "television";

    // Send back detected name
    res.json({ product: detectedProduct });
  } catch (err) {
    console.error("❌ Error detecting product:", err);
    res.status(500).json({ error: "Server error detecting product" });
  }
});

module.exports = router;
