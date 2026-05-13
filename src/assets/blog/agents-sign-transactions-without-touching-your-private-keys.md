---
title: Agents Sign Transactions Without Touching Your Private Keys
description: How OWS lets AI agents pay for services using scoped API keys — while your private keys stay encrypted and never leave the vault.
date: 2026-05-13
category: Web3 Tech
author: Terminal_Admin
readTime: 7 MIN READ
coverImage: /blog/ows-agent-wallet.png
featured: true
---

## 🔑 What is OWS (Open Wallet Standard)?

OWS is an open standard that defines how cryptographic wallets are stored locally, how AI agents access them through a unified interface, and how policy-based controls govern what operations are permitted.

The core idea: **your agent gets a scoped API token, not your private key.** The token can sign transactions — but only after passing policy checks, and without ever exposing the raw key material.

- One encrypted vault (`~/.ows/wallets/`) for all chains
- AES-256-GCM encryption at rest
- Policy engine evaluates BEFORE any key is decrypted
- Supports EVM, Solana, Bitcoin, Cosmos, Tron, TON, Sui, XRPL, Filecoin
- Works via CLI, Node.js SDK, Python SDK, or MCP

![OWS Architecture](/blog/ows-agent-wallet.png)

---

## ⚙️ How It Works: The Agent Signing Flow

Here's the full flow when an AI agent wants to pay for a service using OWS:

### Step 1: Owner Sets Up (One-time)

- Human creates a wallet: `ows wallet create --name "agent-treasury"`
- Human defines a policy (allowed chains, expiry, spending limits)
- Human creates a scoped API key: `ows key create --name "my-agent" --wallet agent-treasury --policy agent-limits`
- OWS generates token `ows_key_a1b2c3d4...` — shown once, given to the agent

### Step 2: Agent Requests a Paid Service

- Agent sends HTTP request to an x402-enabled API
- Server responds with `402 Payment Required` + payment details (chain, amount, address)

### Step 3: Agent Signs via OWS (Key Never Exposed)

```
Agent calls: sign_transaction(wallet, chain, tx, "ows_key_a1b2c3...")

1. Detect ows_key_ prefix → enter AGENT MODE
2. SHA256(token) → look up API key file
3. Check expires_at (if set)
4. Verify wallet is in key's wallet_ids scope
5. Load policies from key's policy_ids
6. Evaluate ALL policies (AND logic, short-circuit on deny)
7. If denied → POLICY_DENIED error (key material NEVER touched)
8. HKDF-SHA256(salt, token) → derive AES key
9. Decrypt wallet secret in hardened memory (mlock'd)
10. Derive chain-specific signing key
11. Sign the transaction
12. Zeroize ALL key material immediately
13. Return signature only
```

### Step 4: Payment Settlement

- Agent retries the request with signed payment credential
- Server verifies signature and settles on-chain
- Agent receives the service response (200 OK + data)

---

## 🛡️ Why This Matters: Security Properties

- **Agent never sees private key** — token derives decryption key via HKDF, but raw key stays in hardened memory for milliseconds
- **Policy before decryption** — if policy denies, key material is never touched
- **Scoped access** — each API key is limited to specific wallets and chains
- **Time-bounded** — `expires_at` rule auto-revokes access
- **Instant revocation** — delete the key file, token becomes useless
- **Auditable** — every operation logged to append-only `audit.jsonl`

---

## 🏗️ Apply It: Quick Setup Example

### Install OWS

```bash
curl -fsSL https://docs.openwallet.sh/install.sh | bash
```

### Create Wallet + Fund It

```bash
ows wallet create --name "agent-treasury"
ows fund deposit --wallet agent-treasury --chain base
```

### Define Policy

```json
{
  "id": "agent-limits",
  "name": "Base chain only, expires end of year",
  "version": 1,
  "created_at": "2026-01-01T00:00:00Z",
  "rules": [
    { "type": "allowed_chains", "chain_ids": ["eip155:8453"] },
    { "type": "expires_at", "timestamp": "2026-12-31T23:59:59Z" }
  ],
  "action": "deny"
}
```

```bash
ows policy create --file policy.json
```

### Create API Key for Agent

```bash
ows key create --name "my-agent" --wallet agent-treasury --policy agent-limits
# => ows_key_a1b2c3d4... (save this — shown once)
```

### Agent Uses the Token

```typescript
import { signTransaction } from "@open-wallet-standard/core";

const result = signTransaction(
  "agent-treasury",
  "base",
  "02f8...",
  "ows_key_a1b2c3d4..."  // token, NOT private key
);
```

### Agent Pays for Services Automatically

```bash
OWS_PASSPHRASE="ows_key_a1b2c3d4..." \
  ows pay request "https://api.example.com/data" --wallet agent-treasury
```

OWS handles the full x402 flow: detects 402 → signs payment → retries → gets data.

---

## 🔄 Architecture: What You Need to Build With OWS

If you're integrating OWS into your system, here are the components:

- **Wallet Vault** (`~/.ows/wallets/`) — AES-256-GCM encrypted wallet files
- **API Key Store** (`~/.ows/keys/`) — scoped tokens with re-encrypted wallet secrets
- **Policy Engine** (`~/.ows/policies/`) — declarative rules + custom executable policies
- **Signing Core** (Rust FFI) — mlock'd memory, zeroize on drop
- **Interface Layer** — CLI, Node.js SDK, Python SDK, MCP server
- **Audit Log** (`~/.ows/logs/audit.jsonl`) — append-only operation log

```
Agent / CLI / App
       │
       │  OWS Interface (SDK / CLI / MCP)
       ▼
┌─────────────────────┐
│    Access Layer      │
│  ┌────────────────┐  │
│  │ Policy Engine   │  │  ← evaluates BEFORE decryption
│  └───────┬────────┘  │
│  ┌───────▼────────┐  │
│  │  Signing Core   │  │  ← mlock, zeroize, sign
│  └───────┬────────┘  │
│  ┌───────▼────────┐  │
│  │  Wallet Vault   │  │  ← AES-256-GCM encrypted
│  └────────────────┘  │
└─────────────────────┘
```

---

## 🚀 Conclusion

OWS solves the "agent key management" problem elegantly: your AI agents can sign transactions and pay for services autonomously — without ever touching your private keys.

The owner stays in control with policies, scoping, and instant revocation. The agent gets just enough access to do its job.

**Ready to try it?**

- 🐦 Follow us for more Web3 agent insights: [https://x.com/overguildOG](https://x.com/overguildOG)
- 🛠️ Try new tools at: [https://leo-book.xyz/](https://leo-book.xyz/)
- 📖 OWS Docs: [https://docs.openwallet.sh/](https://docs.openwallet.sh/)
- 💻 GitHub: [https://github.com/open-wallet-standard/core](https://github.com/open-wallet-standard/core)
