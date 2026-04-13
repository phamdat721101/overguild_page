---
title: MPP Sessions Explained — OAuth for Money in the Machine Economy
description: How MPP Sessions enable AI agents to deposit funds once into escrow and stream thousands of micropayments via off-chain EIP-712 vouchers — settling everything in a single on-chain transaction.
date: 2026-04-11
category: Web3 Tech
author: Terminal_Admin
readTime: 14 MIN READ
coverImage: /blog/mpp.jpeg
featured: false
---

> **Tags:** `#MPP` `#Tempo` `#x402` `#ACP` `#AP2` `#MCP` `#EIP-712` `#Stripe` `#AI Agents` `#Stablecoins` `#HTTP402` `#TIP-20`
>
> **Sources:** [Formo](https://formo.so/blog/mpp-machine-payments-protocol-explained) · [BlockEden](https://blockeden.xyz/blog/2026/04/03/tempo-machine-payments-sessions-ai-agent-stablecoin-streaming-payments/) · [MPP Docs](https://mpp.dev/overview) · [IETF Draft](https://paymentauth.org/draft-httpauth-payment-00.html)

---

## Why Sessions Had to Be Invented

Before understanding Sessions, you need to understand why the old model breaks at machine speed.

Every previous micropayment system — from Flash, to PayPal Micropayments, to Lightning — failed for one common reason: **they assumed the payer was a human**.

Humans have *mental transaction costs*. Even a $0.001 payment triggers cognitive friction: "Should I pay for this? Is it worth it?" That hesitation breaks the economics of sub-cent digital services.

AI agents don't hesitate. For an agent, a payment is simply **a variable in an optimization function** — a prerequisite to task completion, not an emotional event. MPP is the first payment protocol designed around this reality.

### The Problem with Per-Request On-Chain Payments

Even with `x402` solving the HTTP layer, there's still a structural bottleneck when agents work at scale:

| Pain Point | What It Means |
|---|---|
| 💸 **Cost** | Ethereum mainnet gas for a simple ERC-20 transfer can exceed $1 — making a $0.31 average agent payment economically impossible |
| ⏱️ **Latency** | Even fast L2s with 2-second finality compound delays across multi-step workflows |
| 🔏 **Authorization** | Standard wallet signing assumes a human is present — agents need *delegated, bounded spending authority*, not a MetaMask popup |

The `x402` protocol (by Coinbase) solved per-request payments. But **x402 is stateless by design** — each request triggers a separate on-chain transaction. That works for one-off API calls, but it creates unacceptable overhead for *streaming workloads* where an agent consumes resources continuously over minutes or hours.

Sessions are the architectural answer to this.

---

## What Is an MPP Session?

> **One-line definition:** An MPP Session lets an AI agent **deposit funds once into escrow, then make thousands of subsequent micropayments using cryptographically signed off-chain vouchers** — with everything settling into a single on-chain transaction at the end.

The Tempo team describes it as **"OAuth for Money."** The analogy is precise:

> 🔑 *OAuth lets a user authorize a third-party app to act on their behalf within defined scopes — without sharing their password.*
>
> 💰 *An MPP Session lets a human authorize an AI agent to spend money on their behalf within defined limits — without sharing their private key.*

---

## How Sessions Work (Step-by-Step)

### ① Authorization — Open the Session

The human operator (or the agent itself, if pre-authorized) opens a session by depositing funds into an **on-chain escrow contract** on Tempo's L1 chain.

They specify:
- 💵 A **spending cap** (e.g., $50 maximum)
- ⏰ A **time window** (e.g., valid for the next 2 hours)
- 📋 Which **service provider(s)** may redeem funds

**Setup time:** ~500ms — a one-time cost paid once, not per-request.

### ② Streaming — Pay Per Request (Off-Chain)

As the agent consumes services, it **issues EIP-712 signed cumulative vouchers** to service providers with each subsequent HTTP request.

Critical architecture details:
- **No on-chain transaction** is needed for each individual payment
- The server verifies vouchers using `ecrecover` — **no RPC call, no database lookup required**
- This enables **sub-100ms latency** per request
- Payments as small as **$0.0001 per request** are economically viable

```
Agent → [Signed Voucher: $0.0001] → API Server (Dune Analytics)
Agent → [Signed Voucher: $0.0002] → API Server (Alchemy RPC)
Agent → [Signed Voucher: $0.0001] → API Server (fal.ai image gen)
... (thousands of calls)
```

Each voucher is *cumulative* — it carries the running total rather than just an incremental amount, preventing double-spend without a central database.

### ③ Settlement — Batch Close on Chain

When the session ends (spending cap reached, time window expires, or manually closed), **thousands of micro-interactions batch-settle into a single on-chain transaction**.

- The service provider redeems their accumulated vouchers in **one batch**
- This collapses what could be 10,000 on-chain txs into **1 tx**
- Cost savings: **orders of magnitude** compared to per-request on-chain settlement

### ④ Refund — Unused Funds Auto-Returned

Any portion of the escrow deposit not consumed by the session is **automatically refunded to the depositor**.

No manual withdrawal. No lock-up risk. No custodial trust required.

---

## Session vs. Charge Intent (MPP's Two Modes)

MPP has two payment intent types. Sessions are one of them:

| Feature | ⚡ Charge Intent | 🌊 Session Intent |
|---|---|---|
| **Type** | One-shot payment | Streaming micropayments |
| **Mechanism** | 1 request → 1 payment → 1 response | Escrow deposit + EIP-712 signed vouchers |
| **Latency** | Standard (on-chain confirmation) | Sub-100ms (off-chain ecrecover) |
| **Min. practical payment** | ~$0.01 | $0.0001 |
| **Settlement** | Per request, immediately on-chain | Batch-settled at session end |
| **Unused funds** | N/A | Auto-refunded from escrow |
| **x402 compatible?** | ✅ Yes — maps directly to x402 "exact" flow | ❌ Different architecture from SIWx |
| **Chain support (Apr 2026)** | Tempo, Stripe, Card, Solana (beta) | Tempo only |

**Key point:** Charge Intent is backward-compatible with `x402`. The x402 "exact" payment flow maps directly onto MPP's Charge Intent — meaning you are **not making an either/or bet** when choosing MPP.

---

## Session vs. x402 SIWx (Common Confusion Cleared)

This is where most developers get confused. Both MPP Sessions and x402 SIWx (Sign-In-With-X) create "session-like" behavior. They are **not the same thing**:

| Dimension | 🔐 x402 SIWx Session | 💰 MPP Session Intent |
|---|---|---|
| **Protocol** | x402 | MPP |
| **Nature** | Authentication-based | Payment-based |
| **Mechanism** | Prove wallet ownership → receive JWT → skip re-payment | Deposit escrow → stream EIP-712 vouchers → batch settle |
| **What it solves** | Agents skip re-paying for *previously purchased* content | Agents pay for *continuous, ongoing* resource consumption |
| **Analogy** | Web login (cookie) | Pre-paid streaming meter |
| **Settlement** | Per original purchase, settled then | Aggregated at session end |
| **Use case fit** | Access-gated content (one-time purchase, repeated access) | High-frequency compute/data streams (RPC calls, analytics, inference) |

> 💡 **Builder Rule of Thumb:** Use x402 SIWx when your service sells *access* (one purchase → many accesses). Use MPP Sessions when your service sells *consumption* (many micro-uses → one payment).

---

## Technical Infrastructure Enabling Sessions

Sessions are only possible because of three innovations baked into Tempo's L1 architecture:

### 1. Stablecoin-Native Gas (FeeAMM)

Most chains require a volatile native token for gas. Tempo's **FeeAMM** is a DEX embedded directly into node software as an EVM precompile — gas is paid in USDC, USDT, or PathUSD (Tempo's native stablecoin). Agents never need to hold a separate gas token.

### 2. TIP-20 Token Standard

TIP-20 extends ERC-20 with payment-specific features:
- **Transfer memos** — attach invoice/service IDs to transfers
- **Transfer policies** — compliance-friendly stablecoin controls
- **Reward mechanisms** — native yield/incentive distribution
- **Transfer pausing** — emergency controls for regulated issuers

### 3. Simplex Consensus Engine

- Sub-second deterministic finality (~0.5s)
- 20,000 TPS on testnet, roadmap to 200,000+ TPS (3× Visa's capacity)
- Sub-$0.001 fees on basic stablecoin transfers

Without protocol-level integration of these three, Sessions as described would be impossible to implement cleanly as smart contracts on a general-purpose chain.

---

## Where Sessions Fit in the Full Protocol Stack

Sessions don't exist in isolation. MPP is one layer in a 4-protocol emerging standard for autonomous agent commerce:

```
┌─────────────────────────────────────────────────────┐
│  ACP (OpenAI + Stripe)                              │
│  → Standardizes checkout flow between agents        │
│    and merchants (product discovery, cart)           │
├─────────────────────────────────────────────────────┤
│  AP2 / A2A (Google)                                 │
│  → Authorization, trust, identity for agents        │
│  → Integrates x402 for settlement                   │
├─────────────────────────────────────────────────────┤
│  x402 (Coinbase + Cloudflare)                       │
│  → Permissionless per-request stablecoin payments   │
│  → SIWx for access-based sessions                   │
├─────────────────────────────────────────────────────┤
│  MPP Sessions (Stripe + Tempo)  ← YOU ARE HERE      │
│  → Streaming micropayment sessions                  │
│  → Fiat + crypto multi-rail settlement              │
│  → IETF Standards Track proposal                    │
└─────────────────────────────────────────────────────┘
```

Also integrating with MCP (Model Context Protocol): MPP supports MCP as a first-class transport (defined in `draft-payment-transport-mcp-00`), meaning MCP tool servers can natively charge agents for tool usage through the same 402 challenge-response pattern.

---

## Real-World Session Use Cases

### On-Chain Analytics Agent

An agent tasked with monitoring a DeFi portfolio queries **Dune Analytics** 800 times in 30 minutes, each query costing $0.0002.

- ❌ Without sessions: 800 on-chain txs, ~$800+ in gas, 1,600 seconds of latency
- ✅ With MPP sessions: 1 escrow deposit ($0.16 budget), 800 off-chain vouchers at sub-100ms, 1 batch settlement tx at end. Total gas: <$0.001

### AI Inference Pipeline

An agent orchestrating a multi-step reasoning workflow calls **fal.ai** for image analysis, an **Alchemy RPC** for on-chain state, and a custom API for price feeds — all within one user request.

All three services accept MPP sessions. The agent opens one session, issues signed vouchers to each service as it calls them, and the entire multi-provider workflow settles in one tx.

### Autonomous Trip Booking

An agent books a flight by checking prices (API fees), holding a seat (escrowing funds), comparing hotels (more API fees), and finalizing the booking — all within a single authorized session.

The human sets: *"Budget: $600, window: 15 minutes."* The agent handles everything else.

---

## Key Takeaway

The MPP Session concept solves the fundamental problem that made every previous micropayment system fail: **the human-in-the-loop**. By combining an on-chain escrow with off-chain EIP-712 signed vouchers and batch settlement, sessions make it economically viable to run **millions of $0.0001 transactions** without hitting the blockchain every time.

This is not an incremental improvement on existing payment rails — it is the first payment primitive designed from the ground up for a world where machines are the primary economic actors.
