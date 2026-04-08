import { motion } from "framer-motion";
import { useMemo } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import BlogCard from "@/components/blog/BlogCard";
import BlogNewsletter from "@/components/blog/BlogNewsletter";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog";

function extractHeadings(content: string): { id: string; text: string }[] {
  const matches = content.match(/^## .+$/gm);
  if (!matches) return [];
  return matches.map((line) => {
    const text = line.replace(/^## /, "");
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    return { id, text };
  });
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  const headings = useMemo(
    () => (post ? extractHeadings(post.content) : []),
    [post]
  );
  const related = useMemo(
    () => (post ? getRelatedPosts(post.slug, post.category, 3) : []),
    [post]
  );

  if (!post) return <Navigate to="/blog" replace />;

  let h2Counter = 0;

  return (
    <div className="min-h-screen bg-background text-foreground scanlines">
      <Navbar />

      <main className="relative pt-20">
        {/* Hero */}
        <section className="relative min-h-[60vh] flex items-end overflow-hidden">
          {post.coverImage && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${post.coverImage})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          {/* Scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
            }}
          />

          <div className="relative z-10 container mx-auto px-6 pb-12 md:pb-16">
            {/* Back link */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 font-pixel text-[11px] text-primary/70 hover:text-primary tracking-wider mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK TO CHRONICLE
            </Link>

            {/* Decorative badges */}
            <div className="flex gap-3 mb-4">
              <span className="font-pixel text-[10px] text-primary/60 border border-primary/20 px-2 py-0.5 tracking-widest">
                STATUS: SECURE
              </span>
              <span className="font-pixel text-[10px] text-secondary/60 border border-secondary/20 px-2 py-0.5 tracking-widest">
                ENCRYPTION: LEVEL_09
              </span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight max-w-4xl text-glow-cyan text-primary mb-6"
            >
              {post.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-6 font-pixel text-[11px] text-muted-foreground/60 tracking-wider"
            >
              <span>
                AUTHOR: <span className="text-foreground/80">{post.author}</span>
              </span>
              <span>
                STAMP:{" "}
                <span className="text-foreground/80">
                  {post.date
                    ? format(new Date(post.date), "MMM dd, yyyy").toUpperCase()
                    : ""}
                </span>
              </span>
              <span>
                LOC: <span className="text-foreground/80">TERMINAL_GRID</span>
              </span>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="relative py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-7xl mx-auto">
              {/* Sidebar */}
              <aside className="w-full lg:w-64 shrink-0 space-y-8">
                {/* Core Telemetry (decorative) */}
                <div className="border-l-2 border-primary pl-4">
                  <p className="font-pixel text-[10px] text-primary/70 tracking-widest mb-3">
                    CORE TELEMETRY
                  </p>
                  <ul className="space-y-2 font-pixel text-[11px]">
                    {[
                      { label: "Network Load", value: "42.8%" },
                      { label: "Uptime", value: "99.999%" },
                      { label: "Active Peers", value: "14,092" },
                      { label: "Latency", value: "12ms" },
                    ].map((item) => (
                      <li
                        key={item.label}
                        className="flex justify-between text-muted-foreground/50"
                      >
                        <span>{item.label}</span>
                        <span className="text-primary">{item.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Table of Contents */}
                {headings.length > 0 && (
                  <div className="border-l-2 border-primary pl-4">
                    <p className="font-pixel text-[10px] text-primary/70 tracking-widest mb-3">
                      INDEX
                    </p>
                    <nav className="space-y-1.5">
                      {headings.map((h, i) => (
                        <a
                          key={h.id}
                          href={`#${h.id}`}
                          className="block font-pixel text-[11px] text-muted-foreground/60 hover:text-foreground transition-colors tracking-wider"
                        >
                          {(i + 1).toString().padStart(2, "0")}. {h.text.toUpperCase()}
                        </a>
                      ))}
                    </nav>
                  </div>
                )}
              </aside>

              {/* Article Body */}
              <article className="flex-1 min-w-0">
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      h2: ({ children }) => {
                        h2Counter++;
                        const text = String(children);
                        const id = text
                          .toLowerCase()
                          .replace(/[^a-z0-9\s-]/g, "")
                          .replace(/\s+/g, "-");
                        return (
                          <h2
                            id={id}
                            className="text-2xl md:text-3xl font-bold uppercase tracking-tight mt-12 mb-6 flex items-center gap-4 scroll-mt-24"
                          >
                            <span className="font-pixel text-primary text-base">
                              {h2Counter.toString().padStart(2, "0")}.
                            </span>
                            <span>{children}</span>
                          </h2>
                        );
                      },
                      h3: ({ children }) => (
                        <h3 className="text-xl font-bold uppercase tracking-tight mt-8 mb-4 text-foreground">
                          {children}
                        </h3>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-primary pl-6 my-8 text-lg italic text-foreground/80 not-prose">
                          {children}
                        </blockquote>
                      ),
                      pre: ({ children }) => (
                        <pre className="bg-surface-darker border border-border/20 p-6 overflow-x-auto my-6 text-sm">
                          {children}
                        </pre>
                      ),
                      code: ({ children, className }) => {
                        const isInline = !className;
                        if (isInline) {
                          return (
                            <code className="bg-muted px-1.5 py-0.5 text-primary text-sm font-mono">
                              {children}
                            </code>
                          );
                        }
                        return <code className="font-mono">{children}</code>;
                      },
                      img: ({ src, alt }) => (
                        <figure className="my-8 group">
                          <img
                            src={src}
                            alt={alt || ""}
                            className="w-full grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 border border-primary/10 group-hover:border-primary/30"
                          />
                          {alt && (
                            <figcaption className="mt-2 font-pixel text-[10px] text-muted-foreground/50 tracking-widest">
                              {alt.toUpperCase()}
                            </figcaption>
                          )}
                        </figure>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline underline-offset-4"
                        >
                          {children}
                        </a>
                      ),
                      hr: () => (
                        <hr className="my-10 border-border/30" />
                      ),
                      ul: ({ children }) => (
                        <ul className="space-y-2 my-4 list-none pl-0">
                          {children}
                        </ul>
                      ),
                      li: ({ children }) => (
                        <li className="flex gap-2 text-foreground/70">
                          <span className="text-primary shrink-0 mt-1">-</span>
                          <span>{children}</span>
                        </li>
                      ),
                      strong: ({ children }) => (
                        <strong className="text-foreground font-semibold">{children}</strong>
                      ),
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Related Logs */}
        {related.length > 0 && (
          <section className="relative py-16 md:py-20">
            <div className="absolute inset-0 bg-card" />
            <div className="relative z-10 container mx-auto px-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">
                  Related Logs
                </h2>
                <Link
                  to="/blog"
                  className="font-pixel text-[11px] text-primary tracking-widest hover:underline"
                >
                  VIEW_ALL_INTEL
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {related.map((p, i) => (
                  <BlogCard key={p.slug} post={p} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        <BlogNewsletter />
      </main>

      <FooterSection />
    </div>
  );
};

export default BlogPost;
