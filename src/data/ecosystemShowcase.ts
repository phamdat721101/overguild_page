export type EvidenceMetric = {
  value: string;
  label: string;
  detail: string;
  sourceUrl: string;
  sourceLabel: string;
  asOf: string;
};

export type NetworkSpotlight = {
  name: string;
  eyebrow: string;
  headline: string;
  description: string;
  capabilities: string[];
  href: string;
  linkLabel: string;
};

export type CodeSnippet = {
  id: "n-payment";
  label: string;
  description: string;
  code: string;
};

export const ecosystemMetrics: EvidenceMetric[] = [
  {
    value: "128",
    label: "Weekly n-payment downloads",
    detail: "A public snapshot of package adoption, ready to refresh before every outreach campaign.",
    sourceUrl: "https://api.npmjs.org/downloads/point/last-week/n-payment",
    sourceLabel: "npm downloads API",
    asOf: "Aug 17–23, 2026",
  },
  {
    value: "27",
    label: "Chains in the n-payment SDK scope",
    detail: "A multi-chain payment surface for agent and application builders.",
    sourceUrl: "https://www.npmjs.com/package/n-payment",
    sourceLabel: "n-payment package",
    asOf: "Product documentation",
  },
  {
    value: "LIVE",
    label: "HyperMove public product",
    detail: "A public entry point for the agent-connectivity layer in the OverGuild portfolio.",
    sourceUrl: "https://www.hypermove.xyz/",
    sourceLabel: "HyperMove",
    asOf: "Public product link",
  },
  {
    value: "LIVE",
    label: "OpenX agent marketplace",
    detail: "A live public workspace for delegating work to AI agents in plain English.",
    sourceUrl: "https://openx.the-valley.xyz/",
    sourceLabel: "OpenX",
    asOf: "Public product link",
  },
];

export const networkSpotlights: NetworkSpotlight[] = [
  {
    name: "GOAT Network",
    eyebrow: "BITCOIN L2 PAYMENTS",
    headline: "Agent-ready settlement paths",
    description: "A portfolio spotlight for the payment experiments that connect autonomous agents to Bitcoin-aligned rails.",
    capabilities: ["x402 payment flows", "BTC and stablecoin settlement", "Builder integration path"],
    href: "https://www.goat.network/",
    linkLabel: "Explore GOAT Network",
  },
  {
    name: "XRPL",
    eyebrow: "INSTITUTIONAL SETTLEMENT",
    headline: "Stablecoin and delegated-key research",
    description: "Show how OverGuild’s agent-payment work maps to XRPL’s institutional settlement and developer ecosystem.",
    capabilities: ["RLUSD ecosystem", "Role-delegation research", "Agent payment standards"],
    href: "https://xrpl.org/",
    linkLabel: "Explore XRPL",
  },
  {
    name: "t54 Labs",
    eyebrow: "FACILITATOR INFRASTRUCTURE",
    headline: "Paid tools need trusted verification",
    description: "A concise entry point for the facilitator layer behind interoperable agentic payment experiences.",
    capabilities: ["x402 facilitator flows", "Payment verification", "Merchant-ready infrastructure"],
    href: "https://t54.ai/",
    linkLabel: "Explore t54 Labs",
  },
];

export const codeSnippets: CodeSnippet[] = [
  {
    id: "n-payment",
    label: "n-payment",
    description: "Start an agent-friendly paid request.",
    code: `import { fetchWithPayment } from "n-payment";

const response = await fetchWithPayment(
  "https://api.overguild.com/v1/alpha-signal",
  { method: "GET" }
);

const signal = await response.json();`,
  },
];

export const partnerLinks = [
  { name: "Rootstock", href: "https://rootstock.io", logo: "/partners/rootstock.svg" },
  { name: "Cardano Foundation", href: "https://cardanofoundation.org", logo: "/partners/cardano.svg" },
  { name: "Creditcoin", href: "https://creditcoin.org", logo: "/partners/creditcoin.svg" },
  { name: "Ripple / XRPL", href: "https://xrpl.org" },
  { name: "GOAT Network", href: "https://www.goat.network/" },
  { name: "t54 Labs", href: "https://t54.ai/" },
];
