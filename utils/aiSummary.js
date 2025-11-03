import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
    "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
  },
});

export async function getWeeklySummary(req, res) {
  try {
    const weeklyData = req.body;

    const prompt = `
    You are an analytics assistant. Given the user's weekly productivity data, summarize insights clearly and motivationally.

    Data:
    ${JSON.stringify(weeklyData, null, 2)}

    Respond with 3-4 sentences analyzing trends, improvements, or drops, focusing on motivation and next steps.
    `;

    const completion = await client.chat.completions.create({
      model: "openai/gpt-5",
      messages: [{ role: "user", content: prompt }],
    });

    const summary = completion.choices[0].message.content;

    res.json({ summary });
  } catch (error) {
    console.error("Error generating AI summary:", error);
    res.status(500).json({ message: "Error generating summary" });
  }
}
