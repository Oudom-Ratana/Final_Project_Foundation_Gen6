import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import { selectTheme } from '../../redux/slices/uiSlice';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const theme = useSelector(selectTheme);
  const isDark = theme === 'dark';

  return (
    <footer
      className={`w-full border-t text-[18px] mt-16 font-sans transition-colors duration-300 ${
        isDark
          ? 'border-white/10 text-neutral-300'
          : 'border-neutral-200 bg-white text-neutral-600 shadow-inner'
      }`}
      style={
        isDark
          ? {
              background:
                'linear-gradient(to right, rgba(50, 4, 4, 0.9) 0%, #080203 100%), #000000',
            }
          : {
              backgroundColor: '#FFFFFF',
            }
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1: Brand & Socials */}
          <div className="space-y-4 lg:col-span-1">
            <Link to="/" className="flex items-center">
              <span
                className={`text-3xl font-black italic tracking-tighter ${
                  isDark ? 'text-white' : 'text-neutral-900'
                }`}
              >
                FLIX
              </span>
              <span
                className="text-3xl font-black italic tracking-tighter ml-1"
                style={{ color: '#B90101' }}
              >
                ZONE
              </span>
            </Link>
            <p
              className={`leading-relaxed text-[16px] ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              Experience the best cinema booking and high-definition movie streaming in one seamless platform.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="#facebook"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                  isDark
                    ? 'bg-white/10 hover:bg-[#B90101] hover:text-white text-neutral-300'
                    : 'bg-neutral-100 hover:bg-[#B90101] hover:text-white text-neutral-700'
                }`}
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#twitter"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                  isDark
                    ? 'bg-white/10 hover:bg-[#B90101] hover:text-white text-neutral-300'
                    : 'bg-neutral-100 hover:bg-[#B90101] hover:text-white text-neutral-700'
                }`}
                aria-label="Twitter"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 23.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#instagram"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                  isDark
                    ? 'bg-white/10 hover:bg-[#B90101] hover:text-white text-neutral-300'
                    : 'bg-neutral-100 hover:bg-[#B90101] hover:text-white text-neutral-700'
                }`}
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#youtube"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                  isDark
                    ? 'bg-white/10 hover:bg-[#B90101] hover:text-white text-neutral-300'
                    : 'bg-neutral-100 hover:bg-[#B90101] hover:text-white text-neutral-700'
                }`}
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Link */}
          <div className="space-y-3">
            <h4
              className={`font-black text-[18px] uppercase tracking-wider ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}
            >
              Quick Link
            </h4>
            <ul
              className={`space-y-2 font-medium text-[16px] ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}
            >
              <li><Link to="/" className="hover:text-[#B90101] transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-[#B90101] transition">About</Link></li>
              <li><Link to="/movies" className="hover:text-[#B90101] transition">Cinema</Link></li>
            </ul>
          </div>

          {/* Col 3: More */}
          <div className="space-y-3">
            <h4
              className={`font-black text-[18px] uppercase tracking-wider ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}
            >
              More
            </h4>
            <ul
              className={`space-y-2 font-medium text-[16px] ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}
            >
              <li><Link to="/" className="hover:text-[#B90101] transition">Top Movies</Link></li>
              <li><Link to="/about" className="hover:text-[#B90101] transition">Help Center</Link></li>
            </ul>
          </div>

          {/* Col 4: Legal & Priv */}
          <div className="space-y-3">
            <h4
              className={`font-black text-[18px] uppercase tracking-wider ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}
            >
              Legal & Priv
            </h4>
            <ul
              className={`space-y-2 font-medium text-[16px] ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}
            >
              <li><a href="#privacy" className="hover:text-[#B90101] transition">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-[#B90101] transition">Terms of Service</a></li>
            </ul>
          </div>

          {/* Col 5: Get In Touch & ISTAD Badge */}
          <div className="space-y-3">
            <h4
              className={`font-black text-[18px] uppercase tracking-wider ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}
            >
              Get In Touch
            </h4>
            <ul
              className={`space-y-2.5 font-medium text-[16px] ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}
            >
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B90101] shrink-0" />
                <span>Phnom Penh, Cambodia</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#B90101] shrink-0" />
                <span>info@flixzone.cinema</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#B90101] shrink-0" />
                <span>+855 12 345 678</span>
              </li>
            </ul>

            {/* ISTAD Partner Badge */}
            <div className="pt-2">
              <div
                className={`inline-flex items-center gap-3 p-2 px-3.5 rounded-2xl border shadow-sm ${
                  isDark
                    ? 'bg-black/60 border-white/15'
                    : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-[12px] flex items-center justify-center shadow">
                  IS
                </div>
                <div className="flex flex-col">
                  <span
                    className={`font-black text-[14px] tracking-wider ${
                      isDark ? 'text-white' : 'text-neutral-900'
                    }`}
                  >
                    ISTAD
                  </span>
                  <span
                    className={`text-[12px] font-semibold leading-none ${
                      isDark ? 'text-neutral-400' : 'text-neutral-500'
                    }`}
                  >
                    Foundation Gen6
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`border-t pt-6 flex flex-col sm:flex-row items-center justify-center gap-2 text-center text-[16px] ${
            isDark ? 'border-white/10 text-neutral-500' : 'border-neutral-200 text-neutral-500'
          }`}
        >
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ backgroundColor: '#B90101' }}
          />
          <span>© 2024 Flix Zone Cinema. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
}
