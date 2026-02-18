app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { 
            responseModalities: ["IMAGE"]  // ဒါလေး ထည့်ပေးရမှာပါ!
          }
        })
      }
    );

    const data = await response.json();
    const imagePart = data?.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    const imageBase64 = imagePart?.inlineData?.data;

    if (!imageBase64) {
      return res.status(400).json({ error: "Image not generated", details: data });
    }

    res.json({ image: "data:image/png;base64," + imageBase64 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
