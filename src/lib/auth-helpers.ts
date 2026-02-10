import { Plan } from "@/types/auth";

/**
 * ユーザーのプランに応じた権限レベルを定義
 */
export const PLAN_LEVELS: Record<string, number> = {
  [Plan.FREE]: 0,
  [Plan.PLUS]: 1,
  [Plan.PREMIUM]: 2,
  [Plan.EARLY_ACCESS]: 2, // アーリーアクセスは実質 PREMIUM 扱い
  [Plan.UNIVERSE]: 3,
};

/**
 * ユーザーが特定のプラン以上の権限を持っているか判定する
 * isMounted が true の場合のみ sessionStorage の偽装を考慮する
 */
export function hasAccess(
  userPlan: Plan | undefined | string, 
  requiredPlan: Plan, 
  isMounted: boolean = true
): boolean {
  let effectivePlan = userPlan;

  // クライアントサイドでのデバッグ用偽装（マウント後かつブラウザ環境のみ）
  if (isMounted && typeof window !== 'undefined') {
    if (sessionStorage.getItem("debug_mock_auth") === "unauthenticated") {
      return false;
    }

    const mockPlan = sessionStorage.getItem("debug_mock_plan");
    if (mockPlan) {
      effectivePlan = mockPlan as Plan;
    }
  }

  if (!effectivePlan) return false;
  
  const userLevel = PLAN_LEVELS[effectivePlan as Plan] ?? 0;
  const requiredLevel = PLAN_LEVELS[requiredPlan];

  return userLevel >= requiredLevel;
}

/**
 * デバッグ用の偽装を考慮した認証ステータスを取得する
 * isMounted が true の場合のみ sessionStorage の偽装を考慮する
 */
export function getEffectiveStatus(
  actualStatus: "authenticated" | "unauthenticated" | "loading",
  isMounted: boolean = false
): string {
  if (isMounted && typeof window !== 'undefined') {
    const mockAuth = sessionStorage.getItem("debug_mock_auth");
    if (mockAuth) return mockAuth;
  }
  return actualStatus;
}