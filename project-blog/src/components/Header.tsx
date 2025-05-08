import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MobileMenu from './MobileMenu';
import { Sun, Moon, ShoppingCart, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CartItem } from '../types';
import Login from './auth/Login';

interface HeaderProps {
  cartItems: CartItem[];
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItems, onCartClick }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const { currentUser, logOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        hour: '2-digit', 
        minute: '2-digit', 
        timeZoneName: 'short' 
      };
      setCurrentTime(now.toLocaleTimeString(undefined, options));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="border-b border-keyline py-8" role="banner">
        <div className="container mx-auto ">
          <div className="flex flex-col md:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center justify-between w-full lg:w-auto">
                <Link to="/" className="lg:hidden bg-black text-white dark:bg-white dark:text-black px-4 py-1.5 rounded-full font-bold hover:opacity-90 transition-opacity" aria-label="UI HUB - Inicio">
                  UI HUB
                </Link>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                  aria-label="Open mobile menu"
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
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>

              {/* Desktop Menu */}
              <div className="hidden lg:flex items-center space-x-8">
                <a href="/" className="bg-black text-white dark:bg-white dark:text-black px-4 py-1.5 rounded-full font-bold hover:opacity-90 transition-opacity" aria-label="UI HUB - Inicio">
                  UI HUB
                </a>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4 text-xs">
                <span className="uppercase tracking-wide">{currentTime}</span>
                <span className="uppercase tracking-wide hidden sm:inline">|</span>
                <span className="uppercase tracking-wide">123 Design St, San Francisco, CA</span>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 md:items-center w-full md:w-auto mt-1 lg:mt-0">
              <nav className="hidden lg:inline-flex justify-between gap-20 text-sm font-medium" role="navigation" aria-label="Main navigation">
                <Link to="/products" className="hover:underline focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none p-1 rounded-sm" aria-label="View products">Products</Link>
                <Link to="/blog" className="hover:underline focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none p-1 rounded-sm" aria-label="Read blog">Blog</Link>
                <Link to="/about" className="hover:underline focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none p-1 rounded-sm" aria-label="About us">About</Link>
                <Link to="/contact" className="hover:underline focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none p-1 rounded-sm" aria-label="Contact us">Contact</Link>
              </nav>

              {/* Mobile Menu */}
              <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
              />
              
              <div className="flex items-center gap-4 mt-4 md:mt-0" role="group" aria-label="User actions">
                <button 
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full hover:bg-surface transition-colors focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
                  aria-label={isDarkMode ? 'Enable light mode' : 'Enable dark mode'}
                  aria-pressed={isDarkMode}
                >
                  {isDarkMode ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
                </button>
                <button
                  onClick={onCartClick}
                  className="p-2 rounded-full hover:bg-surface transition-colors relative focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
                  aria-label={`Shopping cart${cartItemCount > 0 ? `, ${cartItemCount} ${cartItemCount === 1 ? 'item' : 'items'}` : ''}`}
                  aria-haspopup="dialog"
                >
                  <ShoppingCart size={18} aria-hidden="true" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white dark:bg-white dark:text-black text-xs rounded-full w-4 h-4 flex items-center justify-center" aria-hidden="true">
                      {cartItemCount}
                    </span>
                  )}
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-2 rounded-full hover:bg-surface transition-colors relative focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
                    aria-label={currentUser ? `User menu: ${currentUser.email}` : 'Sign in menu'}
                    aria-expanded={showUserMenu}
                    aria-haspopup="menu"
                    data-testid="user-menu-button"
                  >
                    {currentUser ? (
                      <div className="w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-sm font-medium" aria-hidden="true">
                        {currentUser.email?.[0].toUpperCase()}
                      </div>
                    ) : (
                      <User size={18} aria-hidden="true" />
                    )}
                  </button>
                  {showUserMenu && (
                    <div 
                      className="absolute left-1/2 -translate-x-1/2 mt-2 w-[280px] bg-white dark:bg-black rounded-lg shadow-lg py-2 border border-keyline z-50" 
                      role="menu" 
                      aria-orientation="vertical"
                      aria-label="User menu"
                      data-testid="user-menu-dropdown"
                    >
                      {currentUser ? (
                        <>
                          <div className="px-4 py-2 text-sm border-b border-keyline">
                            {currentUser.email}
                          </div>
                          <button
                            onClick={logOut}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-surface focus:bg-surface focus:outline-none transition-colors flex items-center gap-2"
                            role="menuitem"
                          >
                            <LogOut size={16} aria-hidden="true" />
                            <span>Sign Out</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setShowLoginModal(true);
                              setShowUserMenu(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-surface focus:bg-surface focus:outline-none transition-colors"
                            role="menuitem"
                          >
                            <span>Sign In</span>
                          </button>
                          <button
                            onClick={() => {
                              // TODO: Implement registration
                              setShowUserMenu(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-surface focus:bg-surface focus:outline-none transition-colors"
                            role="menuitem"
                          >
                            <span>Register</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            <MobileMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      </header>
      <Login isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
};

export default Header;