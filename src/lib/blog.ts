export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  author: string;
  readTime: string;
  coverImage: string;
  featured?: boolean;
  content: string;
}

function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const data: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    data[key] = value;
  }
  return { data, content: match[2].trim() };
}

const markdownFiles = import.meta.glob('/src/assets/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const posts: BlogPost[] = Object.entries(markdownFiles)
  .map(([path, raw]) => {
    const slug = path.split('/').pop()!.replace(/\.md$/, '');
    const { data, content } = parseFrontmatter(raw);
    return {
      slug,
      title: data.title || slug,
      description: data.description || '',
      date: data.date || '',
      category: data.category || 'Uncategorized',
      author: data.author || 'Anonymous',
      readTime: data.readTime || '5 MIN READ',
      coverImage: data.coverImage || '',
      featured: data.featured === 'true',
      content,
    };
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export function getAllPosts(): BlogPost[] {
  return posts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getFeaturedPost(): BlogPost | undefined {
  return posts.find((p) => p.featured) || posts[0];
}

export function getCategories(): { name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const post of posts) {
    map.set(post.category, (map.get(post.category) || 0) + 1);
  }
  return Array.from(map, ([name, count]) => ({ name, count }));
}

export function getRelatedPosts(currentSlug: string, category: string, limit = 3): BlogPost[] {
  return posts
    .filter((p) => p.slug !== currentSlug && p.category === category)
    .slice(0, limit);
}
