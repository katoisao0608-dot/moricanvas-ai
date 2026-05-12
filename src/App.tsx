import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./App.css";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const styles = [
  "Soft Anime",
  "Cinematic",
  "Watercolor",
  "Real Estate",
  "Pet Portrait",
  "Xiaohongshu",
  "Threads Minimal",
  "Travel Poster",
];

const ratios = ["1:1", "4:5", "16:9", "9:16"];

function App() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState(styles[0]);
  const [ratio, setRatio] = useState(ratios[0]);
  const [lang, setLang] = useState<"cn" | "jp">("cn");

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
    alert(error ? error.message : "注册成功，请检查邮箱 / 登録完了");
  }

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function generateImage() {
    if (!prompt.trim()) return alert("请输入提示词");

    setLoading(true);
    setImage("");

    const finalPrompt = `
      ${prompt}.
      Style: ${style}.
      Aspect ratio: ${ratio}.
      Premium AI image, refined composition, high-end visual design.
    `;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt }),
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

  const copyShareText = () => {
    navigator.clipboard.writeText(
      lang === "cn"
        ? "我用 MoriCanvas AI 生成了一张图片。"
        : "MoriCanvas AIで画像を生成しました。"
    );
    alert("已复制分享文案");
  };

  return (
    <main className="app">
      <nav className="topbar">
        <div className="brand">
          <span className="brandIcon">🌿</span>
          <div>
            <strong>MoriCanvas AI</strong>
            <small>AI Visual Studio</small>
          </div>
        </div>

        <div className="topActions">
          <button className="ghost" onClick={() => setLang(lang === "cn" ? "jp" : "cn")}>
            {lang === "cn" ? "日本語" : "中文"}
          </button>

          {user ? (
            <button className="ghost" onClick={signOut}>退出</button>
          ) : (
            <span className="statusDot">Guest</span>
          )}
        </div>
      </nav>

      <section className="hero">
        <div>
          <p className="eyebrow">TEXT TO IMAGE · SOCIAL VISUAL · BRAND CONTENT</p>
          <h1>
            {lang === "cn"
              ? "为民宿、宠物、旅行与SNS生成高级视觉"
              : "民泊・ペット・旅・SNS向けの上質なAIビジュアル"}
          </h1>
          <p className="heroText">
            {lang === "cn"
              ? "输入一句话，选择风格与比例，生成可用于小红书、Threads、民宿宣传和宠物内容的图片。"
              : "言葉を入力し、スタイルと比率を選ぶだけで、SNSや民泊宣伝に使える画像を生成。"}
          </p>
        </div>
      </section>

      <section className="workspace">
        <aside className="panel">
          <div className="panelHeader">
            <h2>{lang === "cn" ? "账户" : "アカウント"}</h2>
            <span>{user ? "Signed in" : "Login"}</span>
          </div>

          {!user ? (
            <div className="auth">
              <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <div className="twoBtns">
                <button onClick={signIn}>登录</button>
                <button className="secondary" onClick={signUp}>注册</button>
              </div>
            </div>
          ) : (
            <div className="userCard">
              <span>{user.email}</span>
              <small>Free Plan · 0 credits</small>
            </div>
          )}

          <div className="divider" />

          <h2>{lang === "cn" ? "风格模板" : "スタイル"}</h2>
          <div className="chips">
            {styles.map((s) => (
              <button
                key={s}
                className={style === s ? "chip active" : "chip"}
                onClick={() => setStyle(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <h2>{lang === "cn" ? "图片比例" : "比率"}</h2>
          <div className="ratioGrid">
            {ratios.map((r) => (
              <button
                key={r}
                className={ratio === r ? "ratio active" : "ratio"}
                onClick={() => setRatio(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </aside>

        <section className="creator">
          <div className="promptCard">
            <div className="promptTop">
              <span>Prompt</span>
              <span>{style} · {ratio}</span>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                lang === "cn"
                  ? "例如：夕阳下的北关东老民宿，柴犬坐在木质门口，温暖灯光，适合小红书宣传图"
                  : "例：夕暮れの北関東の古民家、木の玄関に座る柴犬、温かい光、SNS投稿向け"
              }
            />

            <button className="generate" onClick={generateImage} disabled={loading}>
              {loading ? "Generating..." : lang === "cn" ? "生成图片" : "画像を生成"}
            </button>
          </div>

          <div className="quickTemplates">
            <button onClick={() => setPrompt("北关东可带宠物民宿宣传图，温暖灯光，柴犬，日式老房，治愈感")}>
              民宿宣传
            </button>
            <button onClick={() => setPrompt("一只柴犬的电影感肖像，柔和光线，干净背景，高级宠物品牌视觉")}>
              宠物图
            </button>
            <button onClick={() => setPrompt("适合小红书封面的旅行图片，日式乡村，夕阳，治愈，干净排版空间")}>
              小红书封面
            </button>
          </div>
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
              <button className="secondary" onClick={copyShareText}>复制分享文案</button>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

export default App;
