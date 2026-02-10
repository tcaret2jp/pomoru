import { Plan } from "@prisma/client";

/**
 * ユーザーのプランに応じた権限レベルを定義
 */
export const PLAN_LEVELS: Record<Plan, number> = {
  [Plan.FREE]: 0,
  [Plan.PLUS]: 1,
  [Plan.PREMIUM]: 2,
  [Plan.EARLY_ACCESS]: 2, // アーリーアクセスは実質 PREMIUM 扱い
  [Plan.UNIVERSE]: 3,
};

/**
 * ユーザーが特定のプラン以上の権限を持っているか判定する
 */
export function hasAccess(userPlan: Plan | undefined | string, requiredPlan: Plan): boolean {
  // クライアントサイドでのデバッグ用偽装（ブラウザ環境のみ）
  let effectivePlan = userPlan;
  if (typeof window !== 'undefined') {
    // 未ログイン偽装が有効な場合は常に false
    if (sessionStorage.getItem("debug_mock_auth") === "unauthenticated") {
      return false;
    }

    const mockPlan = sessionStorage.getItem("debug_mock_plan");
    if (mockPlan) {
      effectivePlan = mockPlan as Plan;
    }
  }

  if (!effectivePlan) return false;
  
  // ユーザーのプランレベルを取得（不明なプランは FREE 扱い）
  const userLevel = PLAN_LEVELS[effectivePlan as Plan] ?? 0;
  const requiredLevel = PLAN_LEVELS[requiredPlan];

  return userLevel >= requiredLevel;
}

/**
 * デバッグ用の偽装を考慮した認証ステータスを取得する
 */
export function getEffectiveStatus(actualStatus: "authenticated" | "unauthenticated" | "loading"): string {
  if (typeof window !== 'undefined') {
    const mockAuth = sessionStorage.getItem("debug_mock_auth");
    if (mockAuth) return mockAuth;
  }
  return actualStatus;
}
