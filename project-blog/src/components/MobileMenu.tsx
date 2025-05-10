import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';


interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, isAdmin = false }) => {
  const menuVariants = {
    closed: {
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    }
  };

  const linkVariants = {
    closed: { x: 50, opacity: 0 },
    open: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
      },
    }),
  };

  const menuItems = [
    { path: '/products', label: 'Products' },
    { path: '/blog', label: 'Blog' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
          
          {/* Menu */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed top-0 right-0 h-full w-[300px] bg-white dark:bg-gray-900 z-50 shadow-xl lg:hidden"
          >
            <div className="p-5">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              
              <nav className="mt-12">
                <ul className="space-y-4">
                  {menuItems.map((item, i) => (
                    <motion.li
                      key={item.path}
                      custom={i}
                      variants={linkVariants}
                      className="border-b border-gray-100 dark:border-gray-800"
                    >
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className="block py-3 text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                  
                  {isAdmin && (
                    <motion.li
                      custom={menuItems.length}
                      variants={linkVariants}
                      className="border-b border-gray-100 dark:border-gray-800"
                    >
                      <Link
                        to="/admin"
                        onClick={onClose}
                        className="flex items-center py-3 text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors"
                      >
                        <ShieldCheck className="mr-2 h-5 w-5 text-emerald-500" />
                        Admin Panel
                      </Link>
                    </motion.li>
                  )}
                </ul>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
