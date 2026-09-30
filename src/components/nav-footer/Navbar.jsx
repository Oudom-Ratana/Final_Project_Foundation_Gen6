import { useState, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { Link, NavLink, useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import {
  User,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  Heart,
  LayoutDashboard,
} from "lucide-react";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  logout,
} from "../../redux/slices/authSlice";
import { useLogoutApiMutation } from "../../services/api/authApi";
import { selectTheme, toggleTheme } from "../../redux/slices/uiSlice";
import { selectFavouriteMovies } from "../../redux/slices/favouriteSlice";
import { toast } from "react-toastify";
import filmZoneLogo from "../../assets/logo/FilmZoneLogo.png";
import FilmZoneDarkLogo from "../../assets/logo/FilmZone_DarkModeLogo.png";

export default function Navbar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const theme = useSelector(selectTheme);
  const favouriteMovies = useSelector(selectFavouriteMovies) || [];
  const favoriteCount = favouriteMovies.length;
  const isAdmin = user?.role === "admin" || user?.role === "ADMIN";

  const storedAvatar = user?.uuid
    ? localStorage.getItem(`user_avatar_${user.uuid}`)
    : null;
  const userAvatar = user?.avatar || storedAvatar;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const mobileProfileDropdownRef = useRef(null);

  const [logoutApi] = useLogoutApiMutation();

  const handleLogout = async () => {
    const refreshToken = (
      sessionStorage.getItem("refreshToken") ||
      localStorage.getItem("cinema_refresh_token") ||
      user?.refreshToken ||
      ""
    ).trim();

    if (refreshToken) {
      try {
        await logoutApi({ refreshToken }).unwrap();
      } catch (err) {
        console.warn("Server logout response:", err);
      }
    }

    dispatch(logout());
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    toast.info("Logged out successfully");
  };

  const handleThemeToggle = (e) => {
    const isAppearanceTransition =
      typeof document !== "undefined" &&
      document.startViewTransition &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isAppearanceTransition) {
      dispatch(toggleTheme());
      return;
    }

    const rect = e?.currentTarget?.getBoundingClientRect?.();
    const x =
      e?.clientX ?? (rect ? rect.left + rect.width / 2 : window.innerWidth / 2);
    const y =
      e?.clientY ??
      (rect ? rect.top + rect.height / 2 : window.innerHeight / 2);

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    document.documentElement.style.setProperty("--theme-x", `${x}px`);
    document.documentElement.style.setProperty("--theme-y", `${y}px`);
    document.documentElement.style.setProperty("--theme-r", `${endRadius}px`);

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        dispatch(toggleTheme());
      });
    });

    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 360,
            easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {});
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedDesktop =
        profileDropdownRef.current &&
        profileDropdownRef.current.contains(event.target);
      const clickedMobile =
        mobileProfileDropdownRef.current &&
        mobileProfileDropdownRef.current.contains(event.target);

      if (!clickedDesktop && !clickedMobile) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  const [isScrolled, setIsScrolled] = useState(false);
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const nextScrolled = window.scrollY > 30;
          setIsScrolled((prev) =>
            prev !== nextScrolled ? nextScrolled : prev,
          );
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTransparentHeroMode = isHomePage && !isScrolled;

  const navLinkClass = ({ isActive }) =>
    `relative text-[14px] lg:text-[18px] font-bold transition-all px-1 pb-0.5 ${
      isActive
        ? 'text-[#B90101] font-black after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#B90101] after:rounded-full'
        : isTransparentHeroMode
          ? "text-[#EAB308] hover:text-[#B90101]"
          : "text-neutral-800 dark:text-[#EAB308] hover:text-[#B90101] dark:hover:text-[#B90101]"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block text-[16px] font-bold py-2 px-1 transition-colors ${
      isActive
        ? "text-[#B90101] font-black pl-2 border-l-2 border-[#B90101]"
        : "text-neutral-800 dark:text-neutral-200 hover:text-[#B90101] dark:hover:text-[#B90101]"
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isTransparentHeroMode
          ? "bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-[2px] border-b border-white/10"
          : "bg-white/55 dark:bg-black/40 backdrop-blur-md border-b border-neutral-200/80 dark:border-[#9E0505]/20 shadow-xs dark:shadow-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 group shrink-0 select-none py-0.5"
          aria-label="FilmZone Home"
        >
          <img
            src={theme === "dark" ? FilmZoneDarkLogo : filmZoneLogo}
            alt="FilmZone Logo"
            className="h-8 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-sm"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <NavLink to="/stream" className={navLinkClass}>
            Movies
          </NavLink>
          <NavLink to="/deals" className={navLinkClass}>
            Deals
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
        </nav>

        <div className="hidden sm:flex items-center gap-2">
          <Link
            to="/my-tickets"
            className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full border backdrop-blur-md flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-xs ${
              isTransparentHeroMode
                ? "bg-[#1A1F25]/20 hover:bg-[#1A1F25]/35 border-white/20 text-[#FFD700]"
                : "bg-white/80 hover:bg-white dark:bg-[#1A1F25]/40 dark:hover:bg-[#1A1F25]/60 border-neutral-200 dark:border-white/15 text-[#B90101] dark:text-[#EAB308]"
            }`}
            aria-label="My Tickets"
            title="My Tickets"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
          </Link>

          <button
            onClick={handleThemeToggle}
            className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full border backdrop-blur-md flex items-center justify-center text-[#B90101] hover:scale-105 active:scale-95 transition shadow-xs cursor-pointer ${
              isTransparentHeroMode
                ? "bg-[#1A1F25]/20 hover:bg-[#1A1F25]/35 border-white/20"
                : "bg-white/80 hover:bg-white dark:bg-[#1A1F25]/40 dark:hover:bg-[#1A1F25]/60 border-neutral-200 dark:border-white/15"
            }`}
            aria-label="Toggle Theme"
            title={
              theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
          >
            {theme === "dark" ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#B90101] transition-transform rotate-0 hover:rotate-90 duration-300" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#B90101] fill-[#B90101] transition-transform duration-300" />
            )}
          </button>

          {isAuthenticated && user ? (
            <div className="relative" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full overflow-hidden border-2 border-[#B90101] hover:scale-105 active:scale-95 transition shadow-md flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 cursor-pointer focus:outline-none"
                aria-label="User profile menu"
                title={user.name}
              >
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#B90101] flex items-center justify-center text-white">
                    <User className="w-3.5 h-3.5 fill-white" />
                  </div>
                )}
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-52 rounded-2xl bg-white dark:bg-[#1A1F25] border border-neutral-200 dark:border-white/10 shadow-2xl backdrop-blur-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-neutral-100 dark:border-white/5">
                    <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-[#B90101] dark:hover:text-[#B90101] transition"
                  >
                    <User className="w-4 h-4 text-[#B90101]" />
                    <span>Profile</span>
                  </Link>

                  <Link
                    to="/favourite"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-[#B90101] dark:hover:text-[#B90101] transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <Heart className="w-4 h-4 text-[#B90101]" />
                      <span>Favorite</span>
                    </div>
                    {favoriteCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#B90101] text-white text-[10px] font-black shadow-xs">
                        {favoriteCount}
                      </span>
                    )}
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-[#B90101] dark:hover:text-[#B90101] transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#B90101]" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <div className="my-1 border-t border-neutral-100 dark:border-white/5" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-[#B90101] hover:bg-red-500/10 transition cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-white font-bold text-xs sm:text-sm shadow-md hover:brightness-110 active:scale-95 transition cursor-pointer"
              style={{ backgroundColor: "#B90101" }}
            >
              <User className="w-3.5 h-3.5 fill-white" />
              <span>Login</span>
            </Link>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2">
          <Link
            to="/my-tickets"
            className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center shadow-xs transition-colors ${
              isTransparentHeroMode
                ? "bg-[#1A1F25]/20 hover:bg-[#1A1F25]/40 border border-white/20 text-[#FFD700]"
                : "bg-white/80 hover:bg-white dark:bg-[#1A1F25]/40 border border-neutral-200 dark:border-white/15 text-[#B90101] dark:text-[#EAB308]"
            }`}
            aria-label="My Tickets"
          >
            <Bell className="w-3.5 h-3.5 fill-current" />
          </Link>

          <button
            onClick={handleThemeToggle}
            className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center text-[#B90101] shadow-xs cursor-pointer transition-colors ${
              isTransparentHeroMode
                ? "bg-[#1A1F25]/20 hover:bg-[#1A1F25]/40 border border-white/20"
                : "bg-white/80 hover:bg-white dark:bg-[#1A1F25]/40 border border-neutral-200 dark:border-white/15"
            }`}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-3.5 h-3.5 text-[#B90101]" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-[#B90101] fill-[#B90101]" />
            )}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-1.5 rounded-lg backdrop-blur-md shadow-xs cursor-pointer transition-colors ${
              isTransparentHeroMode
                ? "text-white bg-[#1A1F25]/20 hover:bg-[#1A1F25]/40 border border-white/20"
                : "text-neutral-800 dark:text-white bg-white/80 hover:bg-white dark:bg-[#1A1F25]/40 border border-neutral-200 dark:border-white/15"
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white/95 dark:bg-[#0f1115]/95 backdrop-blur-xl px-5 py-4 space-y-3 transition-colors border-neutral-200 dark:border-[#9E0505]/20 shadow-2xl max-h-[calc(100dvh-3.5rem)] overflow-y-auto">
          <NavLink
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Home
          </NavLink>

          <NavLink
            to="/stream"
            onClick={() => setIsMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Movies
          </NavLink>

          <NavLink
            to="/deals"
            onClick={() => setIsMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Deals
          </NavLink>

          {isAuthenticated && user && (
            <NavLink
              to="/favourite"
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              <div className="flex items-center justify-between">
                <span>Favorites</span>
                {favoriteCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#B90101] text-white text-[11px] font-bold">
                    {favoriteCount}
                  </span>
                )}
              </div>
            </NavLink>
          )}

          <NavLink
            to="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            About
          </NavLink>

          {isAuthenticated && isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              Admin Dashboard
            </NavLink>
          )}

          <div
            className="pt-3 border-t flex flex-col gap-2.5"
            style={{ borderColor: "rgba(158, 5, 5, 0.20)" }}
          >
            {isAuthenticated && user ? (
              <div className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#B90101] text-white shadow-md">
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 truncate hover:opacity-90 transition cursor-pointer flex-1"
                >
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover bg-white/20 border border-white/40 shrink-0"
                    />
                  ) : (
                    <User className="w-5 h-5 fill-white shrink-0" />
                  )}
                  <div className="truncate">
                    <p className="text-sm font-bold truncate leading-tight">
                      {user.name}
                    </p>
                    <p className="text-xs text-white/70 truncate">
                      {user.email}
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-black/20 hover:bg-black/30 transition text-white cursor-pointer ml-2"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-full text-white font-bold text-base flex items-center justify-center gap-2 shadow-md hover:brightness-110 transition active:scale-[0.99]"
                style={{ backgroundColor: "#B90101" }}
              >
                <User className="w-4 h-4 fill-white" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
