<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# MPP-Specific Cross-Chain Adapters (Solver-Powered)

- Squid MPP Adapter    │ [https://docs.squidrouter.com/api-and-sdk-integration/squid-mpp-adapter](https://docs.squidrouter.com/api-and-sdk-integration/squid-mpp-adapter) (https://docs.squidrouter.com/api-and-sdk-integration/squid-mpp-adapter) │ Pay MPP services from any EVM chain
- MPP Router (Stellar) │ [https://www.mpprouter.dev](https://www.mpprouter.dev) (https://www.mpprouter.dev)                                                                                           │ Routes Stellar payments to MPP services on Tempo

let research, then analyze all resources from above link then make detail article to:

- explain how Solver can support cross-chain transfer in agentic payment

important note:

- make content to be clean, simple and being break down structure to be easy to follow
- content must have attractive icon, content must tag all related protocols, and having attached resource links

Based on the resources, I've gathered comprehensive information about how Solvers power cross-chain transfers in agentic payments through MPP adapters. Let me create a detailed, well-structured article that breaks down these concepts clearly.

***

# 🌉 Solver-Powered Cross-Chain Adapters for Agentic Payments

## 🎯 The Problem: Payment Fragmentation in Multi-Chain Ecosystems

Traditional agentic payment systems face a critical challenge: **400+ MPP services exist on Tempo**, but agents operating on other blockchains (like Ethereum, Arbitrum, Base) cannot directly access them . Without cross-chain adapters, payment infrastructure remains fragmented—each blockchain operates in isolation, limiting AI agents' ability to pay for services across different networks .

**What prevents direct cross-chain payments?**

- Each blockchain has its own native tokens and settlement layer
- Manual bridging requires complex multi-step transactions
- Agents would need to pre-fund wallets on every supported chain
- No unified routing mechanism exists between networks

***

## 💡 The Solution: Solver-Based Cross-Chain Routing

**Solvers** act as intelligent intermediaries that automatically handle the complexity of cross-chain transfers. Instead of agents managing bridges manually, solvers scan available balances across multiple chains, select optimal routing paths, and execute cross-chain swaps in a single seamless operation .

### How Solvers Enable Agentic Cross-Chain Payments

1. **Auto-discovery**: Solvers scan all supported chains for available token balances
2. **Optimal routing**: Select the best source chain and token based on fees, liquidity, and speed
3. **Atomic bridging**: Execute cross-chain transfers and settlements in one transaction flow
4. **Standard compliance**: Maintain HTTP 402 payment protocol throughout the process

***

## 🔧 Two Key Cross-Chain Adapters

### 1. 🦑 **Squid MPP Adapter** — EVM-to-Tempo Bridge

**Protocol**: [Squid Router](https://docs.squidrouter.com/api-and-sdk-integration/squid-mpp-adapter) | **Target**: EVM chains → Tempo mainnet

The Squid MPP adapter enables AI agents on **any EVM blockchain** (Ethereum, Polygon, Arbitrum, Base, etc.) to pay for MPP services on Tempo without manual bridging .

#### Key Features

**Auto Chain Selection**
The solver automatically scans all Squid-supported EVM chains, detects available USDC or supported token balances, and selects the optimal source chain for payment .

**Cross-Chain Bridging**
Routes tokens from the selected source chain to Tempo mainnet using Squid's liquidity network—no manual bridge interaction required .

**HTTP 402 Payment Flow**
Maintains standard MPP challenge/credential cycle:

1. Server issues 402 Payment Required challenge
2. Client's solver bridges tokens and settles payment
3. Server validates credential and grants access

#### Implementation Example

**Server-side (protecting an endpoint)**:

```javascript
// Protect your API endpoint with MPP
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

**Client-side (paying from any EVM chain)**:

```javascript
// Agent pays from any EVM chain automatically
import { Mppx } from 'mppx';
import { squid } from '@0xsquid/mpp';

const client = Mppx.create({
  payment: squid({
    account: agentWallet,
    integratorId: 'your-squid-id'
  })
});

const response = await client.fetch('https://api.example.com/service');
```

The solver handles everything: detecting the agent has USDC on Arbitrum, bridging to Tempo, and settling the payment—all transparent to the agent .

**Related protocols**: `Squid Router`, `Tempo MPP`, `HTTP 402`, `EVM chains`

**Resources**: [Squid MPP Adapter Docs](https://docs.squidrouter.com/api-and-sdk-integration/squid-mpp-adapter)

***

### 2. ⭐ **MPP Router** — Stellar-to-Tempo Bridge

**Protocol**: [MPP Router](https://www.mpprouter.dev) | **Target**: Stellar → Tempo MPP services
**Built by**: ROZO × Stellar

MPP Router makes 400+ Tempo MPP services accessible to **Stellar-based AI agents** through intelligent routing .

#### How It Works

**Unified Routing Layer**
Instead of integrating with 400+ individual services, agents integrate once with MPP Router, which handles discovery and routing to all MPP-enabled services .

**Cross-Protocol Payment Translation**
Translates Stellar payment primitives into Tempo MPP-compatible settlements, enabling seamless cross-ecosystem payments .

**Agent-Native Integration**
Works directly with popular AI agent frameworks through MCP (Model Context Protocol):

- Claude Desktop
- Gemini CLI
- OpenClaw
- Cursor
- Codex


#### Available Services Through MPP Router

The router provides access to **88+ services** across multiple categories :

**AI/ML**: OpenAI, Anthropic, Google Gemini, Replicate, fal.ai, Stability AI, Mistral AI, DeepSeek, Grok, Perplexity
**Blockchain**: Alchemy, Nansen, Quicknode, Tempo RPC, Codex, Allium
**Search**: Brave Search, Exa, Tavily, SerpApi, Parallel
**Data**: Dune, CoinGecko, IPinfo, Alpha Vantage, Apollo, Wolfram|Alpha
**Storage**: Pinata IPFS, Object Storage, Code Storage
**Compute**: Modal, Build With Locus, Judge0

#### Quick Start (No Login Required)

Agents can discover and call MPP Router services by reading the service directory at `https://apiserver.mpprouter.dev/llms.txt` .

**Before MPP Router**:

- ✕ 400+ services on Tempo not usable for Stellar agents
- ✕ Fragmented payment integration for each service

**After MPP Router**:

- ✓ Stellar can pay across entire MPP ecosystem
- ✓ One integration, unified routing

**Related protocols**: `Stellar`, `Tempo MPP`, `MCP (Model Context Protocol)`, `HTTP 402`

**Resources**: [MPP Router](https://www.mpprouter.dev)

***

## 🔄 The Complete Solver-Powered Payment Flow

Here's how a cross-chain agentic payment works end-to-end:

**Step 1: Service Discovery**
AI agent needs to call an MPP service (e.g., OpenAI API on Tempo)

**Step 2: Payment Challenge**
Service responds with HTTP 402, specifying price and settlement address on Tempo

**Step 3: Balance Detection**
Solver scans agent's wallets across all supported chains:

- Finds 10 USDC on Arbitrum (EVM)
- Finds 5 USDC on Stellar
- Needs to pay 0.01 USDC to Tempo

**Step 4: Optimal Route Selection**
Solver evaluates:

- Bridge fees (Arbitrum→Tempo vs Stellar→Tempo)
- Transaction speed
- Liquidity availability
Selects Arbitrum as optimal source

**Step 5: Atomic Cross-Chain Settlement**
Solver executes:

1. Lock 0.01 USDC + fees on Arbitrum
2. Route through Squid's liquidity network
3. Settle to service's Tempo address
4. Generate payment credential

**Step 6: Service Access**
Agent retries original request with credential, service validates payment, grants access

All of this happens **automatically**—the agent simply calls the API endpoint, and the solver handles all cross-chain complexity behind the scenes.

***

## 🎓 Why Solvers Matter for Agentic Payments

**Liquidity Aggregation**: Agents can use tokens from any chain without manual transfers
**Cost Optimization**: Solvers select cheapest routing paths, reducing transaction fees
**User Experience**: One-line integration instead of complex multi-chain logic
**Protocol Flexibility**: Services on Tempo can serve clients from any blockchain ecosystem
**Unified Standards**: Maintains HTTP 402 payment flow regardless of source chain

***

## 🚀 Building with Solver-Powered Adapters

**For Service Providers** (accepting payments):

1. Install `mppx` library
2. Add `mppx.charge()` middleware to protected endpoints
3. Automatically accept payments from EVM chains (via Squid) or Stellar (via MPP Router)

**For AI Agent Developers** (making payments):

1. Integrate Squid MPP adapter for EVM-based agents
2. Integrate MPP Router for Stellar-based agents
3. Fund agent wallet on any supported chain
4. Let solver handle all cross-chain complexity

***

## 📚 Related Protocols \& Resources

**Core Protocols**:

- `HTTP 402 Payment Required` — Standard payment challenge/credential flow
- `Tempo MPP` — Machine Payments Protocol settlement layer
- `Squid Router` — Cross-chain liquidity and bridging infrastructure
- `Stellar` — Fast, low-cost blockchain for payments

**Integration Tools**:

- `mppx` — MPP server and client library
- `@0xsquid/mpp` — Squid MPP adapter SDK
- `viem` — Ethereum wallet management

**Documentation**:

- [Squid MPP Adapter](https://docs.squidrouter.com/api-and-sdk-integration/squid-mpp-adapter)
- [MPP Router](https://www.mpprouter.dev)
- [Official MPP Protocol Docs](https://mppx.dev)

***

Now that you understand how solvers enable cross-chain agentic payments, which blockchain ecosystem are you planning to build your agent on—EVM chains or Stellar? This will help determine which adapter pattern best fits your architecture.

