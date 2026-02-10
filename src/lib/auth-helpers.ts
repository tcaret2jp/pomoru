import { Plan } from "@/types/auth";

/**
 * ユーザーのプランに応じた権限レベルを定義
 */
export const PLAN_LEVELS: Record<string, number> = {
  FREE: 0,
  PLUS: 1,
  PREMIUM: 2,
  EARLY_ACCESS: 2,
  UNIVERSE: 3,
};

/**
 * ユーザーが特定のプラン以上の権限を持っているか判定する
 */
export function hasAccess(
  userPlan: string | undefined, 
  requiredPlan: Plan, 
  isMounted: boolean
): boolean {
  if (!isMounted) return false;

  let effectivePlan = userPlan;

  // クライアントサイドでのデバッグ用偽装
  if (typeof window !== 'undefined') {
    if (sessionStorage.getItem("debug_mock_auth") === "unauthenticated") {
      return false;
    }
    const mockPlan = sessionStorage.getItem("debug_mock_plan");
    if (mockPlan) {
      effectivePlan = mockPlan;
    }
  }

  if (!effectivePlan) return false;
  
  const userLevel = PLAN_LEVELS[effectivePlan] ?? 0;
  const requiredLevel = PLAN_LEVELS[requiredPlan] ?? 0;

  return userLevel >= requiredLevel;
}

/**
 * デバッグ用の偽装を考慮した認証ステータスを取得する
 */
export function getEffectiveStatus(
  actualStatus: "authenticated" | "unauthenticated" | "loading",
  isMounted: boolean
): string {
  if (isMounted && typeof window !== 'undefined') {
    const mockAuth = sessionStorage.getItem("debug_mock_auth");
    if (mockAuth === "unauthenticated") return "unauthenticated";
    if (mockAuth === "authenticated") return "authenticated";
  }
  return actualStatus;
}
