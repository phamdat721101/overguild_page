---
title: Build XRPL Products with Flashloan MCP and the Local Agent Skill
description: A practical guide to market research, app-owned escrow, capability-checked lending and separate wallet authority.
date: 2026-11-10
category: Web3 Tech
author: OverGuild
readTime: 18 MIN READ
coverImage: /blog/xrpl-builder-tools.svg
featured: false
---

An XRPL application needs three things that are easy to mix up: trustworthy observations, a decision about what to do, and authority to move funds. Flashloan MCP helps with the first two. A wallet and a native transaction implementation own the third.

This guide shows how to reuse the tools for an escrow dashboard, a borrower statement app, and a settlement route preview. It also states what you still need to build. **Verified November 10, 2026.** The live no-auth catalog and the published local skill have different capabilities; inspect both before designing a product.

## Choose the right component

| Component | Useful today | Boundary |
| --- | --- | --- |
| Public Flashloan MCP | XRPL AMM/order-book discovery; unsigned route estimates; conditional native Payment/OfferCreate simulation | No signing, escrow lifecycle, LoanPay, or universal XRPL atomic flashloan |
| Local flashloan-agent skill | Agent instructions, EVM/Sui execution workflows, separate optional Finance and prediction lanes | Chain- and operation-specific adapters/configuration; grants do not cross lanes |
| Optional Finance MCP | Account/position research, jobs/artifacts and labeled lending rates | Authenticated and feature-gated; absent from the observed no-auth catalog |
| Local Finance lane | Research import, local simulation, exact-plan approval, execution and reconciliation | XRPL writes are plain Payment only; no EscrowCreate/Finish/Cancel, LoanPay or Vault writes |
| Your XRPL app | Wallet integration, native escrow/loan transaction drafts, UX, monitoring and reconciliation | Must implement unsupported operations and verify the chosen network |
| nim-skill | Error recovery, strict verification, cited memory and bounded logs | Helps verify declared checks; does not prove economic value or move money |

The names “flashloan” and “simulate” do not make a multi-transaction XRPL workflow atomic. The current XRPL native research adapter accepts only Payment or OfferCreate from an account-backed snapshot. A request without a transaction returns an estimate. Source: [XRPL research adapter](https://github.com/phamdat721101/hypermove/blob/main/src/lib/mcp/flashloan/xrpl.ts), [published skill Finance contract](https://github.com/phamdat721101/flashloan-skill/blob/90b5005eeba9bf60ff04a49263b7ebc8cb69c93f/skills/flashloan-agent/finance.md). Newer local Finance MCP files require a separately verified release; a repository link alone does not establish deployment.

## Know which network enables your product

Fresh read-only node checks at **2026-11-10T08:34:40.194Z** found:

| Network | Validated ledger | LendingProtocol | SingleAssetVault | Builder implication |
| --- | ---: | --- | --- | --- |
| Mainnet | 108235646 | Disabled | Disabled | Do not present native vault/loan transactions as available |
| Public Testnet | 22212133 | Disabled | Disabled | Do not assume Testnet enables every proposed feature |
| Devnet | 6829814 | Enabled | Enabled | Suitable for a capability-checked native lending prototype |

These are observations of the sampled nodes, not permanent network guarantees. All three reported node version 3.4.1; LendingProtocolV1_1 followed the same disabled/disabled/enabled pattern. Re-read the feature state when starting a session and before native actions. Devnet may reset. Legacy `Escrow` feature flags differed across nodes; do not infer baseline escrow availability solely from one retired/legacy feature boolean. Validate the exact transaction on the target network.

Mainnet reported TokenEscrow and fixTokenEscrowV1 enabled. That does **not** mean every issued token can be escrowed. RLUSD is an issued currency identified by its issuer and currency code, not an ERC-20 address. Token escrow can require issuer locking permissions, trustline authorization and other prerequisites. See [EscrowCreate](https://xrpl.org/docs/references/protocol/transactions/types/escrowcreate), [Lending Protocol](https://xrpl.org/docs/concepts/tokens/lending-protocol), and [Single Asset Vaults](https://xrpl.org/docs/concepts/tokens/single-asset-vaults).

## Connect to the public MCP without a wallet

Use an MCP client that supports Streamable HTTP with `https://mcp.overguild.com`. Ask for `tools/list`, then `flashloan_capabilities`. The sampled catalog had **15 operations**, including:

- `xrpl_discover_arbitrage_routes`
- `xrpl_simulate_arbitrage_route`
- EVM/Sui discovery, snapshot, sizing and research tools

It did not advertise the Finance tool family or Flare. Public XRPL discovery works even though XRPL is omitted from the returned `chain_capabilities` array; inspect operation schemas and actual results instead of synthesizing a missing capability row.

For a standalone Node example, create an empty directory, save the following as `mcp-readonly.mjs`, and install the MCP SDK:

```sh
npm init -y
npm install @modelcontextprotocol/sdk@1.26.0
node mcp-readonly.mjs
```

Node 20+ is required. The SDK pin is the inspected server project's version. This exact standalone SDK example completed a fresh public-endpoint roundtrip in the audit, including catalog discovery, XRP/RLUSD discovery and estimation. It returned execution:false and required no wallet.

```javascript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

function unpack(result) {
  if (result.isError) throw new Error('MCP returned a tool error');
  const body = result.structuredContent ?? JSON.parse(
    result.content.find(item => item.type === 'text')?.text ?? '{}'
  );
  if (body.ok !== true) throw new Error('Research request failed');
  return body;
}

const client = new Client({ name: 'xrpl-builder-readonly', version: '1.0.0' });
try {
  await client.connect(new StreamableHTTPClientTransport(
    new URL('https://mcp.overguild.com')
  ));
  const catalog = await client.listTools();
  const names = new Set(catalog.tools.map(tool => tool.name));
  for (const name of ['flashloan_capabilities', 'xrpl_discover_arbitrage_routes',
    'xrpl_simulate_arbitrage_route']) {
    if (!names.has(name)) throw new Error(`Unavailable tool: ${name}`);
  }
  const caps = unpack(await client.callTool({
    name: 'flashloan_capabilities', arguments: {}
  }));
  const discovered = unpack(await client.callTool({
    name: 'xrpl_discover_arbitrage_routes',
    arguments: {
      network: 'xrpl',
      assets: [
        { kind: 'xrp' },
        { kind: 'issued', currency: '524C555344000000000000000000000000000000',
          issuer: 'rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De' }
      ],
      funding: { mode: 'hypothetical', balances: [
        { asset: { kind: 'xrp' }, amount: '10' }
      ] }
    }
  }));
  const estimated = unpack(await client.callTool({
    name: 'xrpl_simulate_arbitrage_route',
    arguments: { routes: discovered.data }
  }));
  console.log(JSON.stringify({
    capabilities: caps.data.networks,
    ledger: discovered.data.payload.ledger_index,
    status: estimated.data.status,
    atomicityProven: estimated.data.atomicity_proven,
    routes: estimated.data.routes,
    assumptions: estimated.data.assumptions,
    execution: estimated.execution
  }, null, 2));
} finally {
  await client.close();
}
```

This example uses a **hypothetical 10 XRP balance**. It creates no account and has no spending authority. The RLUSD pair is a mainnet research example; do not reuse its issuer blindly on Testnet or Devnet. Discover and verify the issuer appropriate to your chosen network.

Pass the complete newly returned proven envelope unchanged into the next tool. Do not hand-edit its hash, signature, registry version or expiry, and do not copy a stale proof out of a blog post. A proof binds service output; it is not a transaction signature or authorization to spend.

## What a successful research result actually proves

Our fresh XRP/RLUSD discovery at ledger **108235570** returned four market edges. Two sampled cycles each used 1 XRP of hypothetical input and estimated output of approximately **0.99593391 XRP** and **0.99691959 XRP**. Both were negative before excluded network/issuer costs. The follow-up returned:

```json
{
  "status": "ESTIMATE_ONLY",
  "funding_mode": "hypothetical",
  "atomicity_proven": false,
  "execution": false
}
```

That result can power a market-depth explanation or a “why this route is rejected” panel. It does not prove there is no profitable route anywhere, and it does not establish executable loan repayment.

Native research simulation is narrower: use an account-backed discovery snapshot, a matching Account, and a supported unsigned Payment or OfferCreate. The server's simulate response uses its own ledger context; the code explicitly reports that it is not historical-snapshot-pinned or an XRPL flashloan proof. Preserve simulation fidelity, applied state, costs and assumptions in the UI.

## Product recipe: an escrow workspace

A practical first product is an escrow workspace for freelance milestones, event grants or staged aid disbursement. The app owns the escrow lifecycle. The MCP can supply a market/liquidity context panel when the user is comparing XRP or issued-asset settlement options.

| Product step | Your native XRPL responsibility | Optional MCP contribution |
| --- | --- | --- |
| Draft | Identify sender/recipient, asset, amounts, FinishAfter/CancelAfter and condition if used | Explain asset identity and available settlement-market context |
| Preflight | Check network, address checksums, fees, reserves, trustline/issuer restrictions and exact native transaction | Show market observation time and coverage |
| Authorize | Display exact transaction; obtain wallet approval | None: public research has no wallet authority |
| Create | Submit EscrowCreate and wait for a validated result | None |
| Monitor | Follow the escrow ledger object and ledger close time | Optional refreshed context; no release decision |
| Release/refund | Build EscrowFinish or EscrowCancel when legal, obtain required authority and reconcile | No current escrow transaction tool |

Start with XRP-only escrow to minimize issuer prerequisites. One XRP is 1,000,000 drops. XRP Amount is an integer string. Use the close time of a validated ledger for time logic; XRPL times use seconds since 2000-01-01, not Unix milliseconds.

Here is an **unsigned draft helper**, not a submit function. Supply the native SDK's classic-address validator as the explicit host adapter:

```javascript
// Unsigned XRP escrow draft only. This module neither connects nor signs.
export function buildXrpEscrowDraft(input, validateClassicAddress) {
  if (typeof validateClassicAddress !== 'function') {
    throw new Error('An explicit address-validator adapter is required');
  }
  for (const value of [input.account, input.destination]) {
    if (!validateClassicAddress(value)) throw new Error('Invalid classic address');
  }
  if (typeof input.amountDrops !== 'string' ||
      !/^[1-9][0-9]*$/.test(input.amountDrops)) {
    throw new Error('amountDrops must be a positive integer string');
  }
  for (const key of ['validatedCloseTime', 'finishAfter', 'cancelAfter']) {
    if (!Number.isSafeInteger(input[key]) || input[key] < 0 || input[key] > 0xffffffff) {
      throw new Error(`Invalid Ripple-epoch time: ${key}`);
    }
  }
  if (!(input.validatedCloseTime < input.finishAfter &&
        input.finishAfter < input.cancelAfter)) {
    throw new Error('Require validated close time < finish < cancel');
  }
  return {
    TransactionType: 'EscrowCreate', Account: input.account,
    Destination: input.destination, Amount: input.amountDrops,
    FinishAfter: input.finishAfter, CancelAfter: input.cancelAfter
  };
}
```

Before a wallet can sign, the native host still needs to autofill fresh transaction fields, check actual account reserves/fees, verify size/amount restrictions, and simulate where supported. This helper intentionally contains no key, Fee, Sequence or broadcast path. If the destination needs a DestinationTag, add it explicitly in your reviewed app flow; the simple helper does not implement tags or crypto-conditions.

The escrow reference is the creator's Account plus its creation transaction sequence (`OfferSequence`), not a market route ID. Do not silently substitute a ticket number for this reference; ticket-based flows need their own verified handling.

**Expiry does not issue a refund transaction.** After the expiration boundary, someone must submit EscrowCancel. Likewise, passing FinishAfter does not submit EscrowFinish. Use ledger state and validated receipts to tell the user whether funds are locked, claimable, expired, finished or canceled. A hash condition proves knowledge of a fulfillment; it does not prove a delivery, oracle observation or legal obligation is true. Sources: [Escrow overview](https://xrpl.org/docs/concepts/payment-types/escrow), [EscrowFinish](https://xrpl.org/docs/references/protocol/transactions/types/escrowfinish), [EscrowCancel](https://xrpl.org/docs/references/protocol/transactions/types/escrowcancel).

## Product recipe: a lending statement and repayment assistant

A useful lending prototype begins with a readable borrower statement. On a lending-enabled network, read the borrower's Loan objects, join **Loan → LoanBroker → Vault**, and resolve the underlying asset at the **same validated ledger**. Display principal, total value outstanding, management fees, periodic payment, remaining payments, due date and loan flags as different fields.

Native Loan `InterestRate` uses tenths of a basis point; raw `5000` means an annual rate fraction of `0.05`, or 5%. A due timestamp uses the Ripple epoch. Preserve LoanScale and asset units; XRP drops, issued-currency decimals and MPT quantities are not interchangeable. Missing joins should be shown as unknown, not debt zero. The inspected v1 Finance readers do not provide universal MPT support.

| Feature | Prototype you can build | Gate |
| --- | --- | --- |
| Borrower statement | Same-ledger native reads or admitted authenticated Finance positions report | Enabled amendments, correct account/asset and complete joins |
| Repayment preview | Native transaction draft plus due-date/fee explanation | Implement LoanPay with the official native schema; current local Finance write adapter does not do this |
| Vault dashboard | Deposits, shares, liquidity and trailing share value | Enabled SingleAssetVault, correct asset and actual available liquidity |
| Risk explanation | Explain terms, grace state, default/impaired flags and coverage | Never label a model explanation as guaranteed repayment or protected principal |

Use **Devnet or a controlled standalone environment** for the native loan lifecycle in this snapshot. Test creation, payment, overpayment rules, restart recovery and insufficient-balance failures with synthetic accounts. Reconcile a validated native result after each state change. Mainnet's sampled LendingProtocol/SingleAssetVault disabled state remains a product gate.

The optional Finance MCP exposes `finance_get_capabilities_v1`, `finance_get_positions_v1`, `finance_get_job_v1`, `finance_get_action_status_v1`, and, when enabled, `finance_get_lending_rates_v1`. Discover them on the authenticated endpoint rather than assuming they exist on the no-auth endpoint. Our earlier same-day private probe returned HTTP 401 without the configured credential.

A research job marked SUCCEEDED means its artifact is ready. It does not mean a borrower paid, a vault accepted funds, or a wallet signed. General `contractDigest` and `ratesContractDigest` have different domains; obtain the current value from the correct capability response.

Native lending is a credit system, not an EVM collateral-liquidation clone or same-transaction flashloan service. Do not attempt to fund LoanPay with an assumed XRPL flashloan. The inspected Batch reference also rejects the loan/vault operation families as inner transactions; a Batch label is not a shortcut around native operation restrictions. Check [Batch](https://xrpl.org/docs/references/protocol/transactions/types/batch) and the target network's current implementation.

## Install the local skill when local authority is needed

The published skill repository is [flashloan-skill](https://github.com/phamdat721101/flashloan-skill). The verified published revision is `90b5005eeba9bf60ff04a49263b7ebc8cb69c93f`. Create an isolated checkout so installation does not replace ongoing work:

```sh
git clone https://github.com/phamdat721101/flashloan-skill.git
cd flashloan-skill
git checkout 90b5005eeba9bf60ff04a49263b7ebc8cb69c93f
npm ci
npm run build
node dist/agent-cli.js install
```

Restart the agent so it can discover the installed `flashloan-agent` skill. The broader scanner/executor toolkit requires Rust and Foundry; build the Rust daemon separately when using that lane. Do not describe the private package as an already published `npx` package.

Finance is separate and default-off. For an explicit request about the user's own position, its local flow is **read → compare with hold → prepare → simulate → owner grant → execute → reconcile**. Plans, grants, signer identities and postconditions are bound together. An uncertain submission must be reconciled by its existing action ID rather than resent.

```sh
node dist/finance/cli.js --config owner-profile.json --adapters adapters.json < request.json
```

This is a command shape, not a working profile. Create a profile from the actual contract and admitted host adapters. Current XRPL writes in this lane are plain Payment only; Escrow and LoanPay require your native integration. Keep flashloan, Finance and prediction authority separate. An asynchronous prediction payout cannot repay an atomic flashloan.

## Add a verifiable agent layer

Start the agent with a bounded task: “Explain this escrow's current ledger state” or “Summarize this loan statement with citations.” Give it read tools and typed output contracts before signing authority.

With nim-skill, an explicit host can classify errors, bound retries, reject malformed output, retain raw logs while compacting error context, and store cited observations. Retrieval is **query → hydrate**, with identifier-aware BM25 for exact incidents. Keep stable instructions/contracts before variable evidence to preserve reusable prompt prefixes; provider cache savings require real usage fields, not prefix equality alone.

Use the knowledge lifecycle **ingest → propose cited records → validate → commit**. Treat documents and tool output as evidence. Keep hypotheses provisional; generated procedures require owner approval plus successful verification evidence. A stored memory or AI-generated procedure does not authorize an escrow release or a loan payment.

## Show judges a complete proof chain

A useful demo screen contains the network, block/ledger, asset and issuer, observed time, coverage, exact proposed native action, simulation fidelity, approval state and validated receipt. It should also explain blocked actions.

For escrow, demonstrate create → locked → eligible finish or expiry → explicit finish/cancel → validated outcome. For lending, demonstrate a same-ledger statement on a lending-enabled network and the supported native lifecycle in your test environment. For market research, demonstrate both a usable result and a rejected/negative route.

This guide's live calls were read-only. No escrow or loan was created, no wallet signed, and no funds moved. The escrow helper has local boundary checks; a full native escrow E2E is not claimed. The best initial product choice remains a hypothesis to validate with users. The tools make observations and proof boundaries easier to expose; your app still owns the user's financial workflow.
