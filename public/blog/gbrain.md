# 🧠 GBrain: The Complete Guide for Web3 Builders

# 🧠 What is GBrain?

GBrain is an **open-source AI memory system** developed by Garry Tan (CEO of Y Combinator) that transforms how AI agents work with knowledge. Instead of treating notes as passive documents, GBrain creates a **living, breathing knowledge brain** that grows smarter over time.

- 🎯 Core Concept
    
    GBrain is a **compiled intelligence system** — not a note-taking app or "chat with your notes" tool. Every page is an intelligence assessment that:
    
    - Stores information as structured **Markdown files** in a Git repository
    - Uses **PostgreSQL + pgvector** for hybrid search (vector + keyword)
    - Runs autonomous **"dream cycles"** that enrich data while you sleep
    - Integrates with **30+ MCP tools** for seamless agent workflows
    - Supports **OpenClaw, Hermes, Claude Code, Cursor, and Windsurf**

---

## 🔑 Key Features

### 1️⃣ Persistent Long-Term Memory

Unlike standard AI chats that forget conversations, GBrain gives agents **perfect total recall** across 10,000+ markdown files. Your agent remembers:

- Every person you've met (4,383+ people tracked)
- Every company you've researched (723+ companies indexed)
- Every meeting transcript, email, tweet, and voice call
- All original ideas and research notes

### 2️⃣ Hybrid Search Engine

GBrain combines **three retrieval strategies** for maximum relevance:

**Vector Search (HNSW)**: Semantic similarity using OpenAI embeddings  

**Keyword Search (PostgreSQL tsvector)**: Exact phrase matching  

**Reciprocal Rank Fusion (RRF)**: Blends both approaches for best results

Benchmark results show **95% Recall@5** (vs 83% without GBrain) and **86.6% F1 score** for graph queries.

### 3️⃣ Dream Cycle Automation

Every night, GBrain runs **autonomous cron jobs** to:

- **Entity Sweep**: Detects new people, companies, protocols mentioned
- **Cross-Reference**: Creates backlinks between related entities
- **Citation Repair**: Fixes broken links and consolidates sources
- **Memory Consolidation**: Enriches thin pages with additional context
- **Timeline Compilation**: Structures chronological events

You wake up to a **smarter brain** than when you went to bed.

### 4️⃣ Structured Knowledge Schema

Every entity follows a standardized format:

**People Pages**: Name, role, company, meeting history, key insights  

**Company Pages**: Description, founders, funding, products, timeline  

**Protocol Pages**: Chain, TVL, mechanism, risks, integrations  

**Meeting Pages**: Date, attendees, decisions, action items

This structure enables **consistent, queryable intelligence assessments**.

---

## 🛠️ Technical Architecture

### Three-Pillar System

**1. Brain Repo (Git)** — Source of Truth  

Plain Markdown files humans can read/edit directly. Versioned with Git for full history.

**2. GBrain Retrieval Layer (Postgres + pgvector)** — Search Engine  

Indexes embeddings and metadata for hybrid search. Runs parallel vector + keyword queries with RRF fusion.

**3. AI Agent (OpenClaw/Hermes/Claude Code)** — Intelligence Interface  

Reads from and writes to both layers using 26 specialized skills defined in `RESOLVER.md`.

### Data Flow

```
User → Agent Query
↓
Intent Classifier (entity/temporal/event/general)
↓
Parallel Search Paths:
├─ Vector Search (cosine similarity)
└─ Keyword Search (Postgres FTS)
↓
Reciprocal Rank Fusion (RRF)
↓
Cosine Re-scoring + Compiled Truth Boost
↓
Top Results → Agent Context
```

### Deployment Options

**PGLite**: Zero-config local setup (perfect for testing)  

**Supabase**: Production-scale managed Postgres (recommended)  

**Self-hosted Postgres**: Full control for enterprise use

---

## 🌐 How Web3 Builders Can Apply GBrain

### 1️⃣ Protocol Research & Analysis

**Problem**: Web3 moves fast. New protocols launch weekly. Keeping track of mechanisms, teams, audits, and risks is overwhelming.

**GBrain Solution**:  

Create structured protocol pages with:

- Chain, TVL, mechanism type (AMM, lending, derivatives)
- Team background, funding rounds, investors
- Audit reports, known vulnerabilities, exploit history
- Integration partners, composability patterns
- Timeline of major updates/incidents

**Example Workflow**:  

1. Agent monitors Twitter/Discord for new protocol mentions
2. Dream cycle detects "Pendle Finance" as entity
3. Auto-creates page with research template
4. Enriches with Messari data, GitHub stats, DeFi Llama metrics
5. Cross-links to related protocols (Curve, Convex, Frax)

**Result**: Your agent knows every protocol in your research universe with perfect recall.

---

### 2️⃣ Investment Thesis Management

**Problem**: Tracking DeFi positions, entry/exit rationale, and portfolio performance across 50+ protocols.

**GBrain Solution**:  

Create investment thesis pages:

- **Entry Thesis**: Why you invested (yield, fundamentals, narratives)
- **Position Data**: Size, entry price, current exposure
- **Risk Assessment**: Smart contract risk, regulatory risk, liquidity risk
- **Exit Criteria**: Price targets, time horizons, stop-losses
- **Performance Log**: Historical PnL, lessons learned

**Dream Cycle Integration**:  

Nightly jobs update:

- Current TVL/price from Coingecko API
- New governance proposals from Snapshot
- Exploit news from [Rekt.news](http://Rekt.news)
- Sentiment shifts from crypto Twitter

**Result**: Your agent becomes your personal DeFi fund manager with institutional-grade memory.

---

### 3️⃣ Partnership & BD Pipeline

**Problem**: Web3 partnerships require tracking dozens of conversations, introductions, and follow-ups across Telegram, Twitter, Discord.

**GBrain Solution**:  

Structure partnership pipeline as:

**Company Pages**: Protocol name, team, stage (research/intro/negotiation/partner)  

**People Pages**: Key contacts, mutual connections, last interaction  

**Meeting Notes**: Discussion topics, blockers, next steps  

**Deal Timeline**: Proposal sent → call scheduled → contract signed

**Agent Skills**:  

- "Find warm intros to Arbitrum Foundation"
- "Summarize all partnership discussions with L2 protocols"
- "Who at Optimism did we meet at ETH Denver?"

**Result**: Never lose context on relationships. Your agent remembers every handshake.

---

### 4️⃣ Community Knowledge Base

**Problem**: Web3 communities (DAOs, builder groups, research collectives) generate tons of tribal knowledge in Discord/Telegram that gets lost.

**GBrain Solution**:  

Build a **community brain** that captures:

**Technical FAQs**: "How to bridge to Bitcoin L2s?"  

**Onboarding Guides**: "Setting up MetaMask for Starknet"  

**Tool Directories**: "Best BTCFi yield aggregators"  

**Event Summaries**: "Key takeaways from ETH Vietnam 2026"  

**Member Profiles**: Who specializes in Solidity, who knows ZK, who built on Sui

**Integration Example** (BTCFi Station):  

- Import Discord conversations via webhook
- Auto-tag mentions of protocols (Babylon, BounceBit, Lombard)
- Create entity pages for new builders joining community
- Cross-link related discussions across channels

**Result**: Community knowledge compounds instead of fragmenting.

---

### 5️⃣ Smart Contract Auditing Context

**Problem**: Auditors review dozens of codebases. Hard to remember patterns, exploit types, and similar vulnerabilities across projects.

**GBrain Solution**:  

Build an **exploit pattern library**:

**Vulnerability Pages**: Reentrancy, oracle manipulation, flash loan attacks  

**Exploit Case Studies**: How Euler hack worked, what went wrong in Mango Markets  

**Protocol Risk Profiles**: Historical incidents, code quality, team response time  

**Checklist Templates**: Per-protocol audit procedures

**Agent Query Examples**:  

- "Show me all lending protocols that suffered oracle manipulation"
- "What are common reentrancy patterns in Solidity?"
- "Compare Euler's fix vs Cream Finance's fix for similar vulnerability"

**Result**: Your agent becomes a security research assistant with perfect memory of exploit history.

---

## 🚀 Getting Started for Web3 Builders

### Installation (30 minutes)

**Step 1: Prerequisites**

```bash
# Install Bun runtime
curl -fsSL https://bun.sh/install | bash

# Clone GBrain
git clone https://github.com/garrytan/gbrain
cd gbrain
bun install
```

**Step 2: Configure API Keys**

Add to `.env`:

```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://....supabase.co
SUPABASE_KEY=eyJ...
```

**Step 3: Initialize Brain**

```bash
# Local setup (PGLite)
gbrain init --local

# Production setup (Supabase)
gbrain init --supabase
```

**Step 4: Import Existing Knowledge**

```bash
# Import markdown notes
gbrain import ~/Documents/research --no-embed

# Run initial indexing
gbrain index --all
```

**Step 5: Connect to Agent**

In OpenClaw/Claude Code:

```
"Set up gbrain (github.com/garrytan/gbrain) as my knowledge brain.

1. Scan ~/git/ and ~/Documents/ for markdown repos
2. Import protocol research notes
3. Run entity sweep for people/companies/protocols
4. Enable dream cycle cron jobs"
```

---

### Web3-Specific Setup Tips

**1. Create Protocol Research Template**

Save as `templates/protocol.md`:

```markdown
# {Protocol Name}

## Overview
- **Chain**: 
- **Category**: AMM | Lending | Derivatives | Bridge
- **TVL**: $XXM
- **Launched**: YYYY-MM

## Mechanism
[How it works]

## Team
- **Founders**: 
- **Backing**: 

## Risks
- **Smart Contract**: 
- **Liquidity**: 
- **Regulatory**: 

## Timeline
- YYYY-MM-DD: Launch
- YYYY-MM-DD: Exploit/Major event

## Related
- [[Similar Protocol]]
- [[Integration Partner]]
```

**2. Set Up Data Ingestion Pipelines**

```bash
# Twitter/X mentions of protocols
gbrain ingest twitter --keywords "BTCFi,Babylon,Lombard"

# DeFi Llama TVL updates
gbrain ingest defillama --protocols "pendle,convex,frax"

# Governance proposals
gbrain ingest snapshot --spaces "aave.eth,curve"

# Discord community discussions
gbrain ingest discord --channels "protocol-research,alpha-sharing"
```

**3. Configure Dream Cycle for Web3**

Add to `cron/dream-cycle.ts`:

```tsx
// Nightly protocol TVL refresh
schedule('0 2 * * *', async () => {
  await updateProtocolMetrics();
});

// Weekly exploit news scan
schedule('0 0 * * 0', async () => {
  await scanRektNews();
  await updateRiskProfiles();
});

// Daily governance tracking
schedule('0 12 * * *', async () => {
  await fetchSnapshotProposals();
  await notifyActiveVotes();
});
```

---

## 🔗 Essential Resources

### Official Documentation

- **GitHub Repository**: [github.com/garrytan/gbrain](http://github.com/garrytan/gbrain)
- **Installation Guide**: [INSTALL_FOR_](https://github.com/garrytan/gbrain/blob/master/INSTALL_FOR_AGENTS.md)[AGENTS.md](http://AGENTS.md)
- **Architecture Docs**: [docs/GBRAIN_](https://github.com/garrytan/gbrain/blob/master/docs/GBRAIN_V0.md)[V0.md](http://V0.md)
- **MIT License**: Free to use, modify, and deploy

### Integration Guides

- **OpenClaw Setup**: [docs/guides/](https://github.com/garrytan/gbrain/blob/master/docs/guides/executive-assistant.md)[executive-assistant.md](http://executive-assistant.md)
- **Hermes Agent**: Compatible with Hermes 3.x+
- **Claude Code**: Works with Claude Opus 4.6+
- **Cursor/Windsurf**: MCP tool integration

### Web3 Context

- **DeFi Llama API**: For protocol TVL/metrics
- **Coingecko API**: For price/market cap data
- **Messari API**: For fundamental research
- **Snapshot GraphQL**: For governance proposals
- **Etherscan/Block Explorers**: For on-chain verification

### Community

- **Reddit**: [r/openclaw](https://reddit.com/r/openclaw)
- **X/Twitter**: [@garrytan](https://twitter.com/garrytan)
- **LinkedIn**: [Garry Tan's post](https://www.linkedin.com/posts/garrytan_github-garrytangbrain-activity-7448263455964299264-qt7o)

---

## 💡 Pro Tips for Web3 Builders

### 1. Start with a Narrow Focus

Don't try to index the entire crypto universe at once. Pick:

- **5-10 protocols** you actively use/research
- **20-30 key people** in your network
- **Your own notes** from last 3 months

Expand as you see value.

### 2. Use MECE Directory Structure

Organize brain repo as:

```
brain/
├── protocols/
│   ├── defi/
│   │   ├── lending/
│   │   ├── dex/
│   │   └── derivatives/
│   └── infrastructure/
│       ├── l2/
│       ├── bridges/
│       └── oracles/
├── people/
├── companies/
├── meetings/
└── thesis/
```

### 3. Tag Consistently

Use inline tags for cross-linking:

- `#protocol/aave` `#protocol/compound`
- `#chain/ethereum` `#chain/arbitrum`
- `#category/lending` `#category/dex`
- `#risk/high` `#risk/medium`

### 4. Weekly Review Ritual

Every Sunday:

1. Review new entities discovered by dream cycle
2. Merge duplicate pages (e.g., "Pendle" vs "Pendle Finance")
3. Update investment thesis based on week's events
4. Check agent's understanding: "What are the top risks in my DeFi portfolio?"

---

## 🎯 Final Thoughts

GBrain isn't just a tool—it's a **paradigm shift** in how builders work with knowledge.

For Web3 builders specifically, it solves the **information overload problem**:  

→ Too many protocols to track  

→ Too many relationships to remember  

→ Too much alpha scattered across platforms  

→ Too little time to synthesize it all

With GBrain, your AI agent becomes your **second brain**, **chief of staff**, and **research assistant** rolled into one—with perfect memory of your Web3 universe.

The best part? It's **open source**, **MIT licensed**, and **built by one of the most respected builders in tech**.

Start building your knowledge brain today. 🧠⚡