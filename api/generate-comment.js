const MAX_TEXT = 5000;
function clean(value, max = MAX_TEXT) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const accessCode = process.env.AI_ACCESS_CODE;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!accessCode || !apiKey) return res.status(503).json({ error: "AI is not configured. Add OPENAI_API_KEY and AI_ACCESS_CODE in Vercel Environment Variables." });
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
  if (imageUrl && (!/^https:\/\//i.test(imageUrl) || !/^https:\/\//i.test(imageUrl))) return res.status(400).json({ error: "Image URL must use HTTPS." });
  const content = [{ type: "input_text", text: [
    "Create one natural Facebook comment responding to the creator's actual post.",
    "Do not claim to have seen details that are not supplied. If only a caption/topic is supplied, react only to that.",
    "Personality: " + tone, "Language: " + language, "Length: " + length,
    "Additional owner instructions: " + instructions, "Cultural context guidance: " + culture,
    "Caption: " + caption, "Video description or transcript: " + description, "Topic: " + topic,
    "Avoid generic praise, false familiarity, engagement bait, assumptions about identity or region, and repeated emojis. Do not mention AI. Output only the comment."
  ].join("\n\n") }];
  if (imageUrl) content.push({ type: "input_image", image_url: imageUrl, detail: "auto" });
  try {
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-5.5", store: false, max_output_tokens: 220, input: [{ role: "user", content }] })
    });
    const data = await upstream.json();
    if (!upstream.ok) return res.status(502).json({ error: "The AI provider request failed.", providerStatus: upstream.status });
    const output = (data.output || []).flatMap(item => item.content || []).filter(part => part.type === "output_text").map(part => part.text).join("\n").trim();
    if (!output) return res.status(502).json({ error: "The AI returned an empty response." });
    return res.status(200).json({ comment: output, provider: "OpenAI", model: data.model || process.env.OPENAI_MODEL || "gpt-5.5" });
  } catch (error) {
    return res.status(502).json({ error: "Could not reach the AI provider. Try again later." });
  }
}
