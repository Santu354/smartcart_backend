import express from "express";
import cors from "cors";
import fetch from "node-fetch";
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

    console.log("🟣 User Message:", userMessage);
    console.log("🔑 Using GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "Loaded ✅" : "❌ Missing");

    // 🔹 Use Gemini API (secured)
    const response = await fetch(
     `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`

      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: userMessage }] }],
        }),
      }
    );

    const data = await response.json();
    console.log("🟢 Gemini Raw Response:", JSON.stringify(data, null, 2)); // 👈 add this line

    const aiReply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t get an answer right now.";

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("❌ AI Chat Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
console.log("✅ GEMINI_API_KEY loaded:", !!process.env.GEMINI_API_KEY);
console.log("✅ Current Environment:", process.env.NODE_ENV || "development");

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
