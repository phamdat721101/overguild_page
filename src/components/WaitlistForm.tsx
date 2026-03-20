import { useState } from "react";
import { motion } from "framer-motion";

const WAITLIST_API =
  import.meta.env.VITE_WAITLIST_API || "https://api.overguild.com/waitlist";
const SOURCE = "landing-overguild";

const WaitlistForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [responseResult, setResponseResult] = useState<{ status: number; data: unknown } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(WAITLIST_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source: SOURCE,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        if (res.status === 405) {
          throw new Error(
            "405 Not Allowed — Server (nginx) chưa cho phép POST /waitlist. Cần cấu hình nginx hoặc backend cho phép method POST."
          );
        }
        throw new Error(text || `HTTP ${res.status}`);
      }
      const text = await res.text();
      const result = res.headers.get("content-type")?.includes("application/json")
        ? (() => { try { return JSON.parse(text); } catch { return { raw: text }; } })()
        : { raw: text };
      setResponseResult({ status: res.status, data: result });
      console.log("[OverGuild Waitlist] 200 OK", result);
      setIsSubmitted(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Try again.";
      setError(msg.length > 120 ? `${msg.slice(0, 120)}…` : msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-pixel p-6 text-left"
      >
        <div className="font-pixel text-[10px] text-primary mb-2 text-glow-cyan">
          QUEST ACCEPTED
        </div>
        <p className="text-foreground font-medium">
          Your Player 1 slot has been reserved.
        </p>
        <p className="text-muted-foreground text-sm mt-2">
          Check your inbox for the confirmation scroll.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          className="input-pixel w-full"
        />
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-pixel w-full px-6 py-3 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Loading...
            </span>
          ) : (
            "Subscribe"
          )}
        </button>
      </div>
    </form>
  );
};

export default WaitlistForm;
