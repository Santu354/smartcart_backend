// routes/chat.js
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    let reply = "I'm not sure about that. Try asking about products or deals!";

    // Basic rule-based responses
    const msg = message.toLowerCase();

    if (msg.includes("discount")) {
      reply = "You can find the latest discounts on Amazon and Flipkart! 💸";
    } else if (msg.includes("best phone")) {
      reply =
        "Some of the best phones right now are the iPhone 15, Pixel 9, and OnePlus 13!";
    } else if (msg.includes("cheap laptop")) {
      reply =
        "Try looking for budget laptops on Amazon — Lenovo IdeaPad and HP are solid options.";
    } else if (msg.includes("offer")) {
      reply =
        "Flipkart Big Billion Days and Amazon Great Indian Festival are great for offers!";
    } else if (msg.includes("hello") || msg.includes("hi")) {
      reply = "Hey there! 👋 I'm SmartCart AI, your shopping assistant!";
    } else if (msg.includes("thank")) {
      reply = "You're welcome! 😊 Happy shopping!";
    }

    res.json({ reply });
  } catch (err) {
    console.error("❌ Chat error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
