import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { codeSnippets, ecosystemMetrics, networkSpotlights } from "@/data/ecosystemShowcase";

export const TractionSection = () => (
  <section id="traction" className="relative py-14 md:py-20 overflow-hidden">
    <div className="absolute inset-0 bg-grid opacity-10" />
    <div className="relative z-10 container mx-auto px-6">
      <SectionHeading eyebrow="ECOSYSTEM TELEMETRY" title="Proof before promises." description="Every number is a dated public evidence snapshot, not a live-dashboard guess." />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {ecosystemMetrics.map((metric, index) => (
          <motion.article key={metric.label} className="card-pixel glow-border p-6 flex flex-col" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
            <p className="font-pixel text-4xl text-primary text-glow-cyan mb-3">{metric.value}</p>
            <h3 className="text-lg font-bold mb-2">{metric.label}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">{metric.detail}</p>
            <a href={metric.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors">
              {metric.sourceLabel} <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <p className="font-pixel text-[10px] text-muted-foreground mt-3">AS OF {metric.asOf.toUpperCase()}</p>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export const NetworkShowcaseSection = () => (
  <section id="networks" className="relative py-14 md:py-20 overflow-hidden bg-surface-dark/30">
    <div className="absolute inset-0 bg-grid opacity-10" />
    <div className="relative z-10 container mx-auto px-6">
      <SectionHeading eyebrow="NETWORK PROOF" title="Built for the rails that matter." description="Clear entry points for the partners and protocols shaping agentic payments." />
      <div className="grid gap-6 lg:grid-cols-3">
        {networkSpotlights.map((network) => (
          <article key={network.name} className="card-pixel p-6 flex flex-col">
            <p className="font-pixel text-xs text-secondary tracking-widest mb-3">{network.eyebrow}</p>
            <h3 className="text-2xl font-bold text-primary mb-2">{network.name}</h3>
            <p className="font-semibold mb-3">{network.headline}</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">{network.description}</p>
            <ul className="space-y-2 mb-6 text-sm text-foreground">
              {network.capabilities.map((capability) => <li key={capability} className="flex gap-2"><span className="text-secondary">▸</span>{capability}</li>)}
            </ul>
            <a href={network.href} target="_blank" rel="noopener noreferrer" className="btn-pixel mt-auto px-4 py-3 text-sm gap-2">
              {network.linkLabel}<ExternalLink className="w-4 h-4" />
            </a>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export const CodeSandboxSection = () => {
  const [activeId, setActiveId] = useState(codeSnippets[0].id);
  const [copied, setCopied] = useState(false);
  const activeSnippet = codeSnippets.find((snippet) => snippet.id === activeId) ?? codeSnippets[0];

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(activeSnippet.code);
      setCopied(true);
      toast({ title: "Snippet copied", description: "Ready for your builder workspace." });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast({ title: "Copy unavailable", description: "Select the code and copy it manually.", variant: "destructive" });
    }
  };

  return (
    <section id="code-sandbox" className="relative py-14 md:py-20 overflow-hidden">
      <div className="relative z-10 container mx-auto px-6">
        <SectionHeading eyebrow="BUILDER QUICKSTART" title="From proof to first request." description="A verified n-payment sketch for builders who want a concise payment starting point." />
        <div className="card-pixel max-w-4xl mx-auto overflow-hidden">
          <div role="tablist" aria-label="Integration snippets" className="flex overflow-x-auto border-b border-border bg-surface-darker">
            {codeSnippets.map((snippet) => <button key={snippet.id} role="tab" aria-selected={activeId === snippet.id} aria-controls={`snippet-${snippet.id}`} onClick={() => setActiveId(snippet.id)} className={`font-pixel whitespace-nowrap px-5 py-4 text-sm transition-colors ${activeId === snippet.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary"}`}>{snippet.label}</button>)}
          </div>
          <div id={`snippet-${activeSnippet.id}`} role="tabpanel" className="p-5 md:p-7">
            <div className="flex items-start justify-between gap-4 mb-4"><p className="text-sm text-muted-foreground">{activeSnippet.description}</p><button onClick={copyCode} className="inline-flex shrink-0 items-center gap-2 text-sm text-primary hover:text-secondary" aria-label="Copy code snippet">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? "Copied" : "Copy"}</button></div>
            <pre className="overflow-x-auto whitespace-pre-wrap break-words bg-background border border-border p-4 text-sm leading-relaxed text-primary"><code>{activeSnippet.code}</code></pre>
          </div>
        </div>
      </div>
    </section>
  );
};

const SectionHeading = ({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) => (
  <div className="text-center max-w-2xl mx-auto mb-10">
    <p className="font-pixel text-primary text-sm mb-3 tracking-widest">[ {eyebrow} ]</p>
    <h2 className="text-3xl md:text-5xl font-bold mb-4">{title}</h2>
    <p className="text-muted-foreground text-base leading-relaxed">{description}</p>
  </div>
);
