import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./App.css";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("注册成功，请检查邮箱");
    }
  }

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("登录成功");
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function generateImage() {
    if (!prompt) return;

    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (data.image) {
        setImage(data.image);
      } else {
        alert(data.error || "生成失败");
      }
    } catch (err) {
      alert("服务器错误");
    }

    setLoading(false);
  }

  return (
    <div className="page">
      <div className="card">
        <div className="logo">🌿 MoriCanvas AI</div>

        <h1>
          风、光、森の気配まで描く
          <br />
          AI作图サイト
        </h1>

        <p className="subtitle">
          中文 / 日本語 AI 插画生成平台
        </p>

        {!user ? (
          <div className="authBox">
            <input
              type="email"
              placeholder="邮箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="authButtons">
              <button onClick={signUp}>注册</button>
              <button onClick={signIn}>登录</button>
            </div>
          </div>
        ) : (
          <div className="userBox">
            <p>已登录：{user.email}</p>
            <button onClick={signOut}>退出登录</button>
          </div>
        )}

        <textarea
          placeholder="输入你想生成的画面..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          className="generateButton"
          onClick={generateImage}
          disabled={loading}
        >
          {loading ? "生成中..." : "画像を生成"}
        </button>

        {image && (
          <div className="imageBox">
            <img src={image} alt="AI Generated" />
          </div>
        )}

        <p className="footer">© 2026 MoriCanvas AI</p>
      </div>
    </div>
  );
}

export default App;
