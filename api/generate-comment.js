const MAX_TEXT = 5000;
function clean(value, max = MAX_TEXT) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const accessCode = process.env.AI_ACCESS_CODE;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!accessCode || !apiKey) return res.status(503).json({ error: "AI is not configured. Add GEMINI_API_KEY and AI_ACCESS_CODE in Vercel Environment Variables." });
  if (req.headers["x-ai-access-code"] !== accessCode) return res.status(401).json({ error: "The AI access code is missing or incorrect." });
  const body = req.body || {};
  const caption = clean(body.caption), description = clean(body.description), topic = clean(body.topic, 500);
  const preferences = body.preferences && typeof body.preferences === "object" ? body.preferences : {};
  const tone = clean(preferences.tone, 160) || "Warm, friendly, respectful and mature";
  const language = clean(preferences.language, 160) || "English first; occasional natural Hinglish";
  const length = clean(preferences.length, 40) || "Medium";
  const instructions = clean(preferences.instructions, 1200);
  const culture = clean(preferences.culture, 1200);
  const imageUrl = clean(body.imageUrl, 1500);
  if (!caption && !description && !topic && !imageUrl) return res.status(400).json({ error: "Add a caption, description, topic or image first." });
  if (imageUrl) { try { const parsed = new URL(imageUrl); if (parsed.protocol !== "https:" || parsed.username || parsed.password) throw new Error("invalid"); } catch { return res.status(400).json({ error: "Image URL must be a public HTTPS URL without embedded credentials." }); } }
  const prompt = [
    "Create one natural Facebook comment responding to the creator's actual post.",
    "Do not claim to have seen details that are not supplied. If only a caption/topic is supplied, react only to that.",
    "Personality: " + tone, "Language: " + language, "Length: " + length,
    "Additional owner instructions: " + instructions, "Cultural context guidance: " + culture,
    "Caption: " + caption, "Video description or transcript: " + description, "Topic: " + topic,
    imageUrl ? "An image URL was supplied but its contents are not available to this text-only request: " + imageUrl : "",
    "Avoid generic praise, false familiarity, engagement bait, assumptions about identity or region, and repeated emojis. Do not mention AI. Output only the comment."
  ].filter(Boolean).join("\n\n");
  try {
    const upstream = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + encodeURIComponent(apiKey), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 220, temperature: 0.8 }
      })
    });
    const data = await upstream.json();
    if (!upstream.ok) return res.status(502).json({ error: "The Gemini request failed. Check the Gemini API key and its free-tier quota.", providerStatus: upstream.status });
    const output = (data.candidates || []).flatMap(candidate => candidate.content?.parts || []).filter(part => typeof part.text === "string").map(part => part.text).join("\n").trim();
    if (!output) return res.status(502).json({ error: "Gemini returned an empty response. Try again." });
    return res.status(200).json({ comment: output, provider: "Gemini", model: "gemini-2.5-flash" });
  } catch {
    return res.status(502).json({ error: "Could not reach Gemini. Try again later." });
  }
}
