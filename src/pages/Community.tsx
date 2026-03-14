import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import tractionEventImg from "@/assets/traction-event.jpg";
import tractionSandboxImg from "@/assets/traction-sandbox.jpg";

const CALENDLY_URL = "https://calendly.com/phamdat721101/30min";

const STATS = [
  { value: "200+", label: "Builders Onboarded" },
  { value: "1,000+", label: "Users Onboarded" },
  { value: "15+", label: "Events Hosted" },
  { value: "10+", label: "Workshops" },
];

const ACTIVITIES = [
  { index: "01", title: "University Outreach & Workshops", desc: "Intensive sessions introducing students to blockchain fundamentals." },
  { index: "02", title: "Community Engagement", desc: "Strong network of enthusiasts and mentors providing constant support." },
  { index: "03", title: "Intensive Builder Sessions", desc: "Small-group technical deep dives into smart contract development and infrastructure." },
  { index: "04", title: "Hackathons & Showcases", desc: "Platform for new builders to present projects on Cardano and other protocols." },
  { index: "05", title: "Expert Keynotes", desc: "Hosted industry leaders discussing GameFi, Micro-payments, and Private Auctions." },
];

const SANDBOX_ROWS = [
  { feature: "Resource Management", concept: "Understanding on-chain assets and scarcity" },
  { feature: "Warehouse & Inventory", concept: "Managing digital ownership and metadata" },
  { feature: "Mission System", concept: "Interacting with smart contract-based questing" },
  { feature: "Town Square Meetups", concept: "Participating in decentralized social governance" },
];

const VISION = [
  {
    audience: "FOR BUILDERS",
    colorClass: "text-glow-gold text-secondary",
    items: ["Enhanced grant programs", "Technical mentorship", "Streamlined SDKs for Web2 integration"],
  },
  {
    audience: "FOR USERS",
    colorClass: "text-glow-cyan text-primary",
    items: ["Simplified UX through gaming ecosystem", "Educational rewards"],
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const Community = () => {
  return (
    <div className="min-h-screen bg-background text-foreground scanlines">
      <Navbar />

      {/* Background grid */}
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />

      <main className="relative pt-24 pb-16">
        {/* 1. Hero */}
        <section className="container mx-auto px-6 py-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-pixel text-primary text-sm tracking-widest mb-4"
          >
            OVERGUILD · 2025 RECAP
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-glow-cyan text-primary mb-6"
          >
            Building the Web3 Frontier
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            OverGuild has spent 2025 empowering the community through education, hands-on workshops,
            and strategic partnerships. Our goal remains clear:{" "}
            <span className="text-secondary font-semibold">Respect Prestige through contribution.</span>
          </motion.p>
        </section>

        {/* 2. Stats bar */}
        <section className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                {...fadeUp}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-pixel p-6 text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-glow-cyan text-primary mb-2">
                  {stat.value}
                </div>
                <div className="font-pixel text-muted-foreground text-[10px] tracking-widest">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3. Photos */}
        <section className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { src: tractionEventImg, alt: "OverGuild community event" },
              { src: tractionSandboxImg, alt: "Builder's Sandbox screenshot" },
            ].map((img, index) => (
              <motion.div
                key={img.alt}
                {...fadeUp}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="card-pixel overflow-hidden relative"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full object-cover max-h-80"
                />
                {/* Scanline overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
                  }}
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. 2025 Activities */}
        <section className="container mx-auto px-6 py-12">
          <motion.p
            {...fadeUp}
            className="font-pixel text-primary text-sm tracking-widest mb-2 text-center"
          >
            HIGHLIGHTS
          </motion.p>
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-bold text-center mb-10"
          >
            2025 Key Activities
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACTIVITIES.map((activity, index) => (
              <motion.div
                key={activity.index}
                {...fadeUp}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-pixel p-6 flex gap-4"
              >
                <span className="font-pixel text-primary text-2xl shrink-0">{activity.index}</span>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{activity.title}</h3>
                  <p className="text-muted-foreground text-sm">{activity.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. Builder's Sandbox */}
        <section className="container mx-auto px-6 py-12">
          <motion.p
            {...fadeUp}
            className="font-pixel text-primary text-sm tracking-widest mb-2 text-center"
          >
            GAME INNOVATION
          </motion.p>
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-bold text-center mb-4"
          >
            The Builder's Sandbox
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-center max-w-xl mx-auto mb-8"
          >
            Our latest game update serves as an interactive onboarding tool where users learn Web3
            mechanics through play.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card-pixel overflow-hidden max-w-3xl mx-auto"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="font-pixel text-secondary text-xs tracking-widest text-left p-4">
                    GAME FEATURE
                  </th>
                  <th className="font-pixel text-secondary text-xs tracking-widest text-left p-4">
                    WEB3 CONCEPT
                  </th>
                </tr>
              </thead>
              <tbody>
                {SANDBOX_ROWS.map((row, index) => (
                  <tr
                    key={row.feature}
                    className={index < SANDBOX_ROWS.length - 1 ? "border-b border-border" : ""}
                  >
                    <td className="p-4 text-sm font-medium text-foreground">
                      <span className="text-primary mr-2">›</span>
                      {row.feature}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{row.concept}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </section>

        {/* 6. 2026 Vision */}
        <section className="container mx-auto px-6 py-12">
          <motion.p
            {...fadeUp}
            className="font-pixel text-primary text-sm tracking-widest mb-2 text-center"
          >
            LOOKING AHEAD
          </motion.p>
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-bold text-center mb-4"
          >
            2026 Vision: The Great Onboarding
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-center max-w-xl mx-auto mb-10"
          >
            In 2026, OverGuild is doubling down on its mission to bring both users and developers
            from Web2 to Web3.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {VISION.map((v, index) => (
              <motion.div
                key={v.audience}
                {...fadeUp}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="card-pixel p-8"
              >
                <h3 className={`font-pixel text-sm tracking-widest mb-6 ${v.colorClass}`}>
                  {v.audience}
                </h3>
                <ul className="space-y-3">
                  {v.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">›</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 7. CTA */}
        <section className="container mx-auto px-6 py-16 text-center">
          <motion.h2
            {...fadeUp}
            className="text-3xl font-bold mb-4"
          >
            Ready to Build the Future?
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground max-w-xl mx-auto mb-8"
          >
            Whether you are a Web2 developer looking for a new challenge or a user curious about
            digital sovereignty, 2026 is your year.
          </motion.p>
          <motion.a
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pixel inline-flex items-center gap-2"
          >
            Schedule a 1-on-1
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        </section>
      </main>

      <FooterSection />
    </div>
  );
};

export default Community;
