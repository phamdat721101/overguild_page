---
title: "Career-Ops on Leo-Book: AI-Powered CV Optimization for Web3 Builders"
description: How Career-Ops integrates an open-source AI-powered job search pipeline into Leo-Book, treating your job search like a CI/CD pipeline with CV parsing, 10-dimension evaluation scoring, and ATS-optimized profile generation.
date: 2026-04-14
category: Web3 Tech
author: Terminal_Admin
readTime: 12 MIN READ
coverImage: /blog/images/flow-diagram.jpg
featured: false
---

## 📌 Part 1 — Introduction

Job hunting in Web3 is broken. You spend hours tailoring CVs, guessing what ATS systems want, and applying to roles that don't actually fit. Meanwhile, companies run your resume through AI filters in seconds.

**We flipped the script.**

[Leo-Book](https://leo-book.xyz/) now integrates [Career-Ops](https://github.com/santifer/career-ops) — an open-source, AI-powered job search pipeline originally built by [@santifer](https://github.com/santifer) — directly into our platform as a web service for builders and researchers.

Instead of spray-and-pray applications, Career-Ops treats your job search like a **CI/CD pipeline**:

- 📄 **Upload your CV once** → AI extracts your skills, experience, and behavioral stories
- 🔍 **Paste any job description** → Get a structured 10-dimension evaluation score (A+ to F)
- 📝 **Receive a tailored CV profile** → Optimized for that specific role
- 📊 **Track everything** → Pipeline dashboard shows all evaluations at a glance

> 💡 *Inspired by [career-ops](https://github.com/santifer/career-ops) (32k+ ⭐ on GitHub) — the system that helped its creator evaluate 740+ job offers and land a Head of Applied AI role.*

### Who is this for?

| Builder Type | How Career-Ops Helps |
|---|---|
| 🛠️ **Web3 Developers** | Match your Solidity/Rust/Go skills against protocol-specific roles |
| 🤖 **AI Engineers** | Evaluate fit for LLMOps, Agentic AI, and Applied AI positions |
| 📊 **DevRel & PMs** | Score your cross-functional experience against hybrid roles |
| 🎓 **Career Switchers** | Identify skill gaps and get honest feedback before applying |

---

## ⚙️ Part 2 — How It Works

Career-Ops on Leo-Book runs in **3 stages**, each powered by Claude AI via AWS Bedrock.

### The Pipeline Flow

![Career-Ops Pipeline Flow](/blog/images/flow-diagram.jpg)

---

### 🔷 Stage 1: CV Command Center — Ingestion & STAR Extraction

Navigate to [`/career-ops`](https://leo-book.xyz/career-ops) and paste your CV in markdown format.

**What happens behind the scenes:**

```
> packet_received: master_cv_upload
> analyzing_syntax...
> [SUCCESS] 17_skills_detected
> [SUCCESS] 4_stories_extracted
> generating_story_bank_previews...
```

The AI parser extracts:

| Output | Description |
|---|---|
| 🧠 **Parsed Skills** | Specific technologies + competencies (e.g., `Go`, `Kubernetes`, `Distributed Systems`) |
| 💼 **Experience Nodes** | Structured role → company → duration → highlights |
| ⭐ **STAR Stories** | Behavioral interview stories in Situation → Task → Action → Result format |
| 📈 **Confidence Score** | 0–1 rating of how complete and parseable your CV is |

**The Story Bank** is the secret weapon. Career-Ops automatically extracts 3–5 STAR stories from your experience — ready-made answers for any behavioral interview question.

Each story card shows:

```
STAR_01: Monolith to Microservices Migration
  S: Legacy architecture creating deployment bottlenecks
  T: Rebuild core routing logic without downtime
  A: Implemented blue-green deployment strategy
  R: 99.99% uptime, 70% faster deployments
```

---

### 🔷 Stage 2: Pipeline Dashboard — Evaluate Jobs

Navigate to [`/career-ops/pipeline`](https://leo-book.xyz/career-ops/pipeline) to start evaluating jobs.

Type in the bottom command bar:

```
> Anthropic | Senior Platform Engineer | Build and maintain core infrastructure...
```

The AI evaluates your CV against the job description across **10 weighted dimensions**:

![10-Dimension Scoring Engine](/blog/images/scoring-engine.jpg)

| # | Dimension | What It Measures |
|---|---|---|
| 1 | 🎯 **Role Match** | How precisely your experience aligns with the role requirements |
| 2 | 🔍 **Skill Gaps** | Missing skills and estimated time to close the gap |
| 3 | 💰 **Comp Strategy** | Negotiation leverage based on your market position |
| 4 | 🏢 **Cultural Delta** | Company culture fit based on your work history patterns |
| 5 | 📈 **Market Velocity** | How in-demand your skill combination is right now |
| 6 | 🌐 **Network Density** | Breadth of your professional network for this domain |
| 7 | ⏳ **Longevity Index** | Likelihood of long-term fit and career growth |
| 8 | 🔧 **Tech Debt Exposure** | Your experience handling legacy systems and migrations |
| 9 | 👑 **Leadership Alpha** | Evidence of technical leadership and team influence |
| 10 | ✅ **Final Readiness** | Overall operational readiness to start this role |

Each dimension returns:
- **Letter grade** (A+ to F)
- **Percentage score** (0–100%)
- **One-line explanation** of why

The Pipeline Dashboard shows all your evaluations in a table:

```
┌─────────────┬──────────────────────┬───────┬──────────────┐
│ COMPANY     │ ROLE                 │ SCORE │ STATUS       │
├─────────────┼──────────────────────┼───────┼──────────────┤
│ ANTHROPIC   │ SR_PLATFORM_ENG      │  A    │ EVALUATED    │
│ STRIPE      │ BACKEND_ENGINEER     │  A-   │ EVALUATED    │
│ VERCEL      │ INFRA_LEAD           │  B+   │ EVALUATED    │
└─────────────┴──────────────────────┴───────┴──────────────┘
```

---

### 🔷 Stage 3: Evaluation Detail — Deep Analysis & Tailored CV

Click any row to see the full evaluation report at `/career-ops/evaluation/{id}`.

**Left panel — 10-Dimension Metrics:**

```
ROLE MATCH          ████████████████████░░  A+  (96%)
  Precision match for Senior Architect roles in FinTech ecosystem.

SKILL GAPS          ██████████████░░░░░░░░  B   (72%)
  Minor deficiency in Rust/WASM systems. 14hr delta for parity.

COMP STRATEGY       █████████████████░░░░░  A   (88%)
  Negotiation leverage optimized for Tier-1 markets. Expected +22% IRR.

FINAL OPERATIONAL READINESS                 A   (90%)
  ████████████████████████████████████░░░░
```

**Right panel — ATS-Optimized CV Preview:**

The AI generates a tailored executive profile specifically written for this role, emphasizing the most relevant experience from your CV that matches the job description.

**Bottom panel — Recommendation Log:**

```
[08:24:12] Targeting Phase: Deploy applications to "High Growth" segments only.
[08:24:15] Risk Assessment: Low churn probability for current profile.
[08:24:19] Resume Sync: ATS validation confirmed for V2_STABLE.
```

---

### 🏗️ System Architecture

![Architecture Diagram](/blog/images/architecture-diagram.jpg)

| Layer | Technology | Purpose |
|---|---|---|
| 🖥️ **Frontend** | Next.js 16, React 19, Tailwind v4 | Terminal Editorial UI with SSR |
| ⚡ **Backend** | Python FastAPI, Pydantic v2 | 5 Career-Ops API endpoints |
| 🤖 **AI Engine** | Claude via AWS Bedrock | CV parsing + 10-dimension evaluation |
| 🗄️ **Database** | Supabase (PostgreSQL + RLS) | cv_profiles, cv_stories, cv_evaluations |

**API Endpoints:**

```
POST /api/v1/career-ops/profiles          → Upload & parse CV
GET  /api/v1/career-ops/profiles/{id}     → Get profile + stories
POST /api/v1/career-ops/evaluate          → Evaluate job fit
GET  /api/v1/career-ops/evaluations       → List all evaluations
GET  /api/v1/career-ops/evaluations/{id}  → Evaluation detail
```

---

## 🎯 Part 3 — Conclusion

Career-Ops on Leo-Book gives builders an unfair advantage in the job market. Instead of guessing whether you're a good fit, you get **data-driven, AI-powered analysis** that tells you exactly where you stand — and generates a tailored CV to maximize your chances.

### Key Takeaways

- ✅ **Quality over quantity** — Focus on roles where you score A or B, skip the rest
- ✅ **STAR stories ready** — Walk into any behavioral interview with pre-extracted stories
- ✅ **Honest feedback** — The AI doesn't sugarcoat. A C- means don't waste your time
- ✅ **Tailored CVs** — Every evaluation generates role-specific content
- ✅ **100% local processing** — Your CV data stays in your pipeline, never shared

### What's Next

- 🔜 PDF generation with ATS-optimized formatting
- 🔜 Portal scanner integration (Greenhouse, Ashby, Lever)
- 🔜 Batch evaluation — process 10+ jobs in parallel
- 🔜 Interview prep mode with company-specific STAR story selection

---

### 🔗 Resources

| Link | Description |
|---|---|
| 🌐 [leo-book.xyz](https://leo-book.xyz/) | Try the platform |
| 🚀 [leo-book.xyz/career-ops](https://leo-book.xyz/career-ops) | Career-Ops CV Command Center |
| 📦 [github.com/santifer/career-ops](https://github.com/santifer/career-ops) | Original open-source project (32k+ ⭐) |
| 🐦 [@overguildOG](https://x.com/overguildOG) | Follow for updates |

---

### 👉 Try it now

1. Go to [leo-book.xyz/career-ops](https://leo-book.xyz/career-ops)
2. Paste your CV
3. Evaluate your first job
4. See where you actually stand

**Follow [@overguildOG](https://x.com/overguildOG) on X for builder signals, protocol updates, and new feature drops.**

---

*Built with [Next.js](https://nextjs.org/) · [FastAPI](https://fastapi.tiangolo.com/) · [Claude AI](https://www.anthropic.com/) · [Supabase](https://supabase.com/) · [AWS Bedrock](https://aws.amazon.com/bedrock/) · Inspired by [career-ops](https://github.com/santifer/career-ops)*

*Published by [Leo-Book](https://leo-book.xyz/) — Critical Web3 & AI signals for builders and researchers.*
