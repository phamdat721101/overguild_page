# 🌉 Solvers Kill Payment Fragmentation Forever

> How solver-powered cross-chain adapters enable AI agents to pay for services across any blockchain — automatically, atomically, and without manual bridging.

![Solver-Powered Cross-Chain Adapters](./solver.png)

---

## 🎯 The Problem: Payment Fragmentation in Multi-Chain Ecosystems

Traditional agentic payment systems face a critical challenge: **400+ MPP services exist on Tempo**, but agents operating on other blockchains (Ethereum, Arbitrum, Base) cannot directly access them. Without cross-chain adapters, payment infrastructure remains fragmented — each blockchain operates in isolation, limiting AI agents' ability to pay for services across different networks.

**What prevents direct cross-chain payments?**

- Each blockchain has its own native tokens and settlement layer
- Manual bridging requires complex multi-step transactions
- Agents would need to pre-fund wallets on every supported chain
- No unified routing mechanism exists between networks

---

## 💡 How Solvers Work: Cross-Chain Routing Explained

**Solvers** act as intelligent intermediaries that automatically handle the complexity of cross-chain transfers. Instead of agents managing bridges manually, solvers scan available balances across multiple chains, select optimal routing paths, and execute cross-chain swaps in a single seamless operation.

### The Solver Flow (Step-by-Step)

```
┌─────────────┐     ┌──────────┐     ┌─────────────┐     ┌──────────┐
│  AI Agent   │────▶│  Solver  │────▶│   Bridge    │────▶│  Service │
│ (Any Chain) │     │ (Router) │     │ (Squid/MPP) │     │ (Tempo)  │
└─────────────┘     └──────────┘     └─────────────┘     └──────────┘
      │                   │                  │                  │
      │  1. Call API      │                  │                  │
      │──────────────────▶│                  │                  │
      │                   │  2. Detect       │                  │
      │                   │  balances on     │                  │
      │                   │  all chains      │                  │
      │                   │─────────────────▶│                  │
      │                   │  3. Bridge &     │                  │
      │                   │  settle          │                  │
      │                   │─────────────────▶│─────────────────▶│
      │  4. Access granted│                  │                  │
      │◀─────────────────────────────────────────────────────────│
```

**How Solvers Enable Agentic Cross-Chain Payments:**

1. **Auto-discovery** — Solvers scan all supported chains for available token balances
2. **Optimal routing** — Select the best source chain and token based on fees, liquidity, and speed
3. **Atomic bridging** — Execute cross-chain transfers and settlements in one transaction flow
4. **Standard compliance** — Maintain HTTP 402 payment protocol throughout the process

---

## 🔧 Two Key Cross-Chain Adapters

### 1. 🦑 Squid MPP Adapter — EVM-to-Tempo Bridge

**Protocol**: [Squid Router](https://docs.squidrouter.com/api-and-sdk-integration/squid-mpp-adapter) | **Target**: EVM chains → Tempo mainnet

The Squid MPP adapter enables AI agents on **any EVM blockchain** (Ethereum, Polygon, Arbitrum, Base, etc.) to pay for MPP services on Tempo without manual bridging.

#### Key Features

| Feature | Description |
|---------|-------------|
| 🔍 Auto Chain Selection | Scans all Squid-supported EVM chains, detects USDC balances |
| 🌉 Cross-Chain Bridging | Routes tokens from source chain to Tempo via Squid liquidity |
| 🔐 HTTP 402 Flow | Maintains standard MPP challenge/credential cycle |

#### Implementation Example

**Server-side (protecting an endpoint):**

```javascript
import { mppx } from 'mppx';

app.get('/api/service', 
  mppx.charge().tempo({ 
    token: 'USDC', 
    amount: '0.01' 
  }), 
  (req, res) => {
    res.json({ data: 'Protected content' });
  }
);
```

**Client-side (paying from any EVM chain):**

```javascript
import { Mppx } from 'mppx';
import { squid } from '@0xsquid/mpp';

const client = Mppx.create({
  payment: squid({
    account: agentWallet,
    integratorId: 'your-squid-id'
  })
});

// Agent pays from any EVM chain automatically
const response = await client.fetch('https://api.example.com/service');
```

> The solver handles everything: detecting the agent has USDC on Arbitrum, bridging to Tempo, and settling the payment — all transparent to the agent.

---

### 2. ⭐ MPP Router — Stellar-to-Tempo Bridge

**Protocol**: [MPP Router](https://www.mpprouter.dev) | **Target**: Stellar → Tempo MPP services | **Built by**: ROZO × Stellar

MPP Router makes 400+ Tempo MPP services accessible to **Stellar-based AI agents** through intelligent routing.

#### How It Works

- **Unified Routing Layer** — Integrate once, access 400+ services
- **Cross-Protocol Translation** — Translates Stellar payments into Tempo MPP settlements
- **Agent-Native** — Works with Claude Desktop, Gemini CLI, Cursor, Codex via MCP

#### Available Services (88+ categories)

| Category | Services |
|----------|----------|
| 🤖 AI/ML | OpenAI, Anthropic, Gemini, Replicate, fal.ai, Stability AI, Mistral, DeepSeek |
| ⛓️ Blockchain | Alchemy, Nansen, Quicknode, Tempo RPC, Codex, Allium |
| 🔍 Search | Brave Search, Exa, Tavily, SerpApi, Parallel |
| 📊 Data | Dune, CoinGecko, IPinfo, Alpha Vantage, Wolfram\|Alpha |
| 💾 Storage | Pinata IPFS, Object Storage, Code Storage |
| ⚡ Compute | Modal, Build With Locus, Judge0 |

#### Quick Start (No Login Required)

Agents discover services by reading: `https://apiserver.mpprouter.dev/llms.txt`

**Before MPP Router:**
- ✕ 400+ services on Tempo not usable for Stellar agents
- ✕ Fragmented payment integration for each service

**After MPP Router:**
- ✓ Stellar can pay across entire MPP ecosystem
- ✓ One integration, unified routing

---

## 🔄 Complete End-to-End Payment Flow

Here's how a cross-chain agentic payment works:

| Step | Action | Detail |
|------|--------|--------|
| 1 | 🔍 Service Discovery | Agent needs to call an MPP service (e.g., OpenAI on Tempo) |
| 2 | 💳 Payment Challenge | Service responds with HTTP 402 + price + settlement address |
| 3 | 💰 Balance Detection | Solver scans wallets: 10 USDC on Arbitrum, 5 USDC on Stellar |
| 4 | 🛤️ Route Selection | Evaluates bridge fees, speed, liquidity → selects Arbitrum |
| 5 | ⚡ Atomic Settlement | Lock → Bridge → Settle → Generate credential |
| 6 | ✅ Access Granted | Agent retries with credential, service validates, grants access |

**All of this happens automatically** — the agent simply calls the API endpoint, and the solver handles all cross-chain complexity behind the scenes.

---

## 🎓 Why Solvers Matter for Agentic Payments

| Benefit | Impact |
|---------|--------|
| 💧 Liquidity Aggregation | Agents use tokens from any chain without manual transfers |
| 💸 Cost Optimization | Solvers select cheapest routing paths |
| 🎯 User Experience | One-line integration instead of complex multi-chain logic |
| 🔌 Protocol Flexibility | Services on Tempo serve clients from any blockchain |
| 📐 Unified Standards | HTTP 402 payment flow regardless of source chain |

---

## 🚀 Start Building Today

**For Service Providers** (accepting payments):
1. Install `mppx` library
2. Add `mppx.charge()` middleware to protected endpoints
3. Automatically accept payments from EVM chains (via Squid) or Stellar (via MPP Router)

**For AI Agent Developers** (making payments):
1. Integrate Squid MPP adapter for EVM-based agents
2. Integrate MPP Router for Stellar-based agents
3. Fund agent wallet on any supported chain
4. Let solver handle all cross-chain complexity

---

## 📚 Resources & Links

| Protocol | Link |
|----------|------|
| Squid MPP Adapter | [docs.squidrouter.com](https://docs.squidrouter.com/api-and-sdk-integration/squid-mpp-adapter) |
| MPP Router | [mpprouter.dev](https://www.mpprouter.dev) |
| MPP Protocol Docs | [mppx.dev](https://mppx.dev) |
| HTTP 402 Standard | [RFC 7231](https://tools.ietf.org/html/rfc7231#section-6.5.2) |

---

**🔗 Subscribe & Follow**: [@overguildOG](https://x.com/overguildOG)

**🛠️ Try new tools**: [leo-book.xyz](https://leo-book.xyz/)
