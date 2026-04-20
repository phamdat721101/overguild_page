# The rsETH Hack: A Comprehensive Analysis of the $292 Million Kelp DAO Exploit

## Executive Summary

On April 18, 2026, at 17:35 UTC, Kelp DAO suffered the largest decentralized finance (DeFi) exploit of 2026, resulting in the theft of approximately 116,500 rsETH tokens valued at $292 million. The attack exploited a critical vulnerability in Kelp DAO's LayerZero-powered cross-chain bridge by manipulating the messaging verification system through a compromised single-validator configuration. The stolen rsETH, representing roughly 18% of the token's total circulating supply, was subsequently deposited as collateral on Aave lending protocol to borrow real ETH, creating up to $200 million in bad debt across multiple DeFi platforms. The incident triggered emergency freezes across at least nine DeFi protocols and exposed fundamental security weaknesses in cross-chain bridge infrastructure and liquid restaking token composability.[^1][^2][^3][^4][^5][^6][^7][^8]

## Background: Kelp DAO and rsETH

### What is Kelp DAO?

Kelp DAO is a liquid restaking protocol built on Ethereum that enables users to maximize staking rewards while maintaining liquidity. The protocol integrates with EigenLayer, allowing users to deposit liquid staking tokens (LSTs) such as stETH from Lido, rETH from Rocket Pool, or cbETH from Coinbase, and receive rsETH in return. Prior to the exploit, Kelp DAO held over $1.3 billion in total value locked (TVL).[^9][^10][^11][^1]

### The rsETH Token Mechanism

rsETH is a liquid restaking token (LRT) that represents restaked positions on EigenLayer. When users deposit their LSTs into Kelp DAO, they receive rsETH tokens that:[^10][^1]

- Continue earning original staking rewards from the underlying LSTs
- Earn additional rewards from EigenLayer's Actively Validated Services (AVS)
- Earn Kelp Miles points for protocol participation
- Maintain liquidity and can be used as collateral across DeFi platforms[^11][^10]

The token operated across more than 20 blockchain networks, including Ethereum mainnet, Arbitrum, Base, Linea, Scroll, Blast, and Mantle, through a LayerZero-powered Omnichain Fungible Token (OFT) bridge. This cross-chain functionality allowed rsETH to serve as widely accepted collateral on lending platforms, particularly on Aave V3 and V4 deployments.[^2][^6][^8][^1]

## The Attack: Timeline and Technical Execution

### Pre-Attack Preparation

The attacker demonstrated sophisticated operational security by funding their wallet approximately 10 hours before the exploit through Tornado Cash's 1 ETH pool, a cryptocurrency mixer commonly used to obscure transaction origins. This initial funding provided the gas money necessary to execute the attack while masking the attacker's identity.[^12][^13][^6]

### The Exploit Mechanism (17:35 UTC)

At 17:35 UTC on April 18, 2026, the attacker executed the primary exploit through a single transaction targeting LayerZero's EndpointV2 contract at address `0x1a44076050125825900e736c501f859c50fE728c`. The attack involved calling the `lzReceive` function with a forged cross-chain message packet that falsely claimed to originate from Endpoint ID (EID) `30320`.[^4][^5]

The forged message passed LayerZero's validation checks because Kelp DAO's rsETH OFT adapter was configured with a critically weak security setup: a 1-of-1 Decentralized Verifier Network (DVN) configuration operated solely by LayerZero Labs. This meant that only a single forged signature from one entity was sufficient to make any cross-chain message appear legitimate.[^14][^5][^4]

The EndpointV2 contract, believing the message was valid, forwarded the payload to Kelp DAO's rsETH OFT adapter at address `0x85d456B2DfF1fd8245387C0BfB64Dfb700e98Ef3`. The adapter fully trusted the packet received from EndpointV2 and performed no additional verification, immediately releasing 116,500 rsETH tokens to the attacker-controlled address.[^5][^4]

### Technical Root Cause: Single Point of Failure

The core vulnerability stemmed from Kelp DAO's choice to configure their bridge with the weakest possible security setup: requiring only one validator (LayerZero Labs) to approve cross-chain messages. According to blockchain analysis, this configuration had been in place for at least 15 months, with LayerZero's own documentation recommending multi-DVN configurations (typically 2-of-3 or 3-of-5) for production deployments handling significant value.[^4][^5]

The attack worked through one of two possible vectors:

1. The single DVN's private key or signing infrastructure was compromised, allowing the attacker to generate legitimate signatures
2. A valid-looking packet was directly constructed to pass validation through vulnerabilities in the message verification logic[^4]

A properly configured multi-DVN security stack would have required the attacker to compromise multiple independent verifier networks simultaneously, making the attack exponentially more difficult.[^5]

### Emergency Response and Failed Follow-Up Attempts

Kelp DAO's emergency response team detected the suspicious activity and activated the protocol-wide pause at 18:21 UTC, approximately 46 minutes after the successful drain. The `pauseAll` function froze critical contracts including the LRT Deposit Pool, withdrawal module, oracle, and the rsETH token itself.[^13][^6][^12]

This rapid response prevented additional catastrophic losses. The attacker attempted two more exploits at 18:26 UTC and 18:28 UTC, each targeting 40,000 rsETH worth approximately $100 million. Both transactions reverted because the protocol's paused state blocked the bridge from releasing funds. Without the emergency pause, total losses could have reached $391 million.[^6][^12][^13]

At 20:10 UTC, approximately 2.5 hours after the initial drain, Kelp DAO published their first public statement on X (formerly Twitter), acknowledging the "suspicious cross-chain activity involving rsETH" and confirming collaboration with LayerZero, Unichain, auditors, and security experts on the root cause analysis.[^12][^6]

## The Downstream Impact: DeFi Contagion

### Converting Stolen rsETH to Liquid Assets

The attacker faced a critical challenge: rsETH had limited liquidity on decentralized exchanges, making it difficult to convert the stolen tokens directly to ETH or stablecoins without causing massive slippage. To solve this, the attacker exploited DeFi's composability by depositing the stolen rsETH as collateral on Aave V3 lending protocol and borrowing the more liquid Wrapped Ether (WETH).[^7][^6][^12]

Within the 46-minute window before Kelp paused the rsETH contracts, the attacker deposited stolen rsETH across Aave deployments on Ethereum and Arbitrum, then borrowed the maximum possible amount of real assets against this inflated collateral. On-chain data indicates the attacker consolidated approximately 74,000 ETH post-exploit, equivalent to over $236 million.[^1][^7][^12]

### Bad Debt Crisis on Aave

Once Kelp DAO paused rsETH contracts in response to the exploit, the collateral backing those borrow positions became worthless. The loans could no longer be liquidated through normal mechanisms because the rsETH collateral was now unbacked and essentially valueless. This left Aave holding bad debt estimated between $177 million and $200 million across its WETH reserves.[^15][^8][^7]

The crisis escalated rapidly:

- Aave's WETH pool hit 100% utilization as depositors rushed to withdraw funds
- Total Value Locked (TVL) on Aave dropped 24.11% amid the liquidity crunch, falling by over $5.4 billion
- The AAVE governance token declined 17.9% on April 19 as market panic spread[^16][^8]

Aave founder Stani Kulechov confirmed that Aave's own smart contracts were not exploited and emphasized the vulnerability originated from rsETH, not Aave's protocol. Within minutes of the detection, Aave's multisig guardians froze all rsETH markets on both Aave V3 and V4, halting new deposits and borrowing against the asset. The protocol set rsETH's loan-to-value ratios to zero to prevent further exposure.[^8][^2][^1]

Aave indicated it would tap its Umbrella backstop mechanism and protocol reserves to offset the deficit, with the mechanism designed to protect depositors in bad debt scenarios.[^15][^1]

### Cascading Protocol Freezes

The impact extended far beyond Aave, creating what analysts described as "cross-protocol contagion". At least nine DeFi protocols were forced to take emergency actions:[^17]

- **SparkLend**: Froze rsETH markets to prevent additional exposure
- **Fluid**: Implemented emergency pause on rsETH-related contracts  
- **Upshift**: Suspended rsETH operations pending investigation
- **Compound V3**: Monitored for potential bad debt exposure from rsETH positions
- **Euler**: Assessed rsETH collateral positions for risk exposure[^18][^19][^7]

Lido Finance paused new deposits into earnETH, their rsETH-exposed product, while emphasizing that core stETH, wstETH, and Lido staking contracts remained unaffected. Ethena Protocol paused its LayerZero OFT bridges out of Ethereum as a precautionary measure, despite having no direct rsETH exposure and maintaining over 101% collateralization.[^20]

### Fund Obfuscation and Dispersion

Following the borrow operations on Aave, the attacker routed funds through Tornado Cash to further obscure the trail. The stolen assets were fragmented and moved across approximately 20 different blockchain networks—a deliberate strategy designed to slow freezing efforts and complicate consolidation by law enforcement and recovery teams.[^21][^22][^19][^1]

Blockchain investigator ZachXBT identified six related attacker addresses and was among the first to flag the incident, estimating losses exceeding $280 million across Ethereum and Arbitrum within an hour of the initial drain.[^23][^6][^12]

## Historical Context: Bridge Exploits in DeFi

### 2026 DeFi Security Landscape

The Kelp DAO exploit became the largest single DeFi hack of 2026, surpassing the $280 million Drift Protocol breach from earlier in the year. By late March 2026, DeFi protocols had already lost over $137 million across 15 separate incidents, with only $9 million recovered. Major victims included Step Finance ($27.3 million via compromised private key), Truebit ($26.2 million from smart contract bug), and Resolv ($25 million through minting vulnerability).[^24][^22][^25][^2]

### Pattern of Bridge Vulnerabilities

Cross-chain bridges have historically been the most exploited component in DeFi infrastructure. Notable bridge exploits prior to the rsETH incident include:[^1]

| Exploit | Date | Amount Lost | Attack Vector |
|---------|------|-------------|---------------|
| Ronin Bridge | March 2022 | $625 million | Validator key compromise[^1] |
| Wormhole | February 2022 | $320 million | Signature verification exploit[^1] |
| Nomad | August 2022 | $190 million | Initialization flaw allowing anyone to impersonate[^1] |
| Kelp DAO rsETH | April 2026 | $292 million | Single DVN configuration compromise[^1][^5] |

The rsETH exploit demonstrated a new dimension to the bridge vulnerability pattern. Rather than simply stealing existing tokens from a bridge, the attacker minted new rsETH tokens through the compromised messaging system and then used DeFi's own infrastructure—specifically lending protocols accepting rsETH as collateral—to extract real value. This combination of bridge vulnerability and lending market composability created a multiplied attack surface.[^1][^4]

## Security Analysis and Root Causes

### The Single-Validator Configuration Failure

The fundamental security failure was Kelp DAO's deployment of a 1-of-1 DVN configuration for their production bridge handling over $1 billion in TVL. LayerZero's architecture explicitly allows OApp (Omnichain App) developers to configure how many DVNs must attest to cross-chain messages before delivery.[^26][^27][^4][^1]

For Kelp's rsETH OFT, both sender-side and receiver-side configurations were identically weak:

- `requiredDVNs: [LayerZero Labs]`
- `requiredDVNCount: 1`  
- `optionalDVNs: []`
- `optionalDVNCount: 0`[^5]

This configuration meant LayerZero Labs operated the sole validator responsible for verifying all cross-chain rsETH transfers. One compromised node, one leaked private key, or one forged signature was sufficient to drain the entire bridge.[^14][^5]

Industry best practices for bridges handling significant value call for multi-DVN configurations such as 2-of-3 or 3-of-5, requiring consensus from multiple independent verifier networks before message delivery. A legitimate rsETH transaction had settled through this same weak 1-of-1 DVN setup just two days before the exploit, confirming this wasn't a dormant testnet artifact but the live production security configuration.[^4][^5]

### Delayed Configuration Updates

Analysis by security researchers revealed that Kelp DAO's weak DVN configuration had persisted for at least 15 months without changes. Despite having adequate time to upgrade to more secure multi-validator setups, Kelp's team apparently prioritized transaction speed and operational simplicity over robust security. This decision ultimately enabled the catastrophic exploit.[^4]

### Trust Assumptions and Verification Gaps

The attack succeeded because Kelp's OFTAdapter contract placed complete trust in messages received from LayerZero's EndpointV2, performing no additional verification. When EndpointV2 forwarded a packet after receiving what it believed was a valid DVN signature, the adapter immediately executed the token release without questioning the message's legitimacy.[^5][^4]

This trust model created a single point of failure: compromise the DVN or forge its signature, and the entire bridge security collapses. The attack didn't require exploiting any bug in LayerZero's protocol itself—the protocol operated exactly as designed. Rather, it exploited the weak configuration choices made by Kelp DAO when deploying their application on top of LayerZero's infrastructure.[^14][^5][^4]

### Composability Risk Amplification

The exploit highlighted how liquid restaking tokens amplify systemic risk through DeFi composability. LRTs exist specifically to be composable—they flow across chains and serve as collateral in lending markets. When attackers compromise an LRT's issuance mechanism (in this case, the cross-chain bridge), the damage cascades throughout every protocol that accepts that token as collateral.[^20][^1]

The attacker didn't need to steal existing tokens; they minted new ones through the compromised bridge and immediately used DeFi's interconnected lending infrastructure to extract genuine value before detection. This created a "cross-protocol contagion" where one protocol's security failure instantly becomes nine protocols' liquidity crisis.[^17][^1][^4]

## Industry Response and Ongoing Investigation

### LayerZero's Statement

LayerZero Labs issued a statement acknowledging awareness of the rsETH vulnerability and confirmed they had been actively working with Kelp DAO on handling and remediation since the incident occurred. LayerZero emphasized that "aside from the rsETH-related incident, other applications remain secure".[^28]

The company stated it was collaborating with blockchain security firm SEAL_Org and other investigators to determine the root cause, indicating they would release a complete post-incident analysis report in conjunction with Kelp DAO once all information was gathered.[^28]

### Recovery Efforts and Negotiation Attempts

Tron founder Justin Sun publicly offered a reward to the Kelp DAO attacker, posting on X: "How much do you want? Let's just talk," arguing it wasn't worth sacrificing both Aave and Kelp DAO. Sun contended the hacker couldn't realistically spend $300 million of stolen cryptocurrency anyway.[^29]

As of the latest reports, no confirmed recovery of the stolen funds has been announced. The attacker successfully fragmented and dispersed the stolen ETH across 20+ blockchain networks following conversion through Tornado Cash, significantly complicating recovery efforts.[^22][^19]

Investigations into the exact mechanism, potential fund recovery, and possible compromise vectors remain ongoing. Law enforcement engagement and potential legal actions have not been publicly confirmed.[^28][^1]

## Implications for DeFi Security

### Reassessment of LRT Collateral Standards

The breach has triggered industry-wide reassessment of how lending protocols evaluate liquid restaking token collateral. Aave and other platforms may implement tighter risk parameters for restaking tokens, including:[^1]

- Stricter onboarding requirements for new LRT collateral types
- Lower loan-to-value (LTV) ratios for cross-chain LRTs
- Enhanced due diligence on bridge security configurations
- Real-time monitoring of cross-chain message verification systems[^20][^1]

### Bridge Security Audit Scrutiny

Bridge security audits across the LRT ecosystem will likely face increased scrutiny following this incident. The exploit demonstrated that traditional smart contract audits focusing solely on code correctness are insufficient when the attack vector involves configuration choices and off-chain infrastructure compromise.[^1][^4]

Security auditors will need to expand their scope to include:

- DVN configuration analysis and validator distribution
- Cross-chain message verification mechanisms
- Private key management for bridge operators
- Threshold cryptography implementations
- Fallback and recovery procedures for compromised validators[^20][^5][^4]

### Regulatory and Governance Implications

The magnitude of the exploit and its cascading effects across multiple protocols may accelerate regulatory scrutiny of DeFi bridge security standards and liquid staking derivatives. The incident provides concrete evidence for regulators concerned about systemic risk in interconnected DeFi protocols.[^1]

DeFi protocols may face pressure to implement:

- Mandatory minimum security configurations for cross-chain bridges
- Regular third-party security assessments of bridge infrastructure
- Enhanced transparency around validator and DVN configurations
- Standardized incident response and communication protocols[^17][^20]

### Long-term Ecosystem Impact

This exploit could trigger broader industry shifts in how DeFi protocols approach cross-chain security. The incident demonstrated that even well-audited protocols with substantial TVL can harbor critical architectural vulnerabilities that remain dormant until exploited.[^4][^1]

The restaking sector, which has attracted billions in deposits over the past year through EigenLayer and liquid restaking tokens, faces a critical juncture. Trust in LRTs as safe collateral assets has been shaken, potentially slowing the rapid growth trajectory the sector experienced prior to April 2026.[^20][^1]

As one security researcher noted, "Cross-chain messaging has quietly become one of the most consequential surfaces in DeFi. As more LRTs and wrapped assets spread across L2s and alt-L1s, one bad bridge day eats a proportionally larger share of the ecosystem".[^20]

## Conclusion

The $292 million Kelp DAO rsETH exploit of April 2026 represents a watershed moment for DeFi security, exposing critical vulnerabilities in cross-chain bridge architecture and the systemic risks of liquid restaking token composability. The attack's success stemmed not from sophisticated zero-day exploits but from a fundamental configuration weakness: a single-validator setup that created an unacceptable single point of failure for a protocol managing over $1 billion in user funds.[^5][^4][^1]

The cascading impact across Aave, Compound, SparkLend, and at least six other protocols demonstrated how deeply interconnected modern DeFi has become, where one protocol's security failure instantly becomes multiple protocols' liquidity crisis. The incident created up to $200 million in bad debt, triggered protocol-wide freezes, and shook confidence in liquid restaking tokens as collateral assets.[^7][^8][^17]

Moving forward, the DeFi ecosystem must prioritize robust multi-validator configurations for cross-chain bridges, implement comprehensive security frameworks that extend beyond smart contract code audits to include operational configurations, and develop better circuit breakers to limit contagion when exploits occur. The Kelp DAO exploit serves as a stark reminder that in the pursuit of capital efficiency and composability, security fundamentals cannot be sacrificed—or the entire ecosystem pays the price.[^5][^4][^20]

---

## References

1. [KelpDAO rsETH Exploit Drains $280M From Aave Markets](https://ourcryptotalk.com/news/kelpdao-rseth-exploit-aave-280-million) - April 19, 2026 – Attackers exploited a vulnerability in KelpDAO 's rsETH cross-chain bridge on April...

2. [Major DeFi hack becomes the largest of 2026 yet - TheStreet Crypto](https://www.thestreet.com/crypto/markets/major-defi-hack-becomes-the-largest-of-2026-yet) - Kelp DAO lost $293 million in largest 2026 crypto exploit on April 19.

3. [Kelp DAO Exploited for $293M in Largest DeFi Hack of 2026](https://www.mexc.com/news/1037320) - Kelp's rsETH bridge drained of $293M as attacker converts stolen funds to ETH. Aave freezes markets,...

4. [The core of this Kelp exploit was that the attacker forged a | KuCoin](https://www.kucoin.com/news/insight/ETH/69e4c9249b8ebc0007ccb4f7) - Kelp's rsETH cross-chain functionality uses LayerZero V2's OFT (Omnichain Fungible Token) standard: ...

5. [The KelpDAO rsETH Exploit: $292M Minted From a 1-of-1 Bridge](https://defiprime.com/kelpdao-rseth-exploit) - A single-signer DVN on KelpDAO's LayerZero bridge let an attacker mint 116500 unbacked rsETH and wal...

6. [Tornado cash-funded wallet steals 116,500 rsETH from KelpDAO](https://cryptorank.io/news/feed/637d8-tornado-cash-wallet-116500-rseth-kelpdao) - Attacker funded a wallet via Tornado Cash (1 ETH pool), waited ~10 hours, then exploited KelpDAO's L...

7. [Kelp DAO hit by $292M bridge hack draining rsETH reserves, Aave ...](https://cryptonews.net/news/defi/32729015/) - Kelp DAO confirmed on X that it had activated emergency safeguards and immediately stopped rsETH dep...

8. [Aave Faces $200M Bad Debt and Liquidity Crisis After KelpDAO ...](https://www.kucoin.com/news/flash/aave-faces-200m-bad-debt-and-liquidity-crisis-after-kelpdao-rseth-exploit) - Aave WETH Pool Hits 100% Utilization After rsETH Exploit Leaves $200M in Bad Debt. Once KelpDAO paus...

9. [Kelp DAO | ShapeShift](https://shapeshift.com/protocols/kelp-dao) - Kelp DAO is a restaking protocol that enhances rewards on liquid staking tokens (LSTs) by enabling u...

10. [What is Kelp DAO? The Ultimate Guide to Liquid Restaking for ...](https://nansen.ai/post/what-is-kelp-dao) - Kelp DAO is a liquid restaking protocol built on Ethereum that allows users to maximize their stakin...

11. [What Is KernelDAO (KERNEL) Restaking Protocol for Earning ...](https://www.kucoin.com/learn/crypto/what-is-kerneldao-kernel-restaking-protocol-and-how-does-it-work) - Learn what KernelDAO (KERNEL) is and how you can earn rewards by restaking ETH, BTC, and BNB across ...

12. [Kelp DAO's rsETH bridge hit in $292M exploit - BingX](https://bingx.com/en/flash-news/post/kelp-dao-rseth-bridge-exploit-drains-rseth-worth-about-m-aave-freezes-rseth-markets) - A major DeFi security incident unfolded on April 19 (Beijing time) after Kelp DAO's rsETH bridge con...

13. [Kelp DAO's rsETH Bridge Hit by $292M Exploit in Suspected ...](https://www.mexc.co/news/1037315) - (187.117)

14. [The $290M rsETH bridge exploit appears to be the result of a ...](https://x.com/ChainLinkGod/status/2045646085688070405) - The $290M rsETH bridge exploit appears to be the result of a compromised 1-of-1 DVN configuration on...

15. [Aave WETH Suppliers Urged to Withdraw After KelpDAO rsETH ...](https://finance.yahoo.com/markets/crypto/articles/aave-weth-suppliers-urged-withdraw-194751997.html) - A KelpDAO rsETH exploit created bad debt in Aave's WETH pool. Suppliers are urged to withdraw before...

16. [#AAVE is down 17.9% today following bad debt triggered by the ...](https://www.facebook.com/coingecko/posts/aave-is-down-179-today-following-bad-debt-triggered-by-the-292m-rseth-exploit-on/1395368199302124/) - AAVE is down 17.9% today following bad debt triggered by the ~$292M rsETH exploit on Kelp DAO. View ...

17. [Kelp Restaking Hack Spreads Risk Across DeFi, $293M Drained](https://www.coti.news/news/kelp-restaking-hack-spreads-risk-across-defi-293m-drained) - The freeze follows an exploit of the Kelp DAO rsETH bridge. Freezing the rsETH markets prevents new ...

18. [$292M Kelp DAO Bridge Hack, Largest Crypto Exploit of 2026 An ...](https://www.facebook.com/AlphaIntelMedia/posts/breaking-292m-kelp-dao-bridge-hack-largest-crypto-exploit-of-2026an-attacker-exp/122160660320956785/) - The vulnerability consisted of a bug in Avalanche's PeerList package, which a malicious actor could ...

19. [Liquid restaking protocol Kelp DAO lost $292M after an attacker ...](https://x.com/tokenmetricsinc/status/2045608798854029566) - Liquid restaking protocol Kelp DAO lost $292M after an attacker tricked its cross-chain bridge into ...

20. [Incident Report: Kelp DAO rsETH Bridge Exploit - Credshields](https://discover.credshields.com/incident-report-kelp-dao-rseth-bridge-exploit/) - Technical analysis of the $292M Kelp DAO exploit: how the rsETH bridge was drained, the 46-minute pa...

21. [Kelp restaking platform exploited, $293M drained in attack - Binance](https://www.binance.com/en/square/post/313996155861250) - The attacker exploited the rsETH adapter bridge contract, the software code that manages Kelp's rsET...

22. [Ari Redbord's Post - LinkedIn](https://www.linkedin.com/posts/ari-redbord_yesterdays-kelp-dao-exploit-is-now-the-activity-7451696449018511360-M_p3) - Yesterdays Kelp DAO exploit is now the biggest DeFi hack of 2026, and it occurred less than three we...

23. [Kelp DAO Suffers $292 Million rsETH Exploit – Details | MEXC News](https://www.mexc.com/news/1038175) - (187.117)

24. [Kelp DAO Hit for $292M in 2026's Largest DeFi Exploit](https://dailycoinbrief.com/kelp-dao-hit-for-292m-in-2026s-largest-defi-exploit/) - Kelp DAO lost $292M in rsETH through a LayerZero bridge exploit, creating $280M in bad debt across A...

25. [DeFi Hacks Top $137M in Early 2026 as Security Failures Mount](https://cryptorank.io/news/feed/6ae58-defi-hacks-top-137m-in-early-2026-as-security-failures-mount) - MarketDeFiCrypto CrimeCrypto Hack. Mar, 24, 2026. < 1 min read. by Coin Edition. for CoinEdition ......

26. [LayerZero - arXiv](https://arxiv.org/html/2312.09118v2) - In this paper, we refer to the extrinsic security configuration as the Security Stack. Monolithic sh...

27. [Security Stack (DVNs) - LayerZero](https://docs.layerzero.network/v2/concepts/modular-security/security-stack-dvns) - This stack of multiple DVNs allows each application to configure a unique security threshold for eac...

28. [LayerZero: Currently working with KelpDAO to fix the rsETH ...](https://www.rootdata.com/news/613920) - LayerZero posted on platform X that it is aware of the rsETH vulnerability incident and has been act...

29. [Tron founder Justin Sun offers reward to $293M Kelp DAO hacker ...](https://www.facebook.com/100090623386147/posts/breaking-tron-founder-justin-sun-offers-reward-to-293m-kelp-dao-hackersun-posted/927907003573404/) - It seems victims of last summer's DAO hack have until April 15 to withdraw DAO-to-Ethereum Classic (...

