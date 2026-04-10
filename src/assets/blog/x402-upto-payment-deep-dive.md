---
title: "x402 'Upto' Payment Scheme: Revolutionizing AI Agent Economics on Base"
description: How the 'upto' payment scheme unlocks usage-based billing for AI agents, optimizes context window management, and enables fair, autonomous micropayments in the Web3 economy.
date: 2026-04-10
category: AI & Web3
author: Terminal_Admin
readTime: 12 MIN READ
coverImage: /blog/x402-upto-payment-deep-dive.png
featured: true
---

**x402** is an open, internet-native payment protocol built on the HTTP 402 "Payment Required" status code. Developed by Coinbase's Developer Platform team, x402 enables any API or web service to require payment before serving content — making native, programmatic payments possible between clients and servers through a universal HTTP standard.

Think of it as fixing a 30-year-old omission in the web stack: the HTTP 402 status code was reserved back in 1997 but never implemented. x402 activates it, turning the request-response cycle into a pay-per-request loop where services can declare payment terms and clients can pay programmatically — often with stablecoins like USDC on Base — without accounts, subscriptions, or API keys by default.

> **Why This Matters for AI Agents:** As autonomous AI agents evolve from text generators into economic actors that accept jobs, manage budgets, and delegate tasks to sub-agents, they need a standardized way to discover prices, authorize payments within budget constraints, and receive resources — all in a single HTTP conversation. x402 provides this foundation for the emerging **Internet of Agents (IoA)**.

---

## The x402 Payment Flow

The protocol follows a simple challenge-retry pattern familiar from HTTP authentication:

```
Client                        Server
  │                             │
  │──── GET /api/generate ─────▶│
  │                             │
  │◀─── HTTP 402 ───────────────│
  │  PAYMENT-REQUIRED header    │
  │  {                          │
  │    scheme: "exact"|"upto"   │
  │    price: "$0.05"           │
  │    network: "eip155:8453"   │  (Base Mainnet)
  │    payTo: "0xABC..."        │
  │  }                          │
  │                             │
  │ [Client signs payment]      │
  │                             │
  │──── GET /api/generate ─────▶│
  │  PAYMENT-SIGNATURE header   │
  │                             │
  │◀─── HTTP 200 OK ────────────│
  │  [Resource delivered]       │
  │  PAYMENT-RESPONSE header    │
  │  { txHash: "0x..." }        │
```

This challenge-then-retry pattern keeps payment native to HTTP — no checkout pages, no redirects, no external payment gateways. The entire flow happens in headers.

---

## Two Payment Schemes: exact vs upto

x402 supports two payment schemes that solve fundamentally different billing problems. They're not interchangeable defaults — choosing between them determines the entire UX and economic model of your API or AI service.

### The 'exact' Scheme — Fixed Price, Deterministic Settlement

`exact` is the default payment scheme. The client pays a fixed, pre-declared price — no more, no less. The price is fully known before the request is made, advertised in the 402 response, and the signed payment payload locks in that exact amount atomically.

```js
// exact configuration
"GET /weather": {
  accepts: [{
    scheme: "exact",
    price: "$0.001",         // Fixed: client always pays exactly this
    network: "eip155:8453",  // Base Mainnet
    payTo: "0xYourAddress",
  }],
}
```

**When to use exact:** Static APIs where cost is deterministic upfront — data endpoints, file downloads, authentication tokens, weather data, fixed-size database queries.

### The 'upto' Scheme — Usage-Based Billing

![Context window optimization with upto payment scheme](https://user-gen-media-assets.s3.amazonaws.com/gemini_images/0628e85c-0aa7-42bd-bd88-c72e15409d37.png)

`upto` is the usage-based billing scheme. The client authorizes a maximum amount upfront, but the server settles only what was actually consumed after processing the request. The final charge is determined server-side at runtime — after the work is done — meaning neither party knows the exact charge at request time.

> **This maps precisely to how modern AI APIs work:** A client sends a prompt, but the number of output tokens (and therefore cost) is unknown until the model finishes generating. With `exact`, you'd have to charge a worst-case fixed fee. With `upto`, you charge only what was used.

```js
// upto configuration
"POST /api/generate": {
  accepts: {
    scheme: "upto",
    price: "$0.10",          // Max authorized ceiling (not the charge)
    network: "eip155:8453",  // Base Mainnet (EVM only for upto)
    payTo: evmAddress,
  },
}
```

### How upto Works — Step by Step

```
Client                        Server                      Facilitator
  │                             │                               │
  │──── POST /api/generate ────▶│                               │
  │                             │                               │
  │◀─── HTTP 402 ───────────────│                               │
  │    scheme: "upto"           │                               │
  │    price: "$0.10"           │  ← max authorized ceiling     │
  │                             │                               │
  │ [Signs payload authorizing  │                               │
  │   up to $0.10 max]          │                               │
  │                             │                               │
  │──── POST /api/generate ────▶│                               │
  │  PAYMENT-SIGNATURE: ...     │                               │
  │                             │                               │
  │              [Server processes request — e.g., 2,300 tokens]│
  │              [Actual cost = $0.023]                          │
  │                             │                               │
  │              setSettlementOverrides(res, { amount: "$0.023" })
  │                             │                               │
  │                             │──── POST /settle ($0.023) ───▶│
  │                             │                               │
  │◀─── HTTP 200 OK ────────────│◀────── tx confirmed ──────────│
  │  [Resource + usage data]    │  Settlement: exactly $0.023   │
  │                             │    (not the $0.10 max)        │
```

### The Critical Mechanism: setSettlementOverrides()

This is a server-side function called inside the route handler after the work is complete, before the response is sent. It instructs the facilitator to settle *less than* the authorized maximum.

```js
app.get("/api/generate", (req, res) => {
  // ... do work (LLM inference, compute, etc.)
  const actualTokens = runInference(req.query.prompt);
  const actualCost = computeCost(actualTokens); // e.g., "$0.023"

  // Settle only what was used
  setSettlementOverrides(res, { amount: actualCost });

  res.json({ result: actualTokens, charged: actualCost });
});
```

### Three Settlement Override Formats

| Format | Example | Behavior |
|---|---|---|
| **Raw atomic units** | `"23000"` | Settles exactly 23,000 atomic units (e.g., USDC 6-decimal → $0.023) |
| **Percentage of max** | `"23%"` | Settles 23% of the authorized ceiling; up to 2 decimal places; result is floored |
| **Dollar price** | `"$0.023"` | Converts USD to atomic units automatically using token decimals; result rounded |

> **Zero-charge edge case:** If `amount: "0"` is set, no on-chain transaction occurs at all — the client is served the resource completely free. This is useful for free-tier logic within a paid endpoint (e.g., first request is free, subsequent ones charged).

---

## Side-by-Side Comparison

| Dimension | exact | upto |
|---|---|---|
| Price at signing | Fully known | Unknown — only ceiling known |
| Settlement amount | Always = declared price | ≤ declared maximum |
| Server-side override | Not possible | Required via `setSettlementOverrides()` |
| Best for | Static APIs, data endpoints, fixed-cost services | AI inference, compute, streaming, variable-cost services |
| Networks | EVM + Solana + Stellar + Aptos | EVM only (Permit2 required) |
| SDK support | TypeScript, Go, Python | TypeScript, Go |
| Transfer method | EIP-3009 (default) or Permit2 | Permit2 (mandatory) |
| Zero-charge path | ❌ | ✅ (amount: "0") |
| Complexity | Low — one config line | Medium — requires handler logic |
| Default | ✅ Yes | ❌ No |

---

## How 'upto' Transforms AI Agent Economics

For autonomous AI agents, `upto` is architecturally transformative. Consider the problem `exact` creates for agents calling variable-cost services:

### The exact Problem for Agents

With `exact`, a server must declare a single fixed price. For an AI inference endpoint, this means either:

- **Underpricing** — charging the minimum possible token count; the server loses money on long outputs
- **Overpricing** — charging a worst-case fixed fee; agents overpay on every short request
- **Tiering complexity** — the server must create multiple endpoints (`/generate/small`, `/generate/large`) each with different `exact` prices

All three options are economically inefficient and create brittle agent logic.

### How upto Resolves Agent Economics

With `upto`, an agent workflow becomes:

```
Agent Logic:
  1. Receive task: "Summarize this document"
  2. Fetch endpoint → receive 402: scheme=upto, price=$0.10
  3. Evaluate: "Is $0.10 max acceptable for this task?"
     → If YES: sign authorization for up to $0.10
     → If NO: skip this service, find cheaper alternative
  4. Send signed request
  5. Server processes: doc = 800 tokens → cost = $0.008
  6. Server calls setSettlementOverrides({ amount: "$0.008" })
  7. Agent receives result; wallet debited $0.008 (not $0.10)
  8. PAYMENT-RESPONSE header returns tx hash for audit trail
```

The agent gains three critical properties it couldn't have with `exact` alone:

**Budget Ceiling** — The agent can make autonomous spend decisions bounded by a declared maximum — a key safety property for agentic systems that need human-defined budget limits.

**Cost Transparency** — The `PAYMENT-RESPONSE` header and usage data in the response body let agents track actual spend per task, enabling real-time budget management across long multi-step workflows.

**Economic Fairness** — Agents never overpay for short responses — cost scales with actual work performed, not worst-case estimates.

### The Agent Decision Loop With upto

```
Agent receives 402 with scheme=upto, price=$X
         │
         ▼
   Is $X ≤ my budget ceiling for this task?
    ├── YES → Sign and proceed
    └── NO  → Reject, try alternative service
              (x402 Bazaar helps find cheaper alternatives)
         │
         ▼
   Server processes → sets actual amount A ≤ $X
         │
         ▼
   Agent wallet debited exactly A
   Agent logs A to cost tracker
   Agent continues workflow
```

This decision loop can run fully autonomously at machine speed — no human needed to approve individual payments.

---

## Optimizing Context & Memory Management for AI Agents

Beyond fair pricing, the `upto` scheme fundamentally changes how AI agent service providers manage computational resources, particularly around context windows and memory allocation. This is where the economic model directly impacts technical architecture.

### The Context Window Economics Problem

Large Language Models (LLMs) powering AI agents operate with fixed context windows (e.g., 8K, 32K, 128K tokens). Every token in the context window — system instructions, conversation history, retrieved documents, tool outputs — consumes compute resources and increases inference latency. With `exact` pricing, providers face a dilemma:

- **Fixed high price:** Assume worst-case context utilization (full 128K window) and charge accordingly → agents overpay for simple queries that use 2K tokens
- **Fixed low price:** Assume average-case context (16K tokens) and risk losing money on complex queries that require full context → unsustainable for providers
- **Tiered endpoints:** Create `/chat/small`, `/chat/medium`, `/chat/large` with different context limits → agents must predict their needs upfront (impossible for dynamic workflows)

### How upto Enables Dynamic Context Allocation

With `upto`, providers can implement **dynamic context budgeting** — allocating context window space based on actual query complexity and charging proportionally:

```js
app.post("/api/chat", async (req, res) => {
  const { prompt, conversationId } = req.body;
  
  // Load conversation history (variable size)
  const history = await getConversationHistory(conversationId);
  
  // Retrieve relevant documents (variable size based on query complexity)
  const retrievedDocs = await semanticSearch(prompt);
  
  // Calculate actual context used
  const systemTokens = 150;
  const historyTokens = countTokens(history);
  const retrievedTokens = countTokens(retrievedDocs);
  const promptTokens = countTokens(prompt);
  const totalInputTokens = systemTokens + historyTokens + retrievedTokens + promptTokens;
  
  // Run inference
  const response = await llm.generate({
    system: systemInstructions,
    history,
    context: retrievedDocs,
    prompt,
  });
  
  const outputTokens = countTokens(response);
  const totalTokens = totalInputTokens + outputTokens;
  
  // Calculate actual cost based on token usage
  const inputCost = totalInputTokens * INPUT_PRICE_PER_TOKEN;
  const outputCost = outputTokens * OUTPUT_PRICE_PER_TOKEN;
  const totalCost = inputCost + outputCost;
  
  // Settle only what was consumed
  setSettlementOverrides(res, { amount: `$${totalCost.toFixed(6)}` });
  
  res.json({
    response,
    usage: {
      inputTokens: totalInputTokens,
      outputTokens,
      totalTokens,
      breakdown: {
        systemTokens,
        historyTokens,
        retrievedTokens,
        promptTokens,
      }
    },
    charged: totalCost,
  });
});
```

### Strategic Context Management Patterns

**1. Progressive Context Loading** — Instead of loading the entire conversation history upfront, load incrementally based on query complexity. Simple follow-up questions use minimal history; complex questions that reference earlier context load more. With `exact`, you must assume worst-case and load full history every time. With `upto`, load what's needed, charge for what's loaded. Agents pay 10x less for simple queries.

**2. Dynamic RAG (Retrieval-Augmented Generation)** — Adjust the number of retrieved documents based on query ambiguity. Factual lookups retrieve 2-3 docs; open-ended research queries retrieve 10-15 docs. With `exact`, either always retrieve maximum (expensive) or always retrieve minimum (poor quality). With `upto`, retrieve adaptively, charge proportionally. Quality scales with complexity.

**3. Tiered Context Compression** — Older conversation turns can be summarized/compressed before adding to context, reducing token count while preserving information. Charge reflects the compressed size, not the original. With `exact`, no incentive to compress — you're charging a flat fee anyway. With `upto`, compression directly reduces cost for agents, incentivizing providers to optimize.

**4. Predictive Context Prefetching** — Analyze conversation patterns to predict what context will be needed. Prefetch and cache likely documents, then charge only for what's actually included in the final context window. With `exact`, no way to reflect prefetch efficiency in pricing. With `upto`, efficient prefetching = lower per-request cost = competitive advantage.

### Memory Management for Multi-Agent Systems

In multi-agent architectures where specialized agents handle different aspects of user requests, `upto` enables **role-based memory allocation**:

- **Orchestrator agent:** Maintains full conversation context and task decomposition history (high context usage)
- **Specialist agents:** Receive only context relevant to their specific function (low context usage)
- **Memory agent:** Retrieves long-term user preferences and historical interactions on-demand (variable context usage)

Each agent's context budget is tracked independently, and the orchestrator can make real-time decisions about which agents to invoke based on their context costs vs. expected value. This is only possible when pricing reflects actual resource consumption.

### Cost Transparency Enables Agent Learning

Because `upto` returns detailed usage breakdowns in the response, agents can learn optimal query strategies over time:

```json
{
  "response": "...",
  "usage": {
    "inputTokens": 2340,
    "outputTokens": 450,
    "totalTokens": 2790,
    "breakdown": {
      "systemTokens": 150,
      "historyTokens": 800,
      "retrievedTokens": 1200,
      "promptTokens": 190
    }
  },
  "charged": 0.008
}
```

Over repeated interactions, the agent can optimize its prompt engineering: "My last query used 1200 tokens of retrieved context but the answer only used 2 of the documents. Next time, I'll request fewer documents to reduce input cost."

> **The Virtuous Cycle:** `upto` pricing creates a virtuous cycle: (1) Providers optimize context management to reduce costs → (2) Agents pay less per request → (3) Agents can afford more requests within their budget → (4) Providers get more volume → (5) Providers invest in better optimization → cycle repeats. This feedback loop doesn't exist with flat `exact` pricing.

---

## Making upto the Default

Based on the official documentation, three paths exist to push `upto` from an advanced option to the standard default behavior:

### Strategy 1 — Design Variable-Cost APIs Around upto

Any API whose cost depends on input/output size should default to `upto`, not `exact`. This covers the fastest-growing API categories:

```js
// ✅ CORRECT for variable-cost services
"POST /api/summarize": {
  accepts: { scheme: "upto", price: "$0.50" }
}

// ❌ WRONG — forces a fixed charge on variable-cost work
"POST /api/summarize": {
  accepts: { scheme: "exact", price: "$0.05" }
}
```

**Concrete examples where upto should be default:**

- LLM inference (billed per token)
- GPU compute (billed per second)
- Data streaming (billed per KB)
- Database queries (billed per row scanned)
- Image generation (billed per resolution tier)

### Strategy 2 — Use upto + exact Together

x402's `accepts` field is an array — a server can advertise both schemes simultaneously, letting the client choose:

```js
"GET /api/generate": {
  accepts: [
    {
      scheme: "upto",          // Preferred: pay only for what you use
      price: "$0.10",
      network: "eip155:8453",  // EVM only
      payTo: evmAddress,
    },
    {
      scheme: "exact",         // Fallback: fixed fee for non-EVM clients
      price: "$0.05",          // Flat fee (slight discount vs upto ceiling)
      network: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
      payTo: svmAddress,
    },
  ],
}
```

Smart clients (and agents) prefer `upto` when available; Solana clients or simpler wallets fall back to `exact`. This pattern maximizes compatibility without sacrificing `upto`'s economic benefits for EVM users.

### Strategy 3 — Use the Zero-Charge Path for Free Tiers

`upto`'s `amount: "0"` capability enables a freemium model natively within a single endpoint — no separate routes needed:

```js
app.get("/api/generate", (req, res) => {
  const user = getUser(req);

  if (user.freeRequestsRemaining > 0) {
    // No charge — but payment auth was still validated
    setSettlementOverrides(res, { amount: "0" });
    user.freeRequestsRemaining--;
  } else {
    const actualCost = runAndMeasure(req);
    setSettlementOverrides(res, { amount: actualCost });
  }

  res.json({ result: processRequest(req) });
});
```

This means a single `upto` endpoint can handle free-tier, pay-per-use, and bulk-discount billing tiers simultaneously — something `exact` simply cannot do without multiple separate endpoints.

### Strategy 4 — Wait for Solana + Python Support

The primary reason `upto` is not already the default is its EVM-only constraint. When Solana SPL token support and Python SDK support are added (both implied as roadmap items), `upto` will have feature parity with `exact` across all platforms. At that point, every major AI API framework — including Python-based LLM APIs — will be able to adopt `upto` as their natural default.

---

## Implementation on Base (EVM L2)

Base is Coinbase's Ethereum Layer 2 solution — a fast, low-cost, developer-friendly environment built on the OP Stack in partnership with Optimism. For `upto` payments, Base provides:

- **Native USDC:** Circle's native, dollar-backed stablecoin with instant settlement
- **Sub-second finality:** Transaction confirmation in under 2 seconds
- **~$0.01 gas fees:** Minimal overhead for micropayments
- **EVM compatibility:** Full support for Permit2 (required for `upto`)
- **Coinbase ecosystem:** Direct integration with Coinbase wallet, 110M+ verified users

> **Why Base for AI Agent Payments?** Base's combination of speed, cost-efficiency, and native USDC makes it the optimal settlement layer for high-frequency agent-to-agent micropayments. Unlike Ethereum mainnet (high gas fees) or alternative L1s (fragmented liquidity), Base offers predictable, sub-cent costs for every transaction — critical when agents make hundreds of API calls per workflow.

### Permit2: The Technical Foundation

`upto` relies on **Permit2**, Uniswap's universal ERC-20 approval contract, to authorize a maximum spending allowance at signing time, then settle the actual lower amount during execution. This is why `upto` is currently EVM-only — Permit2 doesn't yet have a direct parallel in the Solana SPL token model.

How Permit2 enables `upto`:

- **Signature-based approvals:** Client signs an off-chain message authorizing up to $X without an on-chain approval transaction
- **Time-bounded expiry:** Authorizations expire after a set period, limiting risk
- **Shared allowances:** One Permit2 approval can be used across multiple x402 facilitators
- **Gasless for users:** No upfront approval transaction required — first payment includes the approval signature

---

## Resources & Protocols

- [x402 Official](https://www.x402.org) — Core protocol documentation, SDKs, and integration guides
- [Coinbase Developer Platform](https://docs.cdp.coinbase.com/x402/) — x402 implementation docs, Base integration, facilitator setup
- [Base Network](https://www.base.org) — Ethereum L2 documentation, USDC contracts, testnet faucets
- [Permit2 Contract](https://support.uniswap.org/hc/en-us/articles/39683402190733) — Uniswap's universal token approval system
- [x402 Research](https://www.semanticscholar.org/paper/3bb6f801c96fe9c90eeed45cdc165fe02492c776) — Academic papers on capability-priced micro-markets and agent economies
- [Agent-OSI Stack](https://arxiv.org/abs/2602.13795) — Layered protocol stack for decentralized agent networking

---

## Conclusion

`exact` and `upto` are complementary, not competing. `exact` is the right choice for static resources where cost is deterministic upfront — data APIs, file downloads, authentication tokens. `upto` is the right architecture for any work whose cost scales with execution — AI inference, compute, streaming, or any service where billing by actual consumption is fairer than billing by worst-case estimate.

For the emerging AI agent economy, `upto` is the more powerful primitive because it gives autonomous agents a **safety-bounded, economically fair, and fully auditable** mechanism to pay for work — without requiring human approval for every transaction and without locking developers into the rigid pricing that `exact` demands.

As AI agents transition from demos to production economic actors, the infrastructure that wins will be the infrastructure that treats agents as first-class economic participants. x402's `upto` scheme, built on Base's fast and cost-efficient L2, provides exactly that foundation.

> **What's Next?** The x402 ecosystem is rapidly expanding. Stripe has integrated x402 for stablecoin payments. Multi-agent frameworks are building native x402 support. Research is underway on reputation-based service discovery (TraceRank), agent-to-agent protocol extensions (A2A + x402), and decentralized governance for autonomous AI (ETHOS framework). The Internet of Agents is being built on HTTP 402. And `upto` is the payment scheme that makes it economically viable.
