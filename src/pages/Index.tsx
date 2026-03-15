import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import IntroSection from "@/components/IntroSection";
import JourneySection from "@/components/JourneySection";
import JoinSection from "@/components/JoinSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden scanlines">
      <Navbar />
      <IntroSection />
      <JourneySection />

      {/* Partners Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-surface-dark/30 to-background" />
        <div className="absolute inset-0 bg-grid opacity-10" />

        <div className="relative z-10 container mx-auto">
          <motion.p
            className="font-pixel text-xs text-primary mb-2 tracking-widest"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          >
            ECOSYSTEM PARTNERS
          </motion.p>
          <motion.div
            className="w-16 h-px bg-primary/40 mx-auto mb-12"
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
          />

          <div className="flex flex-wrap justify-center items-stretch gap-6 md:gap-8">
            {[
              { name: "Rootstock", href: "https://rootstock.io", logo: "/partners/rootstock.svg" },
              { name: "Cardano Foundation", href: "https://cardanofoundation.org", logo: "/partners/cardano.svg" },
              { name: "Creditcoin", href: "https://creditcoin.org", logo: "/partners/creditcoin.svg" },
            ].map(({ name, href, logo }, i) => (
              <motion.a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="card-pixel group flex flex-col items-center justify-center gap-4 px-8 py-6 w-48 hover:border-primary/60 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <img
                  src={logo}
                  alt={name}
                  className="h-16 w-auto transition-all duration-300"
                  style={{ filter: "brightness(0) invert(1) opacity(0.7)" }}
                  onMouseEnter={e => (e.currentTarget.style.filter = "brightness(0) invert(1) drop-shadow(0 0 10px hsl(180 100% 50%))")}
                  onMouseLeave={e => (e.currentTarget.style.filter = "brightness(0) invert(1) opacity(0.7)")}
                />
                <span className="font-pixel text-[9px] text-primary/50 group-hover:text-primary/80 transition-colors duration-300 text-center leading-relaxed">
                  {name.toUpperCase()}
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <JoinSection />
      <FooterSection />
    </div>
  );
};

export default Index;
