
import React from 'react';
import { Page } from '../types';
import { SunIcon } from '../constants';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NavLink: React.FC<{
    page: Page;
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    children: React.ReactNode;
}> = ({ page, currentPage, setCurrentPage, children }) => {
    const isActive = currentPage === page;
    return (
        <button
            onClick={() => setCurrentPage(page)}
            className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                isActive ? 'text-white font-bold' : 'text-gray-400 hover:text-white'
            }`}
        >
            {children}
            {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"></span>
            )}
        </button>
    );
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('contact-us-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A102A]/80 backdrop-blur-md shadow-lg animate-slide-in-down">
      {/* Gradient progress bar */}
      <div className="h-1 bg-gradient-to-r from-cyan-400 to-purple-500"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentPage(Page.HOME)}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">FF</span>
            </div>
            <div>
                <h1 className="text-lg font-bold text-white tracking-wider">
                    FourFrontIT
                </h1>
                <p className="text-xs text-gray-400 -mt-1">Managed IT + AI Ops</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-4">
            <NavLink page={Page.HOME} currentPage={currentPage} setCurrentPage={setCurrentPage}>Home</NavLink>
            <NavLink page={Page.SERVICES} currentPage={currentPage} setCurrentPage={setCurrentPage}>Our Services</NavLink>
            <NavLink page={Page.ASSISTANT} currentPage={currentPage} setCurrentPage={setCurrentPage}>Live Assistant</NavLink>
            <NavLink page={Page.TOOLS} currentPage={currentPage} setCurrentPage={setCurrentPage}>Business Tools</NavLink>
            <button
              onClick={handleContactClick}
              className="relative px-3 py-2 text-sm font-medium transition-colors duration-300 text-gray-400 hover:text-white"
            >
              Contact Us
            </button>
          </nav>
          
          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <a href="#" className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full hover:opacity-90 transition-opacity duration-300 transform hover:scale-105 shadow-lg">
                Client Portal
            </a>
            <button className="w-10 h-10 flex items-center justify-center bg-slate-800/60 rounded-lg hover:bg-slate-700 transition-colors">
                <SunIcon className="w-5 h-5 text-yellow-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;