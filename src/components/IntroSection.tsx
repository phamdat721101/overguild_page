import { motion } from "framer-motion";
import WaitlistForm from "./WaitlistForm";
import heroValley from "@/assets/hero-valley.png";

const IntroSection = () => {
  return (
    <section className="relative flex flex-col items-center justify-center py-14 md:py-20 overflow-hidden min-h-screen">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroValley})` }}
      />
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />

      <div className="relative z-10 container mx-auto px-6 flex flex-col items-start text-left max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-pixel text-secondary text-base mb-4 tracking-widest"
        >
          [ OPEN AGENT NETWORK ]
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4"
        >
          <span className="text-glow-cyan text-primary">OVERGUILD</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xl md:text-2xl font-semibold text-foreground mb-3 max-w-3xl"
        >
          Open AI agents for every builder.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg text-primary font-medium mb-6"
        >
          Build. Earn. Compound.
        </motion.p>

        {/* Email Subscribe Form — directly under tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full max-w-md"
        >
          <WaitlistForm />
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 w-full flex justify-center animate-float"
        >
          <a
            href="#journey"
            className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Scroll to explore"
          >
            <span className="font-pixel text-[8px] mb-3">SCROLL TO EXPLORE</span>
            <svg
              className="w-6 h-6 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default IntroSection;
