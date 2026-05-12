import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

type Mood = "nostalgic" | "forest" | "sky" | "cozy";

function Button({
  children,
  onClick,
  disabled,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "outline";
}) {
  const base = "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition disabled:opacity-60";
  const styles =
    variant === "primary"
      ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-100"
      : "border border-slate-200 bg-white/80 text-slate-700 hover:bg-white";

  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[2rem] bg-white/80 shadow-xl backdrop-blur ${className}`}>{children}</div>;
}

function Icon({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex h-5 w-5 items-center justify-center">{children}</span>;
}

export default function App() {
  const [prompt, setPrompt] = useState(
    "夕暮れの田舎道を歩く柴犬と小さな旅人。風に揺れる草、雲の切れ間から差す光、やさしい手描きアニメ調。"
  );
  const [mood, setMood] = useState<Mood>("nostalgic");
  const [ratio, setRatio] = useState("3:4");
  const [isGenerating, setIsGenerating] = useState(false);

  const promptHint = useMemo(() => {
    const moodMap: Record<Mood, string> = {
      nostalgic: "懐かしく、温かい光、柔らかな色彩",
      forest: "深い森、木漏れ日、自然の息づかい",
      sky: "大きな空、雲、風を感じる構図",
      cozy: "小さな家、ランプの光、安心感のある雰囲気",
    };
    return moodMap[mood];
  }, [mood]);

  const finalPrompt = `${prompt}

スタイル: ${promptHint}。水彩のような背景、丁寧な線、自然物を多めに、過度に写実的にしない。画像比率: ${ratio}`;

  const handleGenerate = () => {
    setIsGenerating(true);
    window.setTimeout(() => setIsGenerating(false), 1400);
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(finalPrompt);
    alert("生成用プロンプトをコピーしました");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50 to-sky-100 text-slate-800">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-xl text-white shadow-lg shadow-emerald-200">
            🌿
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight">MoriCanvas AI</p>
            <p className="text-xs text-slate-500">やさしい手描きアニメ調の作図ツール</p>
          </div>
        </div>
        <a href="#generator" className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">
          無料で試す
        </a>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-6 pb-12 pt-6 lg:grid-cols-2">
        <section className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm text-emerald-700 shadow-sm backdrop-blur"
          >
            <Icon>✨</Icon>
            写真・文章から、物語のある一枚へ
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.05 }}
            className="mt-6 max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-6xl"
          >
            風、光、森の気配まで描くAI作図サイト
          </motion.h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            入力した言葉をもとに、やわらかい手描きアニメ調のイラスト用プロンプトを作成。旅、民泊、ペット、自然、思い出投稿のビジュアルづくりに向いています。
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["商用SNS投稿", "民泊・宿紹介", "ペット画像"].map((item) => (
              <div key={item} className="rounded-2xl bg-white/70 p-4 text-sm font-medium shadow-sm backdrop-blur">
                {item}
              </div>
            ))}
          </div>
        </section>

        <motion.section
          id="generator"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <Card className="overflow-hidden border-0 shadow-2xl shadow-emerald-100">
            <div className="p-5 md:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">AI作図パネル</h2>
                  <p className="text-sm text-slate-500">プロンプトを入力して生成</p>
                </div>
                <div className="rounded-2xl bg-amber-100 p-3 text-xl text-amber-700">🪄</div>
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-36 w-full resize-none rounded-3xl border border-emerald-100 bg-emerald-50/40 p-4 text-sm leading-6 outline-none transition focus:border-emerald-400 focus:bg-white"
                placeholder="描きたい絵を入力してください"
              />

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-medium">
                  雰囲気
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value as Mood)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 outline-none"
                  >
                    <option value="nostalgic">懐かしい夕暮れ</option>
                    <option value="forest">森と木漏れ日</option>
                    <option value="sky">大きな空と雲</option>
                    <option value="cozy">小さな家と灯り</option>
                  </select>
                </label>

                <label className="text-sm font-medium">
                  画像比率
                  <select
                    value={ratio}
                    onChange={(e) => setRatio(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 outline-none"
                  >
                    <option>1:1</option>
                    <option>3:4</option>
                    <option>4:5</option>
                    <option>16:9</option>
                  </select>
                </label>
              </div>

              <div className="mt-4 rounded-3xl bg-slate-900 p-4 text-sm text-white">
                <p className="mb-2 flex items-center gap-2 font-semibold">
                  <Icon>🌤️</Icon> 生成用プロンプト
                </p>
                <p className="whitespace-pre-line text-slate-300">{finalPrompt}</p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Button onClick={handleGenerate} disabled={isGenerating}>
                  {isGenerating ? "生成中..." : "プレビュー生成"}
                </Button>
                <Button onClick={copyPrompt} variant="outline">
                  プロンプトをコピー
                </Button>
              </div>
            </div>
          </Card>
        </motion.section>
      </main>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <div className="p-6">
              <h3 className="text-2xl font-bold">公開前の状態</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                この版はVercelで公開できるフロントエンドです。画像生成APIを接続すれば、本格的なAI作図サイトになります。
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button variant="outline">🖼️ 画像API接続予定</Button>
                <Button variant="outline">⬇️ 保存機能予定</Button>
              </div>
            </div>
          </Card>

          <div className="relative min-h-[420px] overflow-hidden rounded-[2.2rem] bg-gradient-to-b from-sky-200 via-emerald-100 to-amber-100 shadow-2xl shadow-emerald-100 lg:col-span-2">
            <div className="absolute left-10 top-10 h-24 w-40 rounded-full bg-white/70 blur-sm" />
            <div className="absolute right-16 top-20 h-20 w-32 rounded-full bg-white/60 blur-sm" />
            <div className="absolute bottom-0 left-0 right-0 h-44 rounded-t-full bg-emerald-500/30" />
            <div className="absolute bottom-0 left-20 h-72 w-24 rounded-t-full bg-emerald-800/70" />
            <div className="absolute bottom-20 left-10 h-36 w-36 rounded-full bg-emerald-700/60" />
            <div className="absolute bottom-14 right-24 h-44 w-32 rounded-t-full bg-amber-800/60" />
            <div className="absolute bottom-24 right-20 h-24 w-44 rounded-[3rem] bg-orange-200/90 shadow-xl" />
            <div className="absolute bottom-24 right-36 h-14 w-14 rounded-full bg-orange-100" />
            <div className="absolute bottom-28 right-40 h-3 w-3 rounded-full bg-slate-800" />
            <div className="absolute bottom-10 left-1/2 h-28 w-20 -translate-x-1/2 rounded-t-full bg-slate-700 shadow-xl" />
            <div className="absolute bottom-32 left-1/2 h-12 w-12 -translate-x-1/2 rounded-full bg-amber-100" />
            <div className="absolute bottom-5 left-0 right-0 h-24 bg-gradient-to-t from-emerald-700/50 to-transparent" />
            <div className="absolute bottom-6 left-6 rounded-3xl bg-white/60 px-4 py-3 text-sm font-semibold backdrop-blur">
              {ratio} / soft hand-drawn anime mood
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-7xl px-6 pb-8 text-center text-xs text-slate-500">
        © 2026 MoriCanvas AI. Soft hand-drawn illustration prompt tool.
      </footer>
    </div>
  );
}