import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Flame,
  Layers,
  Wrench,
  BookOpen,
  Bell,
  Mail,
  User,
  Shield,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Cpu
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  const { user, isAdmin, logout, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'blast-furnace', label: 'Blast Furnace' },
    { id: 'supporting-plants', label: 'Supporting Plants' },
    { id: 'applications', label: 'Our Applications' },
    { id: 'consulting', label: 'Technical Consulting' },
    { id: 'knowledge', label: 'Knowledge Center' },
    { id: 'news', label: 'News & Updates' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (id: string) => {
    onTabChange(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Top Industrial Bar */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 lg:px-8 py-1.5 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-orange-400 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            Industrial Blast Furnace & Metallurgical Technology Platform
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline">24/7 Plant Technical Helpline: +91 (0651) 240-8800</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('consulting')}
            className="text-slate-300 hover:text-orange-400 transition-colors font-medium"
          >
            Request Consultation
          </button>
          <span className="text-slate-700">·</span>
          <button
            onClick={() => handleNavClick('knowledge')}
            className="text-slate-300 hover:text-orange-400 transition-colors"
          >
            Engineering Reference
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <div className="relative w-11 h-11 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-2 flex items-center justify-center shadow-lg shadow-orange-950/20 group-hover:border-orange-500/60 transition-colors">
            <Flame className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform" />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-orange-600 rounded-full border-2 border-slate-950"></div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Ironmaking Technology</span>
              <span className="text-xs px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30 font-medium">
                & Digital Solutions
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block tracking-wide">
              Smarter Ironmaking Through Engineering & Digital Innovation
            </p>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-2 text-xs font-medium rounded-md transition-colors relative ${
                  isActive
                    ? 'text-orange-400 bg-slate-900/90'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-orange-500 rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action / Auth */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700/80 text-xs text-slate-200 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center text-white text-[10px] font-bold">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="font-medium text-slate-100 max-w-[120px] truncate">
                    {user.fullName}
                  </div>
                  <div className="text-[10px] text-orange-400 flex items-center gap-1">
                    {isAdmin ? <Shield className="w-2.5 h-2.5" /> : null}
                    {isAdmin ? 'Administrator' : 'Plant Member'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="font-semibold text-white">{user.fullName}</p>
                    <p className="text-slate-400 truncate">{user.email}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{user.companyName}</p>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        handleNavClick('admin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-800 text-orange-400 font-medium flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4 text-orange-500" />
                      Administrator Dashboard
                    </button>
                  )}

                  <button
                    onClick={() => {
                      handleNavClick('user-dashboard');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    My Account & Requests
                  </button>

                  <button
                    onClick={() => {
                      handleNavClick('consulting');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 text-slate-300 flex items-center gap-2"
                  >
                    <Wrench className="w-3.5 h-3.5 text-slate-400" />
                    New Consulting Request
                  </button>

                  <div className="border-t border-slate-800 my-1"></div>

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 text-red-400 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white rounded-lg shadow-md shadow-orange-950/30 transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>Portal Login</span>
            </button>
          )}

          {/* Quick Consultation CTA */}
          <button
            onClick={() => handleNavClick('consulting')}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
          >
            <span>Consulting Form</span>
          </button>
        </div>

        {/* Mobile menu hamburger */}
        <div className="flex xl:hidden items-center gap-2">
          {user ? (
            <button
              onClick={() => handleNavClick(isAdmin ? 'admin' : 'user-dashboard')}
              className="px-2.5 py-1 text-xs bg-slate-800 text-orange-400 border border-slate-700 rounded"
            >
              {isAdmin ? 'Admin' : 'Dashboard'}
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="px-2.5 py-1 text-xs bg-orange-600 text-white rounded font-medium"
            >
              Login
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg flex items-center justify-between ${
                currentTab === link.id
                  ? 'bg-orange-600/10 text-orange-400 border-l-2 border-orange-500'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{link.label}</span>
            </button>
          ))}

          <div className="pt-4 border-t border-slate-800 mt-2 space-y-2">
            {user ? (
              <>
                <div className="px-3 py-2 bg-slate-850 rounded-lg">
                  <p className="text-xs text-slate-400">Signed in as</p>
                  <p className="text-sm font-medium text-white">{user.fullName}</p>
                  <p className="text-xs text-orange-400">{user.email}</p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="w-full text-left px-3 py-2 text-sm text-orange-400 font-medium bg-orange-950/30 border border-orange-800/40 rounded-lg"
                  >
                    Administrator Dashboard
                  </button>
                )}
                <button
                  onClick={() => handleNavClick('user-dashboard')}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg"
                >
                  My Submissions & Requests
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-800 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="w-full py-2.5 text-sm font-semibold bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-center"
              >
                Sign In / Register Account
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
