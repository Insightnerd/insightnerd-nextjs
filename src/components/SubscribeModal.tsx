"use client"

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function SubscribeModal() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const flag = localStorage.getItem("insightnerd-subscribe-dismissed");
    if (flag === "true") {
      setDismissed(true);
      return;
    }
    setDismissed(false);
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  function close() {
    setVisible(false);
    localStorage.setItem("insightnerd-subscribe-dismissed", "true");
    setDismissed(true);
  }

  function handleSubscribe() {
    if (!email.trim()) return;
    window.location.href = `mailto:insightnerd@outlook.com?subject=Subscribe%20me&body=I%20want%20to%20subscribe.%20My%20email:%20${encodeURIComponent(email)}`;
    close();
  }

  if (!visible || dismissed) return null;

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
        <h2 className="text-xl font-bold mb-1">Subscribe to InsightNerd</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Get the latest articles delivered to your inbox.
        </p>
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground mb-3 outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleSubscribe}
          disabled={!email.trim()}
          className="w-full rounded-lg bg-primary text-primary-foreground py-2 text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Subscribe
        </button>
        <button
          onClick={close}
          className="w-full text-center text-xs text-muted-foreground mt-3 hover:text-foreground transition-colors"
        >
          No thanks
        </button>
      </div>
    </div>
  );
}
