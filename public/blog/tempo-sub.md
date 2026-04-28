<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# [https://tempo.xyz/blog/subscriptions-on-tempo](https://tempo.xyz/blog/subscriptions-on-tempo)

[https://tempo.xyz/blog/virtual-addresses](https://tempo.xyz/blog/virtual-addresses)
[https://docs.tempo.xyz/guide/payments/virtual-addresses](https://docs.tempo.xyz/guide/payments/virtual-addresses)

let scan, and analyze all resources from above links then make detail article to:

- explain about the concept of virtual address, and access-key including what is it, how it work
- then explain how it can support MPP be better adoption

important note:

- make content to be clean, simple and being break down structure to be easy to follow
- content must have attractive icon, content must tag all related protocols, and having attached resource links
- return content to be attractive notion format

Now I have all the content. Let me compose a detailed, well-structured Notion-style article.

Here is the full article in Notion-compatible format:

***

# 🌐 Virtual Addresses \& Access Keys on Tempo — A Deep Dive

> *How Tempo's native primitives eliminate sweep operations, enable subscriptions, and unlock better Machine Payments Protocol (MPP) adoption*

***

📎 **Resource Links**

- [📄 Blog: Virtual Addresses for Stablecoin Deposits](https://tempo.xyz/blog/virtual-addresses)
- [📄 Blog: Subscriptions on Tempo](https://tempo.xyz/blog/subscriptions-on-tempo)
- [📘 Docs: Use Virtual Addresses for Deposits](https://docs.tempo.xyz/guide/payments/virtual-addresses)
- [⚙️ Protocol Spec: TIP-1022 — Virtual Address Forwarding](https://docs.tempo.xyz/protocol/tips/tip-1022)
- [⚙️ Protocol Spec: TIP-1011 — Enhanced Access Key Permissions](https://docs.tempo.xyz/protocol/tips/tip-1011)
- [🤖 Machine Payments Protocol (MPP) Guide](https://docs.tempo.xyz/guide/machine-payments/)

***

## 🧩 Part 1 — Virtual Addresses

### 🔍 What Is a Virtual Address?

A **virtual address** on [Tempo](https://tempo.xyz) looks exactly like a normal blockchain address to the sender — but it is **not** a standalone wallet.

Under the hood, it is a **derived identifier** that points to a registered **master wallet**. When a [TIP-20](https://docs.tempo.xyz/protocol/tip20/overview) stablecoin is sent to a virtual address, the Tempo protocol automatically resolves and credits the funds directly to the master wallet — **no sweep transaction required**.

> 💡 Think of virtual addresses as the **onchain equivalent of virtual bank accounts** — a fintech can issue thousands of unique IBANs to customers, but all funds settle into one real account behind the scenes.

***

### 🏗️ Why Was It Needed?

Before virtual addresses, every business that needed **unique deposit addresses per customer** (exchanges, ramps, neobanks, marketplaces) ran into the same problem:


| Problem | Impact |
| :-- | :-- |
| Each deposit address = a real onchain account | Requires state rent / account initialization cost |
| Funds land in individual addresses | Needs **sweep transactions** to consolidate to treasury |
| Thousands of active endpoints | Higher infra overhead, monitoring, compliance complexity |
| Sweep adds latency | Funds stuck between "received" and "available" |


***

### ⚙️ How Virtual Addresses Work (Step-by-Step)

```
1. A business registers ONE master wallet on Tempo
2. It derives trillions of customer-specific virtual addresses OFFLINE
   (no on-chain transaction needed per address)
3. Customer sends TIP-20 stablecoin → virtual address
4. Tempo detects the virtual address format
5. Protocol resolves → master wallet
6. Master wallet balance is credited directly
7. Two Transfer events are emitted for full attribution:
   - Transfer(sender → virtualAddress, amount)
   - Transfer(virtualAddress → master, amount)
```

**Sequence Diagram:**

```
Sender ──────────────────────────────────────────────────────────▶ TIP-20
                    transfer(virtualAddress, amount)
                                  │
                                  ▼
                         resolve(masterId)
TIP-20 ───────────────────────────────────────────────────────▶ Virtual Registry
                                  │
                          returns master wallet
                                  │
                                  ▼
TIP-20 ───────────────────────────────────────────────────────▶ Registered Wallet
                        credit balance ✅
```


***

### 🛠️ How to Derive a Virtual Address (Dev View)

Once a master is registered, operators derive virtual addresses **fully offchain** using the `masterId` and a `userTag`:

```ts
import { VirtualAddress } from 'ox/tempo'

const virtualAddress = VirtualAddress.from({
  masterId,
  userTag: '0x000000000001', // operator's internal customer/invoice ID
})
```

- `masterId` = the registered master wallet identifier
- `userTag` = any 6-byte hex value (customer ID, invoice ref, corridor tag, etc.)
- No gas cost, no network call needed to derive addresses

***

### ✅ Key Properties to Know

| Property | Behavior |
| :-- | :-- |
| `balanceOf(virtualAddress)` | Always returns `0` |
| Funds landing | Go directly to master wallet |
| Attribution | Via Transfer events + your `userTag` mapping |
| Policy checks (compliance, KYC) | Applied to the **resolved master**, not virtual address |
| Reward protocols (DEX, lending) | ⚠️ Avoid — virtual addresses can't hold/track funds |


***

### 🏢 Who Benefits Most?

- 🏦 **Exchanges \& brokers** — dedicated deposit address per user
- 🔄 **Onramps / offramps** — attribute inbound customer funds cleanly
- 🛒 **Marketplaces** — one address per merchant or invoice
- 🏛️ **Treasury platforms** — segmented inbound payment routing

***

## 🔑 Part 2 — Access Keys

### 🔍 What Is an Access Key?

An **Access Key** is a native [Tempo](https://tempo.xyz) protocol primitive that lets a user **delegate signing authority** to a service — with strict, user-defined constraints.

It is **not** a full account handover. The user sets the rules. The service can only act within those rules. The user can revoke at any time.

> 💡 Think of it like a **scoped API key for your wallet** — a service gets permission to charge you, but only up to a defined amount, on specific tokens, for a limited time, and only at specific contracts.

***

### ⚙️ How Access Keys Work (Step-by-Step)

```
1. User authorizes an Access Key, defining:
   - Maximum spend amount
   - Allowed token(s)
   - Expiry date
   - (Optional) Specific contract addresses & function selectors
   - (Optional) Periodic spending cap (e.g., $50/week)

2. User hands the Access Key to the service

3. Service uses the key to "pull" funds from the user's account
   → within the spending limits
   → until expiry
   → scoped to defined contracts only

4. Protocol validates each charge against remaining allowance
   → If it fits → ✅ approved
   → If it exceeds → ❌ rejected

5. For periodic limits: window resets automatically each period
   → No re-approval needed from user
```


***

### 🔐 Access Key Parameters

| Parameter | Description |
| :-- | :-- |
| `maxAmount` | Total cap the service can spend |
| `token` | Which TIP-20 stablecoins are allowed |
| `expiry` | When the key stops being valid |
| `contract scope` | Which smart contracts can be called |
| `function selector` | Which specific functions can be called |
| `periodicLimit` | Amount allowed per time period (e.g., \$50/week) |


***

### 🔁 Periodic Spending Limits = Subscriptions

The biggest unlock from Access Keys is the addition of **periodic spending limits**, which enable **native onchain subscriptions**:

```
Old way:
  → Require fresh user signature every billing cycle   😫
  → OR: get approval for a whole year upfront          😰

New way with Access Keys:
  → User sets "$50/week for the next 50 weeks" once    ✅
  → Service charges weekly, auto-validated by protocol ✅
  → Week resets → allowance refreshes automatically    ✅
  → User can revoke anytime                            ✅
```

**Example use cases enabled:**

- 📰 Newsletter or streaming service subscription
- 🤖 AI agent with a monthly API budget (e.g., `$100/month` scoped to a specific inference contract)
- 🌍 SaaS billing across 30+ countries — one access key, one stablecoin, instant settlement

***

## 🤝 Part 3 — How These Features Power Better MPP Adoption

### 🤖 What Is MPP?

The **Machine Payments Protocol (MPP)** — co-authored by [Stripe](https://stripe.com) and [Tempo](https://tempo.xyz) — is an open standard for **machine-to-machine payments**. It enables AI agents and automated services to pay for APIs, compute, data, and digital resources using [TIP-20](https://docs.tempo.xyz/protocol/tip20/overview) stablecoins — no API keys, no billing accounts needed.

***

### 🚧 MPP's Adoption Challenges (Before)

| Challenge | Why It Hurt |
| :-- | :-- |
| Per-request payment approval | Too much friction, breaks automation |
| No recurring billing primitive | Agents can't subscribe to services |
| Wallet exposure risk | Giving a service full wallet access = security risk |
| Infrastructure complexity for API providers | Hard to issue unique deposit endpoints at scale |


***

### ✅ How Virtual Addresses + Access Keys Solve MPP Friction

#### 1️⃣ Access Keys → Frictionless Agentic Payments

An AI agent can be granted an Access Key **scoped to a specific MPP service contract**, with a defined monthly budget:

```
Agent has Access Key:
  → contract: inference_api.tempo
  → limit: $100/month
  → expiry: 6 months

Agent calls the service throughout the month
  → Each charge validated against remaining allowance
  → No re-approval, no re-prompting
  → Limit resets monthly automatically
  → Key CANNOT be used elsewhere ✅
```

This is exactly how **pay-as-you-go MPP sessions** and **subscriptions** become practical for agentic workflows.

***

#### 2️⃣ Virtual Addresses → Scalable MPP Service Infrastructure

For **API providers monetizing via MPP**, virtual addresses eliminate the operational overhead of managing deposits at scale:

```
Before virtual addresses:
  Each API client needs a unique deposit address
  → Sweep transactions for every deposit
  → Monitoring thousands of balance endpoints
  → Latency, gas cost, operational failure risk

After virtual addresses:
  Register ONE master wallet
  Derive unique address per client/invoice OFFCHAIN
  → All deposits → master wallet directly
  → Events still carry full attribution
  → Zero sweep operations ✅
```


***

#### 3️⃣ Combined: Full MPP Subscription Stack

Virtual Addresses + Access Keys together give MPP services a **complete, enterprise-grade payment stack**:

```
┌─────────────────────────────────────────────────────┐
│                  MPP Service Provider               │
│  ┌──────────────────┐    ┌────────────────────────┐ │
│  │  Virtual Address │    │      Access Key         │ │
│  │  per client/     │    │  Periodic limit:        │ │
│  │  invoice/corridor│    │  "$50/month"            │ │
│  │                  │    │  Scoped to this API     │ │
│  │  → All funds     │    │  → Auto-charges client  │ │
│  │    land in       │    │  → No re-approval       │ │
│  │    master wallet │    │  → Client can revoke    │ │
│  └──────────────────┘    └────────────────────────┘ │
│         ↓                          ↓                │
│    Clean reconciliation    Reliable recurring revenue│
└─────────────────────────────────────────────────────┘
```


***

### 🌍 Real-World MPP Scenarios Unlocked

| Scenario | Virtual Address | Access Key |
| :-- | :-- | :-- |
| AI agent pays per inference request | ✅ Provider receives in master wallet | ✅ Agent has scoped monthly budget |
| Developer subscribes to blockchain data API | ✅ Unique deposit address per developer | ✅ Weekly spending limit, auto-renewed |
| Marketplace settles per-merchant payouts | ✅ One address per merchant, one treasury | ✅ Scheduled pull payments |
| SaaS platform with global stablecoin billing | ✅ No sweep overhead for inbound funds | ✅ One-time authorization, recurring charges |


***

## 🧠 Summary

> [Tempo](https://tempo.xyz)'s **Virtual Addresses** and **Access Keys** are not just UX improvements — they are **protocol-native primitives** that make stablecoin payments composable, scalable, and safe enough for both enterprise treasury operations and autonomous AI agents.
>
> Together, they remove the two biggest blockers for **MPP adoption**: the **operational complexity** of managing deposits at scale, and the **friction of per-request payment authorization** in automated workflows.

***

### 🔗 Related Protocols \& Standards

| Protocol | Role |
| :-- | :-- |
| [Tempo](https://tempo.xyz) | Payments-first blockchain |
| [TIP-20](https://docs.tempo.xyz/protocol/tip20/overview) | Native stablecoin token standard |
| [TIP-1022](https://docs.tempo.xyz/protocol/tips/tip-1022) | Virtual address forwarding spec |
| [TIP-1011](https://docs.tempo.xyz/protocol/tips/tip-1011) | Enhanced access key permissions |
| [MPP (Machine Payments Protocol)](https://docs.tempo.xyz/learn/tempo/machine-payments) | Open standard for agentic payments (Stripe × Tempo) |
| [pathUSD](https://docs.tempo.xyz/quickstart/faucet) | Primary TIP-20 stablecoin on Tempo |


***

*📬 For enterprise inquiries: [partners@tempo.xyz](mailto:partners@tempo.xyz) · [tempo.xyz/advisory](https://tempo.xyz/advisory)*

***

Here's how to use this in Notion:

**To paste into Notion:**

1. Copy the entire article above
2. Open a new Notion page
3. Paste directly — Notion will auto-render headers (`##`), tables, code blocks, and bullet lists
4. For the mermaid/sequence diagrams, paste the code blocks into a **Code block** toggle and label them as `mermaid` — or use a Notion embed with [Mermaid.live](https://mermaid.live)
5. Use Notion's **callout blocks** (`/callout`) for the `💡` tip boxes to make them visually pop
6. The icons (🔑, 🌐, 🤖, etc.) render natively in Notion headings and bullets

**Tagged protocols:** [Tempo](https://tempo.xyz) · [TIP-20](https://docs.tempo.xyz/protocol/tip20/overview) · [TIP-1022](https://docs.tempo.xyz/protocol/tips/tip-1022) · [TIP-1011](https://docs.tempo.xyz/protocol/tips/tip-1011) · [MPP](https://docs.tempo.xyz/learn/tempo/machine-payments) · [Stripe](https://stripe.com)

