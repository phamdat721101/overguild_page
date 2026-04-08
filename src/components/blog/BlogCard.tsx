import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import type { BlogPost } from "@/lib/blog";

interface BlogCardProps {
  post: BlogPost;
  index?: number;
}

const BlogCard = ({ post, index = 0 }: BlogCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group flex flex-col bg-card border-b-2 border-transparent hover:border-primary transition-colors duration-300"
    >
      <Link to={`/blog/${post.slug}`} className="flex flex-col h-full">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-surface-darker">
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition-all duration-700"
            />
          )}
          {/* Category tag */}
          <span className="absolute top-4 left-4 font-pixel text-[10px] text-secondary bg-background/80 px-2 py-1 tracking-widest">
            {post.category.toUpperCase()}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6 md:p-8">
          <time className="font-pixel text-[11px] text-muted-foreground/50 tracking-wider mb-3">
            {post.date ? format(new Date(post.date), "MMM dd, yyyy").toUpperCase() : ""} — {post.readTime}
          </time>

          <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 mb-2 line-clamp-2">
            {post.title}
          </h3>

          <p className="text-sm text-foreground/50 line-clamp-3 mb-6">
            {post.description}
          </p>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between">
            <span className="font-pixel text-[11px] text-primary/70 group-hover:text-primary transition-colors flex items-center gap-2 tracking-wider">
              READ FULL LOG
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard;
