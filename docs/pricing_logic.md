# Pricing Logic & Authorization Strategy

このドキュメントでは、Pomoruエコシステム（Pomoru, PomoTask, および将来のアプリ）におけるプラン体系と、各機能へのアクセス権限を判定するためのロジックについて記述します。

## プラン体系 (Tier Hierarchy)

プランは以下の4段階（+ アーリーアクセス）で構成されます。上位プランは下位プランの全機能を含みます。

| プラン名         | 対象範囲              | 料金 (月額) | 概要                                                                  |
| :--------------- | :-------------------- | :---------- | :-------------------------------------------------------------------- |
| **Free**         | 単一アプリ            | ¥0          | 基本機能。同期機能など。                                              |
| **Plus**         | 単一アプリ            | ¥480        | 基本統計、ライトな連携機能など。                                      |
| **Premium**      | **Pomoru & PomoTask** | ¥980        | 全機能アクセス。詳細分析、Notion連携、カスタム設定。**2アプリ共通**。 |
| **Universe**     | **全アプリ (Future)** | ¥1,980      | 将来リリースされる全アプリの最上位プラン権限 + コミュニティ特典など。 |
| _(Early Access)_ | -                     | -           | ベータ版ユーザー向けの特典。実質的に `Premium` 相当の権限を持つ。     |

## データモデルの拡張 (`schema.prisma`)

`Plan` enum を拡張して、新しいプランをサポートします。

```prisma
// prisma/schema.prisma

enum Plan {
  FREE
  PLUS        // 追加
  PREMIUM
  UNIVERSE    // 追加
  EARLY_ACCESS
}

model User {
  // ...
  plan           Plan     @default(FREE)
  isEarlyAdopter Boolean  @default(false) // 古いフラグとの互換性維持のため残す
  // ...
}
```

## 権限チェックロジック (Authorization Logic)

各アプリの実装において、ユーザーが特定の機能を使えるかどうかを判定するための共通ロジックです。
「上位プランは下位プランの権限を包含する」という原則に基づきます。

### 判定関数 (Utility Helper)

```typescript
// src/lib/auth-helpers.ts (例)

import { User, Plan } from "@prisma/client";

/**
 * ユーザーが指定されたプラン以上の権限を持っているかを確認する
 */
export function hasAccess(user: User, requiredTier: Plan): boolean {
  // アーリーアダプターは実質 PREMIUM 扱いとする場合の特例
  if (user.isEarlyAdopter && requiredTier !== "UNIVERSE") {
    return true;
  }

  const tiers = {
    [Plan.FREE]: 0,
    [Plan.PLUS]: 1,
    [Plan.PREMIUM]: 2,
    [Plan.EARLY_ACCESS]: 2, // PREMIUMと同等
    [Plan.UNIVERSE]: 3,
  };

  const userTierLevel = tiers[user.plan] || 0;
  const requiredTierLevel = tiers[requiredTier] || 0;

  return userTierLevel >= requiredTierLevel;
}
```

### 使用例 (Usage)

#### 1. Plus機能のチェック (例: 基本統計を見る)

`PLUS` 以上のプランであればアクセス可能。つまり `PLUS`, `PREMIUM`, `UNIVERSE` ユーザーが対象。

```typescript
if (!hasAccess(user, Plan.PLUS)) {
  throw new Error("この機能を使用するにはPlusプラン以上が必要です。");
}
```

#### 2. Premium機能のチェック (例: Notion連携、PomoTask全機能)

`PREMIUM` 以上のプランであればアクセス可能。つまり `PREMIUM`, `UNIVERSE` ユーザーが対象。

```typescript
if (!hasAccess(user, Plan.PREMIUM)) {
  return <UpgradeModal requiredPlan="Premium" />;
}
```

#### 3. Universe機能のチェック (例: 将来のアプリのα版アクセス)

`UNIVERSE` プランのユーザーのみアクセス可能。

```typescript
if (!hasAccess(user, Plan.UNIVERSE)) {
  // Universeプランへの誘導
}
```

## 将来のアプリへの拡張性

- **DB共有戦略:** 全アプリで同じ Supabase (PostgreSQL) データベースを参照することで、`User` テーブルの `plan` カラムを共有します。これにより、あるアプリでアップグレードすれば、即座に他のアプリでもプランが適用されます。
- **Universeの優位性:** 将来新しいアプリ（例: "PomoJournal"）を作った際も、そのアプリの最上位プラン判定ロジックに `hasAccess(user, Plan.PREMIUM)` を組み込むだけで、Universe会員は自動的に全機能を使えるようになります。
