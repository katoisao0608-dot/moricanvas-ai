declare const process: any;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, ratio } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    let size = "1024x1024";

    if (ratio === "16:9") {
      size = "1536x1024";
    }

    if (ratio === "9:16") {
      size = "1024x1536";
    }

    if (ratio === "4:5") {
      size = "1024x1536";
    }

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Image generation failed",
      });
    }

    const base64Image = data.data?.[0]?.b64_json;

    if (!base64Image) {
      return res.status(500).json({ error: "No image returned" });
    }

    return res.status(200).json({
      image: `data:image/png;base64,${base64Image}`,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || "Server error",
    });
  }
}
