#!/usr/bin/env node
import { createInterface } from "readline";
import { writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = join(__dirname, "..", "src", "assets", "blog");

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((r) => rl.question(q, r));

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  const title = await ask("Title: ");
  if (!title.trim()) {
    console.error("Title is required.");
    process.exit(1);
  }

  const category = (await ask("Category [Web3 Tech]: ")) || "Web3 Tech";
  const author = (await ask("Author [Terminal_Admin]: ")) || "Terminal_Admin";

  const slug = slugify(title);
  const date = new Date().toISOString().split("T")[0];
  const filePath = join(BLOG_DIR, `${slug}.md`);

  if (existsSync(filePath)) {
    console.error(`File already exists: ${filePath}`);
    process.exit(1);
  }

  const content = `---
title: ${title}
description:
date: ${date}
category: ${category}
author: ${author}
readTime: 5 MIN READ
coverImage: /blog/${slug}.jpg
featured: false
---

Write your content here.
`;

  writeFileSync(filePath, content, "utf-8");
  console.log(`\nCreated: ${filePath}`);
  console.log(`Cover image: public/blog/${slug}.jpg (add manually)`);
  rl.close();
}

main();
