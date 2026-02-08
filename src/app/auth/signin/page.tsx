'use client';

import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function SignInContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");

  // 既にログイン済みの場合はリダイレクト
  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  return (
    <div className="max-w-md w-full mx-auto px-6 relative z-10">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-4xl mx-auto mb-8 shadow-inner border border-primary/5">
          🍅
        </div>
        <h1 className="text-3xl font-bold font-mono tracking-tighter mb-2">Sign in to Pomoru</h1>
        <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium opacity-60">
          Focus, Sync, and Achieve.
        </p>
      </div>

      <div className="space-y-6">
        {/* Google Sign In */}
        <Button
          variant="primary"
          size="lg"
          onClick={() => signIn("google", { callbackUrl })}
          className="w-full h-14 rounded-2xl gap-4 bg-white text-black hover:bg-zinc-100 border border-border shadow-xl shadow-black/5 transition-all active:scale-[0.98]"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.18 1-.76 1.85-1.61 2.42v2.84h2.6c1.52-1.41 2.4-3.48 2.4-5.27z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-2.6-2.84c-.5.34-1.14.54-1.81.54-2.83 0-5.22-1.92-6.08-4.5H2.18v2.92C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.92 13.54c-.22-.66-.35-1.36-.35-2.04s.13-1.38.35-2.04V6.54H2.18C1.43 8.09 1 9.73 1 11.5s.43 3.41 1.18 4.96l3.74-2.92z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.54l3.74 2.92c.86-2.58 3.25-4.5 6.08-4.5z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-base font-bold">Sign in with Google</span>
        </Button>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-border/50"></div>
          <span className="flex-shrink mx-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Or</span>
          <div className="flex-grow border-t border-border/50"></div>
        </div>

        {/* Email Sign In (Magic Link UI Placeholder) */}
        <div className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-40" />
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 pl-11 pr-4 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-sm font-medium"
            />
          </div>
          <Button
            variant="ghost"
            size="lg"
            disabled={!email || status === "loading"}
            onClick={() => alert('Magic Link implementation coming soon!')}
            className="w-full h-14 rounded-2xl text-base font-bold bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent hover:border-border transition-all"
          >
            Continue with Email
          </Button>
        </div>
      </div>

      <p className="mt-12 text-center text-xs text-muted-foreground leading-relaxed">
        By continuing, you agree to our <br />
        <Link href="#" className="underline hover:text-foreground">Terms of Service</Link> and <Link href="#" className="underline hover:text-foreground">Privacy Policy</Link>.
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300 relative flex flex-col justify-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary blur-[120px]" />
      </div>

      <header className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-20">
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exit</span>
        </Link>
        <ThemeToggle />
      </header>

      <Suspense fallback={<div className="flex items-center justify-center">Loading...</div>}>
        <SignInContent />
      </Suspense>

      <footer className="absolute bottom-0 left-0 right-0 p-8 text-center text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 font-mono">
        POMORU AUTHENTICATION SYSTEM
      </footer>
    </main>
  );
}
