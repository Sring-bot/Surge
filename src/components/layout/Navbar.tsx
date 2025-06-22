import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Zap, Menu, X, User, History, BarChart3, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gray-900/80 border-b border-gray-800 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center group">
              <Zap className="h-8 w-8 text-primary-500 transform group-hover:rotate-12 transition-transform duration-300" />
              <span className="ml-2 text-xl font-mono font-bold text-white group-hover:text-primary-400 transition-colors duration-300">SURGE</span>
            </Link>
          </motion.div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <motion.div whileHover={{ y: -2 }}>
                  <Link
                    to="/dashboard"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                  >
                    Dashboard
                  </Link>
                </motion.div>
                <motion.div whileHover={{ y: -2 }}>
                  <Link
                    to="/configure"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                  >
                    New Test
                  </Link>
                </motion.div>
                <motion.div whileHover={{ y: -2 }}>
                  <Link
                    to="/history"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                  >
                    History
                  </Link>
                </motion.div>
                <motion.div 
                  className="relative ml-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button 
                    onClick={handleLogout}
                    className="cyber-button"
                  >
                    Logout
                  </button>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div whileHover={{ y: -2 }}>
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/signup" className="cyber-button">
                    Sign Up
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <motion.button
              onClick={toggleMenu}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="block h-6 w-6" aria-hidden="true" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900 border-b border-gray-800">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-sm font-semibold text-gray-400">
                    Signed in as {user?.username}
                  </div>
                  <Link
                    to="/dashboard"
                    className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link
                    to="/configure"
                    className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    New Test
                  </Link>
                  <Link
                    to="/history"
                    className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <History className="mr-2 h-5 w-5" />
                    History
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium transition-all duration-300"
                  >
                    <User className="mr-2 h-5 w-5" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;