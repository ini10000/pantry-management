import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { items } = req.body;

      // Ensure items is an array and has at least one item
      if (!Array.isArray(items) || items.length === 0) {
        return res
          .status(400)
          .json({ error: "Items array is required and should not be empty" });
      }

      // Call OpenAI API for recipe suggestions
      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          prompt: `Suggest recipes using the following ingredients: ${items.join(
            ", "
          )}`,
          max_tokens: 10000,
          n: 1,
          stop: null,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("OpenAI API error:", error);
        return res
          .status(response.status)
          .json({ error: error.message || "Failed to get recipes" });
      }

      const result = await response.json();
      const recipes = result.choices[0].text
        .trim()
        .split("\n")
        .filter((recipe) => recipe);

      res.status(200).json({ recipes });
    } catch (error) {
      console.error("API error:", error);
      res.status(500).json({ error: "Failed to get recipes" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
