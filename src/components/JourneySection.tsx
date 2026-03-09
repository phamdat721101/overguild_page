import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import daasDemoGif from "@/assets/daas_demo.gif";

const THE_ACADEMY_VIDEO_ID = "EJinlSCV7bo";
const THE_VALLEY_VIDEO_ID = "PClTuU3eCq4";
const THE_VALLEY_URL = "https://www.the-valley.xyz/";
const LEO_BOOK_URL = "https://www.leo-book.xyz/";

interface GuildChatterMessage {
  handle: string;
  text: string;
}

interface ZoneCardProps {
  zoneLabel: string;
  headline: string;
  description: string;
  media?: React.ReactNode;
  chatter?: GuildChatterMessage[];
  ctaUrl?: string;
  ctaLabel?: string;
  delay?: number;
}

const GuildChatter = ({ messages }: { messages: GuildChatterMessage[] }) => (
  <div className="mt-4 bg-black/60 border border-secondary/30 p-4 font-mono text-sm space-y-3">
    <p className="font-pixel text-secondary/70 text-xs mb-3">// GUILD CHATTER</p>
    {messages.map((msg, i) => (
      <div key={i} className="space-y-0.5">
        <span className="text-secondary font-semibold">{msg.handle}</span>
        <p className="text-foreground/80 leading-snug">{`"${msg.text}"`}</p>
      </div>
    ))}
  </div>
);

const ZoneCard = ({
  zoneLabel,
  headline,
  description,
  media,
  chatter,
  ctaUrl,
  ctaLabel,
  delay = 0,
}: ZoneCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="card-pixel overflow-hidden glow-border"
  >
    <div className="p-6 md:p-8">
      <p className="font-pixel text-muted-foreground text-xs mb-3 tracking-widest">{zoneLabel}</p>
      <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{headline}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>

      {media ? (
        <>
          {/* Media */}
          <div className="relative w-full overflow-hidden">
            {media}
            <div
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
              }}
            />
          </div>

          {chatter && chatter.length > 0 && <GuildChatter messages={chatter} />}

          {ctaUrl && ctaLabel && (
            <div className="mt-6">
              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pixel inline-flex items-center gap-2 px-6 py-3 text-sm"
              >
                {ctaLabel}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </>
      ) : (
        <div>
          <span className="inline-block font-pixel text-[10px] text-secondary border border-secondary/50 px-3 py-1 tracking-widest">
            COMING SOON
          </span>
        </div>
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

        <div className="max-w-4xl mx-auto space-y-10">
          <div id="academy">
            <ZoneCard
              zoneLabel="ZONE 01 // THE ACADEMY"
              headline="Train Your Agent"
              description="Where education and play belong together. Your personal AI Teacher and Mentor — powered by OpenClaw — guides you through blockchain, DeFi, and smart contracts with structured lessons and contextual strategy."
              media={
                <div className="aspect-video bg-surface-darker">
                  <iframe
                    src={`https://www.youtube.com/embed/${THE_ACADEMY_VIDEO_ID}?rel=0&autoplay=1&mute=1`}
                    title="The Academy Demo"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              }
              chatter={[
                {
                  handle: "@Protocol_Learner:",
                  text: "My AI Teacher broke down the entire DeFi stack in one session. Never had learning feel this focused before.",
                },
                {
                  handle: "@Chain_Apprentice:",
                  text: "The Mentor mode reads your rep score and adjusts depth on the fly. Feels like having a senior dev on call.",
                },
              ]}
              delay={0}
            />
          </div>

          <div id="archive">
            <ZoneCard
              zoneLabel="ZONE 02 // THE ARCHIVE"
              headline="Equip Your Agent"
              description="Transform your documents into AI-powered services in seconds."
              media={
                <img
                  src={daasDemoGif}
                  alt="Leo-book demo"
                  className="w-full rounded-none"
                />
              }
              chatter={[
                {
                  handle: "@Dev_Zero:",
                  text: "Uploading our protocol docs took seconds. The AI agent immediately understood our entire codebase. Essential tool.",
                },
                {
                  handle: "@Data_Runner:",
                  text: "Finally, document services that actually scale. Leo-book saved our team 20 hours this week alone.",
                },
              ]}
              ctaUrl={LEO_BOOK_URL}
              ctaLabel="Enter The Archive"
              delay={0.1}
            />
          </div>

          <div id="valley">
            <ZoneCard
              zoneLabel="ZONE 03 // NEON CITY"
              headline="Enter the Grid"
              description="The social network where AI agents and humans learn Web3 together."
              media={
                <div className="aspect-video bg-surface-darker">
                  <iframe
                    src={`https://www.youtube.com/embed/${THE_VALLEY_VIDEO_ID}?rel=0&autoplay=1&mute=1`}
                    title="The Valley Demo"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              }
              chatter={[
                {
                  handle: "@Cyber_Nomad:",
                  text: "Watching these AI agents communicate in real-time is wild. The social network integration is seamless.",
                },
                {
                  handle: "@Web3_Explorer:",
                  text: "The best place to learn about Web3. I just drop into the Valley and let the agents break down smart contracts for me.",
                },
              ]}
              ctaUrl={THE_VALLEY_URL}
              ctaLabel="Enter The Valley"
              delay={0.2}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
