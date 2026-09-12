import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { User, Bell, Sun, Moon, Menu, X, LogOut, Heart } from "lucide-react";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  logout,
} from "../../redux/slices/authSlice";
import { selectTheme, toggleTheme } from "../../redux/slices/uiSlice";
import { selectWatchlist } from "../../redux/slices/watchlistSlice";
import filmZoneLogo from "../../assets/logo/FilmZoneLogo.png";

export default function Navbar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const theme = useSelector(selectTheme);
  const watchlist = useSelector(selectWatchlist);
  const favoriteCount = watchlist?.length || 0;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Check if current route is Homepage for transparent overlay mode
  const isHomePage = location.pathname === "/";

  // Scroll listener: hide navbar on scroll down, show on scroll up or at top
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show when near the top of the page
      if (currentScrollY <= 20) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 70) {
        // Scrolling down -> hide navbar
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up -> reveal navbar
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Active state: Primary red with red underline indicator bar
  // Inactive state: Golden yellow text
  const navLinkClass = ({ isActive }) =>
    `relative text-[18px] font-bold transition-all px-1 pb-1.5 ${
      isActive
        ? 'text-[#B90101] font-black after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#B90101] after:rounded-full'
        : "text-[#EAB308] hover:text-[#B90101]"
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-transform duration-300 ease-in-out ${
        isVisible || isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
      } ${
        isHomePage && lastScrollY <= 20
          ? "bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-[2px]"
          : "bg-white/95 dark:bg-black/90 backdrop-blur-md shadow-md"
      }`}
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 border-b border-[#9E0505]/20"
        style={{ borderColor: "rgba(158, 5, 5, 0.20)" }}
      >
        {/* 1. Left: FilmZone Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group shrink-0 select-none py-1"
          aria-label="FilmZone Home"
        >
          <img
            src={filmZoneLogo}
            alt="FilmZone Logo"
            className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-sm"
          />
        </Link>

        {/* 2. Center: Navigation Links (Home, Promo, Stream, About) */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          {/* <NavLink to="/promo" className={navLinkClass}>
            Promo
          </NavLink> */}
          <NavLink to="/stream" className={navLinkClass}>
            Movies
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
        </nav>

        {/* 3. Right: Action Buttons (Red Login Pill, Glass Bell, Glass Sun/Moon) */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Red Login Pill Button */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-[35px] bg-[#B90101] text-white font-bold text-[16px] shadow-md">
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
            <Link
              to="/login"
              className="flex items-center gap-2 px-6 py-2.5 rounded-[35px] text-white font-bold text-[16px] shadow-md hover:brightness-110 active:scale-95 transition"
              style={{ backgroundColor: "#B90101" }}
            >
              <User className="w-4 h-4 fill-white" />
              <span>Login</span>
            </Link>
          )}

                   {/* Glass Favorite Movie Button (Directly after Login button) */}
          <Link
            to="/stream"
            className="relative w-[46px] h-[46px] rounded-[35px] bg-[#1A1F25]/10 dark:bg-[#1A1F25]/20 hover:bg-[#1A1F25]/25 border border-white/20 backdrop-blur-md flex items-center justify-center text-[#B90101] hover:scale-105 active:scale-95 transition shadow-sm group"
            style={{
              backgroundColor: "rgba(26, 31, 37, 0.10)",
              borderColor: "rgba(255, 255, 255, 0.20)",
              borderRadius: "35px",
            }}
            aria-label="Favorite Movies"
            title="Favorite Movies"
          >
            <Heart className="w-5 h-5 text-[#B90101] group-hover:fill-[#B90101] transition-colors" />
            {favoriteCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#B90101] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs border border-white dark:border-neutral-900">
                {favoriteCount}
              </span>
            )}
          </Link>


          {/* Glass Notification Bell Button — navigates to /my-tickets */}
          <Link
            to="/my-tickets"
            className="w-[46px] h-[46px] rounded-[35px] bg-[#1A1F25]/10 dark:bg-[#1A1F25]/20 hover:bg-[#1A1F25]/25 border border-white/20 backdrop-blur-md flex items-center justify-center text-[#FFD700] hover:scale-105 active:scale-95 transition shadow-sm"
            style={{
              backgroundColor: "rgba(26, 31, 37, 0.10)",
              borderColor: "rgba(255, 255, 255, 0.20)",
              borderRadius: "35px",
            }}
            aria-label="My Tickets"
            title="My Tickets"
          >
            <Bell className="w-5 h-5 fill-primary text-primary" />
          </Link>

          {/* Glass Theme Switcher Toggle Button (Red primary color #B90101) */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="w-[46px] h-[46px] rounded-[35px] bg-[#1A1F25]/10 dark:bg-[#1A1F25]/20 hover:bg-[#1A1F25]/25 border border-white/20 backdrop-blur-md flex items-center justify-center text-[#B90101] hover:scale-105 active:scale-95 transition shadow-sm"
            style={{
              backgroundColor: "rgba(26, 31, 37, 0.10)",
              borderColor: "rgba(255, 255, 255, 0.20)",
              borderRadius: "35px",
            }}
            aria-label="Toggle Theme"
            title={
              theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-[#B90101] transition-transform rotate-0 hover:rotate-90 duration-300" />
            ) : (
              <Moon className="w-5 h-5 text-[#B90101] fill-[#B90101] transition-transform duration-300" />
            )}
          </button>

          {/* Admin Portal Switcher */}
          <Link
            to="/admin"
            className="px-3.5 py-2 rounded-[35px] bg-[#1A1F25]/10 dark:bg-[#1A1F25]/20 hover:bg-[#B90101] hover:text-white border border-white/20 backdrop-blur-md text-xs font-black text-[#B90101] hover:scale-105 active:scale-95 transition shadow-sm flex items-center justify-center"
          >
            Admin
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Favorite Button */}
          <Link
            to="/stream"
            className="relative w-[40px] h-[40px] rounded-[35px] bg-[#1A1F25]/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-[#B90101]"
            aria-label="Favorite Movies"
            title="Favorite Movies"
          >
            <Heart className="w-4 h-4 text-[#B90101]" />
            {favoriteCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-0.5 bg-[#B90101] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {favoriteCount}
              </span>
            )}
          </Link>

          {/* Mobile Theme Switcher (Red primary color #B90101) */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="w-[40px] h-[40px] rounded-[35px] bg-[#1A1F25]/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-[#B90101]"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-[#B90101]" />
            ) : (
              <Moon className="w-4 h-4 text-[#B90101] fill-[#B90101]" />
            )}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-neutral-800 dark:text-white rounded-[20px] bg-[#1A1F25]/10 border border-white/20 backdrop-blur-md"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden border-t bg-white dark:bg-neutral-950 px-6 py-4 space-y-3 transition-colors"
          style={{ borderColor: "rgba(158, 5, 5, 0.20)" }}
        >
          <NavLink
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={navLinkClass}
          >
            Home
          </NavLink>
          <div />
          {/* <NavLink
            to="/promo"
            onClick={() => setIsMobileMenuOpen(false)}
            className={navLinkClass}
          >
            Promo
          </NavLink> */}
          <div />
          <NavLink
            to="/stream"
            onClick={() => setIsMobileMenuOpen(false)}
            className={navLinkClass}
          >
            Movies
          </NavLink>
          <div />
          <NavLink
            to="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className={navLinkClass}
          >
            About
          </NavLink>
          <div />
          <NavLink
            to="/admin"
            onClick={() => setIsMobileMenuOpen(false)}
            className={navLinkClass}
          >
            Admin Dashboard
          </NavLink>

          <div
            className="pt-3 border-t flex items-center justify-between"
            style={{ borderColor: "rgba(158, 5, 5, 0.20)" }}
          >
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-[35px] text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-md"
              style={{ backgroundColor: "#B90101" }}
            >
              <User className="w-4 h-4 fill-white" />
              <span>Login</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
