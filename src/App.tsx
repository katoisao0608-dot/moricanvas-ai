import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./App.css";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type Lang = "jp" | "en" | "cn";

const text = {
  jp: {
    eyebrow: "AI画像生成 · 民泊 · ペット · 旅行 · SNS",
    title: "一文から、投稿に使える上質な画像を生成",
    subtitle:
      "用途・雰囲気・比率を選ぶことで、生成結果そのものが変化します。",
    login: "ログイン",
    logout: "ログアウト",
    guest: "ゲストモード",
    prompt: "画像を説明してください",
    generate: "画像を生成",
    generating: "生成中...",
    preview: "プレビュー",
    waiting: "画像はここに表示されます",
    download: "画像を保存",
  },

  en: {
    eyebrow: "AI IMAGE · STAY · PET · TRAVEL · SOCIAL",
    title: "Turn one sentence into a publish-ready image",
    subtitle:
      "Use case, style and ratio directly affect the generated result.",
    login: "Log in",
    logout: "Log out",
    guest: "Guest mode",
    prompt: "Describe your image",
    generate: "Generate image",
    generating: "Generating...",
    preview: "Preview",
    waiting: "Your image will appear here",
    download: "Download",
  },

  cn: {
    eyebrow: "AI 图片生成 · 民宿 · 宠物 · 旅行 · 社交媒体",
    title: "输入一句话，生成适合发布的高级图片",
    subtitle:
      "用途、风格和比例会真正影响最终生成结果。",
    login: "登录",
    logout: "退出",
    guest: "游客模式",
    prompt: "描述你想生成的画面",
    generate: "生成图片",
    generating: "生成中...",
    preview: "预览结果",
    waiting: "生成结果会显示在这里",
    download: "下载图片",
  },
};

const presets = [
  {
    name: "民宿",
    prompt:
      "Japanese countryside guesthouse, cozy wooden house, warm lights, healing atmosphere",
  },

  {
    name: "小红书",
    prompt:
      "premium lifestyle social media cover, trendy, clean composition",
  },

  {
    name: "宠物",
    prompt:
      "premium pet portrait, emotional lighting, warm atmosphere",
  },

  {
    name: "旅行",
    prompt:
      "cinematic travel poster, poetic landscape, refined color palette",
  },
];

const styles = [
  {
    name: "日系",
    prompt:
      "Japanese lifestyle magazine aesthetic, natural tones, quiet luxury",
  },

  {
    name: "电影感",
    prompt:
      "cinematic film still, atmospheric depth, premium lighting",
  },

  {
    name: "手绘",
    prompt:
      "soft hand-drawn animation illustration, warm palette",
  },

  {
    name: "写实",
    prompt:
      "high-end photorealistic commercial photography",
  },
];

const ratios = [
  {
    name: "1:1",
    prompt: "square composition",
  },

  {
    name: "4:5",
    prompt: "vertical social feed composition",
  },

  {
    name: "9:16",
    prompt: "mobile vertical composition",
  },

  {
    name: "16:9",
    prompt: "wide cinematic composition",
  },
];

export default function App() {
  const [lang, setLang] = useState<Lang>("jp");

  const t = text[lang];

  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const [preset, setPreset] = useState(presets[0]);
  const [style, setStyle] = useState(styles[0]);
  const [ratio, setRatio] = useState(ratios[1]);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => data.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function generateImage() {
    if (!prompt.trim()) return;

    setLoading(true);
    setImage("");

    const finalPrompt = `
Main idea:
${prompt}

Use case:
${preset.prompt}

Visual style:
${style.prompt}

Aspect ratio:
${ratio.prompt}

Premium AI image, elegant composition, commercially usable, beautiful lighting, no watermark.
`;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          prompt: finalPrompt,
          ratio: ratio.name,
        }),
      });

      const data = await res.json();

      if (data.image) {
        setImage(data.image);
      }
    } catch (err) {
      alert("Error");
    }

    setLoading(false);
  }

  function downloadImage() {
    if (!image) return;

    const a = document.createElement("a");

    a.href = image;
    a.download = "moricanvas-ai.png";

    a.click();
  }

  return (
    <main className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brandIcon">M</div>

          <div>
            <strong>MoriCanvas AI</strong>
            <small>AI Image Studio</small>
          </div>
        </div>

        <div className="topActions">
          <select
            value={lang}
            onChange={(e) =>
              setLang(e.target.value as Lang)
            }
          >
            <option value="jp">日本語</option>
            <option value="en">English</option>
            <option value="cn">中文</option>
          </select>

          <span className="pill">
            {user ? user.email : t.guest}
          </span>

          {user && (
            <button
              className="ghostBtn"
              onClick={signOut}
            >
              {t.logout}
            </button>
          )}
        </div>
      </header>

      <section className="hero">
        <p className="eyebrow">{t.eyebrow}</p>

        <h1>{t.title}</h1>

        <p className="heroText">
          {t.subtitle}
        </p>
      </section>

      <section className="workspace">
        <section className="creator">
          <div className="sectionCard">
            <h3>Use case</h3>

            <div className="chips">
              {presets.map((item) => (
                <button
                  key={item.name}
                  className={
                    preset.name === item.name
                      ? "chip active"
                      : "chip"
                  }
                  onClick={() => setPreset(item)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="sectionCard">
            <h3>{t.prompt}</h3>

            <textarea
              value={prompt}
              onChange={(e) =>
                setPrompt(e.target.value)
              }
              placeholder="北关东の古民家、柴犬、夕方の暖かい光..."
            />
          </div>

          <div className="sectionCard">
            <h3>Style</h3>

            <div className="chips">
              {styles.map((item) => (
                <button
                  key={item.name}
                  className={
                    style.name === item.name
                      ? "chip active"
                      : "chip"
                  }
                  onClick={() => setStyle(item)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="sectionCard">
            <h3>Ratio</h3>

            <div className="chips">
              {ratios.map((item) => (
                <button
                  key={item.name}
                  className={
                    ratio.name === item.name
                      ? "chip active"
                      : "chip"
                  }
                  onClick={() => setRatio(item)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <button
            className="generateBtn"
            onClick={generateImage}
            disabled={loading}
          >
            {loading
              ? t.generating
              : t.generate}
          </button>
        </section>

        <aside className="preview">
          <div className="previewTop">
            <div>
              <span>{t.preview}</span>

              <h2>
                {preset.name} · {style.name}
              </h2>
            </div>

            <em>{ratio.name}</em>
          </div>

          <div className="canvas">
            {loading && (
              <div className="loading">
                {t.generating}
              </div>
            )}

            {!loading && !image && (
              <div className="empty">
                <b>✦</b>

                <p>{t.waiting}</p>
              </div>
            )}

            {image && (
              <img
                src={image}
                alt="Generated"
              />
            )}
          </div>

          {image && (
            <div className="actions">
              <button
                onClick={downloadImage}
              >
                {t.download}
              </button>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
