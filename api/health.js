export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const configured = Boolean(process.env.OPENAI_API_KEY && process.env.AI_ACCESS_CODE);
  return res.status(200).json({ aiConfigured: configured, provider: configured ? "OpenAI" : null });
}
