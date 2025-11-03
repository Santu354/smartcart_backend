const express = require("express");
const cors = require("cors");
const path = require("path");
const productRoutes = require("./routes/products");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded images (optional)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API routes
app.use("/api/products", productRoutes);

// ✅ Simple AI Chat Endpoint
app.post("/api/chat", (req, res) => {
  try {
    const { message } = req.body;

    // 🧠 Handle missing message
    if (!message || typeof message !== "string") {
      return res
        .status(400)
        .json({ reply: "Please type a message for me to respond 😊" });
    }

    const lowerMsg = message.toLowerCase();
    let reply =
      "I'm your SmartCart assistant 🛒 — I can help you find the best deals across Amazon, Flipkart, Snapdeal, and Myntra!";

    // 💬 Basic rule-based responses
    if (lowerMsg.includes("iphone")) {
      reply =
        "📱 Best iPhone deals are often on Flipkart and Amazon. Try searching 'iPhone 14' or 'iPhone 15' using the Compare button!";
    } else if (lowerMsg.includes("laptop")) {
      reply =
        "💻 You’ll find amazing laptop offers on Amazon and Snapdeal — HP, Dell, and Lenovo have great discounts right now!";
    } else if (lowerMsg.includes("watch")) {
      reply =
        "⌚ Smartwatches like Fire-Boltt, Noise, and boAt are on sale on Amazon and Myntra!";
    } else if (lowerMsg.includes("shoes")) {
      reply =
        "👟 You’ll find huge discounts on branded shoes at Myntra and Flipkart — try searching for Nike or Puma!";
    } else if (
      lowerMsg.includes("best deal") ||
      lowerMsg.includes("discount") ||
      lowerMsg.includes("offer")
    ) {
      reply =
        "💸 Use the 'Compare on All Platforms' button to instantly see the best prices for your product!";
    } else if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
      reply =
        "Hey there 👋! I’m SmartCart AI. What product are you looking for today?";
    } else if (lowerMsg.includes("thank")) {
      reply = "You're welcome! 😊 Always happy to help you find great deals!";
    }

    res.json({ reply });
  } catch (err) {
    console.error("❌ Chat route error:", err);
    res.status(500).json({ reply: "Server error, please try again later." });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
