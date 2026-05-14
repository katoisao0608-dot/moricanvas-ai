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
    login: "ログイン",
    logout: "ログアウト",
    signup: "新規登録",
    guest: "ゲスト",
    email: "メールアドレス",
    password: "パスワード",
    close: "閉じる",
    title: "一文から、投稿に使える画像を生成",
    subtitle:
      "用途、雰囲気、比率を選ぶと、生成される画像の方向性が変わります。",
    prompt: "画像の説明",
    placeholder:
      "北関東のペット可古民家宿、夕方の暖かい光、雑誌風の高級感。",
    generate: "画像を生成",
    generating: "生成中...",
    upload: "参考画像をアップロード",
    remove: "削除",
    preview: "プレビュー",
    waiting: "生成画像がここに表示されます",
    download: "画像を保存",
    credits: "残り",
    noCredits: "残り枚数がありません。",
    needLogin: "先にログインしてください。",
    loginSuccess: "ログインしました。",
    signupSuccess: "登録完了。ログインしてください。",
  },

  en: {
    login: "Log in",
    logout: "Log out",
    signup: "Sign up",
    guest: "Guest",
    email: "Email",
    password: "Password",
    close: "Close",
    title: "Create publish-ready images from one sentence",
    subtitle:
      "Choose use case, mood and ratio to shape the generated image.",
    prompt: "Image description",
    placeholder:
      "A pet-friendly Japanese countryside guesthouse, warm sunset light, magazine style.",
    generate: "Generate Image",
    generating: "Generating...",
    upload: "Upload Reference Image",
    remove: "Remove",
    preview: "Preview",
    waiting: "Generated image will appear here",
    download: "Download",
    credits: "Credits",
    noCredits: "No credits left.",
    needLogin: "Please log in first.",
    loginSuccess: "Logged in successfully.",
    signupSuccess: "Registration complete. Please log in.",
  },

  cn: {
    login: "登录",
    logout: "退出登录",
    signup: "注册",
    guest: "游客",
    email: "邮箱",
    password: "密码",
    close: "关闭",
    title: "输入一句话，生成适合发布的图片",
    subtitle:
      "选择用途、氛围、比例后，AI 会自动调整最终生成方向。",
    prompt: "图片描述",
    placeholder:
      "北关东可带宠物入住的日式老民宿，傍晚暖光，杂志高级感。",
    generate: "生成图片",
    generating: "生成中...",
    upload: "上传参考图",
    remove: "删除",
    preview: "预览",
    waiting: "生成结果会显示在这里",
    download: "下载图片",
    credits: "剩余",
    noCredits: "剩余次数不足。",
    needLogin: "请先登录。",
    loginSuccess: "登录成功。",
    signupSuccess: "注册成功，请登录。",
  },
};

const useCases = {
  jp: ["民泊PR", "SNS表紙", "ペット写真", "旅行ポスター"],
  en: ["Stay Promo", "Social Cover", "Pet Portrait", "Travel Poster"],
  cn: ["民宿宣传", "社媒封面", "宠物写真", "旅行海报"],
};

const styles = {
  jp: ["雑誌風", "映画風", "手描き", "実写風"],
  en: ["Magazine", "Cinema", "Hand Drawn", "Realistic"],
  cn: ["杂志风", "电影感", "手绘", "写实"],
};

const ratios = ["1:1", "4:5", "9:16", "16:9"];

export default function App() {
  const [lang, setLang] = useState<Lang>("jp");
  const t = text[lang];

  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [referenceImage, setReferenceImage] = useState("");

  const [loading, setLoading] = useState(false);

  const [selectedCase, setSelectedCase] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState(0);
  const [selectedRatio, setSelectedRatio] = useState("4:5");

  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(5);

  const [showAuth, setShowAuth] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function loadProfile(userId: string, userEmail?: string) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (!data) {
      await supabase.from("profiles").insert({
        id: userId,
        email: userEmail || "",
        credits: 5,
      });

      setCredits(5);
      return;
    }

    let fixedCredits = data.credits;

    if (fixedCredits === null || fixedCredits === undefined) {
      fixedCredits = 5;
    }

    if (fixedCredits <= 0) {
      fixedCredits = 5;

      await supabase
        .from("profiles")
        .update({ credits: fixedCredits })
        .eq("id", userId);
    }

    setCredits(fixedCredits);
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session?.user) {
        setUser(data.session.user);

        await loadProfile(
          data.session.user.id,
          data.session.user.email || ""
        );
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);

        await loadProfile(session.user.id, session.user.email || "");
      } else {
        setUser(null);
        setCredits(5);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function signUp() {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) {
      await loadProfile(data.user.id, data.user.email || email);
    }

    alert(t.signupSuccess);
    setShowAuth(false);
  }

  async function signIn() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) {
      setUser(data.user);

      await loadProfile(data.user.id, data.user.email || email);
    }

    alert(t.loginSuccess);
    setShowAuth(false);
  }

  async function signOut() {
    try {
      await supabase.auth.signOut({
        scope: "global",
      });

      setUser(null);
      setCredits(5);

      localStorage.clear();
      sessionStorage.clear();

      window.location.href =
        window.location.origin + "?logout=" + Date.now();
    } catch (e) {
      console.error(e);

      setUser(null);
      setCredits(5);

      localStorage.clear();
      sessionStorage.clear();

      window.location.href =
        window.location.origin + "?logout=" + Date.now();
    }
  }

  function handleReferenceImage(file: File | null) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setReferenceImage(reader.result as string);
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

    setLoading(true);

    try {
      const finalPrompt = `
Use case: ${useCases[lang][selectedCase]}
Style: ${styles[lang][selectedStyle]}
Aspect ratio: ${selectedRatio}

User prompt:
${prompt}

Create a beautiful, premium, publish-ready image.
`;

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          prompt: finalPrompt,
          ratio: selectedRatio,
          referenceImage,
        }),
      });

      const data = await response.json();

      if (data.image) {
        setGeneratedImage(data.image);

        const newCredits = credits - 1;

        setCredits(newCredits);

        await supabase
          .from("profiles")
          .update({
            credits: newCredits,
          })
          .eq("id", user.id);
      } else {
        alert(data.error || "Generation failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }

    setLoading(false);
  }

  function downloadImage() {
    if (!generatedImage) return;

    const link = document.createElement("a");

    link.href = generatedImage;
    link.download = "moricanvas-ai.png";

    link.click();
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="logoArea">
          <div className="logoBox">M</div>

          <div>
            <h2>MoriCanvas AI</h2>
            <p>AI Image Studio</p>
          </div>
        </div>

        <div className="topRight">
          <div className="langSwitch">
            <button
              className={lang === "jp" ? "active" : ""}
              onClick={() => setLang("jp")}
            >
              日本語
            </button>

            <button
              className={lang === "en" ? "active" : ""}
              onClick={() => setLang("en")}
            >
              English
            </button>

            <button
              className={lang === "cn" ? "active" : ""}
              onClick={() => setLang("cn")}
            >
              中文
            </button>
          </div>

          <div className="userArea">
            <div className="userEmail">
              {user ? user.email : t.guest}
            </div>

            {user ? (
              <button className="logoutBtn" onClick={signOut}>
                {t.logout}
              </button>
            ) : (
              <button
                className="logoutBtn"
                onClick={() => setShowAuth(true)}
              >
                {t.login}
              </button>
            )}
          </div>
        </div>
      </header>

      <section className="hero">
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      {showAuth && !user && (
        <div className="modalOverlay">
          <div className="authModal">
            <div className="authHeader">
              <h2>{t.login}</h2>

              <button onClick={() => setShowAuth(false)}>
                {t.close}
              </button>
            </div>

            <input
              placeholder={t.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder={t.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="authButtons">
              <button onClick={signIn}>
                {t.login}
              </button>

              <button onClick={signUp}>
                {t.signup}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="mainGrid">
        <div className="leftPanel">
          <div className="creditsCard">
            <div>
              <span>{user ? user.email : t.guest}</span>
            </div>

            <div>
              <strong>
                {t.credits} {credits}
              </strong>
            </div>
          </div>

          <div className="sectionBox">
            <h3>Use Case</h3>

            <div className="gridButtons">
              {useCases[lang].map((item, index) => (
                <button
                  key={item}
                  className={
                    selectedCase === index
                      ? "gridBtn active"
                      : "gridBtn"
                  }
                  onClick={() => setSelectedCase(index)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="sectionBox">
            <h3>{t.prompt}</h3>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t.placeholder}
            />
          </div>

          <div className="sectionBox">
            <h3>{t.upload}</h3>

            <label className="uploadBox">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleReferenceImage(
                    e.target.files?.[0] || null
                  )
                }
              />

              <span>{t.upload}</span>
            </label>

            {referenceImage && (
              <div className="referencePreview">
                <img src={referenceImage} />

                <button
                  onClick={() => setReferenceImage("")}
                >
                  {t.remove}
                </button>
              </div>
            )}
          </div>

          <div className="sectionBox">
            <h3>Style</h3>

            <div className="chips">
              {styles[lang].map((item, index) => (
                <button
                  key={item}
                  className={
                    selectedStyle === index
                      ? "chip active"
                      : "chip"
                  }
                  onClick={() => setSelectedStyle(index)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="sectionBox">
            <h3>Ratio</h3>

            <div className="chips">
              {ratios.map((item) => (
                <button
                  key={item}
                  className={
                    selectedRatio === item
                      ? "chip active"
                      : "chip"
                  }
                  onClick={() => setSelectedRatio(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            className="generateBtn"
            onClick={generateImage}
            disabled={loading}
          >
            {loading ? t.generating : t.generate}
          </button>
        </div>

        <div className="rightPanel">
          <div className="previewHeader">
            <div>
              <span>{t.preview}</span>

              <h2>
                {useCases[lang][selectedCase]} ·{" "}
                {styles[lang][selectedStyle]}
              </h2>
            </div>

            <div className="ratioBadge">
              {selectedRatio}
            </div>
          </div>

          <div className="previewCanvas">
            {!generatedImage && !loading && (
              <div className="emptyState">
                <div>✦</div>
                <p>{t.waiting}</p>
              </div>
            )}

            {loading && (
              <div className="emptyState">
                <p>{t.generating}</p>
              </div>
            )}

            {generatedImage && (
              <img src={generatedImage} />
            )}
          </div>

          {generatedImage && (
            <button
              className="downloadBtn"
              onClick={downloadImage}
            >
              {t.download}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
