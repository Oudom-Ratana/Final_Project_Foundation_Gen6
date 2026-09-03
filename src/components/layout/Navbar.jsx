import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import {
  Search,
  User,
  Ticket,
  Moon,
  ChevronDown,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  logout,
} from '../../redux/slices/authSlice';
import LoginModal from '../auth/LoginModal';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/movies?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const navLinkStyle = ({ isActive }) =>
    `text-[18px] font-semibold transition px-3.5 py-1.5 rounded-full ${
      isActive
        ? 'text-[#B90101] font-black'
        : 'text-white/90 hover:text-white hover:bg-white/10'
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-black/85 backdrop-blur-md border-b border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-22 flex items-center justify-between gap-4">
          {/* Brand Logo: FLIX ZONE */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="flex items-center">
              <span className="text-2xl sm:text-3xl font-black italic tracking-tighter text-white drop-shadow">
                FLIX
              </span>
              <span
                className="text-2xl sm:text-3xl font-black italic tracking-tighter ml-1 drop-shadow"
                style={{ color: '#B90101' }}
              >
                ZONE
              </span>
            </div>
          </Link>

          {/* Search Bar Input (Glassmorphic) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative w-60 lg:w-80"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search here..."
              className="w-full pl-5 pr-11 py-2.5 bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 rounded-full text-[18px] text-white placeholder-white/60 backdrop-blur-md focus:outline-none focus:border-[#B90101] transition shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-3.5 text-white/70 hover:text-white transition"
              aria-label="Submit search"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Center Navigation Links (18px font size) */}
          <nav className="hidden md:flex items-center gap-3 lg:gap-6">
            <NavLink to="/" className={navLinkStyle}>
              Home
            </NavLink>
            <NavLink to="/movies" className={navLinkStyle}>
              Events
            </NavLink>
            <NavLink to="/booking/seats" className={navLinkStyle}>
              Cinema
            </NavLink>
            <NavLink to="/movies" className={navLinkStyle}>
              About
            </NavLink>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Login Pill */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 bg-neutral-900 border border-white/20 rounded-full py-1.5 px-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-[18px] font-bold text-white max-w-[90px] truncate">
                  {user.name}
                </span>
                <button
                  onClick={() => dispatch(logout())}
                  className="p-1 text-white/60 hover:text-[#B90101]"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-white border border-white/20 text-[18px] font-bold shadow transition active:scale-95"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}

            {/* Circular Theme Icon */}
            <button
              className="p-2.5 rounded-full bg-neutral-900/90 border border-white/20 text-white/80 hover:text-white transition"
              aria-label="Toggle theme"
            >
              <Moon className="w-4 h-4" />
            </button>

            {/* Ticket Pill Button */}
            <Link
              to="/my-tickets"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-800/90 hover:bg-neutral-700 text-white border border-white/20 text-[18px] font-bold shadow transition active:scale-95"
            >
              <Ticket className="w-4 h-4" style={{ color: '#FFD700' }} />
              <span>Ticket</span>
            </Link>

            {/* Language Selector Pill */}
            <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-neutral-900/90 border border-white/20 text-[18px] font-bold text-white cursor-pointer hover:bg-neutral-800 transition">
              <span>EN</span>
              <ChevronDown className="w-4 h-4 text-white/70" />
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 text-white rounded-xl bg-neutral-900 border border-white/20"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-neutral-950 px-4 py-4 space-y-3">
            <form onSubmit={handleSearchSubmit} className="relative w-full mb-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search here..."
                className="w-full pl-4 pr-10 py-3 bg-white/10 border border-white/20 rounded-full text-[18px] text-white placeholder-white/60 focus:outline-none"
              />
              <Search className="absolute right-3.5 top-3.5 w-5 h-5 text-white/70" />
            </form>

            <NavLink
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-[18px] font-semibold text-white py-2"
            >
              Home
            </NavLink>
            <NavLink
              to="/movies"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-[18px] font-semibold text-white py-2"
            >
              Events
            </NavLink>
            <NavLink
              to="/booking/seats"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-[18px] font-semibold text-white py-2"
            >
              Cinema
            </NavLink>
            <NavLink
              to="/stream"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-[18px] font-semibold text-emerald-400 py-2"
            >
              Free Streaming
            </NavLink>
            <NavLink
              to="/my-tickets"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-[18px] font-semibold text-white py-2"
            >
              My Tickets
            </NavLink>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  <span className="text-[18px] font-bold text-white">{user.name}</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsLoginOpen(true);
                  }}
                  className="w-full py-3 rounded-full text-white font-bold text-[18px] shadow-lg"
                  style={{ backgroundColor: '#B90101' }}
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
