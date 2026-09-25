import { Outlet, useLocation, ScrollRestoration } from "react-router";
import { useSelector } from "react-redux";
import { selectTheme } from "../redux/slices/uiSlice";
import Navbar from "../components/nav-footer/Navbar";
import Footer from "../components/nav-footer/Footer";

export default function RootLayout() {
  const location = useLocation();
  const theme = useSelector(selectTheme);
  const isDark = theme === "dark";
  const isHomePage = location.pathname === "/";
  const isAuthPage = [
    "/login",
    "/Login",
    "/signup",
    "/SignUp",
    "/forgot-password",
    "/ForgotPassword",
  ].includes(location.pathname);

  const isConcessionDetail =
    location.pathname.startsWith("/deals/") ||
    location.pathname.startsWith("/promo/");

  return (
    <div
      className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-300 selection:bg-[#B90101] selection:text-white ${
        isDark ? "text-white" : "text-neutral-900"
      } ${isAuthPage ? "h-screen overflow-hidden" : ""}`}
      style={{
        background: isDark ? "var(--bg-dark-mode)" : "var(--bg-light-mode)",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        minHeight: "100vh",
      }}
    >
      {/* ── Ambient Cinema Red Light Mesh in Light Mode (Active across each page) ── */}
      {!isDark && !isAuthPage && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Top Center FilmZone Red Spotlight */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(185,1,1,0.18)_0%,rgba(185,1,1,0.06)_50%,transparent_75%)] rounded-full blur-3xl" />
          {/* Right Side Cinema Warm Red Accent */}
          <div className="absolute top-1/4 -right-28 w-[550px] h-[550px] bg-[radial-gradient(circle_at_center,rgba(185,1,1,0.13)_0%,rgba(200,150,30,0.05)_45%,transparent_70%)] rounded-full blur-3xl" />
          {/* Lower Left Soft Crimson Bloom */}
          <div className="absolute bottom-1/4 -left-28 w-[550px] h-[550px] bg-[radial-gradient(circle_at_center,rgba(185,1,1,0.11)_0%,transparent_70%)] rounded-full blur-3xl" />
        </div>
      )}

      {!isAuthPage && !isConcessionDetail && <Navbar />}
      <main
        className={`flex-1 w-full relative z-10 ${
          isHomePage
            ? "pb-12"
            : isAuthPage
              ? "h-screen w-full overflow-hidden"
              : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-15 sm:pt-17.5 pb-12"
        }`}
      >
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
      <ScrollRestoration
        getKey={(loc) => {
          if (loc.pathname.startsWith("/deals")) return "/deals";
          if (loc.pathname.startsWith("/promo")) return "/promo";
          return loc.key;
        }}
      />
    </div>
  );
}
