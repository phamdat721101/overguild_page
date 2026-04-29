---
title: "x402 Facilitator — Deep Dive: The Trust Layer Powering Native HTTP Payments"
description: The trust layer that powers native HTTP payments — how the x402 facilitator works, why it matters, and how to build your own from scratch. Covers Coinbase CDP, Base, Solana, EIP-3009, and the full ecosystem.
date: 2026-04-27
category: AI & Web3
author: Terminal_Admin
readTime: 8 MIN READ
coverImage: /blog/facilitator.png
featured: false
---

> The trust layer that powers native HTTP payments — how it works, why it matters, and how to build your own from scratch.

---

## 1. What is x402?

x402 is an open HTTP payment standard that lets APIs and web services charge money *natively* — no subscriptions, no API keys, no redirects.

At its core, x402 revives the long-forgotten **HTTP 402 "Payment Required"** status code. Instead of external payment flows, payments are embedded directly into HTTP headers as signed cryptographic payloads. The result: any resource on the web can be monetized per-request, including AI agent pipelines, data APIs, and premium content.

> **Key Use Cases:** AI agent marketplaces, pay-per-use APIs, micropayment content platforms, usage-based SaaS pricing, and any service requiring instant, verifiable on-chain payments.

- 🤖 **AI Agent Payments** — Agents autonomously pay for tools, data, and compute without human checkout flows.
- 🧩 **Pay-Per-Request APIs** — Charge fractions of a cent per API call. No subscriptions, pure usage-based pricing.
- 🔗 **Standard HTTP** — Works with existing web infrastructure. No new protocols or libraries required on the network layer.
- 🌐 **Multi-Chain** — Supported on Base, Solana, Polygon, Avalanche, Arbitrum, Optimism, and more.

---

## 2. What is a Facilitator?

The Facilitator is the trust layer of x402 — an independent service that verifies payment validity and settles transactions on-chain so resource servers don't have to.

> **Critical Distinction:** The facilitator is **not a custodian**. It never holds funds. Payments flow directly from buyer (client wallet) to seller (server wallet) via signed authorizations. The facilitator only verifies and submits.

Think of the facilitator as a **payment notary + blockchain relay**. It receives a signed payment authorization, checks it's legitimate, then broadcasts the transaction on-chain. The server trusts the facilitator's verification result to decide whether to grant access.

- ✅ **Verify Payments** — Confirms the signed payload is valid, has the correct amount and recipient, and hasn't been used before.
- ⛓️ **Settle On-Chain** — Submits validated transactions to the blockchain, handles gas fees, and monitors for confirmation.
- 📡 **Advertise Capabilities** — Exposes supported networks, token types, and payment schemes for client auto-discovery.
- 🔄 **Abstract Complexity** — Servers never touch blockchain nodes directly — the facilitator handles all chain-specific quirks.

> "The facilitator acts as an independent verification and settlement layer within the x402 protocol. It helps servers confirm payments and submit transactions onchain without requiring direct blockchain infrastructure."
>
> — x402 Official Documentation, docs.x402.org

---

## 3. How It Works — Full Flow

The x402 payment lifecycle involves four actors: **Client** (buyer), **Resource Server** (seller), **Facilitator** (trust layer), and the **Blockchain** (settlement layer). Here's the complete flow:

### x402 Payment Flow (12 Steps)

1. **Client → Resource Server: Initial Request** — Client makes a normal HTTP GET/POST request to a protected endpoint. No payment header yet — just a regular request.

2. **Resource Server → Client: 402 Payment Required** — Server responds with HTTP 402 and a `PAYMENT-REQUIRED` header containing Base64-encoded payment requirements: price, network, accepted tokens, and recipient address.

3. **Client: Build Payment Payload** — Client parses the 402 response, selects a payment method from the `accepts` field, and creates a signed payment payload (EIP-3009 or SVM authorization). No gas needed for signing.

4. **Client → Resource Server: Retry with Payment** — Client retries the original request, attaching the signed payload as `X-PAYMENT` header (Base64-encoded JSON).

5. **Resource Server → Facilitator: POST /verify** — Server forwards the payment payload to the facilitator's `/verify` endpoint along with the original payment requirements.

6. **Facilitator: Verify Payload** — Facilitator validates signature, checks amount matches requirements, confirms recipient address, and ensures the payload hasn't been replayed. Returns `isValid: true/false`.

7. **Resource Server: Process Work** — If verification is valid, server performs the requested operation (generates data, serves content, runs compute, etc.). If invalid, returns another 402.

8. **Resource Server → Facilitator: POST /settle** — After work is complete, server asks facilitator to settle the payment on-chain by calling the `/settle` endpoint with the same payload.

9. **Facilitator → Blockchain: Submit Transaction** — Facilitator broadcasts the signed `transferWithAuthorization` (EIP-3009) or equivalent SVM transaction to the blockchain.

10. **Facilitator: Wait for Confirmation** — Facilitator monitors the blockchain for transaction confirmation, handling retries or failures as needed.

11. **Facilitator → Resource Server: Settlement Response** — Returns a `PaymentExecutionResponse` with the transaction hash as proof of settlement.

12. **Resource Server → Client: 200 OK + Receipt** — Server returns the requested resource with a `PAYMENT-RESPONSE` header containing the settlement proof. Success!

> **⚠️ Solana Duplicate Settlement Warning:** On Solana, multiple /settle calls for the same transaction before confirmation can all return success (network deduplication). Always implement a **SettlementCache** (120s TTL) in your Solana facilitator to prevent replay attacks.

---

## 4. The 3 Required Endpoints

Every x402 facilitator must implement exactly three HTTP endpoints. These form the public interface of your facilitator service.

### POST /verify

Validates a payment payload **without** broadcasting to the blockchain. Used by the resource server before doing any work.

- `payload` — Base64-encoded signed payment payload from the client's X-PAYMENT header
- `requirements` — Payment requirements from the 402 response (amount, recipient, network, scheme)
- **Returns:** `{ isValid: boolean, invalidReason?: string }`

### POST /settle

Submits the payment transaction on-chain and waits for confirmation. Called by the server after work is complete.

- `payload` — Same payment payload sent to /verify
- `requirements` — Same payment requirements from the 402 response
- **Returns:** `{ success: boolean, txHash: string, network: string }`

### GET /supported

Advertises what networks, tokens, and payment schemes this facilitator supports. Enables client auto-discovery.

- **Returns:** `{ x402Version: string, schemes: [...], networks: [...], feePayer: string }`

---

## 5. Build Your Own Facilitator

Building a custom facilitator gives you full control over supported networks, token types, fee policies, and settlement logic. Here's the complete path from zero to running facilitator.

> **Official SDK Support:** x402 provides TypeScript, Python, and Go packages. The TypeScript SDK (`@coinbase/x402`) includes facilitator registration helpers for both EVM (EIP-3009) and SVM (Solana) payment schemes.

### Step-by-Step Guide

1. **Install the x402 Facilitator Package** — Start with the official SDK. Install `@coinbase/x402` for TypeScript or use the Python/Go equivalents. This gives you scheme registration helpers and payload parsing utilities.

2. **Set Up a Web Server** — Spin up any HTTP server (Express, Fastify, Hono, etc.). Your facilitator is just a standard REST service. Expose it over HTTPS on a public URL.

3. **Configure a Signing Wallet** — Your facilitator needs a wallet (fee payer) that will pay gas fees when submitting transactions. On EVM chains (Base), use an EOA with ETH. On Solana, use a keypair with SOL or integrate Kora for gasless signing.

4. **Register Payment Schemes** — Register which payment schemes your facilitator supports using the SDK helpers: `registerEVMFacilitatorScheme()` for Base/EVM networks (EIP-3009 USDC), or `registerSVMFacilitatorScheme()` for Solana. Each scheme handles its own verify/settle logic.

5. **Wire Up the 3 Endpoints** — Implement `POST /verify`, `POST /settle`, and `GET /supported`. The SDK provides handler factories that do the heavy lifting — you just plug them into your router.

6. **Add Replay Protection (Critical for Solana)** — For Solana, initialize a `SettlementCache` and pass it to both V1 and V2 SVM scheme registrations. For EVM, EIP-3009's nonce mechanism handles replay protection natively.

7. **Test on Devnet / Testnet** — Run against Base Sepolia or Solana Devnet. Use Circle's USDC faucet for test tokens. Verify all three endpoints with the x402 test client before moving to mainnet.

8. **Deploy and Register in the Ecosystem** — Deploy your facilitator with a public HTTPS URL. Submit a PR to the x402 GitHub ecosystem directory to list your facilitator alongside Coinbase CDP, xpay, AltLayer, and others.

### Minimal TypeScript Facilitator

```typescript
// Install: npm install @coinbase/x402 express viem

import express from 'express';
import { createFacilitatorRoutes, registerEVMScheme } from '@coinbase/x402/facilitator';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';

const app = express();
app.use(express.json());

// 1. Set up fee-payer wallet (pays gas on Base)
const account = privateKeyToAccount(process.env.FEE_PAYER_KEY as `0x${string}`);
const walletClient = createWalletClient({
  account, chain: base, transport: http()
});

// 2. Register EVM payment scheme (Base mainnet, USDC EIP-3009)
const schemes = registerEVMScheme(walletClient, {
  network: 'base',
  usdcAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
});

// 3. Wire up all 3 required endpoints automatically
app.use('/', createFacilitatorRoutes(schemes));

// 4. Start server
app.listen(3000, () => {
  console.log('🚀 Facilitator running at http://localhost:3000');
});
```

> **Pro Tip — Custom Facilitator Use Cases:** Build a custom facilitator when you need: (1) a specific chain not yet in the ecosystem, (2) a custom token beyond USDC, (3) gasless UX via Kora/Paymaster integration, (4) custom fee sharing logic, or (5) private enterprise deployment where you don't want to use Coinbase's hosted service.

---

## 6. Ecosystem Facilitators

Multiple production facilitators are available today. You can use any of them by pointing your server's `facilitatorUrl` config to their endpoint. They compete on supported networks, reliability, and fee structures.

| Facilitator | Networks | Status | Free Tier |
|---|---|---|---|
| [🔵 Coinbase CDP](https://docs.cdp.coinbase.com/x402) | Base, Base Sepolia | LIVE | 1,000 tx/mo |
| [🟠 xpay.sh](https://docs.xpay.sh/en/x402-protocol/facilitator) | Base Mainnet + Testnet | LIVE | — |
| [🔷 AltLayer](https://docs.altlayer.io/altlayer-documentation/x402-product-suite/facilitator) | Base, Solana, Polygon, Avalanche, Arbitrum, Optimism | LIVE | — |
| [🛡️ OpenZeppelin Relayer](https://docs.openzeppelin.com/relayer/guides/stellar-x402-facilitator-guide) | Stellar | LIVE | Plugin |
| [🟡 Kora (Solana)](https://solana.com/developers/guides/getstarted/build-a-x402-facilitator) | Solana Mainnet + Devnet | LIVE | Self-hosted |
| [💜 BlockyDevs / Hedera](https://hedera.com/blog/hedera-and-the-x402-payment-standard/) | Hedera, Base, Solana, Arbitrum, Optimism, Avalanche | BETA | Open source |

> **Open Architecture:** The x402 protocol is designed so **anyone can run their own facilitator**. The ecosystem does not depend on any single company. Coinbase's hosted facilitator has a free tier of 1,000 transactions/month — ideal for getting started before deploying your own.

---

## 7. Resources & Links

- 📘 **[x402 Facilitator Docs](https://docs.x402.org/core-concepts/facilitator)** — Official x402 facilitator documentation — core concepts, interaction flow, and specs.
- 🐙 **[x402 GitHub Repository](https://github.com/coinbase/x402)** — Official TypeScript SDK, Python and Go packages, and facilitator reference implementations.
- 🟡 **[Build a Solana Facilitator](https://solana.com/developers/guides/getstarted/build-a-x402-facilitator)** — Step-by-step guide to building an x402 facilitator with Kora gasless signing on Solana.
- 🔵 **[Coinbase CDP x402 Guide](https://docs.cdp.coinbase.com/x402/core-concepts/how-it-works)** — Full protocol walkthrough including client/server roles, HTTP 402 spec, and Coinbase facilitator setup.
- 🟠 **[xpay Facilitator API](https://docs.xpay.sh/en/x402-protocol/facilitator)** — Public x402 facilitator API at facilitator.xpay.sh — USDC on Base mainnet and testnet.
- 🔷 **[AltLayer x402 Suite](https://docs.altlayer.io/altlayer-documentation/x402-product-suite/facilitator)** — Multi-chain facilitator covering Base, Solana, Polygon, Avalanche, Arbitrum, and Optimism.
- 📰 **[x402 Explained — Sherlock](https://sherlock.xyz/post/x402-explained-the-http-402-payment-protocol)** — Clear, concise explanation of the full x402 protocol stack including the facilitator's trust role.
- 🛡️ **[OpenZeppelin x402 (Stellar)](https://docs.openzeppelin.com/relayer/guides/stellar-x402-facilitator-guide)** — Plugin-based facilitator for OpenZeppelin Relayer, targeting Stellar mainnet and testnet.

---

*Built for the BTCFi Station community · x402 Protocol Research · April 2026*
