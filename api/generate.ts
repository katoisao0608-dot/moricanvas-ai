declare const process: any;
declare const Buffer: any;

function dataUrlToBlob(dataUrl: string) {
  const [meta, base64] = dataUrl.split(",");
  const mime = meta.match(/data:(.*);base64/)?.[1] || "image/png";
  const binary = Buffer.from(base64, "base64");

  return new Blob([binary], { type: mime });
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, ratio, referenceImage } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    let size = "1024x1024";

    if (ratio === "16:9") size = "1536x1024";
    if (ratio === "9:16") size = "1024x1536";
    if (ratio === "4:5") size = "1024x1536";

    let response;

    if (referenceImage) {
      const imageBlob = dataUrlToBlob(referenceImage);

      const formData = new FormData();
      formData.append("model", "gpt-image-1");
      formData.append("prompt", prompt);
      formData.append("size", size);
      formData.append("image", imageBlob, "reference.png");

      response = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: formData,
      });
    } else {
      response = await fetch("https://api.openai.com/v1/images/generations", {
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
    }

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
