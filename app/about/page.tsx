"use client"
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Heart, Users, Award } from "lucide-react";

const Page = () => {
  const values = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Fresh & Organic",
      description: "We source the finest organic ingredients from local farms, ensuring every meal is packed with nutrition and flavor."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Made with Love",
      description: "Our chefs pour their passion into every dish, creating culinary experiences that warm your heart and soul."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community First",
      description: "We believe in building strong relationships with our customers and supporting the local community."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Quality Assured",
      description: "Every meal meets our rigorous quality standards, from preparation to delivery at your doorstep."
    }
  ];

  return (
    <div className="min-h-screen">      
      {/* Hero Section */}
      <section className="bg-bgxsubtle pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--hero-gradient)] opacity-50" />
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              About Eato
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Bringing fresh, delicious, and nutritious meals to your doorstep since 2020. 
              We're passionate about food, health, and making your life easier.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 bg-bgxbase">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-foreground">
              Our Story
            </h2>
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                Eato was born from a simple idea: everyone deserves access to fresh, 
                healthy, and delicious food without the hassle of cooking or compromising on quality.
              </p>
              <p>
                What started as a small kitchen operation has grown into a beloved food delivery 
                service serving thousands of happy customers. Our commitment to quality, sustainability, 
                and customer satisfaction remains at the heart of everything we do.
              </p>
              <p>
                Today, we partner with local farmers and suppliers to bring you the freshest ingredients, 
                prepared by skilled chefs who treat every meal as a work of art. We're not just delivering 
                food – we're delivering joy, health, and convenience to your table.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-bgxsurface px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These core principles guide everything we do at Eato
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-[var(--card-shadow)] transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-bgxbase">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Our Mission
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              To revolutionize food delivery by combining the convenience of modern technology 
              with the timeless values of fresh ingredients, culinary excellence, and genuine care 
              for our customers' health and happiness.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Page;