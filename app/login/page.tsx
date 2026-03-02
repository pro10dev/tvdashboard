"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Authentication failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-background overflow-hidden">
      {/* Background ambiance */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] bg-gold/3 rounded-full blur-[100px]" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex w-full max-w-md flex-col gap-7 rounded-xl tv-card p-10 tv-glow-cyan animate-fade-in-up"
      >
        {/* Accent bar */}
        <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

        <div className="text-center">
          <h1
            className="text-3xl font-bold text-foreground tracking-[0.12em] tv-text-glow-cyan uppercase"
            style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
          >
            Information Board
          </h1>
          <p className="mt-3 text-base text-muted tracking-wide">
            Enter password to continue
          </p>
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          autoFocus
          className="rounded-lg border border-border bg-surface px-5 py-4 text-lg text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
        />

        {error && (
          <div className="flex items-center gap-2 justify-center px-3 py-2 rounded-lg bg-danger/10 border border-danger/20">
            <span className="w-2 h-2 rounded-full bg-danger" />
            <p className="text-sm font-medium text-danger">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-accent/90 px-5 py-4 text-lg font-bold text-white tracking-wider uppercase transition-all disabled:opacity-40 tv-glow-cyan"
          style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
        >
          {loading ? "Authenticating..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
