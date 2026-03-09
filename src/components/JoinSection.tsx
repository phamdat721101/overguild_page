import { motion } from "framer-motion";
import { useState } from "react";

const X_URL = "https://x.com/overguildOG";
const TELEGRAM_URL = "https://t.me/OverGuildVN";
const CONTACT_EMAIL = "overguild2110@gmail.com";

const JoinSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [requirements, setRequirements] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Name: ${name}\nEmail: ${email}\nRequirements:\n${requirements}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=OverGuild Service Inquiry&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="contact" className="relative py-14 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-grid opacity-10" />

      <div className="relative z-10 container mx-auto px-6">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto mb-16"
        >
          <div className="text-center mb-8">
            <p className="font-pixel text-primary text-xs mb-3 tracking-widest">[ TRANSMISSION ]</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              <span className="text-foreground">Send a </span>
              <span className="text-glow-cyan text-primary">Message</span>
            </h2>
            <p className="text-muted-foreground text-base">
              Have a project in mind? Tell us what you need.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-pixel w-full px-4 py-3 text-sm bg-background text-foreground placeholder:text-muted-foreground"
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-pixel w-full px-4 py-3 text-sm bg-background text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <textarea
              placeholder="Requirements"
              required
              rows={4}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="input-pixel w-full px-4 py-3 text-sm bg-background text-foreground placeholder:text-muted-foreground resize-none"
            />
            <div className="text-center">
              <button type="submit" className="btn-pixel px-8 py-3 text-sm">
                Send Inquiry
              </button>
            </div>
          </form>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center max-w-xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Join </span>
            <span className="text-glow-cyan text-primary">OverGuild</span>
          </h2>
          <p className="text-muted-foreground mb-8 text-base">
            Follow us for updates, community, and Season 1.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={X_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pixel inline-flex items-center gap-2 px-6 py-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Twitter
            </a>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pixel inline-flex items-center gap-2 px-6 py-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              Telegram
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default JoinSection;
