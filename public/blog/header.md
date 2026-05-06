<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# let collect all data, then make research and analyze to make article to explain about how HEADER data work in x402, and MPP of Tempo

important note:

- make content to be clean, simple and being break down structure to be easy to follow
- content must have attractive icon, content must tag all related protocols, and having attached resource links
- return content to be attractive notion format

Here is the full Notion-formatted article, ready to paste directly into Notion:

***

# 📡 How HTTP Headers Power Web3 Payments

### A clean breakdown of how `x402` and `MPP` use HTTP headers to enable machine-native payments

> 💡 **TL;DR** — Both x402 and MPP hijack a single HTTP status code (`402 Payment Required`) and embed all payment instructions inside response **headers** — not the body. The header *name* tells the client which protocol to use. The header *value* tells it exactly what to pay, to whom, and how.

***

## 🗂️ Table of Contents

1. [Why Headers at All?](#)
2. [The Shared Foundation — HTTP 402](#)
3. [🔵 x402 — Header Deep Dive](#)
4. [🟣 MPP (Tempo) — Header Deep Dive](#)
5. [⚡ Side-by-Side Comparison](#)
6. [🔍 How a Client Detects Which Protocol](#)
7. [🌐 When a Server Supports Both](#)
8. [🔗 Resources](#)

***

## 1️⃣ Why Headers at All?

> HTTP has a built-in separation of concerns — **headers carry metadata**, **body carries content**. Payment is infrastructure metadata, not content.

Here is why headers are the only correct place for payment instructions:


| Reason | Explanation |
| :-- | :-- |
| **402 has no body by convention** | Like `401` and `403`, a refusal response signals via headers — the body is empty or irrelevant |
| **Works across all HTTP methods** | `GET` requests have no body to put data in; headers work for GET, POST, PUT, DELETE equally |
| **Middleware-transparent** | Proxies, CDNs (Cloudflare), and API gateways can read and strip headers without touching the body |
| **Enables the retry pattern** | Client reads the payment header, pays, retries the *same* request — headers survive the retry, body is re-sent as-is |
| **Faster** | Headers are read before the body is streamed — no buffering needed for payment decisions |


***

## 2️⃣ The Shared Foundation — `HTTP 402`

Both protocols start from the exact same status code, dead since 1991 and now revived for the agentic economy:

```http
HTTP/1.1 402 Payment Required
```

> 🏛️ **History note** — `402` was reserved in the original HTTP/1.0 spec (RFC 1945, 1996) as "reserved for future use." It was never officially used — until now. Both Coinbase (x402) and Stripe (MPP) independently chose it as the natural home for machine-native payment challenges.

After this status line, the server adds **one of two completely different headers** — that difference is everything.

***

## 3️⃣ 🔵 x402 — Header Deep Dive

> **Protocol tag:** `#x402` `#Coinbase` `#Base` `#EIP-3009` `#USDC` `#HTTP402`

### What is x402?

x402 is a **stateless, per-request, on-chain payment protocol** by Coinbase (launched May 2025). Think of it as a **vending machine**: insert exact change, receive product, transaction complete. No memory, no session, no subscription.

***

### 📤 Step 1 — Server Sends `X-PAYMENT-REQUIRED`

When an unauthenticated client hits a paid API endpoint, the server responds:

```http
HTTP/1.1 402 Payment Required
X-PAYMENT-REQUIRED: {
  "scheme":               "exact",
  "network":              "base",
  "maxAmountRequired":    "1000",
  "asset":                "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  "payTo":                "0xMerchantWalletAddress",
  "resource":             "/api/v1/data",
  "description":          "1 API query — weather data",
  "mimeType":             "application/json",
  "estimatedProcessingTime": 200,
  "expires":              "2026-05-06T12:30:00Z"
}
```


#### 🔑 Field-by-Field Breakdown

| Field | Type | What It Means |
| :-- | :-- | :-- |
| `scheme` | string | Sub-protocol to use — `"exact"` means pay-exactly-this-amount on-chain |
| `network` | string | Which blockchain to settle on — `"base"`, `"ethereum"`, `"polygon"`, `"solana"` |
| `maxAmountRequired` | string (wei) | Amount in smallest unit — `"1000"` = \$0.001 USDC (6 decimals) |
| `asset` | address | ERC-20 token contract — this is the USDC contract address on Base |
| `payTo` | address | Merchant's receiving wallet address |
| `resource` | string | The URL path being monetized |
| `description` | string | Human/agent-readable description of what is being purchased |
| `mimeType` | string | Content type of the response if paid — helps agents decide if worth paying |
| `estimatedProcessingTime` | ms | How long the server will wait for payment verification |
| `expires` | ISO 8601 | Payment instruction expiry — client must pay before this time |


***

### 📥 Step 2 — Client Sends `X-PAYMENT-SIGNATURE` (Retry)

The client (AI agent or app) signs an **EIP-3009 `transferWithAuthorization`** message — a gasless, off-chain cryptographic authorization — and attaches it as a header in the **same request, retried**:

```http
GET /api/v1/data HTTP/1.1
X-PAYMENT-SIGNATURE: {
  "scheme":    "exact",
  "network":   "base",
  "payload": {
    "from":          "0xAgentWalletAddress",
    "to":            "0xMerchantWalletAddress",
    "value":         "1000",
    "validAfter":    "0",
    "validBefore":   "1746527400",
    "nonce":         "0xRandomNonce32Bytes",
    "v": 27, "r": "0x...", "s": "0x..."
  }
}
```

> 🔐 **Security note** — This signature is **cryptographically bound** to the exact recipient, exact amount, and exact time window. Even if intercepted, it cannot be redirected to a different wallet, used for a different amount, or replayed after expiry. The security lives in the ECDSA signature, not in TLS.

***

### ✅ Step 3 — Server Returns `X-PAYMENT-RESPONSE`

After the facilitator verifies the signature on-chain:

```http
HTTP/1.1 200 OK
X-PAYMENT-RESPONSE: {
  "success":    true,
  "txHash":     "0xOnChainTransactionHash",
  "network":    "base",
  "payer":      "0xAgentWalletAddress",
  "amount":     "1000",
  "asset":      "USDC"
}
Content-Type: application/json

{ "temperature": 32, "city": "Ho Chi Minh City" }
```


***

### 🏗️ The Facilitator — The Hidden Component

> The **facilitator** sits between server and blockchain. It is the piece that makes x402 work without requiring every API server to run a full Ethereum node.

```
CLIENT ──[X-PAYMENT-SIGNATURE]──> SERVER
                                    │
                               calls HTTPS
                                    │
                                    ▼
                             FACILITATOR SERVICE
                             (Coinbase-hosted or self-hosted)
                                    │
                          verifies EIP-3009 signature
                          submits on-chain tx if needed
                                    │
                                    ▼
                             BASE / ETHEREUM
                             (USDC transfer settled)
                                    │
                             returns verification
                                    │
                                    ▼
SERVER ◄──[verification OK]────────┘
SERVER ──[200 + X-PAYMENT-RESPONSE]──> CLIENT
```

**Key properties of the facilitator:**

- 🔒 Cannot move funds beyond what client authorized
- ⚡ Abstracts all blockchain complexity from the API server
- 🌐 Coinbase hosts a free reference facilitator
- 🛠️ Anyone can self-host for full decentralization

***

### 🔵 x402 Full Flow — Visual Summary

```
1. Client → GET /api/data
              ↓
2. Server → 402 + X-PAYMENT-REQUIRED header
              ↓
3. Client reads header → signs EIP-3009 off-chain (no gas!)
              ↓
4. Client → Retry GET /api/data + X-PAYMENT-SIGNATURE header
              ↓
5. Server → calls Facilitator → verifies on Base chain
              ↓
6. Server → 200 OK + X-PAYMENT-RESPONSE header + actual data
```

⏱️ **Total round-trip time on Base: ~200–500ms**
💰 **Cost per request: ~\$0.001 USDC**
⛽ **Gas paid by: Facilitator (client never pays gas directly)**

***

## 4️⃣ 🟣 MPP (Machine Payments Protocol) — Header Deep Dive

> **Protocol tags:** `#MPP` `#Tempo` `#Stripe` `#Paradigm` `#TIP-20` `#SharedPaymentToken` `#HTTP402` `#WWW-Authenticate`

### What is MPP?

MPP is a **stateful, session-based, multi-rail payment protocol** by Stripe + Tempo (launched March 18, 2026). Think of it as a **hotel minibar tab**: you authorize a spending cap once, consume services freely, and the protocol handles micro-settlements in the background. One session, many transactions, one final reconciliation.

***

### 📤 Step 1 — Server Sends `WWW-Authenticate: Payment`

MPP deliberately reuses the **official IANA-registered** `WWW-Authenticate` header — the same header used by `Bearer` tokens and `Basic` auth. This is a key design decision: existing HTTP middleware (proxies, CDNs, API gateways) already understand this header without any updates.

```http
HTTP/1.1 402 Payment Required
WWW-Authenticate: Payment
  challenge="a1b2c3d4e5f6",
  price="0.001",
  currency="USDC",
  recipient="0xServiceWalletAddress",
  network="tempo",
  session_ttl="3600",
  pricing_model="per_request",
  realm="api.openai.com"
```


#### 🔑 Field-by-Field Breakdown

| Field | Type | What It Means |
| :-- | :-- | :-- |
| `challenge` | string | Server-generated nonce — client must include this in its authorization to prevent replay |
| `price` | decimal | Cost per unit of consumption — `"0.001"` USDC per API call |
| `currency` | string | Accepted currency — `"USDC"`, `"USDT"`, `"EURC"` |
| `recipient` | address | Service provider's receiving address on Tempo chain |
| `network` | string | Settlement rail — `"tempo"` (Tempo L1), `"stripe"` (Stripe fiat), `"lightning"` (Bitcoin LN) |
| `session_ttl` | seconds | How long the authorized session stays active — `3600` = 1 hour |
| `pricing_model` | string | `"per_request"`, `"per_token"`, `"per_second"`, `"per_byte"` — flexible pricing granularity |
| `realm` | string | Identifies which service/domain is requesting payment |


***

### 🔐 Step 2 — Client Opens a Session and Gets an SPT

Before retrying, the client performs an **out-of-band authorization step** — it calls the Tempo/Stripe authorization endpoint to open a session with a spending cap:

```
CLIENT                          TEMPO CHAIN / STRIPE
  │                                      │
  ├── Authorize session ────────────────>│
  │   spending_cap: $5.00 USDC           │
  │   recipient: 0xService...            │
  │   ttl: 3600s                         │
  │                                      │
  │<── Shared Payment Token (SPT) ───────┤
  │    {token: "spt_abc123...",           │
  │     remaining: "$5.00",              │
  │     expires: "2026-05-06T13:50Z"}    │
```

> 💡 **The Shared Payment Token (SPT)** is what makes MPP multi-rail. The same SPT can be backed by:
> - USDC on Tempo chain (crypto-native path)
> - A Stripe credit card (fiat path)
> - A corporate buy-now-pay-later facility (enterprise path)
> - Lightning Network (Bitcoin path via Lightspark)
>
> The API server never needs to know which rail is underneath — it just validates the SPT.

***

### 📥 Step 3 — Client Sends `Authorization: Payment` (Retry)

The client retries the original request with the SPT attached:

```http
POST /v1/chat/completions HTTP/1.1
Authorization: Payment
  token="spt_abc123xyz",
  challenge="a1b2c3d4e5f6",
  amount="0.001",
  currency="USDC"
Content-Type: application/json

{ "model": "gpt-5", "messages": [...] }
```

> 🧩 **Key difference from x402** — The body of the POST is untouched. The payment authorization lives entirely in the `Authorization` header. The API server processes the request exactly as it would for any other `Authorization` header type.

***

### ✅ Step 4 — Server Returns `Payment-Response`

```http
HTTP/1.1 200 OK
Payment-Response: {
  "status":       "settled",
  "deducted":     "0.001",
  "currency":     "USDC",
  "remaining":    "4.999",
  "session":      "spt_abc123xyz",
  "tx_ref":       "tempo_tx_0xabc...",
  "memo":         "ChatGPT /completions call #1"
}
Content-Type: application/json

{ "choices": [...] }
```

> 📋 **`memo` field** — This maps to Tempo's **TIP-20 on-transfer memo** feature. Every micro-deduction is recorded on Tempo chain with a human-readable memo, enabling **automatic invoice reconciliation** — the agent gets a full audit trail of every service consumed within the session.

***

### 🏗️ The Session Flow on Tempo Chain

```
AGENT opens MPP session ($5 cap)
  │
  ├── Call 1: OpenAI API → $0.002 deducted → balance: $4.998
  │   (TIP-20 transfer + memo: "tokens: 2000")
  │
  ├── Call 2: Browserbase → $0.050 deducted → balance: $4.948
  │   (TIP-20 transfer + memo: "browser session 30s")
  │
  ├── Call 3: Weather API (x402) → $0.001 deducted → balance: $4.947
  │   (x402 sub-payment WITHIN the MPP session)
  │
  └── Session closes (TTL expired or agent done)
      Single settlement record on Tempo chain
      Full memo trail = automatic invoice
```

**Tempo chain properties enabling this:**

- ⚡ Sub-0.5s finality per micro-settlement
- 💸 No native gas token — fees paid in USDC directly
- 📝 TIP-20 on-transfer memos for automatic reconciliation
- 🛣️ Dedicated payment lanes — payment txs never get stuck behind DeFi activity

***

### 🟣 MPP Full Flow — Visual Summary

```
1. Agent → POST /api/service (no auth)
              ↓
2. Server → 402 + WWW-Authenticate: Payment header
              ↓
3. Agent → Calls Tempo/Stripe auth endpoint
           Opens session, gets SPT (spending cap: $5)
              ↓
4. Agent → Retry POST + Authorization: Payment spt_token header
              ↓
5. Server → validates SPT with Tempo/Stripe
              ↓
6. Server → 200 OK + Payment-Response header + result
           (micro-deduction recorded on Tempo chain with memo)
              ↓
7. Agent continues calling same endpoint
   SPT auto-deducts each time — no re-authorization
              ↓
8. Session closes → single settlement, full audit trail
```

⏱️ **Session authorization: ~1 round-trip (one-time per session)**
⏱️ **Per-call overhead after that: ~0ms (SPT validated in-memory)**
⚡ **On-chain settlement: ~0.5s on Tempo per micro-payment**
💰 **Cost per request: sub-\$0.001**

***

## 5️⃣ ⚡ Side-by-Side Comparison

| Dimension | 🔵 x402 | 🟣 MPP |
| :-- | :-- | :-- |
| **Challenge header** | `X-PAYMENT-REQUIRED` (custom) | `WWW-Authenticate: Payment` (IANA standard) |
| **Response header** | `X-PAYMENT-SIGNATURE` | `Authorization: Payment` |
| **Confirmation header** | `X-PAYMENT-RESPONSE` | `Payment-Response` |
| **Payment model** | Stateless per-request | Stateful session with spending cap |
| **Authorization object** | EIP-3009 signed message | Shared Payment Token (SPT) |
| **Settlement rails** | On-chain only (USDC, EVM) | Multi-rail: USDC + Stripe fiat + Lightning |
| **Session memory** | ❌ None — every request is fresh | ✅ SPT tracks remaining balance across requests |
| **On-chain settlement** | Per-request (Base/ETH, ~200ms) | Per-request on Tempo (~0.5s) with memo |
| **Gas handling** | Facilitator pays, abstracts from client | No gas token — fees in USDC natively |
| **Pricing flexibility** | Per-request fixed price | Per-request, per-token, per-second, per-byte |
| **Audit trail** | On-chain tx per request | TIP-20 memo per deduction + session summary |
| **Best use case** | Single API calls, data feeds, compute | Multi-service agent workflows, streaming, enterprise |
| **Standard compliance** | Non-standard `X-` header | Extends RFC 7235 `WWW-Authenticate` |
| **Backed by** | Coinbase, Cloudflare, Circle, AWS | Stripe, Paradigm, Visa, Lightspark |
| **Launch date** | May 2025 | March 18, 2026 |


***

## 6️⃣ 🔍 How a Client Detects Which Protocol

The detection is entirely deterministic — no guessing required:

```typescript
function detectPaymentProtocol(
  response: Response
): "x402" | "mpp" | "both" | "unknown" {

  if (response.status !== 402) return "unknown";

  const wwwAuth  = response.headers.get("WWW-Authenticate") ?? "";
  const xPayment = response.headers.get("X-PAYMENT-REQUIRED") ?? "";

  const hasMPP  = wwwAuth.trimStart().startsWith("Payment ");
  const hasX402 = xPayment.length > 0;

  if (hasMPP && hasX402) return "both";     // server supports both
  if (hasMPP)            return "mpp";
  if (hasX402)           return "x402";

  return "unknown";  // non-standard 402
}
```


### Decision Tree

```
Server returns HTTP 402
        │
        ├── Has "X-PAYMENT-REQUIRED" header?
        │         │
        │         YES ──> 🔵 x402 protocol
        │                 Read JSON: {scheme, network, asset, payTo, amount}
        │                 Sign EIP-3009 → retry with X-PAYMENT-SIGNATURE
        │
        └── Has "WWW-Authenticate: Payment ..." header?
                  │
                  YES ──> 🟣 MPP protocol
                          Read params: challenge, price, network, session_ttl
                          Open session → get SPT → retry with Authorization: Payment
```


***

## 7️⃣ 🌐 When a Server Supports Both

Cloudflare (which backed both protocols) and other infrastructure providers serve **both headers simultaneously**, letting the client pick based on its capabilities:

```http
HTTP/1.1 402 Payment Required
X-PAYMENT-REQUIRED: {"scheme":"exact","network":"base","maxAmountRequired":"1000",...}
WWW-Authenticate: Payment challenge="abc123",price="0.001",network="tempo",...
```


### Client Selection Logic

| Client Type | Chooses | Why |
| :-- | :-- | :-- |
| Crypto-native AI agent on Base | 🔵 x402 | Already has USDC on Base, can sign EIP-3009, no session needed |
| Enterprise agent with Stripe account | 🟣 MPP | Has SPT backed by corporate card, needs invoice/reconciliation |
| Agent on Tempo chain | 🟣 MPP | Sub-0.5s finality, no gas token, TIP-20 memos for accounting |
| Simple script / one-off call | 🔵 x402 | No session overhead, simpler implementation |
| Long-running workflow (multi-service) | 🟣 MPP | One session auth, auto-deduct, single reconciliation at end |

> 🎯 **The key insight**: x402 and MPP are **not competitors**. An MPP session can use x402 as its underlying per-payment mechanism for specific sub-calls. They compose — MPP handles the session layer, x402 handles individual atomic payments within it.

***

## 8️⃣ 🔗 Resources

### 🔵 x402

- 🌐 [x402.org — Official Protocol Site](https://www.x402.org)
- 📄 [x402 Explained — Sherlock.xyz Deep Dive](https://sherlock.xyz/post/x402-explained-the-http-402-payment-protocol)
- 🛠️ [What Is x402? — Alchemy Blog](https://www.alchemy.com/blog/how-x402-brings-real-time-crypto-payments-to-the-web)
- 📚 [Complete x402 How-To Guide — SimpleScraper](https://simplescraper.io/blog/x402-payment-protocol)
- 🔬 [x402 for AI Agents — Cobo Research](https://www.cobo.com/post/what-is-x402)


### 🟣 MPP + Tempo

- 🌐 [Introducing MPP — Official Stripe Blog](https://stripe.com/blog/machine-payments-protocol)
- 🏗️ [Tempo: The Payments-First Blockchain — Paradigm](https://www.paradigm.xyz/2025/09/tempo-payments-first-blockchain)
- 🚀 [Tempo Mainnet Launch — MEXC Coverage](https://blog.mexc.com/news/tempo-mainnet-launch-machine-payments-protocol-unlocks-ai-powered-crypto-transactions-and-autonomous)
- 📊 [Deep Dive: Machine Payments Protocol — FinTech Wrap Up](https://www.fintechwrapup.com/p/deep-dive-the-machine-payments-protocol)
- ⚡ [Why MPP Signals a Turning Point — Forrester](https://www.forrester.com/blogs/why-stripes-machine-payments-protocol-signals-a-turning-point-for-micropayments/)
- 🆚 [MPP vs x402 vs ACP vs AP2 — Crossmint Compare](https://www.crossmint.com/learn/agentic-payments-protocols-compared)
- 🤖 [How AI Agents Pay for Services — Tenzro](https://www.tenzro.com/blog/payments-for-ai-agents)
- 💡 [x402 + MPP Comprehensive Overview — Binance Square](https://www.binance.com/en/square/post/304164006996706)


### 🏗️ Infrastructure

- 🔵 [Base Chain Developer Docs](https://docs.base.org)
- 🟣 [Tempo Chain](https://tempo.xyz)
- ⭕ [Circle USDC / CCTP Docs](https://developers.circle.com)
- 🔐 [EIP-3009 — Transfer With Authorization Standard](https://eips.ethereum.org/EIPS/eip-3009)
- 🔧 [EIP-7579 — Modular Smart Account Standard](https://eips.ethereum.org/EIPS/eip-7579)
- 🤖 [ERC-8004 — On-Chain AI Agent Identity](https://www.cobo.com/post/erc-8004-on-chain-identity-standard-for-ai-agents-the-future-of-agentic-wallets)

***

> 📌 **Last updated:** May 6, 2026
> ✍️ **Author:** Research compiled via BTCFi Station / Journal Trading
> 🏷️ **Tags:** `#x402` `#MPP` `#Tempo` `#Stripe` `#Coinbase` `#HTTP402` `#AIAgentPayments` `#Web3Payments` `#USDC` `#EIP3009` `#TIP20` `#MachinePayments` `#Stablecoins` `#Agentic`
<span style="display:none">[^1][^2][^3][^4][^5]</span>

<div align="center">⁂</div>

[^1]: how to break down task to build overguild platfor...

[^2]: Note Content.md

[^3]: Cardano Smart Contracts Fundamental.pdf

[^4]: Mastering Hydra - Cardano's Layer 2 Powerhouse.pdf

[^5]: Ape or Fade - Product Proposal.md

