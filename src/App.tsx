import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./App.css";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const presets = [
  {
    id: "minpaku",
    label: "民宿宣传",
    title: "Pet-friendly Stay",
    description: "适合民宿、老房、旅行住宿宣传",
    prompt:
      "premium Japanese countryside guesthouse campaign image, pet-friendly stay, cozy wooden house, warm interior light, quiet healing atmosphere, suitable for accommodation promotion",
  },
  {
    id: "xiaohongshu",
    label: "小红书封面",
    title: "Lifestyle Cover",
    description: "干净、显眼、适合种草封面",
    prompt:
      "premium Xiaohongshu lifestyle cover image, clean trendy composition, soft daylight, elegant negative space for title, attractive social media visual",
  },
  {
    id: "threads",
    label: "Threads配图",
    title: "Minimal Mood",
    description: "极简、有空气感、有留白",
    prompt:
      "minimal editorial social media image for Threads, calm mood, clean negative space, modern quiet luxury visual, no clutter",
  },
  {
    id: "pet",
    label: "宠物写真",
    title: "Pet Portrait",
    description: "柴犬、猫、宠物品牌感",
    prompt:
      "premium emotional pet portrait, warm cinematic lighting, clean background, expressive animal face, charming but refined commercial photography",
  },
];

const aesthetics = [
  {
    label: "日系杂志",
    prompt:
      "Japanese lifestyle magazine aesthetic, natural tones, refined editorial composition, quiet luxury, soft realistic light",
  },
  {
    label: "电影感",
    prompt:
      "cinematic film still aesthetic, atmospheric depth, premium color grading, dramatic but elegant lighting",
  },
  {
    label: "手绘动画",
    prompt:
      "soft hand-drawn animation illustration, gentle linework, warm palette, poetic atmosphere, refined anime-inspired visual",
  },
  {
    label: "高级写实",
    prompt:
      "high-end photorealistic commercial photography, natural texture, premium lens quality, realistic details",
  },
];

const layoutStyles = [
  {
    label: "无文字",
    prompt: "no text, no letters, no logo, image only",
  },
  {
    label: "标题留白",
    prompt:
      "large clean negative space for future title placement, no readable text, editorial layout",
  },
  {
    label: "海报构图",
    prompt:
      "poster-like composition, strong visual hierarchy, clear subject, refined blank area, no readable text",
  },
];

const ratios = [
  { label: "1:1", size: "square composition, centered subject" },
  { label: "4:5", size: "vertical 4:5 social feed composition" },
  { label: "9:16", size: "mobile story vertical composition" },
  { label: "16:9", size: "wide cinematic horizontal composition" },
];

function App() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const [preset, setPreset] = useState(presets[0]);
  const [aesthetic, setAesthetic] = useState(aesthetics[0]);
  const [layoutStyle, setLayoutStyle] = useState(layoutStyles[1]);
  const [ratio, setRatio] = useState(ratios[1]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  async function signUp() {
    const { error } = await supabase.auth.signUp({ email, password });
    alert(error ? error.message : "注册成功，请检查邮箱");
  }

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else setShowAuth(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function generateImage() {
    if (!prompt.trim()) {
      alert("请输入你想生成的画面");
      return;
    }

    setLoading(true);
    setImage("");

    const finalPrompt = `
Main idea:
${prompt}

Commercial use case:
${preset.prompt}

Visual aesthetic:
${aesthetic.prompt}

Typography / layout direction:
${layoutStyle.prompt}

Aspect ratio:
${ratio.size}

Important quality rules:
premium AI image, coherent scene, elegant composition, beautiful lighting, commercially usable, clean details, no messy typography, no watermark, no distorted objects.
`;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          ratio: ratio.label,
        }),
      });

      const data = await res.json();

      if (data.image) setImage(data.image);
      else alert(data.error || "生成失败");
    } catch {
      alert("服务器错误");
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
      <header className="nav">
        <div className="brand">
          <div className="brandMark">M</div>
          <div>
            <strong>MoriCanvas AI</strong>
            <span>Prompt-driven visual studio</span>
          </div>
        </div>

        <div className="navRight">
          <span className="pill">{user ? user.email : "Guest Mode"}</span>
          {user ? (
            <button className="ghostBtn" onClick={signOut}>退出</button>
          ) : (
            <button className="ghostBtn" onClick={() => setShowAuth(!showAuth)}>
              登录
            </button>
          )}
        </div>
      </header>

      {showAuth && !user && (
        <section className="authPanel">
          <input placeholder="邮箱" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input placeholder="密码" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={signIn}>登录</button>
          <button onClick={signUp}>注册</button>
        </section>
      )}

      <section className="hero">
        <div>
          <p className="eyebrow">SNS · STAY · PET · TRAVEL</p>
          <h1>不是简单作图，是把用途、风格和构图一起生成。</h1>
          <p>
            选择一个真实商业场景，再选择视觉风格、排版方向和比例。每个选项都会写入最终 prompt，直接影响图片结果。
          </p>
        </div>
      </section>

      <section className="studio">
        <section className="left">
          <div className="block">
            <div className="blockHead">
              <span>01</span>
              <h2>选择用途</h2>
            </div>

            <div className="presetGrid">
              {presets.map((item) => (
                <button
                  key={item.id}
                  className={preset.id === item.id ? "preset active" : "preset"}
                  onClick={() => setPreset(item)}
                >
                  <strong>{item.label}</strong>
                  <span>{item.title}</span>
                  <small>{item.description}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="block">
            <div className="blockHead">
              <span>02</span>
              <h2>描述画面</h2>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例：北关东一栋可带宠物入住的日式老民宿，柴犬坐在木门前，傍晚暖光，安静治愈。"
            />
          </div>

          <div className="optionRow">
            <div className="optionBox">
              <h3>视觉风格</h3>
              <div className="chips">
                {aesthetics.map((item) => (
                  <button
                    key={item.label}
                    className={aesthetic.label === item.label ? "chip active" : "chip"}
                    onClick={() => setAesthetic(item)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="optionBox">
              <h3>标题 / 字体空间</h3>
              <div className="chips">
                {layoutStyles.map((item) => (
                  <button
                    key={item.label}
                    className={layoutStyle.label === item.label ? "chip active" : "chip"}
                    onClick={() => setLayoutStyle(item)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="optionBox">
              <h3>比例</h3>
              <div className="chips">
                {ratios.map((item) => (
                  <button
                    key={item.label}
                    className={ratio.label === item.label ? "chip active" : "chip"}
                    onClick={() => setRatio(item)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button className="generateBtn" onClick={generateImage} disabled={loading}>
            {loading ? "生成中..." : "生成图片"}
          </button>
        </section>

        <aside className="right">
          <div className="previewHead">
            <div>
              <span>Preview</span>
              <h2>{preset.label} · {aesthetic.label}</h2>
            </div>
            <em>{ratio.label}</em>
          </div>

          <div className="previewCanvas">
            {loading && <div className="loading">Generating...</div>}
            {!loading && !image && (
              <div className="empty">
                <b>✦</b>
                <p>生成结果会显示在这里</p>
              </div>
            )}
            {image && <img src={image} alt="Generated" />}
          </div>

          {image && (
            <div className="actions">
              <button onClick={downloadImage}>下载图片</button>
              <button onClick={() => navigator.clipboard.writeText(prompt)}>
                复制提示词
              </button>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

export default App;
