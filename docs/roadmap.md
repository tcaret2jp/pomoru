# 開発ロードマップ (Ultra-Detailed / みじん切り版)

`requirements.md` および `design.md` に基づく、実装手順書レベルまで分解されたロードマップ。

## Phase 1: MVP (Core Timer) - 基本機能の実装

### 1.1 プロジェクト初期化とクリーンアップ
- [x] **不要ファイルの削除と初期化**
  - [x] `src/app/page.module.css` を削除
  - [x] `public/` 以下の `next.svg`, `vercel.svg`, `window.svg`, `globe.svg`, `file.svg` を削除
  - [x] `src/app/globals.css` の内容を消去し、Tailwind directives (`@tailwind base;` 等) 3行のみにする
  - [x] `src/app/page.tsx` を編集し、既存のコードを削除して `<main className="flex min-h-screen flex-col items-center justify-center">Pomoru</main>` だけにする
  - [x] `src/app/layout.tsx` の `metadata` を更新 (title: "Pomoru", description: "Simple Pomodoro Timer")
- [x] **必須ライブラリのインストール**
  - [x] `npm install lucide-react` (アイコン用)
  - [x] `npm install clsx tailwind-merge` (クラス名結合用)
  - [x] `npm install use-sound` (サウンド再生用)
  - [x] `npm install -D prettier-plugin-tailwindcss` (Tailwind クラスの自動ソート用)

### 1.2 デザインシステム基盤の構築

- [x] **フォント設定 (`src/app/layout.tsx`)**

  - [x] `next/font/google` から `Inter` と `JetBrains_Mono` をインポート

  - [x] `Inter` を `variable: --font-inter` として定義

  - [x] `JetBrains_Mono` を `variable: --font-mono` として定義

  - [x] `<body>` タグの `className` に変数を適用

- [x] **Tailwind 設定 (`src/app/globals.css` - Tailwind v4)**

  - [x] `@theme` ブロックに `design.md` のカラーパレットを追加

  - [x] `fontFamily` に `sans` (Inter) と `mono` (JetBrains Mono) を追加

- [x] **ユーティリティ作成 (`src/lib/utils.ts`)**

  - [x] `cn` 関数を実装 (clsx と tailwind-merge を使用)

### 1.3 Atomic コンポーネント実装
- [ ] **ボタンコンポーネント (`src/components/ui/Button.tsx`)**
  - [ ] Props定義: `variant` ('primary' | 'secondary' | 'ghost'), `size` ('sm' | 'md' | 'lg')
  - [ ] `button` 要素をラップし、`cn` でクラスを動的に適用
  - [ ] ホバーエフェクト、アクティブエフェクトの実装
- [ ] **カードコンポーネント (`src/components/ui/Card.tsx`)**
  - [ ] 単純な `div` ラッパー。影、角丸、背景色 (白/黒) を適用
- [ ] **モーダルコンポーネント (`src/components/ui/Modal.tsx`)**
  - [ ] `Radix UI Dialog` (または自作ポータル) を使用したベース実装
  - [ ] 背景のオーバーレイと、中央配置のコンテナ
  - [ ] `isOpen`, `onClose` Props の定義

### 1.4 タイマーロジック (`src/hooks/useTimer.ts`)
- [ ] **型定義**
  - [ ] `TimerMode = 'work' | 'shortBreak' | 'longBreak'`
- [ ] **State 定義**
  - [ ] `timeLeft` (number, 秒単位)
  - [ ] `isActive` (boolean)
  - [ ] `mode` (TimerMode)
- [ ] **アクション実装**
  - [ ] `start()`: `isActive` を true にし、開始時刻 (`startTime`) を `Date.now()` で記録
  - [ ] `pause()`: `isActive` を false にし、残り時間を保持
  - [ ] `reset()`: モードに応じた初期時間にリセット
  - [ ] `switchMode(mode)`: モード変更と時間リセット
- [ ] **ティック処理 (useEffect)**
  - [ ] `setInterval` (100ms 間隔)
  - [ ] 現在時刻 - `startTime` を計算し、予想される残り時間を算出（ドリフト補正）
  - [ ] 残り時間が 0 になったら `onComplete` コールバックを実行し、音を鳴らす
- [ ] **バックグラウンド復帰対応 (useEffect)**
  - [ ] `document.visibilityState` を監視
  - [ ] `visible` になった瞬間、再度 `Date.now()` を用いて `timeLeft` を再計算・補正

### 1.5 タイマー UI 実装 (`src/components/features/timer/`)
- [ ] **TimerDisplay.tsx**
  - [ ] Props: `timeLeft` (seconds)
  - [ ] `Math.floor(timeLeft / 60)` と `timeLeft % 60` で分・秒を表示
  - [ ] ゼロ埋め処理 (`padStart(2, '0')`)
  - [ ] `font-mono` クラス適用
- [ ] **TimerProgress.tsx** (円形プログレス)
  - [ ] SVG の `<circle>` を2つ重ねる (背景用と進行用)
  - [ ] `radius`, `strokeWidth` を定義
  - [ ] `circumference` (円周) を計算
  - [ ] `timeLeft / totalTime` から `strokeDashoffset` を動的に計算してアニメーションさせる
- [ ] **TimerControls.tsx**
  - [ ] Play/Pause ボタン (トグル)
  - [ ] Reset ボタン
  - [ ] アイコン (`Play`, `Pause`, `RotateCcw` from lucide-react) の配置
- [ ] **ModeSwitcher.tsx**
  - [ ] 3つのタブボタンを表示
  - [ ] 現在の `mode` に応じてアクティブスタイル (背景色変更) を適用
  - [ ] クリック時に `switchMode` を呼び出し

### 1.6 統合と動作確認
- [ ] `src/app/page.tsx` に各コンポーネントを配置
- [ ] `useTimer` フックをページレベルで呼び出し、各コンポーネントに State と Handler を渡す
- [ ] ブラウザで表示確認
  - [ ] カウントダウンが正確か
  - [ ] バックグラウンドにして戻った時に時間が飛んでいるか (正しい挙動)
  - [ ] 音が鳴るか

## Phase 2: Authentication & Database - ユーザー基盤

### 2.1 データベース準備
- [ ] **Vercel Postgres (または Supabase) 作成**
  - [ ] Vercel ダッシュボードで Storage を作成
  - [ ] `.env` に `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING` を設定
- [ ] **Prisma 初期化**
  - [ ] `npm install prisma --save-dev`
  - [ ] `npm install @prisma/client`
  - [ ] `npx prisma init`
- [ ] **スキーマ定義 (`prisma/schema.prisma`)**
  - [ ] `User` モデル作成 (id, name, email, emailVerified, image)
  - [ ] `Account` モデル作成 (userId, type, provider, providerAccountId...)
  - [ ] `Session` モデル作成
  - [ ] `Settings` モデル作成 (userId, workDuration, shortBreakDuration, longBreakDuration, autoStartWork, autoStartBreaks)
- [ ] **マイグレーション実行**
  - [ ] `npx prisma migrate dev --name init_schema`

### 2.2 NextAuth 実装
- [ ] **ライブラリ導入**
  - [ ] `npm install next-auth @next-auth/prisma-adapter`
- [ ] **環境変数設定**
  - [ ] `NEXTAUTH_SECRET` (openssl rand -base64 32 で生成)
  - [ ] `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (GCPで取得)
- [ ] **API ルート作成 (`src/app/api/auth/[...nextauth]/route.ts`)**
  - [ ] `GoogleProvider` の設定
  - [ ] `PrismaAdapter` の適用
  - [ ] `callbacks` でセッションに `userId` を含めるように拡張
- [ ] **ログインボタン実装 (`src/components/auth/LoginButton.tsx`)**
  - [ ] `signIn('google')` を呼ぶボタン
  - [ ] `useSession` でログイン状態ならアバターとログアウトボタンを表示

### 2.3 設定機能の実装
- [ ] **Settings API 作成**
  - [ ] `src/app/api/settings/route.ts`
  - [ ] `GET`: `prisma.settings.findUnique` (なければデフォルト値を返す)
  - [ ] `PUT`: `prisma.settings.upsert` (バリデーション含む)
- [ ] **設定モーダル (`src/components/features/settings/SettingsModal.tsx`)**
  - [ ] フォーム実装 (React Hook Form 推奨)
  - [ ] 各時間の入力フィールド (数値のみ)
  - [ ] トグルスイッチ
- [ ] **設定同期フック (`useSettings`)**
  - [ ] `SWR` (`npm install swr`) を導入
  - [ ] ログイン時: APIから fetch / mutate
  - [ ] 未ログイン時: LocalStorage と同期 (`useLocalStorage` フック作成)

## Phase 3: Notion Integration - 外部連携

### 3.1 Notion 認証
- [ ] **Notion アプリ登録**
  - [ ] Notion Developers で Integration 作成 (Public Integration)
  - [ ] `NOTION_CLIENT_ID`, `NOTION_CLIENT_SECRET` を `.env` に追加
- [ ] **OAuth フロー実装**
  - [ ] `src/app/api/integrations/notion/auth/route.ts`: Notion の認可 URL へリダイレクト
  - [ ] `src/app/api/integrations/notion/callback/route.ts`:
    - [ ] `code` を受け取り `POST https://api.notion.com/v1/oauth/token`
    - [ ] 取得した `access_token` を `Account` テーブル (または `Integration` テーブル新規作成) に保存
- [ ] **暗号化処理 (`src/lib/crypto.ts`)**
  - [ ] アクセストークンを DB 保存する前に AES 等で暗号化する関数実装

### 3.2 タスク取得と選択
- [ ] **タスク取得 API (`src/app/api/notion/tasks/route.ts`)**
  - [ ] 保存されたトークンを復号
  - [ ] Notion Search API を叩いて Database を検索、または指定 Database のページを取得
- [ ] **タスクセレクター (`src/components/features/tasks/TaskSelector.tsx`)**
  - [ ] `Combobox` (または Select) UI 実装
  - [ ] 選択されたタスクを `currentTask` State に保存

### 3.3 実績記録
- [ ] **セッション記録 API (`src/app/api/sessions/route.ts`)**
  - [ ] POST: `prisma.pomodoroSession.create`
  - [ ] 関連づけられた `notionTaskId` があれば保存
- [ ] **Notion への書き込み**
  - [ ] セッション記録時、Notion API (Pages Update) を叩いて、該当タスクのプロパティ (例: "Actual Time") を更新する処理を追加

## Phase 4: Monetization & Statistics - 収益化と統計

### 4.1 統計ページ
- [ ] **ライブラリ導入**
  - [ ] `npm install recharts`
- [ ] **統計 API (`src/app/api/stats/route.ts`)**
  - [ ] 指定期間の `PomodoroSession` を集計して返す
- [ ] **グラフ実装 (`src/components/features/stats/DailyChart.tsx`)**
  - [ ] BarChart で日ごとの完了数を表示

### 4.2 Stripe 統合
- [ ] **Stripe セットアップ**
  - [ ] `npm install stripe`
  - [ ] `.env` に `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- [ ] **チェックアウト API (`src/app/api/stripe/checkout/route.ts`)**
  - [ ] `stripe.checkout.sessions.create`
- [ ] **Webhook API (`src/app/api/webhooks/stripe/route.ts`)**
  - [ ] `checkout.session.completed` イベントをハンドリング
  - [ ] `prisma.user.update` で `isPremium: true` にする
- [ ] **プレミアムガード**
  - [ ] `src/components/common/PremiumLock.tsx` 作成 (非プレミアムユーザーにオーバーレイを表示)

## Phase 5: Polish & Deployment - 仕上げ

### 5.1 ダークモード対応
- [ ] **Next Themes 導入**
  - [ ] `npm install next-themes`
  - [ ] `src/app/providers.tsx` を作成し `ThemeProvider` でラップ
  - [ ] `src/components/ui/ThemeToggle.tsx` 作成
- [ ] **色調整**
  - [ ] 全コンポーネントで `dark:` クラスが適切か再確認

### 5.2 PWA 対応
- [ ] **PWA パッケージ**
  - [ ] `npm install @ducanh2912/next-pwa` (App Router 対応版)
- [ ] **Manifest 作成**
  - [ ] `public/manifest.json`
  - [ ] アイコン画像 (192x192, 512x512) を生成して配置

### 5.3 最終デプロイ
- [ ] `npm run build` 実行確認
- [ ] Vercel へプッシュ
- [ ] 本番環境変数の設定確認