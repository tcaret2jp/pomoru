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
  // SSR中またはマウント前は、偽装を一切行わず、かつ基本権限以外は false を返す
  if (!isMounted || typeof window === 'undefined') {
    if (!userPlan) return false;
    const userLevel = PLAN_LEVELS[userPlan] ?? 0;
    const requiredLevel = PLAN_LEVELS[requiredPlan] ?? 0;
    return userLevel >= requiredLevel;
  }

  let effectivePlan = userPlan;

  // クライアントサイドでのみデバッグ用偽装を考慮
  try {
    if (sessionStorage.getItem("debug_mock_auth") === "unauthenticated") {
      return false;
    }
    const mockPlan = sessionStorage.getItem("debug_mock_plan");
    if (mockPlan) {
      effectivePlan = mockPlan;
    }
  } catch (e) {
    // sessionStorage が使えない環境（プライベートブラウジング等）への配慮
    console.error("sessionStorage access failed", e);
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
    try {
      const mockAuth = sessionStorage.getItem("debug_mock_auth");
      if (mockAuth === "unauthenticated") return "unauthenticated";
      if (mockAuth === "authenticated") return "authenticated";
    } catch (e) {
      console.error("sessionStorage access failed", e);
    }
  }
  return actualStatus;
}