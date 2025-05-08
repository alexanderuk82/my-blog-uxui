import React from 'react';
import { ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="py-64 md:py-32 border-t border-keyline">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold">Let's talk</h3>
          <p className="mb-4">Have a project in mind? We'd love to hear about it.</p>
          <a 
            href="mailto:hello@uistore.design" 
            className="text-sm hover:underline"
          >
            hello@uistore.design
          </a>
          <a 
            href="tel:+1234567890" 
            className="text-sm hover:underline"
          >
            +1 (234) 567-890
          </a>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold">PAGES</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <a href="#products" className="hover:underline">Products</a>
              <a href="#blog" className="hover:underline">Blog</a>
              <a href="#about" className="hover:underline">About</a>
              <a href="#contact" className="hover:underline">Contact</a>
            </nav>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold">FOLLOW</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <a href="#twitter" className="hover:underline">Twitter</a>
              <a href="#instagram" className="hover:underline">Instagram</a>
              <a href="#dribbble" className="hover:underline">Dribbble</a>
              <a href="#github" className="hover:underline">GitHub</a>
            </nav>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold">Newsletter</h3>
          <p className="mb-4">Stay updated with our latest components and articles.</p>
          
          <div className="flex mt-2">
            <input 
              type="email" 
              placeholder="Your email" 
              className="flex-grow py-2 px-4 outline-none border border-r-0 border-black dark:border-white bg-transparent"
            />
            <button className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 flex items-center">
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-16 pt-8 border-t border-keyline text-sm flex flex-col sm:flex-row justify-between gap-4">
        <span>© 2024 UI Store. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#terms" className="hover:underline">Terms</a>
          <a href="#privacy" className="hover:underline">Privacy</a>
          <a href="#cookies" className="hover:underline">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;