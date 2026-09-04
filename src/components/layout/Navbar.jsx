import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import {
  User,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  logout,
} from '../../redux/slices/authSlice';
import { selectTheme, toggleTheme } from '../../redux/slices/uiSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const theme = useSelector(selectTheme);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active state: Primary red with red underline indicator bar
  // Inactive state: Golden yellow text
  const navLinkClass = ({ isActive }) =>
    `relative text-[18px] font-bold transition-all px-1 pb-1.5 ${
      isActive
        ? 'text-[#B90101] font-black after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#B90101] after:rounded-full'
        : 'text-[#EAB308] hover:text-[#B90101]'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-black/85 backdrop-blur-md border-b border-neutral-200/80 dark:border-white/10 shadow-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* 1. Left: FLIM ZONE Logo with Speed Lines */}
        <Link to="/" className="flex items-center gap-2 group shrink-0 select-none">
          <div className="flex flex-col">
            <div className="flex items-center font-black italic tracking-tighter text-2xl sm:text-3xl leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-neutral-300 via-neutral-500 to-neutral-700 dark:from-white dark:via-neutral-300 dark:to-neutral-500 drop-shadow-sm">
                FLIM
              </span>
              <span
                className="text-transparent bg-clip-text bg-gradient-to-b from-red-500 via-red-600 to-[#B90101] ml-1 drop-shadow-[0_0_8px_rgba(185,1,1,0.5)]"
              >
                ZONE
              </span>
            </div>
            {/* Speed underline effect matching logo */}
            <div className="flex items-center gap-0.5 mt-0.5">
              <span className="h-[2px] w-5 bg-gradient-to-r from-transparent to-[#B90101]" />
              <span className="h-[2px] w-9 bg-[#B90101]" />
              <span className="h-[2px] w-3 bg-[#B90101]" />
            </div>
          </div>
        </Link>

        {/* 2. Center: Navigation Links (Home, Promo, Stream, About) */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/promo" className={navLinkClass}>
            Promo
          </NavLink>
          <NavLink to="/stream" className={navLinkClass}>
            Stream
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
        </nav>

        {/* 3. Right: Action Buttons (Red Login Pill, Gold Bell, Sun/Moon) */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Red Login Pill Button */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#B90101] text-white font-bold text-[16px] shadow-md">
              <User className="w-4 h-4 fill-white" />
              <span className="max-w-[100px] truncate">{user.name}</span>
              <button
                onClick={() => dispatch(logout())}
                className="p-1 hover:text-neutral-200 transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="flex items-center gap-2 px-6 py-2 rounded-full text-white font-bold text-[16px] shadow-md hover:brightness-110 active:scale-95 transition"
              style={{ backgroundColor: '#B90101' }}
            >
              <User className="w-4 h-4 fill-white" />
              <span>Login</span>
            </button>
          )}

          {/* Gold Notification Bell Button (Circular Pill) */}
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-neutral-200/80 dark:bg-white/10 hover:bg-neutral-300 dark:hover:bg-white/20 flex items-center justify-center text-[#EAB308] hover:scale-105 active:scale-95 transition shadow-xs"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 fill-[#EAB308] text-[#EAB308]" />
          </button>

          {/* Theme Switcher Toggle Button (Circular Pill) */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="w-10 h-10 rounded-full bg-neutral-200/80 dark:bg-white/10 hover:bg-neutral-300 dark:hover:bg-white/20 flex items-center justify-center text-[#EAB308] hover:scale-105 active:scale-95 transition shadow-xs"
            aria-label="Toggle Theme"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-[#EAB308] transition-transform rotate-0 hover:rotate-90 duration-300" />
            ) : (
              <Sun className="w-5 h-5 text-[#EAB308] transition-transform rotate-0 hover:rotate-90 duration-300" />
            )}
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="w-9 h-9 rounded-full bg-neutral-200/80 dark:bg-white/10 flex items-center justify-center text-[#EAB308]"
            aria-label="Toggle Theme"
          >
            <Sun className="w-4 h-4 text-[#EAB308]" />
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-neutral-800 dark:text-white rounded-xl bg-neutral-200/80 dark:bg-white/10"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-6 py-4 space-y-3 transition-colors">
          <NavLink
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={navLinkClass}
          >
            Home
          </NavLink>
          <div />
          <NavLink
            to="/promo"
            onClick={() => setIsMobileMenuOpen(false)}
            className={navLinkClass}
          >
            Promo
          </NavLink>
          <div />
          <NavLink
            to="/stream"
            onClick={() => setIsMobileMenuOpen(false)}
            className={navLinkClass}
          >
            Stream
          </NavLink>
          <div />
          <NavLink
            to="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className={navLinkClass}
          >
            About
          </NavLink>

          <div className="pt-3 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between">
            <button
              type="button"
              className="w-full py-2.5 rounded-full text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-md"
              style={{ backgroundColor: '#B90101' }}
            >
              <User className="w-4 h-4 fill-white" />
              <span>Login</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
