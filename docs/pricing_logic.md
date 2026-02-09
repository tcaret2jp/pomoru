# Pricing Logic & Authorization Strategy (Updated)

このドキュメントでは、Pomoruエコシステムにおける最新のプラン体系と、機能ごとの権限割り当てを定義します。

## プラン体系 (Tier Hierarchy & Features)

上位プランは下位プランの全機能を含みます。

| プラン名 | ターゲット | 主な限定機能 |
| :--- | :--- | :--- |
| **Free** | ライトユーザー | 基本タイマー、クラウド同期 |
| **Plus** | カスタマイズ重視 | **カスタムアラーム音**、Notion連携(基本) |
| **Premium** | プロ・効率化重視 | **高度なタスク管理**、**詳細統計・分析機能**、Pomoru & PomoTask共通 |
| **Universe** | ヘビーユーザー | **全アプリのPremium特権**、ゴールドバッジ、コミュニティ招待 |

### 機能別の必要プラン (Feature Matrix)

| カテゴリ | 機能名 | 必要プラン | 備考 |
| :--- | :--- | :--- | :--- |
| タイマー | 基本ポモドーロ | FREE | |
| | **カスタムアラーム音** | **PLUS** | お気に入りの音に変更可能 |
| タスク | Notion連携 (インポート) | PLUS | Notionからタスクを読み込む |
| | **高度なタスク管理** | **PREMIUM** | 双方向同期、自動ステータス更新、優先度管理 |
| 分析 | 基本統計 | PLUS | 今日の合計時間など |
| | **詳細統計・分析** | **PREMIUM** | 週次/月次レポート、タスク別分析、集中トレンド |
| エコシステム | 全アプリPremium権限 | **UNIVERSE** | PomoTask以外の将来アプリも含む |

## 権限チェックの実装方針

`src/lib/auth-helpers.ts` で以下のレベル分けを使用して判定します。

```typescript
export enum PlanLevel {
  FREE = 0,
  PLUS = 1,
  PREMIUM = 2,
  UNIVERSE = 3,
}

const PLAN_MAP: Record<string, number> = {
  FREE: PlanLevel.FREE,
  PLUS: PlanLevel.PLUS,
  PREMIUM: PlanLevel.PREMIUM,
  EARLY_ACCESS: PlanLevel.PREMIUM, // アーリーアクセスはPREMIUM相当
  UNIVERSE: PlanLevel.UNIVERSE,
};
```

## UIへの反映

`src/app/pricing/page.tsx` の各カードに記載されているベネフィット（箇条書き部分）を、上記のマトリクスに合わせて更新します。