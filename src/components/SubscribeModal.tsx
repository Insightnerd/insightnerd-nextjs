"use client"

import { useState, useEffect } from "react";
import { X, CheckCircle, Loader2 } from "lucide-react";
import { useSubscribe } from "./SubscribeProvider";

export function SubscribeModal() {
  const { open, setOpen } = useSubscribe();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (open) return;
    const flag = localStorage.getItem("insightnerd-subscribe-dismissed");
    if (flag !== "true") {
      const timer = setTimeout(() => setOpen(true), 8000);
      return () => clearTimeout(timer);
    }
  }, [open, setOpen]);

  function close() {
    setOpen(false);
    setStatus("idle");
    setMessage("");
  }

  function dismiss() {
    setOpen(false);
    localStorage.setItem("insightnerd-subscribe-dismissed", "true");
    setStatus("idle");
    setMessage("");
  }

  async function handleSubscribe() {
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
        setMessage("You're subscribed! Check your inbox.");
        localStorage.setItem("insightnerd-subscribe-dismissed", "true");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#cccccc]/70 dark:bg-black/70" onClick={close} />
      <div className="relative bg-white dark:bg-neutral-950 border border-border rounded-xl p-6 w-full max-w-sm shadow-2xl animate-fade-in">
        <button
          onClick={close}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {status === "success" ? (
          <div className="text-center py-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-1">Subscribed!</h2>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-1">Subscribe to InsightNerd</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Get the latest articles delivered to your inbox.
            </p>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground mb-3 outline-none focus:ring-2 focus:ring-primary"
            />
            {status === "error" && (
              <p className="text-sm text-red-500 mb-3">{message}</p>
            )}
            <button
              onClick={handleSubscribe}
              disabled={!email.trim() || status === "loading"}
              className="w-full rounded-lg bg-primary text-primary-foreground py-2 text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
            >
              {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
            <button
              onClick={dismiss}
              className="w-full text-center text-xs text-muted-foreground mt-3 hover:text-foreground transition-colors"
            >
              No thanks
            </button>
          </>
        )}
      </div>
    </div>
  );
}
