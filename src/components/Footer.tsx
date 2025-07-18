import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Heart } from "lucide-react";
import FooterBackground from "./FooterBackground";
import { useTheme } from "../contexts/ThemeContext";

const Footer: React.FC = () => {
  const { isDarkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`relative mt-20 min-h-[400px] ${
        isDarkMode
          ? "bg-gradient-to-t from-black via-gray-900 to-gray-800"
          : "bg-gradient-to-t from-white via-orange-50 to-orange-100"
      }`}
    >
      {/* Futuristic moonlit background */}
      <FooterBackground className="absolute inset-0" />

      {/* Content overlay */}
      <div className="relative z-10 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Contact Info */}
            <motion.div
              className="text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3
                className={`text-lg font-bold mb-4 ${
                  isDarkMode ? "text-orange-400" : "text-orange-700"
                }`}
              >
                Contact
              </h3>
              <div
                className={`space-y-2 ${
                  isDarkMode ? "text-orange-200" : "text-orange-700/80"
                }`}
              >
                <p>akshay@example.com</p>
                <p>+1 (555) 123-4567</p>
                <p>Available for opportunities</p>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3
                className={`text-lg font-bold mb-4 ${
                  isDarkMode ? "text-orange-400" : "text-orange-700"
                }`}
              >
                Connect
              </h3>
              <div className="flex justify-center space-x-4">
                {[
                  { icon: Github, href: "#", label: "GitHub" },
                  { icon: Linkedin, href: "#", label: "LinkedIn" },
                  { icon: Mail, href: "#", label: "Email" },
                ].map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    className={`p-3 border rounded-full transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gray-900/40 border-orange-400/30 text-orange-300 hover:text-orange-100 hover:bg-orange-900/40"
                        : "bg-orange-100 border-orange-400/30 text-orange-700 hover:text-orange-900 hover:bg-orange-200"
                    }`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={20} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quote */}
            <motion.div
              className="text-center md:text-right"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3
                className={`text-lg font-bold mb-4 ${
                  isDarkMode ? "text-orange-400" : "text-orange-700"
                }`}
              >
                Mission
              </h3>
              <p
                className={`italic ${
                  isDarkMode ? "text-orange-200" : "text-orange-700/80"
                }`}
              >
                "Exploring the infinite possibilities of code,
                <br />
                one stellar project at a time."
              </p>
            </motion.div>
          </div>

          {/* Copyright */}
          <motion.div
            className={`pt-8 border-t text-center ${
              isDarkMode ? "border-orange-400/20" : "border-orange-400/40"
            }`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p
              className={`flex items-center justify-center gap-2 ${
                isDarkMode ? "text-orange-300" : "text-orange-700"
              }`}
            >
              © {currentYear} Akshay. Made with{" "}
              <Heart size={16} className="text-orange-400 animate-pulse" /> and
              lots of coffee
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
