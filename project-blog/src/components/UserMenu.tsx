import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LogOut } from 'lucide-react';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  currentUser: any | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({
  isOpen,
  onClose,
  anchorRef,
  currentUser,
  onLoginClick,
  onLogoutClick
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  
  // Calculate menu position based on anchor element
  useEffect(() => {
    if (isOpen && anchorRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const menuWidth = 280; // Width of the menu in pixels
      const viewportWidth = window.innerWidth;
      const isMobile = viewportWidth < 768; // Detectar si es dispositivo móvil
      
      // En dispositivos móviles, posicionar el menú de manera diferente
      if (isMobile) {
        // Posicionar el menú centrado horizontalmente en la pantalla
        const leftPosition = Math.max(10, (viewportWidth - menuWidth) / 2);
        
        // Posicionar verticalmente debajo del header
        const topPosition = anchorRect.bottom + window.scrollY + 10;
        
        setMenuPosition({
          top: topPosition,
          left: leftPosition
        });
      } else {
        // Comportamiento normal para desktop
        // Calculate vertical position
        const topPosition = anchorRect.bottom + window.scrollY;
        
        // Calculate horizontal position with boundary checks
        let leftPosition;
        
        // Check if menu would overflow right edge
        if (anchorRect.left + menuWidth > viewportWidth) {
          // Align to right edge of anchor with padding
          leftPosition = anchorRect.right - menuWidth;
        } 
        // Check if menu would overflow left edge
        else if (anchorRect.left < 0) {
          // Align to left edge of viewport with padding
          leftPosition = 10;
        } 
        // Default: center align with anchor
        else {
          // Center the menu on the anchor
          leftPosition = anchorRect.left + (anchorRect.width / 2) - (menuWidth / 2);
          
          // Make sure it doesn't go off screen
          if (leftPosition + menuWidth > viewportWidth) {
            leftPosition = viewportWidth - menuWidth - 10;
          }
          if (leftPosition < 10) {
            leftPosition = 10;
          }
        }
        
        // Update position
        setMenuPosition({
          top: topPosition,
          left: leftPosition
        });
      }
    }
  }, [isOpen, anchorRef]);
  
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, anchorRef]);
  
  // Close on escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);
  
  // Don't render anything if not open
  if (!isOpen) return null;
  
  // Create portal to render at document body level
  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-50 w-[280px] bg-white dark:bg-black rounded-lg shadow-lg py-2 border border-keyline transform-gpu"
      style={{
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`,
        maxWidth: 'calc(100vw - 20px)',
        maxHeight: 'calc(100vh - 100px)',
        overflowY: 'auto'
      }}
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
            onClick={onLogoutClick}
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
            onClick={onLoginClick}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-surface focus:bg-surface focus:outline-none transition-colors"
            role="menuitem"
          >
            <span>Sign In</span>
          </button>
          <button
            onClick={onClose}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-surface focus:bg-surface focus:outline-none transition-colors"
            role="menuitem"
          >
            <span>Register</span>
          </button>
        </>
      )}
    </div>,
    document.body
  );
};

export default UserMenu;
