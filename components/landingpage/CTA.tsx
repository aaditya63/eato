"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-10 bg-bgxbase">
      <div className=" mx-auto px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-[#fefe8a] to-[#b3d193] rounded-3xl p-8 md:p-16 text-center shadow-card"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-5xl font-bold text-foreground mb-4"
          >
            Ready to Order?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto"
          >
            Order online today and enjoy upto 50% off your first meal. Fresh food, fast delivery — all from your browser.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8"
          >
            <Input 
              type="email" 
              placeholder="Enter your email"
              className="bg-background/80 border-border text-foreground"
            />
            <Button 
              size="lg"
              className="bg-btnxsecondary text-bgxbase hover:bg-btnxsecondary/90 cursor-pointer whitespace-nowrap"
            >
              Get Started
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 text-sm text-foreground/70"
          >
            <span>✓ No credit card required</span>
            <span>✓ 30% off first order</span>
            <span>✓ Free delivery on orders over ₹500</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
