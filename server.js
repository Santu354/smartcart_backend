const express = require("express");
const cors = require("cors");
const path = require("path");
const productRoutes = require("./routes/products");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded images (optional)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Product routes
app.use("/api/products", productRoutes);

// ✅ Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// 🔹 AI Chat Endpoint — gives intelligent real-time answers
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "No message received." });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are SmartCart AI — a friendly shopping assistant.
      The user said: "${message}".
      Give a helpful, short, and real-time answer about the product, deals, or tips.
      Keep it conversational and avoid code or long lists.
    `;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error("❌ AI Error:", error);
    res.status(500).json({ reply: "Sorry, I couldn’t get that right now. Try again later!" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
