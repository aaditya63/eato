"use client";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
    const pathname = usePathname();
  return (
    <footer className={`${pathname.startsWith("/dashboard") ? "hidden" : "block"} py-16 bg-textxprimary`}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-bgxbase mb-4">Eato</h3>
            <p className="text-bgxbase mb-4">
              Fresh food delivered fast to your doorstep. Order from your favorite restaurants today.
            </p>
            <div className="flex gap-4">
              <motion.a
                whileHover={{ scale: 1.2 }}
                href="#"
                className="text-bgxbase hover:text-background transition-colors"
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2 }}
                href="#"
                className="text-bgxbase hover:text-background transition-colors"
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2 }}
                href="#"
                className="text-bgxbase hover:text-background transition-colors"
              >
                <Twitter size={20} />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-lg text-bgxbase font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-bgxbase hover:text-background transition-colors">Home</a></li>
              <li><a href="#features" className="text-bgxbase hover:text-background transition-colors">Features</a></li>
              <li><a href="#menu" className="text-bgxbase hover:text-background transition-colors">Menu</a></li>
              <li><a href="#contact" className="text-bgxbase hover:text-background transition-colors">Contact</a></li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg text-bgxbase font-bold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-bgxbase hover:text-background transition-colors">Help Center</a></li>
              <li><a href="#" className="text-bgxbase hover:text-background transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-bgxbase hover:text-background transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-bgxbase hover:text-background transition-colors">FAQ</a></li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-lg text-bgxbase font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-bgxbase">
                <MapPin size={20} className="mt-1 flex-shrink-0" />
                <span>ABC, 123, Mumbai, Maharashtra, India</span>
              </li>
              <li className="flex items-center gap-2 text-bgxbase">
                <Phone size={20} className="flex-shrink-0" />
                <span>+91 1234567890</span>
              </li>
              <li className="flex items-center gap-2 text-bgxbase">
                <Mail size={20} className="flex-shrink-0" />
                <span>aadityasah13@gmail.com</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-background/20 pt-8 text-center text-background/70"
        >
          <p>&copy; 2025 Eato. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
