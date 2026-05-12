import { useState } from "react";
import "./App.css";

const styles = [
  "手描きアニメ",
  "シネマ風",
  "水彩画",
  "ジブリ風",
  "小红书风",
  "Threads极简",
];

function App() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("jp");
  const [style, setStyle] = useState(styles[0]);

  const text = {
    jp: {
      title: "風、光、森の気配まで描く AI作図サイト",
      subtitle:
        "言葉から、SNS向けの美しいビジュアルを数秒で生成。",
      placeholder:
        "例：夕暮れの田舎道を歩く柴犬、小さな旅人、温かい光、映画のような空気感。",
      button: "画像を生成",
      loading: "生成中...",
    },
    cn: {
      title: "连风、光与空气感都能生成的 AI 作图网站",
      subtitle:
        "几秒内生成适合小红书 / Threads / 民宿宣传的高级视觉。",
      placeholder:
        "例如：夕阳下的乡间小路，一只柴犬和小旅行者，温暖光线，电影感。",
      button: "生成图片",
      loading: "生成中...",
    },
  };

  const t = text[language as "jp" | "cn"];

  async function generateImage() {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setImageUrl("");

    try {
      const finalPrompt = `${prompt}, ${style}, ultra aesthetic, cinematic lighting`;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: finalPrompt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "error");
      }

      setImageUrl(data.imageUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function downloadImage() {
    if (!imageUrl) return;

    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "moricanvas-ai.png";
    link.click();
  }

  return (
    <main className="page">
      <section className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <div className="badge">🌿 MoriCanvas AI</div>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.08)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <option value="jp">日本語</option>
            <option value="cn">中文</option>
          </select>
        </div>

        <h1>{t.title}</h1>

        <p className="subtitle">{t.subtitle}</p>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 18,
          }}
        >
          {styles.map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              style={{
                width: "auto",
                padding: "10px 18px",
                background:
                  style === s
                    ? "linear-gradient(135deg,#86efac,#67e8f9)"
                    : "rgba(255,255,255,0.08)",
                color: style === s ? "#052e16" : "white",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t.placeholder}
        />

        <button onClick={generateImage} disabled={loading}>
          {loading ? t.loading : t.button}
        </button>

        {error && <p className="error">{error}</p>}

        {imageUrl && (
          <div className="result">
            <img src={imageUrl} alt="generated" />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <button onClick={downloadImage}>保存图片</button>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(window.location.href)
                }
              >
                分享链接
              </button>
            </div>
          </div>
        )}

        <p className="footer">
          MoriCanvas AI © 2026 · AI Visual Platform
        </p>
      </section>
    </main>
  );
}

export default App;
