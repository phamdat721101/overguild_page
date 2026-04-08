---
title: Passkey Wallet Standards - Tempo, MoonPay OWS, and Chain Foundations
description: Tempo treats passkeys as first-class signing primitives while MoonPay OWS defines a multi-chain agent-oriented wallet standard. How they converge around WebAuthn/P-256.
date: 2026-04-08
category: Web3 Tech
author: Terminal_Admin
readTime: 12 MIN READ
coverImage: /blog/account.jpg
featured: true
---

Tempo is treating passkeys as a first-class signing primitive at the protocol and wallet layer, while MoonPay's Open Wallet Standard is defining a multi-chain, agent-oriented wallet standard that chain foundations (Ethereum, Solana, etc.) help shape; both are complementary but there is still no single, FIDO-style "passkey wallet standard" across chains. Instead, you see a convergence around: WebAuthn/P-256 signatures at the protocol or wallet layer, plus multi-chain, threshold-signature based standards for how wallets expose capabilities to apps and AI agents.

Below is a focused breakdown of Tempo and MoonPay OWS, and how chain foundations are engaging around passkeys and wallet standards.

---

## Tempo's passkey-first wallet model

Tempo is explicitly designing its protocol and wallet around passkeys as a core authentication and signing mechanism.

- **Protocol-level support for WebAuthn**: Tempo introduces a new EIP-2718 transaction type `0x76` ("Tempo Transactions") that supports multiple signature schemes, including secp256k1, P-256, and WebAuthn signatures. This means passkey-style signatures are not just an off-chain login trick; they are a first-class transaction authentication method at the chain level.

- **Tempo Wallet UX: "one passkey, infinite keys"**: Tempo Wallet is presented as "no private keys" from the user's perspective — a passkey secures the wallet, and from it you can derive session keys for tools like Foundry and agents ("one passkey, infinite session keys"), with revocation controls. This tightly couples WebAuthn auth with smart-wallet/session-key patterns.

- **Interoperability via key export**: Under the hood, Tempo Wallet is still backed by a standard Ethereum private key stored on the device; users can export that private key to move assets into wallets like MetaMask or hardware wallets, and both wallets can then sign with the same key. That's Tempo's way of aligning a passkey-centric UX with existing EVM wallet standards and ecosystem tools.

- **EVM compatibility & AA standards**: Tempo supports all standard Ethereum transaction types (legacy, EIP-2930, EIP-1559) plus EIP-7702 "set code" transactions, which are key to future account-abstraction-style workflows. This means passkey-secured accounts can still interoperate with EVM tooling and evolving AA standards.

- **Ecosystem integration (Privy + Tempo)**: Privy's 2026 docs show how to use passkeys with server wallets and explicitly mention using Tempo with Privy: developers convert WebAuthn P-256 keys to PEM and use them to authorize wallet operations through Privy's API. That's a concrete example of a passkey wallet (Tempo) aligning with a third-party wallet infra stack around a shared WebAuthn/P-256 primitive.

> Overall, Tempo is pushing toward a **passkey-native protocol + wallet combo**: WebAuthn signatures recognized at the protocol level, a wallet that hides raw keys behind passkeys and session keys, and escape hatches (key export) that keep compatibility with today's wallet standards.

---

## MoonPay's Open Wallet Standard (OWS)

MoonPay's Open Wallet Standard is less about passkeys per se and more about defining a **multi-chain, agent-friendly wallet standard**, but it sits in the same "wallet standardization" space.

- **Scope and goal**: OWS is an open-source standard that gives AI agents a secure, universal way to hold wallets and operate across multiple chains through one interface. It is intentionally multi-chain and agent-centric, targeting secure AI–blockchain integration rather than a single wallet app.

- **Multi-chain "every chain, one interface"**: A single seed phrase in OWS derives accounts across eight chain families (EVM, Solana, Bitcoin, Cosmos, Tron, TON, Spark, Filecoin, XRP Ledger), all accessible through one signing interface with CAIP-2 identifiers. That aligns more with **seed/HD-wallet standards** than with passkeys directly, but it defines how wallets are exposed to apps and agents in a chain-agnostic way.

- **Threshold signatures and agent security**: The standard relies heavily on threshold signature schemes (TSS), splitting signing authority across multiple parties, and allowing AI agents to request signatures through secure channels without ever accessing private keys. This is philosophically similar to passkey + MPC architectures: the agent or user authenticates, and a distributed signer produces chain-level signatures.

- **Industry consortium including chain foundations**: OWS was created over ~18 months with a consortium that includes the Ethereum Foundation and Solana Foundation (plus PayPal and others), who contributed domain expertise (smart-contract security, high-throughput environments, payment reliability). Multiple security firms (Trail of Bits, Quantstamp) audited the cryptographic design before launch.

> From a passkey perspective, OWS doesn't standardize WebAuthn flows itself, but it **defines the wallet/agent abstraction that a passkey-based wallet or agent could plug into**: passkeys (or other auth factors) can sit at the "user/agent authentication" layer, while OWS standardizes how that authenticated entity requests multi-chain signatures.

---

## How chain foundations are engaging with passkeys and wallet standards

Instead of a single cross-chain "passkey wallet standard," foundations and ecosystems are converging around a few building blocks:

### Ethereum ecosystem

- **Account abstraction as the base**: Ethereum's ERC-4337 and emerging EIP-7702 proposals define how smart wallets can be first-class accounts, which is the ideal substrate to plug passkey authentication into smart-wallets, as many AA explainers and industry posts highlight.

- **Participation in OWS**: The Ethereum Foundation's involvement in MoonPay's OWS consortium shows they are steering **multi-chain wallet standardization** at the agent and signing layer, not directly defining an Ethereum-only passkey standard.

- **Ecosystem wallets**: Coinbase launched a passkey-backed smart wallet on Ethereum in 2024, but independent analysis points out that initial configurations set `userVerification` to "preferred" rather than "required", underscoring that even large players are still iterating on best practices for passkey security in wallets.

### Solana ecosystem

- **Passkeys for Solana smart wallets**: Helius' "Solana Passkeys" work explains patterns for integrating passkeys and WebAuthn into Solana wallets and applications, again using smart-wallet abstractions rather than a formal standard.

- **OWS consortium role**: Solana Foundation contributed to OWS by optimizing for high-throughput conditions, ensuring the standard can support Solana's performance characteristics while remaining chain-agnostic.

### Stellar ecosystem

- **Stellar passkey smart wallets**: The Stellar Development Foundation has published materials and reference implementations for a passkey-based smart wallet on Soroban/Stellar, positioning passkeys as a default UX pattern for non-custodial wallets in their ecosystem.

- **Grants/hackathons**: Their hackathons and documentation encourage builders to use passkey-style authentication in Soroban smart wallets, which is effectively a **de-facto standard** for high-UX Stellar wallets even if it's not formalized as a protocol specification.

### Tempo and emerging chains

- **Protocol-level passkey support**: Tempo goes further than most by embedding WebAuthn and P-256 at the transaction type level (type `0x76`), aligning the chain itself with passkey-style signatures, while maintaining full EVM compatibility and support for EIP-7702.

- **Ecosystem primitives around passkeys**: Services like TempoID (".tempo" name service) explicitly advertise that no private keys are needed — Tempo Wallet's passkey auth handles everything, and agents or CLIs interact with on-chain name contracts via that passkey-backed wallet. That's close to a **chain-local passkey wallet standard**: names, wallets, and agents all pivot around the same passkey wallet primitive.

---

## How this compares and what "wallet standard" is emerging

Putting this together:

- **Passkeys as auth, not as the full standard**: Tempo, Stellar, Solana, Coinbase, Privy, etc. are aligning on WebAuthn/P-256 passkeys as the *authentication factor* that unlocks wallets or issues session keys, often in combination with MPC or smart-contract wallets.

- **Wallet standards at the account/agent layer**: MoonPay's OWS, AA standards (ERC-4337/EIP-7702), and Tempo's `0x76` transaction type are defining the **structure of wallets, transactions, and agent APIs** — multi-chain derivation, threshold signatures, how agents ask for signatures, and how smart accounts behave — rather than standardizing passkeys themselves.

- **Role of foundations**: Chain foundations are mainly (1) contributing to broad standards like OWS and AA, (2) publishing reference passkey-wallet implementations and hackathon tracks (Stellar, Solana, Ethereum-ecosystem wallets), and (3) nudging the ecosystem toward passkeys as a default UX, without yet issuing something on the level of a unified "Passkey Wallet Standard 1.0".

For a builder, the practical takeaway is:

- If you want **Tempo-style alignment**, design wallets that treat WebAuthn/P-256 signatures as first-class and interoperate with existing EVM standards (keys, EIP-4337/7702), possibly via Tempo or similar chains.

- If you want **MoonPay-style standardization**, design against OWS-type abstractions: seed/threshold-based, multi-chain wallets with agent-friendly APIs, where passkeys become the secure way for humans (or agent operators) to authenticate into those wallets rather than the on-chain key format itself.
