---
title: "Tempo Accounts: Architecture, Implementation, and Technical Deep Dive"
description: How Tempo Accounts revolutionize blockchain authentication with passkey-based auth, access key delegation, fee sponsorship, and batch transactions through a custom EIP-2718 transaction type.
date: 2026-04-13
category: Web3 Tech
author: Terminal_Admin
readTime: 25 MIN READ
coverImage: /blog/tempo-account.png
featured: true
---

## Executive Summary

Tempo Accounts is not a standalone product but rather an account management system built around the **Tempo Accounts SDK**—a TypeScript library that enables applications to create, manage, and interact with accounts on the Tempo blockchain. The system revolutionizes blockchain authentication by integrating **passkey-based authentication** (WebAuthn/P256 signatures), **access key delegation**, **fee sponsorship**, and **batch transactions** natively into the protocol through a custom **EIP-2718 transaction type**.

Unlike traditional Ethereum accounts that rely on seed phrases and sequential nonces, Tempo Accounts leverage modern authentication standards and protocol-level features to deliver seamless, gasless user experiences comparable to Web2 applications while maintaining the security guarantees of blockchain technology.

## What is Tempo Account?

### Core Definition

A **Tempo Account** refers to any account managed through the Tempo Accounts SDK on the Tempo blockchain. These accounts can be created through two primary methods:

1. **Universal Tempo Wallet**: A single passkey creates one portable account accessible across all applications via `wallet.tempo.xyz`
2. **Domain-Bound Passkeys**: Application-specific accounts created and managed directly within the app's domain using WebAuthn

The fundamental architecture positions the SDK as a **router between applications and signing adapters**, exposed as an **EIP-1193 Provider** compatible with existing Ethereum tooling like Wagmi and Viem.

### High-Level Flow

```
Application → Accounts SDK → Signing Adapter → User Approves (Passkey) → Result
```

This simple flow masks sophisticated underlying infrastructure that handles cryptographic operations, transaction orchestration, and protocol-level optimizations entirely transparently to the end user.

## Architecture and Components

### 1. The Accounts SDK

The Accounts SDK serves as the central orchestration layer, providing a standard **EIP-1193 Provider interface** that applications interact with through familiar JSON-RPC methods. This design ensures compatibility with the entire Ethereum developer ecosystem while enabling Tempo-specific enhancements.

**Core Components:**

| Component | Function |
|-----------|----------|
| **Provider** | Creates EIP-1193 provider instances for application integration |
| **Adapters** | Handle key storage and signing operations (`dialog`, `webAuthn`, `local`) |
| **JSON-RPC Methods** | Standard methods (`wallet_connect`, `eth_sendTransaction`) plus Tempo extensions (`wallet_sendCalls`, `wallet_authorizeAccessKey`) |
| **Wagmi Connectors** | Pre-built connectors for React applications (`tempoWallet()`, `webAuthn()`) |

**Architectural Diagram:**

```
┌─────────────────────┐
│   Application       │
│  (Wagmi/Viem)       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Accounts SDK       │
│ (EIP-1193 Provider) │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Signing Adapter    │
│  • Tempo Wallet     │
│  • WebAuthn         │
│  • Local            │
└─────────────────────┘
```

### 2. Signing Adapters

Adapters are pluggable modules that determine **where keys live** and **who handles signing**. The choice of adapter fundamentally shapes the user experience and security model.

#### Tempo Wallet Adapter

The `dialog` adapter delegates signing to the hosted Tempo Wallet at `wallet.tempo.xyz` via an embedded iframe or popup window.

**Key Features:**
- **Universal Account**: One passkey works across all applications
- **Embedded Onramp**: Direct fiat-to-crypto conversion within the wallet UI
- **Access Key Management**: Visual interface for authorizing and revoking delegated keys
- **Transaction Orchestration**: Intelligent batching and fee optimization
- **HTTPS Required**: iframe dialogs require secure origins due to WebAuthn security requirements

**When to Use:** Most applications should default to Tempo Wallet for the universal account experience with minimal integration effort.

#### WebAuthn Adapter

The `webAuthn` adapter handles passkey ceremonies and signing in-process on the application's own domain, creating **domain-bound accounts**.

**Key Features:**
- **Domain-Bound Keys**: Passkeys tied to specific domains per WebAuthn spec
- **Custom UI**: Applications control the entire authentication flow
- **Reduced Latency**: No iframe/popup communication overhead
- **Customizable Policies**: Application-defined authorization logic

**Domain Binding Implications:**

WebAuthn passkeys are bound to the Relying Party ID (rpID)—the domain that created them. A passkey created by `wallet.example.com` can only be used by `wallet.example.com`. This prevents phishing attacks but creates vendor lock-in: if the provider changes domains or shuts down, the passkey becomes useless.

The FIDO Alliance's Credential Exchange Protocol (CXP) may eventually enable cross-ecosystem transfer, but as of April 2026 it remains unfinalized.

**When to Use:** Domain-bound passkeys suit applications that want full control over the authentication experience and accept the trade-off of non-portable accounts.

### 3. Tempo Transactions (EIP-2718 Type 0x76)

At the protocol level, Tempo implements a custom **EIP-2718 transaction type** (type `0x76`) that extends standard EVM transactions with payment-optimized features.

#### Transaction Structure

```solidity
TempoTransaction {
  calls: Call[],              // Batch multiple operations
  nonce: (u64, u256),        // 2D nonce: (key, sequence)
  signature: Signature,       // User's signature (ECDSA, P256, or WebAuthn)
  fee_payer_signature: Option<Signature>,  // Optional sponsor signature
  scheduled_time: Option<u64>,             // Optional execution timestamp
  expiry_time: Option<u64>                 // Optional expiry
}
```

#### Native Protocol Features

**1. Native Passkey Support**

Tempo natively supports three signature types at the protocol level:

- **ECDSA (secp256k1)**: Standard Ethereum signatures
- **P-256 (secp256r1)**: The curve used in Apple Secure Enclave and hardware security modules
- **WebAuthn**: Full passkey support including user presence verification, origin binding, and anti-replay counters

This means a user can **generate a P-256 key from Face ID, derive a chain address directly, and start transacting with zero ceremony**. No smart contract wallet deployment, no ERC-4337 bundlers, no EntryPoint contracts—the protocol itself understands and verifies the signature.

**2. Batch Transactions**

Tempo Transactions include a `calls` array field—a list of sequential calls bundled into a single transaction at the protocol level. This is available to **every account, on every transaction, by default** with no setup required.

```typescript
const calls = [
  {
    to: tokenAddress,
    input: ITIP20.transferCall({ to: recipient1, amount: 100_000_000 })
  },
  {
    to: tokenAddress,
    input: ITIP20.transferCall({ to: recipient2, amount: 50_000_000 })
  }
]

await client.sendCalls({ calls })
```

Multiple payment disbursements, approve + transfer sequences, or any arbitrary call sequence—one signature, one transaction.

**3. Fee Sponsorship**

Tempo Transactions support **native fee sponsorship**, allowing applications to pay gas fees on behalf of users.

**Sponsorship Flow:**

1. **User signs** the transaction with their key (including tx hash)
2. **Sponsor signs** a separate `fee_payer_signature` committing to pay gas
3. **Transaction executes** with sponsor paying all gas fees
4. **User's balance** unaffected by gas costs

The sponsor signature binds to the specific sender and transaction hash, preventing replay attacks.

**Implementation Example:**

```rust
// User signs the transaction
let user_signed_tx = tx_request.build(&user_signer).await?;

// Sponsor computes fee payer signature hash
let fee_payer_hash = user_signed_tx.fee_payer_signature_hash();
let sponsor_signature = sponsor_signer.sign_hash(&fee_payer_hash).await?;

// Attach sponsor signature
let sponsored_tx = user_signed_tx.with_fee_payer_signature(sponsor_signature);

// Send sponsored transaction
provider.send_raw_transaction(&sponsored_tx.encoded_2718()).await?;
```

**Sponsorship Policies:**

Production implementations typically enforce sponsorship policies to control costs:

```rust
enum SponsorshipPolicy {
    AlwaysSponsor,
    OnboardingOnly { max_transactions: u32 },
    WhitelistedUsers { addresses: Vec<Address> },
    ValueThreshold { max_value: U256 },
    Custom(Box<dyn Fn(&TempoTransactionRequest) -> bool>),
}
```

**4. Two-Dimensional Nonces**

Tempo introduces a **two-dimensional nonce system**: the standard 64-bit nonce **plus** a 256-bit "nonce key".

```
Nonce Structure: (nonce_key: u256, nonce_value: u64)
```

Transactions with different nonce keys are treated as **entirely independent sequences**. A single account can run multiple transaction streams in parallel, and a stalled transaction in one stream doesn't block another.

**Nonce Architecture:**

```
Account State:
  protocol_nonce: u64           // key 0, in account state

Precompile Storage:
  nonces[account][^1]: 0         // user nonce key 1
  nonces[account][^2]: 0         // user nonce key 2
  nonces[account][^3]: 0         // user nonce key 3
```

**Best Practices:**

- **Key 0**: Reserved for protocol (account state)
- **Keys 1-10**: Interactive operations (user-facing transactions)
- **Keys 11-100**: Automation (bots, keepers)
- **Keys 101+**: Reserved for future use

### 4. Account Keychain Precompile

The **Account Keychain precompile** (predeployed system contract) enables accounts to authorize **secondary keys** (Access Keys) that can sign transactions with **scoped permissions**.

#### Core Functionality

Access Keys provide delegated transaction signing with configurable constraints:

- **Expiry Timestamps**: Keys automatically become invalid after specified block timestamp
- **Token Spending Limits**: Per-token maximum spending amounts
- **Periodic Spending Limits**: Limits that reset after configurable time periods (TIP-1011)
- **Destination Scoping**: Restrict keys to only interact with specific contract addresses (TIP-1011)
- **2D Nonce Assignment**: Each access key operates on its own nonce stream

#### TIP-1011: Enhanced Access Key Permissions

TIP-1011 extends Access Keys with two major permission enhancements:

**1. Periodic Spending Limits**

Spending limits that automatically reset after a configurable time period, enabling subscription-based access patterns:

```solidity
struct TokenLimit {
    address token;
    uint256 amount;
    uint64 period;      // NEW: 0 = one-time, >0 = recurring period in seconds
}
```

**Example:** An access key with a 1000 USDC limit that resets every 30 days allows automated subscriptions without granting unlimited spending authority.

**2. Destination Address Scoping**

Restricts keys to only interact with specific contract addresses:

```solidity
function authorizeKey(
    bytes calldata key,
    uint64 expiry,
    TokenLimit[] calldata spendingLimits,
    address[] calldata allowedDestinations  // NEW: empty = unrestricted
) external;
```

**Example:** An access key restricted to `[dex_contract, token_contract]` cannot interact with arbitrary contracts, limiting the damage from key compromise.

#### Interface

```solidity
interface IAccountKeychain {
    /// @notice Authorize a key with enhanced permissions
    function authorizeKey(
        bytes calldata key,
        uint64 expiry,
        TokenLimit[] calldata spendingLimits,
        address[] calldata allowedDestinations
    ) external;

    /// @notice Returns allowed destinations for a key
    function getAllowedDestinations(bytes calldata key) 
        external view returns (address[] memory);

    /// @notice Returns remaining limit accounting for period resets
    function getRemainingLimit(bytes calldata key, address token) 
        external view returns (uint256 remaining, uint64 periodEnd);

    /// @notice Revoke a previously authorized key
    function revokeKey(bytes calldata key) external;
}
```

## How Tempo Accounts Work

### Account Creation Flow

#### Universal Tempo Wallet

```typescript
import { useConnect, useConnectors } from 'wagmi'
import { tempoWallet } from 'accounts/wagmi'

// 1. Configure connector
const config = createConfig({
  chains: [tempo],
  connectors: [tempoWallet()],
  transports: { [tempo.id]: http() }
})

// 2. User clicks "Connect Wallet"
const connect = useConnect()
await connect.connect({ connector: tempoWallet() })

// 3. Dialog opens, user creates passkey with Face ID/Touch ID
// 4. Passkey generated in Secure Enclave, registered with wallet.tempo.xyz
// 5. Account address derived from P-256 public key
// 6. Connection established, app receives account address
```

The entire flow completes in seconds with no seed phrases, browser extensions, or manual wallet configuration.

#### Domain-Bound Passkey Account

```typescript
import { webAuthn } from 'accounts/wagmi'

// 1. Configure with custom auth endpoint
const config = createConfig({
  chains: [tempo],
  connectors: [webAuthn({ authUrl: '/auth' })],
  transports: { [tempo.id]: http() }
})

// 2. User initiates registration
await connect.connect({ connector: webAuthn({ authUrl: '/auth' }) })

// 3. App calls server /auth endpoint for WebAuthn challenge
// 4. Browser invokes navigator.credentials.create()
// 5. User approves with biometric
// 6. Public key returned to server, stored in database
// 7. Account address derived from P-256 public key
```

The passkey is bound to the application's domain and cannot be used elsewhere.

### Transaction Signing Flow

#### Standard Transaction

```typescript
// 1. Build transaction
const transfer = useTransfer()
transfer.mutate({
  token: pathUSD_ADDRESS,
  to: recipientAddress,
  amount: parseUnits('10', 6)
})

// 2. SDK routes signing request to adapter
// 3. User approves with passkey (Face ID/Touch ID)
// 4. P-256 signature generated in Secure Enclave
// 5. Tempo Transaction constructed with signature
// 6. Transaction submitted to Tempo network
// 7. Validators verify P-256 signature natively
// 8. Transaction executes in ~500ms with deterministic finality
```

#### Sponsored Transaction

```typescript
// 1. User signs transaction (as above)
const userSignedTx = await buildTransaction(userSigner)

// 2. Sponsor computes fee payer signature
const feePayerHash = userSignedTx.fee_payer_signature_hash()
const sponsorSig = await sponsorSigner.sign_hash(feePayerHash)

// 3. Attach sponsor signature
const sponsoredTx = userSignedTx.with_fee_payer_signature(sponsorSig)

// 4. Submit transaction
// 5. Protocol verifies both user signature and sponsor signature
// 6. Sponsor's account debited for gas fees
// 7. User's account unaffected by gas costs
```

The user sees a gasless experience; the application absorbs transaction costs.

#### Batch Transaction

```typescript
// 1. Define multiple calls
const calls = [
  { to: token, input: approveCall({ spender, amount: MAX }) },
  { to: dex, input: swapCall({ tokenIn, tokenOut, amountIn }) }
]

// 2. Submit as single transaction
await client.sendCalls({ calls })

// 3. User signs once
// 4. All calls execute atomically
// 5. One transaction, one gas payment
```

### Access Key Delegation Flow

```typescript
// 1. Main account authorizes access key
const accessKeyPubKey = generateP256KeyPair().publicKey

await accountKeychain.authorizeKey({
  key: accessKeyPubKey,
  expiry: timestampIn30Days(),
  spendingLimits: [
    { token: USDC_ADDRESS, amount: parseUnits('1000', 6), period: 2592000 }
  ],
  allowedDestinations: [DEX_ADDRESS, TOKEN_ADDRESS]
})

// 2. Access key holder can now sign transactions within constraints
const tx = buildTransaction({
  calls: [{ to: DEX_ADDRESS, input: swapCall() }],
  nonce: [1, 0]  // nonce_key=1 for access key
})

const signature = signWithAccessKey(tx, accessKeyPrivateKey)
await provider.sendTransaction(tx)

// 3. Protocol verifies:
//    - Access key is authorized for sender account
//    - Transaction within spending limits
//    - Destination in allowedDestinations list
//    - Key not expired
//    - Transaction executes if all checks pass
```

## Implementation Guide

### Basic Setup

#### Installation

```bash
npm install accounts wagmi viem
```

#### Configuration

```typescript
// config.ts
import { createConfig, http } from 'wagmi'
import { tempo } from 'wagmi/chains'
import { tempoWallet } from 'accounts/wagmi'

export const wagmiConfig = createConfig({
  chains: [tempo],
  connectors: [tempoWallet()],
  transports: {
    [tempo.id]: http('https://rpc.tempo.xyz')
  }
})
```

#### Application Wrapper

```typescript
// App.tsx
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <YourApp />
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

### Connection Component

```typescript
import { useConnect, useAccount, useDisconnect } from 'wagmi'
import { tempoWallet } from 'accounts/wagmi'

export function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div>
        <p>Connected: {address}</p>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    )
  }

  return (
    <button onClick={() => connect({ connector: tempoWallet() })}>
      Connect Wallet
    </button>
  )
}
```

### Sending Payments

```typescript
import { useTransfer } from 'wagmi/tempo'
import { parseUnits } from 'viem'

export function SendPayment() {
  const transfer = useTransfer()

  const handleSend = async () => {
    transfer.mutate({
      token: '0x20c0000000000000000000000000000000000001', // pathUSD
      to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEbb',
      amount: parseUnits('10', 6),
      memo: 'Payment for invoice #12345'
    })
  }

  return (
    <button onClick={handleSend} disabled={transfer.isPending}>
      {transfer.isPending ? 'Sending...' : 'Send 10 USDC'}
    </button>
  )
}
```

### Batch Transactions

```typescript
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { encodeFunctionData } from 'viem'

export function BatchPayments() {
  const { data: hash, writeContract } = useWriteContract()

  const handleBatch = async () => {
    const calls = [
      {
        to: pathUSD,
        input: encodeFunctionData({
          abi: TIP20_ABI,
          functionName: 'transfer',
          args: [recipient1, parseUnits('10', 6)]
        })
      },
      {
        to: pathUSD,
        input: encodeFunctionData({
          abi: TIP20_ABI,
          functionName: 'transfer',
          args: [recipient2, parseUnits('5', 6)]
        })
      }
    ]

    await provider.request({
      method: 'wallet_sendCalls',
      params: [{ calls, from: accountAddress }]
    })
  }

  return <button onClick={handleBatch}>Send Batch</button>
}
```

### Server-Side Fee Sponsorship

```typescript
// server.ts
import { PrivateKeySigner } from 'ethers'
import { Provider } from '@ethersproject/providers'

const sponsorSigner = new PrivateKeySigner(process.env.SPONSOR_PRIVATE_KEY)

app.post('/api/sponsor', async (req, res) => {
  const { userSignedTx } = req.body

  // Validate transaction
  if (!isValidForSponsorship(userSignedTx)) {
    return res.status(400).json({ error: 'Invalid transaction' })
  }

  // Check sponsor balance
  const balance = await provider.getBalance(sponsorSigner.address)
  if (balance < estimateGasCost(userSignedTx)) {
    return res.status(402).json({ error: 'Insufficient sponsor funds' })
  }

  // Sign as fee payer
  const feePayerHash = computeFeePayerHash(userSignedTx)
  const sponsorSignature = await sponsorSigner.signMessage(feePayerHash)

  // Return sponsored transaction
  const sponsoredTx = attachSponsorSignature(userSignedTx, sponsorSignature)
  res.json({ sponsoredTx })
})
```

### Access Key Management

```typescript
import { useWriteContract } from 'wagmi'

const ACCOUNT_KEYCHAIN = '0x0000000000000000000000000000000000000100'

export function AuthorizeAccessKey() {
  const { writeContract } = useWriteContract()

  const authorizeKey = async (accessKeyPubKey: string) => {
    writeContract({
      address: ACCOUNT_KEYCHAIN,
      abi: ACCOUNT_KEYCHAIN_ABI,
      functionName: 'authorizeKey',
      args: [
        accessKeyPubKey,
        Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
        [
          {
            token: USDC_ADDRESS,
            amount: parseUnits('1000', 6),
            period: 2592000 // 30 days in seconds
          }
        ],
        [DEX_ADDRESS, TOKEN_ADDRESS] // Allowed destinations
      ]
    })
  }

  return <button onClick={() => authorizeKey('0x...')}>Authorize Key</button>
}
```

## Comparison: Tempo vs Ethereum Account Abstraction

The implementation gap between Tempo's "protocol-native" approach and Ethereum's "application-layer" Account Abstraction (ERC-4337) is substantial:

| Feature | Tempo | Ethereum / EVM L2 |
|---------|-------|-------------------|
| **Passkey / Biometric Auth** | Protocol-native P-256 signatures | RIP-7212 + smart contract wallet |
| **Batch Transactions** | Default for all accounts | EIP-7702 delegation or ERC-4337 |
| **Gas Sponsorship** | Built into transaction format | Paymaster contracts (ERC-4337) |
| **Session Keys** | Native field in transaction | Smart account + modules |
| **Parallel Nonces** | 2D nonce system by default | ERC-4337 smart accounts only |
| **Infrastructure Overhead** | None (protocol-level) | Bundlers, paymasters, EntryPoint |
| **Sponsor Logic Flexibility** | Low (opinionated fields) | High (full contract logic) |
| **Setup Required** | Zero | Wallet deployment, module installation |

**Key Insight:** On Tempo, **Face ID = native chain address** with zero ceremony. On Ethereum/Base, **Face ID = smart contract wallet deployment + passkey binding**. The end result can look identical to users, but the developer implementation burden differs meaningfully.

The deeper lesson isn't "Tempo is better than Ethereum"—it's that Ethereum chose **maximally permissive base layer + application-layer standards**, while Tempo made the opposite bet: **opinionated, payment-optimized defaults baked into the protocol**.

## Production Considerations

### Security Requirements

**HTTPS Mandatory:** WebAuthn only works over HTTPS. The Tempo Wallet dialog requires secure origins for iframe embedding. Use `localhost` for local development (which is exempted from the HTTPS requirement).

**Challenge Management:** Every registration and login attempt must use a unique, server-generated random challenge (minimum 16 bytes, ideally 32 bytes). Challenges must be single-use and short-lived (expire within 5 minutes).

**Signature Verification:** Use established WebAuthn server libraries (SimpleWebAuthn, Duo, etc.) rather than implementing cryptographic verification manually.

### Sponsorship Best Practices

**Validation Rules:**
- Check gas limits (prevent excessive consumption)
- Validate call targets against whitelist
- Implement rate limiting per user
- Set transaction value limits
- Monitor sponsor account balance

**Cost Management:**
- Start with onboarding-only sponsorship (first N transactions)
- Graduate users to self-pay after onboarding
- Implement tiered sponsorship based on user value
- Monitor and alert on sponsorship burn rate

### Access Key Hygiene

**Limit Scope Aggressively:**
- Set shortest reasonable expiry times
- Use periodic limits for recurring operations
- Whitelist specific destination contracts
- Assign separate nonce keys per access key

**Rotation Strategy:**
- Rotate access keys before expiry
- Implement monitoring for suspicious activity
- Revoke keys immediately on compromise detection
- Maintain audit logs of key authorizations

## Conclusion

Tempo Accounts represents a fundamental rethinking of blockchain account architecture by integrating modern authentication standards and payment-optimized features directly into the protocol layer. Rather than bolting account abstraction onto an existing system through smart contracts and off-chain infrastructure (ERC-4337), Tempo baked the features users need—passkey support, batch transactions, fee sponsorship, and access key delegation—into a custom EIP-2718 transaction type.

The result is a developer experience comparable to traditional Web2 authentication paired with user experiences that rival centralized payment applications, all while maintaining the security guarantees and transaction finality of blockchain systems. The Accounts SDK provides a clean abstraction layer that shields developers from protocol complexity while remaining compatible with existing Ethereum tooling through standard EIP-1193 interfaces.

As the blockchain industry moves beyond seed phrases and toward mainstream adoption, Tempo Accounts demonstrates a viable path: **protocol-native features designed for payment use cases from day one**, rather than attempting to retrofit payment functionality onto general-purpose blockchains through increasingly complex application-layer abstractions.

## Resources

**Official Documentation:**
- Tempo Accounts SDK: https://docs.tempo.xyz/accounts
- Tempo Protocol: https://docs.tempo.xyz/protocol
- Tempo Transactions Spec: https://docs.tempo.xyz/protocol/transactions/spec-tempo-transaction
- Account Keychain Precompile: https://docs.tempo.xyz/protocol/precompiles/account-keychain

**GitHub Repositories:**
- Accounts SDK: https://github.com/tempoxyz/accounts
- Tempo Node: https://github.com/tempoxyz/tempo

**Technical Specifications:**
- TIP-1011 (Enhanced Access Keys): https://docs.tempo.xyz/protocol/tips/tip-1011
- TIP-1009 (Expiring Nonces): https://docs.tempo.xyz/protocol/tips/tip-1009
- EIP-2718 (Typed Transactions): https://eips.ethereum.org/EIPS/eip-2718

**Integration Guides:**
- Create & Use Accounts: https://docs.tempo.xyz/guide/use-accounts
- Fee Sponsorship Guide: https://docs.tempo.xyz/guide/payments/sponsor-user-fees
- Embed Tempo Wallet: https://docs.tempo.xyz/guide/use-accounts/embed-tempo-wallet
- Embed Passkey Accounts: https://docs.tempo.xyz/guide/use-accounts/embed-passkeys
