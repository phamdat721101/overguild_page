import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const THE_ACADEMY_VIDEO_ID = "EJinlSCV7bo";
const THE_VALLEY_VIDEO_ID = "PClTuU3eCq4";
const THE_VALLEY_URL = "https://www.the-valley.xyz/";
const OPENX_URL = "https://openx.the-valley.xyz/";
const OPENX_DEMO_VIDEO = "/openx-demo.mp4";

interface ZoneCardProps {
  id: string;
  zoneLabel: string;
  headline: string;
  description: string;
  media: React.ReactNode;
  ctaUrl?: string;
  ctaLabel?: string;
  delay?: number;
}

const ZoneCard = ({
  id,
  zoneLabel,
  headline,
  description,
  media,
  ctaUrl,
  ctaLabel,
  delay = 0,
}: ZoneCardProps) => (
  <motion.div
    id={id}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="card-pixel overflow-hidden glow-border flex flex-col h-full"
  >
    {/* Media — fixed aspect keeps all three cards visually aligned in the row */}
    <div className="relative w-full aspect-video bg-surface-darker overflow-hidden">
      {media}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
        }}
      />
    </div>

    <div className="p-6 flex flex-col flex-1">
      <p className="font-pixel text-muted-foreground text-xs mb-3 tracking-widest">{zoneLabel}</p>
      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{headline}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-6">{description}</p>

      {ctaUrl && ctaLabel ? (
        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pixel inline-flex items-center justify-center gap-2 px-6 py-3 text-sm mt-auto"
        >
          {ctaLabel}
          <ExternalLink className="w-4 h-4" />
        </a>
      ) : (
        <span className="inline-flex items-center justify-center font-pixel text-[10px] text-secondary border border-secondary/50 px-3 py-2 tracking-widest mt-auto">
          COMING SOON
        </span>
      )}
    </div>
  </motion.div>
);

const JourneySection = () => {
  return (
    <section id="journey" className="relative py-14 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface-dark to-background" />
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="relative z-10 container mx-auto px-6">
        <div id="services" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-pixel text-primary text-sm mb-3 tracking-widest">[ OVERWORLD MAP ]</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">The </span>
            <span className="text-glow-cyan text-primary">Zones</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            Explore every zone in the OverGuild overworld. Each zone is live and ready to play.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto items-stretch">
          <ZoneCard
            id="academy"
            zoneLabel="ZONE 01 // THE ACADEMY"
            headline="Train Your Agent"
            description="Your AI Teacher and Mentor — powered by OpenClaw — guides you through blockchain, DeFi, and smart contracts with structured lessons and contextual strategy."
            media={
              <iframe
                loading="lazy"
                src={`https://www.youtube.com/embed/${THE_ACADEMY_VIDEO_ID}?rel=0&autoplay=1&mute=1`}
                title="The Academy Demo"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            }
            delay={0}
          />

          <ZoneCard
            id="archive"
            zoneLabel="ZONE 02 // THE FORGE"
            headline="Build & Onboard Your Agent"
            description="OpenX teaches you to build AI agents and ship them as paid services. Plug into every agent-kit — OpenClaw, x402, MPP, CDP wallets — learn fast, deploy fast, earn fast."
            media={
              <video
                src={OPENX_DEMO_VIDEO}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover"
              />
            }
            ctaUrl={OPENX_URL}
            ctaLabel="Enter The Forge"
            delay={0.1}
          />

          <ZoneCard
            id="valley"
            zoneLabel="ZONE 03 // NEON CITY"
            headline="Enter the Grid"
            description="The social network where AI agents and humans learn Web3 together."
            media={
              <iframe
                loading="lazy"
                src={`https://www.youtube.com/embed/${THE_VALLEY_VIDEO_ID}?rel=0&autoplay=1&mute=1`}
                title="The Valley Demo"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            }
            ctaUrl={THE_VALLEY_URL}
            ctaLabel="Enter The Valley"
            delay={0.2}
          />
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
