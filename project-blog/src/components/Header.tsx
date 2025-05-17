import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import MobileMenu from './MobileMenu';
import { ShoppingCart, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Login from './auth/Login';
import SignUp from './auth/SignUp';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import Cart from './Cart';

interface HeaderProps {
}

const Header: React.FC<HeaderProps> = () => {
  // Eliminamos el estado isDarkMode ya que ahora lo maneja ThemeToggle
  const [currentTime, setCurrentTime] = useState('');
  const { currentUser, logOut } = useAuth();
  const { state, setCartOpen } = useCart();
  const cartItemCount = state.itemCount;
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userButtonRef = useRef<HTMLButtonElement>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  // Lista de correos electrónicos con acceso de administrador
  const adminEmails = ['alexanderburgosuk82@gmail.com']; // Añade aquí tu correo electrónico

  // Verificar si el usuario actual tiene acceso de administrador
  const isAdmin = currentUser ? adminEmails.includes(currentUser.email || '') : false;

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
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="flex items-center gap-1 text-primary hover:underline focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none p-1 rounded-sm" 
                    aria-label="Admin panel"
                  >
                    <ShieldCheck size={16} aria-hidden="true" />
                    <span>Admin</span>
                  </Link>
                )}
              </nav>

              {/* Mobile Menu */}
              <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
              />
              
              <div className="flex items-center gap-4 mt-4 md:-mt-4 lg:-mt-0" role="group" aria-label="User actions">
                <ThemeToggle />
                <button onClick={() => setCartOpen(true)} className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full" aria-label="Open cart">
                  <ShoppingCart size={20} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black dark:bg-white text-white dark:text-black text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </button>
                <div className="relative">
                  <button
                    ref={userButtonRef}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-2 rounded-full hover:bg-surface transition-colors relative focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
                    aria-label={currentUser ? `User menu: ${currentUser.email}` : 'Sign in menu'}
                    aria-expanded={showUserMenu}
                    aria-haspopup="menu"
                    data-testid="user-menu-button"
                  >
                    {currentUser ? (
                      <div className="w-10 h-10 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-sm font-medium" aria-hidden="true">
                        {currentUser.email?.[0].toUpperCase()}
                        {isAdmin && (
                          <span className="absolute -top-1 -right-1 text-xs bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center" title="Admin">
                            <ShieldCheck size={10} aria-hidden="true" />
                          </span>
                        )}
                      </div>
                    ) : (
                      <User aria-hidden="true" />
                    )}
                  </button>
                  
                  <UserMenu 
                    isOpen={showUserMenu}
                    onClose={() => setShowUserMenu(false)}
                    anchorRef={userButtonRef}
                    currentUser={currentUser}
                    onLoginClick={() => {
                      setShowLoginModal(true);
                      setShowUserMenu(false);
                    }}
                    onRegisterClick={() => {
                      setShowSignUpModal(true);
                      setShowUserMenu(false);
                    }}
                    onLogoutClick={() => {
                      logOut();
                      toast.success('Logged out successfully');
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            <MobileMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
              isAdmin={isAdmin}
            />
          </div>
        </div>
      </header>
      <Login 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onSignUpClick={() => {
          setShowLoginModal(false);
          setShowSignUpModal(true);
        }} 
      />
      <SignUp 
        isOpen={showSignUpModal} 
        onClose={() => setShowSignUpModal(false)} 
        onLoginClick={() => {
          setShowSignUpModal(false);
          setShowLoginModal(true);
        }} 
      />
      <Cart />
    </>
  );
};

export default Header;