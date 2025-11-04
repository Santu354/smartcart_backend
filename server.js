import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // if not installed: npm install node-fetch
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// ✅ Existing routes
import productRoutes from "./routes/products.js";
app.use("/api/products", productRoutes);

// ✅ New AI Chat route
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 🔹 Use Gemini API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDQQiBGgx79nSKNyZiBhFYa-Ozny-Euy1g",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: userMessage }] }],
        }),
      }
    );

    const data = await response.json();
    const aiReply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t get an answer right now.";

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
