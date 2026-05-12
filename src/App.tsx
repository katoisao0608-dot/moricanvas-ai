import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./App.css";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const useCases = [
  {
    name: "民宿宣传",
    prompt: "Japanese countryside guesthouse, cozy wooden house, warm lights, pet-friendly stay, calm healing atmosphere, suitable for travel accommodation promotion",
  },
  {
    name: "小红书封面",
    prompt: "premium Xiaohongshu cover design, clean composition, trendy lifestyle visual, soft light, eye-catching but elegant",
  },
  {
    name: "Threads配图",
    prompt: "minimal social media visual for Threads, clean layout, strong mood, modern editorial style, subtle negative space",
  },
  {
    name: "宠物写真",
    prompt: "premium pet portrait, emotional expression, soft cinematic lighting, clean background, warm and charming atmosphere",
  },
  {
    name: "旅行海报",
    prompt: "travel poster, cinematic landscape, poetic mood, refined color palette, elegant composition",
  },
];

const visualStyles = [
  {
    name: "手绘动画",
    prompt: "soft hand-drawn anime style, gentle lines, warm colors, poetic atmosphere, refined illustration",
  },
  {
    name: "高级写实",
    prompt: "high-end photorealistic style, premium commercial photography, natural light, detailed texture",
  },
  {
    name: "电影感",
    prompt: "cinematic composition, dramatic lighting, film still, atmospheric depth, premium color grading",
  },
  {
    name: "水彩治愈",
    prompt: "soft watercolor illustration, gentle texture, calming mood, airy composition",
  },
  {
    name: "日系杂志",
    prompt: "Japanese lifestyle magazine style, clean layout, quiet luxury, natural tones, refined editorial visual",
  },
];

const typographyMoods = [
  {
    name: "无文字",
    prompt: "no text, no letters, no typography, image only",
  },
  {
    name: "极简标题空间",
    prompt: "large clean negative space for minimal title placement, modern editorial layout, no actual readable text",
  },
  {
    name: "海报排版感",
    prompt: "poster-like composition with strong visual hierarchy, blank area for headline, no actual readable text",
  },
];

const ratios = [
  { name: "1:1", prompt: "square composition, centered subject" },
  { name: "4:5", prompt: "vertical social media composition, suitable for Xiaohongshu feed" },
  { name: "9:16", prompt: "vertical story composition, mobile-first layout" },
  { name: "16:9", prompt: "wide cinematic composition" },
];

function App() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const [useCase, setUseCase] = useState(useCases[0]);
  const [visualStyle, setVisualStyle] = useState(visualStyles[0]);
  const [typography, setTypography] = useState(typographyMoods[0]);
  const [ratio, setRatio] = useState(ratios[0]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);

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
Main subject:
${prompt}

Use case:
${useCase.prompt}

Visual style:
${visualStyle.prompt}

Typography and layout:
${typography.prompt}

Aspect ratio:
${ratio.prompt}

Quality direction:
premium AI image, refined composition, commercially usable, clean details, beautiful lighting, coherent scene, no distorted objects, no messy text.
`;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: finalPrompt, ratio: ratio.name }),
      });

      const data = await res.json();

      if (data.image) {
        setImage(data.image);
      } else {
        alert(data.error || "生成失败");
      }
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
      <nav className="topbar">
        <div className="brand">
          <span className="brandIcon">🌿</span>
          <div>
            <strong>MoriCanvas AI</strong>
            <small>Prompt-driven Visual Studio</small>
          </div>
        </div>

        {user ? (
          <button className="ghost" onClick={signOut}>退出登录</button>
        ) : (
          <span className="statusDot">Guest Mode</span>
        )}
      </nav>

      <section className="hero">
        <p className="eyebrow">AI IMAGE GENERATOR FOR SNS / STAY / PET / TRAVEL</p>
        <h1>让每一个选项，真正影响生成结果</h1>
        <p className="heroText">
          选择用途、画面风格、排版氛围和比例后，系统会自动组合成专业 prompt，不再只是装饰按钮。
        </p>
      </section>

      {!user ? (
        <section className="authBar">
          <input
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="密码"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="authBtns">
            <button onClick={signIn}>登录</button>
            <button onClick={signUp}>注册</button>
          </div>
        </section>
      ) : (
        <section className="userCard">
          <strong>{user.email}</strong>
          <small>Free Plan · 后续可接入 credits / Stripe</small>
        </section>
      )}

      <section className="workspace">
        <section className="creator">
          <div className="promptCard">
            <div className="promptTop">
              <span>Prompt</span>
              <span>{useCase.name} · {visualStyle.name} · {ratio.name}</span>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例如：北关东一栋可带宠物入住的日式老民宿，柴犬坐在木门前，傍晚暖光，安静治愈。"
            />
          </div>

          <div className="controls">
            <div className="controlGroup">
              <h3>用途模板</h3>
              <div className="chips">
                {useCases.map((item) => (
                  <button
                    key={item.name}
                    className={useCase.name === item.name ? "chip active" : "chip"}
                    onClick={() => setUseCase(item)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="controlGroup">
              <h3>画面风格</h3>
              <div className="chips">
                {visualStyles.map((item) => (
                  <button
                    key={item.name}
                    className={visualStyle.name === item.name ? "chip active" : "chip"}
                    onClick={() => setVisualStyle(item)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="controlGroup">
              <h3>字体 / 排版氛围</h3>
              <div className="chips">
                {typographyMoods.map((item) => (
                  <button
                    key={item.name}
                    className={typography.name === item.name ? "chip active" : "chip"}
                    onClick={() => setTypography(item)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="controlGroup">
              <h3>图片比例</h3>
              <div className="chips">
                {ratios.map((item) => (
                  <button
                    key={item.name}
                    className={ratio.name === item.name ? "chip active" : "chip"}
                    onClick={() => setRatio(item)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button className="generate" onClick={generateImage} disabled={loading}>
            {loading ? "生成中..." : "生成图片"}
          </button>
        </section>

        <aside className="preview">
          <div className="previewTop">
            <h2>Preview</h2>
            <span>{image ? "Ready" : "Waiting"}</span>
          </div>

          <div className="canvas">
            {loading && <div className="loader">生成中...</div>}

            {!loading && !image && (
              <div className="empty">
                <span>✦</span>
                <p>生成结果会显示在这里</p>
              </div>
            )}

            {image && <img src={image} alt="Generated" />}
          </div>

          {image && (
            <div className="resultActions">
              <button onClick={downloadImage}>下载图片</button>
              <button
                className="ghost"
                onClick={() => navigator.clipboard.writeText(prompt)}
              >
                复制原始提示词
              </button>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

export default App;
