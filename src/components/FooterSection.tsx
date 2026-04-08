import { Link } from "react-router-dom";
import logo from "@/assets/logo.svg";

const DOCS_URL = "https://docs.overguild.xyz";
const LEO_BOOK_URL = "https://www.leo-book.xyz/";

const BLOCK_COUNT = 15;
const LIT_START = 5;
const LIT_COUNT = 5;

const FooterSection = () => {
  return (
    <footer className="relative py-8 overflow-hidden border-t border-border text-foreground">
      <div className="absolute inset-0 bg-background" />
      <div className="relative z-10 container mx-auto px-6 py-6">
        {/* Row: Brand (left) | Links (center) | Copyright (right) */}
        <div className="flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-0">
          <div className="flex items-center gap-3 md:justify-self-start">
            <img src={logo} alt="OverGuild logo" className="w-8 h-8" />
            <span className="text-lg font-bold text-brand-outline">OverGuild</span>
          </div>

          <nav className="flex items-center justify-center gap-6 text-sm text-muted-foreground hover:[&>a]:text-foreground [&>a]:transition-colors">
            <a href={DOCS_URL} target="_blank" rel="noopener noreferrer">
              Docs
            </a>
            <Link to="/blog">
              Blog
            </Link>
            <a href={LEO_BOOK_URL} target="_blank" rel="noopener noreferrer">
              Leo-book
            </a>
          </nav>

          <p className="text-sm text-muted-foreground md:text-right md:justify-self-end">
            © 2026 OVERGUILD
          </p>
        </div>

        {/* Block indicator bar (centered below links) */}
        <div className="flex justify-center gap-1 mt-6">
          {Array.from({ length: BLOCK_COUNT }, (_, i) => {
            const isLit = i >= LIT_START && i < LIT_START + LIT_COUNT;
            return (
              <div
                key={i}
                className={`h-2 w-3 rounded-sm transition-colors ${
                  isLit
                    ? "bg-primary shadow-[0_0_8px_hsl(var(--primary))]"
                    : "bg-muted"
                }`}
              />
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
