import { motion } from "framer-motion";
import { useState } from "react";

const BlogNewsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="relative py-20 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-surface-darker" />

      <div className="relative z-10 container mx-auto px-6 text-center max-w-2xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight mb-4"
        >
          <span className="text-foreground">Stay Connected to the </span>
          <span className="text-glow-gold text-secondary">NETWORK</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-muted-foreground mb-8"
        >
          Subscribe to OverGuild's chronicle for the latest tech breakdowns, guild updates,
          and frontier research. Directly to your terminal.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto"
        >
          <input
            type="email"
            placeholder="ENTER_EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-pixel flex-1 px-4 py-3 text-sm font-pixel tracking-wider bg-background text-foreground placeholder:text-muted-foreground/40"
          />
          <button type="submit" className="btn-pixel px-6 py-3 text-sm font-pixel tracking-widest">
            {submitted ? "INITIALIZED" : "INITIALIZE"}
          </button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-pixel text-[10px] text-muted-foreground/40 mt-6 tracking-widest"
        >
          NO SPAM. JUST PURE DATA. SECURE TRANSMISSION GUARANTEED.
        </motion.p>
      </div>
    </section>
  );
};

export default BlogNewsletter;
