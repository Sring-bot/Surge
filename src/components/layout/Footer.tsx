import { Zap, Github, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const socialLinks = [
    {
      href: "https://github.com/Sring-bot",
      icon: <Github className="h-5 w-5" />,
      label: "GitHub",
      rotate: 10
    },
    {
      href: "https://www.linkedin.com/in/srinivasan-r-2a49b5245/",
      icon: <Linkedin className="h-5 w-5" />,
      label: "LinkedIn",
      rotate: -10
    }
  ];

  return (
    <footer className="bg-gray-900/80 backdrop-blur-md border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          {/* Logo and Copyright */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Zap className="h-6 w-6 text-primary-500" />
            <span className="ml-2 text-lg font-mono font-bold text-white">SURGE</span>
            <span className="ml-2 text-sm text-gray-400">© {new Date().getFullYear()}</span>
          </motion.div>
          
          {/* Social Links */}
          <div className="flex mt-4 md:mt-0 space-x-6">
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="text-gray-400 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.2, rotate: link.rotate }}
                whileTap={{ scale: 0.9 }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.icon}
                <span className="sr-only">{link.label}</span>
              </motion.a>
            ))}
          </div>
        </div>
        
        {/* Description */}
        <div className="mt-4 pt-4 border-t border-gray-800 text-center md:text-left">
          <div className="text-sm text-gray-400">
            Surge is a high-performance load testing platform designed for developers.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;