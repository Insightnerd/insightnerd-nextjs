"use client"

import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";

export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("Subscribed!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed");
      }
    } catch {
      setStatus("error");
      setMessage("Network error");
    }
  }

  return (
    <div>
      <h4 className="text-foreground text-sm font-semibold mb-3 tracking-wider uppercase">
        Newsletter
      </h4>
      <p className="text-xs text-muted-foreground mb-3">
        Get the latest articles delivered to your inbox.
      </p>
      {status === "success" ? (
        <div className="flex items-center gap-2 text-xs text-green-500">
          <CheckCircle className="h-4 w-4" />
          {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary min-w-0"
            required
          />
          <button
            type="submit"
            disabled={status === "loading" || !email.trim()}
            className="shrink-0 rounded-lg bg-primary text-primary-foreground px-3 py-2 text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === "loading" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Join"}
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="text-xs text-red-500 mt-1">{message}</p>
      )}
    </div>
  );
}
