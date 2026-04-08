import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import BlogCard from "@/components/blog/BlogCard";
import BlogNewsletter from "@/components/blog/BlogNewsletter";
import { getAllPosts, getFeaturedPost, getCategories } from "@/lib/blog";

const POSTS_PER_PAGE = 4;

const Blog = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const allPosts = getAllPosts();
  const featured = getFeaturedPost();
  const categories = getCategories();

  const filteredPosts = useMemo(() => {
    let result = allPosts;
    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allPosts, activeCategory, search]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const startIdx = (currentPage - 1) * POSTS_PER_PAGE + 1;
  const endIdx = Math.min(currentPage * POSTS_PER_PAGE, filteredPosts.length);

  return (
    <div className="min-h-screen bg-background text-foreground scanlines">
      <Navbar />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />

      <main className="relative pt-20">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-surface-darker" />
          {featured?.coverImage && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-screen"
              style={{ backgroundImage: `url(${featured.coverImage})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />

          <div className="relative z-10 container mx-auto px-6">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block font-pixel text-[10px] text-background bg-secondary px-3 py-1 tracking-widest mb-4"
            >
              FEATURED PROTOCOL
            </motion.span>

            <div className="w-16 h-0.5 bg-primary mb-6" />

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
            >
              <span className="text-foreground">THE BUILDER'S </span>
              <span className="text-glow-cyan text-primary italic">CHRONICLE</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-foreground/70 max-w-xl text-lg mb-8"
            >
              Documenting the ascent of the sovereign terminal. Exploring the
              frontiers of decentralized governance and the{" "}
              <span className="text-secondary font-semibold">2026 Vision</span>.
            </motion.p>

            {featured && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link
                  to={`/blog/${featured.slug}`}
                  className="btn-pixel inline-flex items-center gap-2 px-6 py-3 text-sm"
                >
                  READ FEATURED ARTICLE
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            )}
          </div>

          {/* Atmospheric glow */}
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* Main Content */}
        <section className="relative py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Sidebar */}
              <aside className="w-full lg:w-72 shrink-0 space-y-8">
                {/* Search */}
                <div className="border-l-2 border-primary pl-4">
                  <p className="font-pixel text-[10px] text-primary/70 tracking-widest mb-3">
                    SEARCH_TERMINAL
                  </p>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                    <input
                      type="text"
                      placeholder="Search logs..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                      className="w-full bg-muted border-none pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="border-l-2 border-primary pl-4">
                  <p className="font-pixel text-[10px] text-primary/70 tracking-widest mb-3">
                    INDEX_CATEGORIES
                  </p>
                  <ul className="space-y-1">
                    <li>
                      <button
                        onClick={() => {
                          setActiveCategory(null);
                          setPage(1);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm font-pixel tracking-wider transition-colors flex justify-between items-center ${
                          !activeCategory
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <span>ALL POSTS</span>
                        <span className="font-pixel text-[10px] text-muted-foreground">
                          [{allPosts.length.toString().padStart(2, "0")}]
                        </span>
                      </button>
                    </li>
                    {categories.map((cat) => (
                      <li key={cat.name}>
                        <button
                          onClick={() => {
                            setActiveCategory(cat.name);
                            setPage(1);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm font-pixel tracking-wider transition-colors flex justify-between items-center ${
                            activeCategory === cat.name
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          <span>{cat.name.toUpperCase()}</span>
                          <span className="font-pixel text-[10px] text-muted-foreground">
                            [{cat.count.toString().padStart(2, "0")}]
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* System Status (decorative) */}
                <div className="border-l-2 border-muted-foreground/20 pl-4">
                  <p className="font-pixel text-[10px] text-muted-foreground/40 tracking-widest mb-3">
                    SYSTEM_STATUS
                  </p>
                  <div className="space-y-1.5 font-pixel text-[10px] text-muted-foreground/30">
                    <p>UPTIME: 99.99%</p>
                    <p>NODES ACTIVE: 1,204</p>
                    <p>LAST UPDATE: 14:02 UTC</p>
                  </div>
                </div>
              </aside>

              {/* Article Grid */}
              <div className="flex-1">
                {paginatedPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {paginatedPosts.map((post, i) => (
                      <BlogCard key={post.slug} post={post} index={i} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="font-pixel text-sm text-muted-foreground tracking-widest">
                      NO LOGS FOUND
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {filteredPosts.length > 0 && (
                  <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="font-pixel text-[11px] text-muted-foreground/50 tracking-widest">
                      SHOWING {startIdx.toString().padStart(2, "0")}-
                      {endIdx.toString().padStart(2, "0")} OF{" "}
                      {filteredPosts.length.toString().padStart(2, "0")} ENTRIES
                    </p>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-pixel text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (n) => (
                          <button
                            key={n}
                            onClick={() => setPage(n)}
                            className={`w-9 h-9 text-sm font-pixel transition-colors ${
                              n === currentPage
                                ? "bg-primary text-primary-foreground font-bold"
                                : "text-muted-foreground hover:bg-muted"
                            }`}
                          >
                            {n}
                          </button>
                        )
                      )}

                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-pixel text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <BlogNewsletter />
      </main>

      <FooterSection />
    </div>
  );
};

export default Blog;
