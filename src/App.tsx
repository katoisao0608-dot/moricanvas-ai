import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./App.css";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type Lang = "cn" | "jp" | "en";

const copy = {
  cn: {
    login: "登录",
    logout: "退出",
    guest: "游客模式",
    eyebrow: "AI 图片生成 · 民宿 · 宠物 · 旅行 · 社交媒体",
    title: "输入一句话，生成适合发布的高级图片",
    subtitle: "选择用途、风格、排版和比例。每个选项都会真正影响图片生成结果。",
    use: "选择用途",
    describe: "描述你想要的画面",
    style: "图片风格",
    layout: "标题/排版空间",
    ratio: "图片比例",
    generate: "生成图片",
    generating: "生成中...",
    preview: "预览结果",
    waiting: "图片会显示在这里",
    download: "下载图片",
    copyPrompt: "复制提示词",
    email: "邮箱",
    password: "密码",
    signup: "注册",
    placeholder: "例：北关东一栋可带宠物入住的日式老民宿，柴犬坐在木门前，傍晚暖光，安静治愈。",
  },
  jp: {
    login: "ログイン",
    logout: "ログアウト",
    guest: "ゲストモード",
    eyebrow: "AI画像生成 · 民泊 · ペット · 旅行 · SNS",
    title: "一文から、投稿に使える上質な画像を生成",
    subtitle: "用途、雰囲気、レイアウト、比率を選ぶと、それぞれが生成結果に反映されます。",
    use: "用途を選ぶ",
    describe: "作りたい画像を説明",
    style: "画像スタイル",
    layout: "タイトル/余白",
    ratio: "画像比率",
    generate: "画像を生成",
    generating: "生成中...",
    preview: "プレビュー",
    waiting: "生成画像がここに表示されます",
    download: "画像を保存",
    copyPrompt: "プロンプトをコピー",
    email: "メール",
    password: "パスワード",
    signup: "登録",
    placeholder: "例：北関東のペット可の古民家宿、木の玄関に座る柴犬、夕方の温かい光、静かで癒やされる雰囲気。",
  },
  en: {
    login: "Log in",
    logout: "Log out",
    guest: "Guest Mode",
    eyebrow: "AI Image Generator · Stay · Pet · Travel · Social",
    title: "Turn one sentence into a publish-ready image",
    subtitle: "Choose use case, visual style, layout and ratio. Every option directly shapes the final image.",
    use: "Choose use case",
    describe: "Describe your image",
    style: "Visual style",
    layout: "Title / layout space",
    ratio: "Image ratio",
    generate: "Generate image",
    generating: "Generating...",
    preview: "Preview",
    waiting: "Your image will appear here",
    download: "Download",
    copyPrompt: "Copy prompt",
    email: "Email",
    password: "Password",
    signup: "Sign up",
    placeholder: "Example: A pet-friendly Japanese countryside guesthouse in North Kanto, a Shiba Inu sitting by the wooden entrance, warm evening light, quiet healing mood.",
  },
};

const presets = [
  {
    key: "民宿宣传 / 民泊PR / Stay Promo",
    prompt: "premium Japanese countryside guesthouse campaign image, pet-friendly stay, cozy wooden house, warm interior light, suitable for accommodation promotion",
  },
  {
    key: "小红书封面 / SNS表紙 / Social Cover",
    prompt: "premium social media cover image, clean trendy composition, elegant negative space for title, attractive lifestyle visual",
  },
  {
    key: "宠物写真 / ペット写真 / Pet Portrait",
    prompt: "premium emotional pet portrait, warm cinematic lighting, clean background, expressive animal face, refined commercial photography",
  },
  {
    key: "旅行海报 / 旅ポスター / Travel Poster",
    prompt: "premium travel poster, poetic landscape, refined color palette, cinematic destination mood, elegant composition",
  },
];

const styles = [
  { key: "日系杂志 / 雑誌風 / Magazine", prompt: "Japanese lifestyle magazine aesthetic, natural tones, quiet luxury, refined editorial composition" },
  { key: "电影感 / 映画風 / Cinematic", prompt: "cinematic film still aesthetic, atmospheric depth, premium color grading, elegant lighting" },
  { key: "手绘动画 / 手描き / Anime", prompt: "soft hand-drawn animation illustration, gentle linework, warm palette, poetic atmosphere" },
  { key: "高级写实 / 写実 / Realistic", prompt: "high-end photorealistic commercial photography, natural texture, realistic premium details" },
];

const layouts = [
  { key: "无文字 / 文字なし / No text", prompt: "no text, no letters, no logo, image only" },
  { key: "标题留白 / 余白あり / Title space", prompt: "large clean negative space for future title placement, no readable text" },
  { key: "海报构图 / ポスター / Poster layout", prompt: "poster-like composition, strong visual hierarchy, refined blank area, no readable text" },
];

const ratios = [
  { key: "1:1", prompt: "square composition, centered subject" },
  { key: "4:5", prompt: "vertical 4:5 social feed composition" },
  { key: "9:16", prompt: "mobile story vertical composition" },
  { key: "16:9", prompt: "wide cinematic horizontal composition" },
];

export default function App() {
  const [lang, setLang] = useState<Lang>("cn");
  const t = copy[lang];

  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const [preset, setPreset] = useState(presets[0]);
  const [style, setStyle] = useState(styles[0]);
  const [layout, setLayout] = useState(layouts[1]);
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
    alert(error ? error.message : "Done");
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
    if (!prompt.trim()) return alert(t.placeholder);

    setLoading(true);
    setImage("");

    const finalPrompt = `
Main idea:
${prompt}

Use case:
${preset.prompt}

Visual style:
${style.prompt}

Layout:
${layout.prompt}

Aspect ratio:
${ratio.prompt}

Quality:
premium AI image, coherent scene, elegant composition, beautiful lighting, commercially usable, clean details, no watermark, no distorted objects.
`;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt, ratio: ratio.key }),
      });

      const data = await res.json();
      if (data.image) setImage(data.image);
      else alert(data.error || "Error");
    } catch {
      alert("Server error");
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
            <span>AI Image Studio</span>
          </div>
        </div>

        <div className="navRight">
          <select value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
            <option value="cn">中文</option>
            <option value="jp">日本語</option>
            <option value="en">English</option>
          </select>

          <span className="pill">{user ? user.email : t.guest}</span>

          {user ? (
            <button className="ghostBtn" onClick={signOut}>{t.logout}</button>
          ) : (
            <button className="ghostBtn" onClick={() => setShowAuth(!showAuth)}>{t.login}</button>
          )}
        </div>
      </header>

      {showAuth && !user && (
        <section className="authPanel">
          <input placeholder={t.email} value={email} onChange={(e) => setEmail(e.target.value)} />
          <input placeholder={t.password} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={signIn}>{t.login}</button>
          <button onClick={signUp}>{t.signup}</button>
        </section>
      )}

      <section className="hero cleanHero">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="studio cleanStudio">
        <section className="left">
          <div className="stepCard">
            <h2>01. {t.use}</h2>
            <div className="presetGrid compact">
              {presets.map((item) => (
                <button
                  key={item.key}
                  className={preset.key === item.key ? "preset active" : "preset"}
                  onClick={() => setPreset(item)}
                >
                  {item.key}
                </button>
              ))}
            </div>
          </div>

          <div className="stepCard">
            <h2>02. {t.describe}</h2>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={t.placeholder} />
          </div>

          <div className="stepCard">
            <h2>03. {t.style}</h2>
            <div className="chips">
              {styles.map((item) => (
                <button key={item.key} className={style.key === item.key ? "chip active" : "chip"} onClick={() => setStyle(item)}>
                  {item.key}
                </button>
              ))}
            </div>
          </div>

          <div className="stepGrid">
            <div className="stepCard">
              <h2>04. {t.layout}</h2>
              <div className="chips">
                {layouts.map((item) => (
                  <button key={item.key} className={layout.key === item.key ? "chip active" : "chip"} onClick={() => setLayout(item)}>
                    {item.key}
                  </button>
                ))}
              </div>
            </div>

            <div className="stepCard">
              <h2>05. {t.ratio}</h2>
              <div className="chips">
                {ratios.map((item) => (
                  <button key={item.key} className={ratio.key === item.key ? "chip active" : "chip"} onClick={() => setRatio(item)}>
                    {item.key}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button className="generateBtn" onClick={generateImage} disabled={loading}>
            {loading ? t.generating : t.generate}
          </button>
        </section>

        <aside className="right">
          <div className="previewHead">
            <div>
              <span>{t.preview}</span>
              <h2>{preset.key.split("/")[0]} · {style.key.split("/")[0]}</h2>
            </div>
            <em>{ratio.key}</em>
          </div>

          <div className="previewCanvas">
            {loading && <div className="loading">{t.generating}</div>}
            {!loading && !image && (
              <div className="empty">
                <b>✦</b>
                <p>{t.waiting}</p>
              </div>
            )}
            {image && <img src={image} alt="Generated" />}
          </div>

          {image && (
            <div className="actions">
              <button onClick={downloadImage}>{t.download}</button>
              <button onClick={() => navigator.clipboard.writeText(prompt)}>{t.copyPrompt}</button>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
