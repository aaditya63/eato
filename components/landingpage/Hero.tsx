"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
// import heroImage from "@/assets/hero-food.jpg";
import heroImage from "../../public/assets/hero-food.jpg";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-bgxsubtle flex items-center overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none"></div>

      <div className="mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-textxprimary leading-tight"
            >
              Fresh Food
              <span className="block text-textxsecondary">Delivered Fast</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-textxmuted"
            >
              Order from your favorite restaurants and get fresh, delicious meals delivered right to your doorstep in minutes.
            </motion.p>


            <motion.div
              style={{ pointerEvents: "auto" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pointer-events-auto"
            >
              
              <Button 
                size="lg" 
                className="bg-btnxprimary cursor-pointer text-bgxsubtle hover:bg-btnxprimary/90 text-lg px-8"
              >
                Order Now
              </Button>
              <Button 
                size="lg" 
                className="border-btnxprimary border cursor-pointer bg-bgxbase hover:bg-textxsecondary text-btnxprimary hover:text-primary-foreground text-lg px-8"
              >
                View Menu
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex gap-8 pt-4"
            >
              <div>
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Restaurants</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">10k+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">30min</div>
                <div className="text-sm text-muted-foreground">Avg Delivery</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <motion.div
              animate={{ 
                y: [0, -20, 0],
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative rounded-3xl overflow-hidden shadow-card"
            >
              <Image 
                src={heroImage} 
                alt="Fresh food delivery" 
                className="w-full h-auto object-cover"
              />
            </motion.div>
            
            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground px-6 py-4 rounded-2xl shadow-card"
            >
              <div className="text-2xl font-bold">30% OFF</div>
              <div className="text-sm">First Order</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
