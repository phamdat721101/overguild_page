<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# let collect all data, all resource then make detail article to explain about these wallet type for builder to decide to use in project

important note:

- make content to be clean, simple and being break down structure to be easy to follow
- content must have attractive icon, content must tag all related protocols, and having attached resource links
- return content to be attractive notion format

Here's your Notion-ready article — clean, structured, and builder-focused. Below is a preview of the full content you can copy directly into Notion:

***

# 🔐 CDP Wallet Types — Builder's Decision Guide

> **For builders who want to ship fast, stay secure, and pick the right wallet architecture from day one.**

***

## 📌 TL;DR — Pick in 30 Seconds

|  | 🖥️ Server Wallet | 👤 Embedded Wallet | 🤖 Agentic Wallet |
| :-- | :-- | :-- | :-- |
| **Controls keys?** | Developer / App | User (self-custody) | AI Agent |
| **Auth method** | API Key + Secret | Email / Social login | CLI / MCP server |
| **Best for** | Backend automation | Consumer apps, DeFi | AI agents, bots |
| **Networks** | All EVM + Solana | All EVM + Solana | Base (primary) |
| **Gasless?** | ❌ | ❌ | ✅ |
| **Key export?** | ❌ | ✅ | ❌ |


***

## 🧭 The One Core Question

> **"Who should hold the private keys?"**

CDP answers this with 3 architectures — the logic is simple:

```
User owns funds  →  Embedded Wallet  
App owns funds   →  Server Wallet  
Agent owns funds →  Agentic Wallet
```

All three run on **AWS Nitro Enclave (TEE)** — keys never leave secure hardware, not even Coinbase can access them.

***

## 🖥️ Server Wallet — Backend Automation

Your backend signs transactions programmatically. No user needed.

**Built for:** Payment gateways · Treasury management · Trading bots · Fee collection

**Key powers:**

- `EIP-4337` Account Abstraction: batch transactions, gas sponsorship, spend limits
- Policy Engine: allowlists, KYT blocking, OFAC auto-screening
- `viem` native — no rewrite needed
- Trade API: swap tokens programmatically in one call
- **< 200ms** signing latency

🔗 `EIP-4337` · `EVM` · `Solana` · `KYT` · `OFAC` · `viem`

📚 [Server Wallet v2 Docs](https://docs.cdp.coinbase.com/server-wallets/v2/introduction/welcome) · [Policy Engine](https://docs.cdp.coinbase.com/server-wallets/v2/policies/overview)

***

## 👤 Embedded Wallet — Consumer UX

User-owned wallet, zero friction. Email login = instant wallet. No seed phrases.

**Built for:** Consumer payments · Web3 gaming · Social platforms · NFT marketplaces

**Key powers:**

- Auth: Email OTP, SMS, Google, custom providers (Auth0, Firebase, Cognito)
- Everything built-in: Onramp/Offramp, Swaps, Staking, **3.85% USDC yield**
- OFAC screening auto-applied on every transfer
- `x402` native — pay for HTTP services from the wallet
- Up to 5 devices, key export anytime

🔗 `USDC` · `x402` · `EVM` · `Solana` · `OAuth2` · `OFAC` · `EIP-4337`

📚 [Embedded Wallet Docs](https://docs.cdp.coinbase.com/embedded-wallets/welcome) · [x402 Integration](https://docs.cdp.coinbase.com/embedded-wallets/x402-payments)

***

## 🤖 Agentic Wallet — AI Agent Commerce

Wallet made for autonomous agents. Self-directed spending with built-in guardrails.

**Built for:** Trading agents · Research agents · DeFi yield bots · Agent-to-agent commerce

**Key powers:**

- `x402` auto-payment: agent detects HTTP 402 → auto-pays with USDC → retries
- Gasless trading on Base — agents never fail from empty gas
- CLI mode (developers) or MCP server (Claude, Gemini, Codex — no code)
- Spend limits + audit trail at infrastructure level

🔗 `x402` · `HTTP 402` · `Base` · `USDC` · `MCP` · `EIP-4337`

📚 [Agentic Wallet Docs](https://docs.cdp.coinbase.com/agentic-wallet/welcome) · [x402 Whitepaper](https://www.x402.org/x402-whitepaper.pdf)

***

## 🏁 Quick Decision Framework

```
Who initiates tx?  →  user=Embedded · backend=Server · agent=Agentic
Who owns assets?   →  user=Embedded · platform=Server · agent=Agentic
What network?      →  multi-chain=Server/Embedded · Base-only=Agentic
Compliance need?   →  consumer KYC=Embedded · enterprise audit=Server
```

The downloadable `.md` file below is formatted for **direct paste into Notion** — headers, tables, code blocks, icons, and all resource links included.[^1][^2][^3][^4][^5][^6]
<span style="display:none">[^10][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://docs.cdp.coinbase.com/server-wallets/comparing-our-wallets

[^2]: https://www.coinbase.com/developer-platform/discover/launches/cdp-wallets-launch

[^3]: https://docs.cdp.coinbase.com/embedded-wallets/welcome

[^4]: https://docs.cdp.coinbase.com/server-wallets/v2/introduction/welcome

[^5]: https://docs.cdp.coinbase.com/agentic-wallet/welcome

[^6]: https://docs.cdp.coinbase.com/x402/welcome

[^7]: how to break down task to build overguild platfor...

[^8]: Note Content.md

[^9]: Cardano Smart Contracts Fundamental.pdf

[^10]: Mastering Hydra - Cardano's Layer 2 Powerhouse.pdf

