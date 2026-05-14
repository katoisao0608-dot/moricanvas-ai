import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./App.css";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type Lang = "jp" | "en" | "cn";

const data = {
  jp: {
    navLogin: "ログイン",
    navLogout: "ログアウト",
    guest: "ゲスト",
    email: "メールアドレス",
    password: "パスワード",
    signIn: "ログイン",
    signUp: "新規登録",
    close: "閉じる",
    plan: "無料プラン",
    creditsLabel: "残り",
    eyebrow: "AI画像生成 · 民泊 · ペット · 旅行 · SNS",
    title: "一文から、投稿に使える画像を生成",
    subtitle: "用途、雰囲気、比率を選ぶと、生成される画像の方向性が変わります。",
    useCase: "用途",
    promptTitle: "画像の説明",
    referenceImage: "参考画像",
    uploadImage: "画像をアップロード",
    removeImage: "削除",
    styleTitle: "雰囲気",
    layoutTitle: "レイアウト",
    ratioTitle: "比率",
    generate: "画像を生成",
    generating: "生成中...",
    preview: "プレビュー",
    waiting: "生成画像がここに表示されます",
    download: "画像を保存",
    history: "履歴",
    edit: "AI修正",
    batch: "まとめて生成",
    share: "共有用にコピー",
    placeholder: "例：北関東のペット可の古民家宿、木の玄関に座る柴犬、夕方の温かい光。",
    registerSuccess: "登録が完了しました。ログインしてください。",
    loginSuccess: "ログインしました。",
    needLogin: "先にログインしてください。",
    noCredits: "残り枚数がありません。",
    noHistory: "履歴はまだありません。",
    presets: [
      {
        label: "民泊PR",
        desc: "宿泊施設や古民家の宣伝向け",
        prompt: "Japanese countryside guesthouse promotion image, pet-friendly stay, cozy wooden house, warm lights, accommodation campaign visual",
      },
      {
        label: "SNS表紙",
        desc: "投稿・小紅書・Threads向け",
        prompt: "premium social media cover image, clean composition, trendy lifestyle visual, elegant negative space",
      },
      {
        label: "ペット写真",
        desc: "犬・猫・ペットブランド向け",
        prompt: "premium pet portrait, warm emotional lighting, clean background, charming animal expression",
      },
      {
        label: "旅行ポスター",
        desc: "旅・地域紹介・観光向け",
        prompt: "cinematic travel poster, poetic landscape, refined color palette, elegant destination mood",
      },
    ],
    styles: [
      {
        label: "雑誌風",
        prompt: "Japanese lifestyle magazine aesthetic, natural tones, quiet luxury, refined editorial composition",
      },
      {
        label: "映画風",
        prompt: "cinematic film still, atmospheric depth, premium lighting, elegant color grading",
      },
      {
        label: "手描き",
        prompt: "soft hand-drawn illustration, warm palette, gentle linework, poetic atmosphere",
      },
      {
        label: "実写風",
        prompt: "high-end photorealistic commercial photography, realistic texture, premium details",
      },
    ],
    layouts: [
      { label: "文字なし", prompt: "no text, no letters, no logo, image only" },
      { label: "タイトル余白", prompt: "large clean negative space for future title placement, no readable text" },
      { label: "ポスター構図", prompt: "poster-like composition, strong visual hierarchy, refined blank area, no readable text" },
    ],
  },

  en: {
    navLogin: "Log in",
    navLogout: "Log out",
    guest: "Guest",
    email: "Email",
    password: "Password",
    signIn: "Log in",
    signUp: "Sign up",
    close: "Close",
    plan: "Free Plan",
    creditsLabel: "Credits",
    eyebrow: "AI Image · Stay · Pet · Travel · Social",
    title: "Create publish-ready images from one sentence",
    subtitle: "Choose use case, mood, layout and ratio. Each option shapes the final image.",
    useCase: "Use case",
    promptTitle: "Image description",
    referenceImage: "Reference image",
    uploadImage: "Upload image",
    removeImage: "Remove",
    styleTitle: "Mood",
    layoutTitle: "Layout",
    ratioTitle: "Ratio",
    generate: "Generate image",
    generating: "Generating...",
    preview: "Preview",
    waiting: "Your image will appear here",
    download: "Download",
    history: "History",
    edit: "AI Edit",
    batch: "Batch",
    share: "Copy share text",
    placeholder: "Example: A pet-friendly old Japanese guesthouse in North Kanto, a Shiba Inu by the wooden entrance, warm evening light.",
    registerSuccess: "Account created. Please log in.",
    loginSuccess: "Logged in successfully.",
    needLogin: "Please log in first.",
    noCredits: "No credits left.",
    noHistory: "No history yet.",
    presets: [
      {
        label: "Stay Promo",
        desc: "For guesthouses and old houses",
        prompt: "Japanese countryside guesthouse promotion image, pet-friendly stay, cozy wooden house, warm lights, accommodation campaign visual",
      },
      {
        label: "Social Cover",
        desc: "For social posts and covers",
        prompt: "premium social media cover image, clean composition, trendy lifestyle visual, elegant negative space",
      },
      {
        label: "Pet Portrait",
        desc: "For dogs, cats and pet brands",
        prompt: "premium pet portrait, warm emotional lighting, clean background, charming animal expression",
      },
      {
        label: "Travel Poster",
        desc: "For travel and local promotion",
        prompt: "cinematic travel poster, poetic landscape, refined color palette, elegant destination mood",
      },
    ],
    styles: [
      {
        label: "Magazine",
        prompt: "Japanese lifestyle magazine aesthetic, natural tones, quiet luxury, refined editorial composition",
      },
      {
        label: "Cinematic",
        prompt: "cinematic film still, atmospheric depth, premium lighting, elegant color grading",
      },
      {
        label: "Hand-drawn",
        prompt: "soft hand-drawn illustration, warm palette, gentle linework, poetic atmosphere",
      },
      {
        label: "Realistic",
        prompt: "high-end photorealistic commercial photography, realistic texture, premium details",
      },
    ],
    layouts: [
      { label: "No text", prompt: "no text, no letters, no logo, image only" },
      { label: "Title space", prompt: "large clean negative space for future title placement, no readable text" },
      { label: "Poster layout", prompt: "poster-like composition, strong visual hierarchy, refined blank area, no readable text" },
    ],
  },

  cn: {
    navLogin: "登录",
    navLogout: "退出",
    guest: "游客",
    email: "邮箱",
    password: "密码",
    signIn: "登录",
    signUp: "注册",
    close: "关闭",
    plan: "免费计划",
    creditsLabel: "剩余",
    eyebrow: "AI 图片生成 · 民宿 · 宠物 · 旅行 · 社交媒体",
    title: "输入一句话，生成适合发布的图片",
    subtitle: "选择用途、氛围、排版和比例，每一个选项都会影响最终生成结果。",
    useCase: "用途",
    promptTitle: "画面描述",
    referenceImage: "参考图片",
    uploadImage: "上传图片",
    removeImage: "删除",
    styleTitle: "氛围",
    layoutTitle: "排版",
    ratioTitle: "比例",
    generate: "生成图片",
    generating: "生成中...",
    preview: "预览",
    waiting: "生成结果会显示在这里",
    download: "下载图片",
    history: "历史记录",
    edit: "AI 修图",
    batch: "批量生成",
    share: "复制分享文案",
    placeholder: "例：北关东一栋可带宠物入住的日式老民宿，柴犬坐在木门前，傍晚暖光。",
    registerSuccess: "注册成功，请登录。",
    loginSuccess: "登录成功。",
    needLogin: "请先登录。",
    noCredits: "剩余点数不足。",
    noHistory: "还没有历史记录。",
    presets: [
      {
        label: "民宿宣传",
        desc: "适合民宿、老房、住宿宣传",
        prompt: "Japanese countryside guesthouse promotion image, pet-friendly stay, cozy wooden house, warm lights, accommodation campaign visual",
      },
      {
        label: "社媒封面",
        desc: "适合小红书、Threads、封面图",
        prompt: "premium social media cover image, clean composition, trendy lifestyle visual, elegant negative space",
      },
      {
        label: "宠物写真",
        desc: "适合狗、猫、宠物品牌",
        prompt: "premium pet portrait, warm emotional lighting, clean background, charming animal expression",
      },
      {
        label: "旅行海报",
        desc: "适合旅行、地区介绍、观光宣传",
        prompt: "cinematic travel poster, poetic landscape, refined color palette, elegant destination mood",
      },
    ],
    styles: [
      {
        label: "日系杂志",
        prompt: "Japanese lifestyle magazine aesthetic, natural tones, quiet luxury, refined editorial composition",
      },
      {
        label: "电影感",
        prompt: "cinematic film still, atmospheric depth, premium lighting, elegant color grading",
      },
      {
        label: "手绘",
        prompt: "soft hand-drawn illustration, warm palette, gentle linework, poetic atmosphere",
      },
      {
        label: "写实",
        prompt: "high-end photorealistic commercial photography, realistic texture, premium details",
      },
    ],
    layouts: [
      { label: "无文字", prompt: "no text, no letters, no logo, image only" },
      { label: "标题留白", prompt: "large clean negative space for future title placement, no readable text" },
      { label: "海报构图", prompt: "poster-like composition, strong visual hierarchy, refined blank area, no readable text" },
    ],
  },
};

const ratios = ["1:1", "4:5", "9:16", "16:9"];

export default function App() {
  const [lang, setLang] = useState<Lang>("jp");
  const t = data[lang];

  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [referenceImage, setReferenceImage] = useState("");
  const [historyImages, setHistoryImages] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);

  const [presetIndex, setPresetIndex] = useState(0);
  const [styleIndex, setStyleIndex] = useState(0);
  const [layoutIndex, setLayoutIndex] = useState(1);
  const [ratio, setRatio] = useState("4:5");

  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(5);

  const [showAuth, setShowAuth] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function loadHistory(userId: string) {
    const { data } = await supabase
      .from("images")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(12);

    setHistoryImages(data || []);
  }

  async function loadProfile(userId: string, userEmail?: string) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .maybeSingle();

    if (!profile) {
      await supabase.from("profiles").insert({
        id: userId,
        email: userEmail || "",
        credits: 5,
      });

      setCredits(5);
      return;
    }

    let nextCredits = Number(profile.credits);

    if (!Number.isFinite(nextCredits) || nextCredits <= 0) {
      nextCredits = 5;

      await supabase
        .from("profiles")
        .update({ credits: 5 })
        .eq("id", userId);
    }

    setCredits(nextCredits);
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session?.user) {
        setUser(data.session.user);
        await loadProfile(data.session.user.id, data.session.user.email || "");
        await loadHistory(data.session.user.id);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          await loadProfile(session.user.id, session.user.email || "");
          await loadHistory(session.user.id);
        } else {
          setUser(null);
          setCredits(5);
          setHistoryImages([]);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function signUp() {
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    setAuthLoading(true);

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setAuthLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    if (authData.user) {
      await loadProfile(authData.user.id, authData.user.email || email);
      await loadHistory(authData.user.id);
    }

    alert(t.registerSuccess);
    setShowAuth(false);
  }

  async function signIn() {
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    setAuthLoading(true);

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setAuthLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    if (authData.user) {
      setUser(authData.user);
      await loadProfile(authData.user.id, authData.user.email || email);
      await loadHistory(authData.user.id);
    }

    alert(t.loginSuccess);
    setShowAuth(false);
  }

  async function signOut() {
    try {
      await supabase.auth.signOut({ scope: "global" });
    } catch (error) {
      console.error(error);
    }

    setUser(null);
    setCredits(5);
    setHistoryImages([]);
    setShowAuth(false);
    setEmail("");
    setPassword("");

    localStorage.clear();
    sessionStorage.clear();

    window.location.replace(window.location.origin + "/?logout=" + Date.now());
  }

  function handleReferenceUpload(file: File | null) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setReferenceImage(String(reader.result));
    };

    reader.readAsDataURL(file);
  }

  async function generateImage() {
    if (!user) {
      alert(t.needLogin);
      setShowAuth(true);
      return;
    }

    if (credits <= 0) {
      alert(t.noCredits);
      return;
    }

    if (!prompt.trim() && !referenceImage) return;

    setLoading(true);
    setImage("");

    const finalPrompt = `
Main idea:
${prompt}

Reference image instruction:
If a reference image is provided, use it as visual guidance for subject, composition, object identity, color mood or atmosphere. Do not copy watermarks or text.

Use case:
${t.presets[presetIndex].prompt}

Visual style:
${t.styles[styleIndex].prompt}

Layout:
${t.layouts[layoutIndex].prompt}

Aspect ratio:
${ratio}

Quality:
premium AI image, clean composition, beautiful lighting, commercially usable, no watermark, no messy text, no distorted objects.
`;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          ratio,
          referenceImage,
        }),
      });

      const result = await res.json();

      if (result.image) {
        setImage(result.image);

        await supabase.from("images").insert({
          user_id: user.id,
          image_url: result.image,
          prompt: finalPrompt,
          ratio,
        });

        await loadHistory(user.id);

        const newCredits = Math.max(credits - 1, 0);
        setCredits(newCredits);

        await supabase
          .from("profiles")
          .update({ credits: newCredits })
          .eq("id", user.id);
      } else {
        alert(result.error || "Error");
      }
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

  function copyShareText() {
    const text =
      lang === "jp"
        ? "MoriCanvas AIで画像を生成しました。"
        : lang === "en"
          ? "I created this image with MoriCanvas AI."
          : "我用 MoriCanvas AI 生成了一张图片。";

    navigator.clipboard.writeText(text);
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
          <div className="languageTabs">
            <button type="button" className={lang === "jp" ? "active" : ""} onClick={() => setLang("jp")}>日本語</button>
            <button type="button" className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>English</button>
            <button type="button" className={lang === "cn" ? "active" : ""} onClick={() => setLang("cn")}>中文</button>
          </div>

          <span className="pill">{user ? user.email : t.guest}</span>

          {user ? (
            <button type="button" className="ghostBtn" onClick={signOut}>
              {t.navLogout}
            </button>
          ) : (
            <button type="button" className="ghostBtn" onClick={() => setShowAuth(true)}>
              {t.navLogin}
            </button>
          )}
        </div>
      </header>

      {showAuth && !user && (
        <div className="modalOverlay" onClick={() => setShowAuth(false)}>
          <section className="authModal" onClick={(e) => e.stopPropagation()}>
            <div className="authHeader">
              <h2>{t.navLogin}</h2>
              <button type="button" onClick={() => setShowAuth(false)}>
                {t.close}
              </button>
            </div>

            <input placeholder={t.email} value={email} onChange={(e) => setEmail(e.target.value)} />
            <input placeholder={t.password} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <div className="authButtons">
              <button type="button" onClick={signIn} disabled={authLoading}>
                {authLoading ? "..." : t.signIn}
              </button>
              <button type="button" onClick={signUp} disabled={authLoading}>
                {authLoading ? "..." : t.signUp}
              </button>
            </div>
          </section>
        </div>
      )}

      <section className="hero">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p className="heroText">{t.subtitle}</p>
      </section>

      <section className="workspace">
        <section className="creator">
          <div className="statusGrid">
            <div>
              <span>{t.plan}</span>
              <strong>{user ? user.email : t.guest}</strong>
            </div>
            <div>
              <span>Credits</span>
              <strong>{t.creditsLabel} {credits}</strong>
            </div>
          </div>

          <div className="sectionCard">
            <h3>{t.useCase}</h3>
            <div className="presetGrid">
              {t.presets.map((item, index) => (
                <button type="button" key={item.label} className={presetIndex === index ? "preset active" : "preset"} onClick={() => setPresetIndex(index)}>
                  <strong>{item.label}</strong>
                  <span>{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sectionCard">
            <h3>{t.promptTitle}</h3>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={t.placeholder} />
          </div>

          <div className="sectionCard">
            <h3>{t.referenceImage}</h3>

            <label className="uploadBox">
              <input type="file" accept="image/*" onChange={(e) => handleReferenceUpload(e.target.files?.[0] || null)} />
              <span>{t.uploadImage}</span>
            </label>

            {referenceImage && (
              <div className="referencePreview">
                <img src={referenceImage} alt="Reference" />
                <button type="button" onClick={() => setReferenceImage("")}>
                  {t.removeImage}
                </button>
              </div>
            )}
          </div>

          <div className="sectionCard">
            <h3>{t.styleTitle}</h3>
            <div className="chips">
              {t.styles.map((item, index) => (
                <button type="button" key={item.label} className={styleIndex === index ? "chip active" : "chip"} onClick={() => setStyleIndex(index)}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="twoColumns">
            <div className="sectionCard">
              <h3>{t.layoutTitle}</h3>
              <div className="chips">
                {t.layouts.map((item, index) => (
                  <button type="button" key={item.label} className={layoutIndex === index ? "chip active" : "chip"} onClick={() => setLayoutIndex(index)}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="sectionCard">
              <h3>{t.ratioTitle}</h3>
              <div className="chips">
                {ratios.map((item) => (
                  <button type="button" key={item} className={ratio === item ? "chip active" : "chip"} onClick={() => setRatio(item)}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button type="button" className="generateBtn" onClick={generateImage} disabled={loading}>
            {loading ? t.generating : t.generate}
          </button>
        </section>

        <aside className="preview">
          <div className="previewTop">
            <div>
              <span>{t.preview}</span>
              <h2>{t.presets[presetIndex].label} · {t.styles[styleIndex].label}</h2>
            </div>
            <em>{ratio}</em>
          </div>

          <div className="canvas">
            {loading && <div className="loading">{t.generating}</div>}

            {!loading && !image && (
              <div className="empty">
                <b>✦</b>
                <p>{t.waiting}</p>
              </div>
            )}

            {image && <img src={image} alt="Generated" />}
          </div>

          {showHistory && (
            <div className="historyPanel">
              {historyImages.length === 0 && <p>{t.noHistory}</p>}

              {historyImages.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className="historyItem"
                  onClick={() => setImage(item.image_url)}
                >
                  <img src={item.image_url} alt="History" />
                </button>
              ))}
            </div>
          )}

          <div className="toolRow">
            <button type="button" onClick={() => setShowHistory(!showHistory)}>
              {t.history}
            </button>
            <button type="button" disabled>{t.batch}</button>
            <button type="button" disabled>{t.edit}</button>
          </div>

          {image && (
            <div className="actions">
              <button type="button" onClick={downloadImage}>{t.download}</button>
              <button type="button" onClick={copyShareText}>{t.share}</button>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
