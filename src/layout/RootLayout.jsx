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
      className={`min-h-screen min-h-[100dvh] w-full max-w-full overflow-x-hidden flex flex-col font-sans antialiased transition-colors duration-300 selection:bg-[#B90101] selection:text-white ${
        isDark ? "text-white" : "text-neutral-900"
      } ${isAuthPage ? "h-screen h-[100dvh] overflow-hidden" : ""}`}
      style={{
        background: isDark ? "var(--bg-dark-mode)" : "var(--bg-light-mode)",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        minHeight: "100dvh",
      }}
    >
      {!isDark && !isAuthPage && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-24 sm:-top-32 left-1/2 -translate-x-1/2 w-[85vw] max-w-[900px] h-[350px] sm:h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(185,1,1,0.18)_0%,rgba(185,1,1,0.06)_50%,transparent_75%)] rounded-full blur-2xl sm:blur-3xl" />
          <div className="absolute top-1/4 -right-16 sm:-right-28 w-[60vw] max-w-[550px] h-[350px] sm:h-[550px] bg-[radial-gradient(circle_at_center,rgba(185,1,1,0.13)_0%,rgba(200,150,30,0.05)_45%,transparent_70%)] rounded-full blur-2xl sm:blur-3xl" />
          <div className="absolute bottom-1/4 -left-16 sm:-left-28 w-[60vw] max-w-[550px] h-[350px] sm:h-[550px] bg-[radial-gradient(circle_at_center,rgba(185,1,1,0.11)_0%,transparent_70%)] rounded-full blur-2xl sm:blur-3xl" />
        </div>
      )}

      {!isAuthPage && !isConcessionDetail && <Navbar />}

      <main
        className={`flex-1 w-full relative z-10 transition-all duration-200 ${
          isHomePage
            ? "w-full pb-8 sm:pb-12"
            : isAuthPage
              ? "h-full w-full overflow-hidden flex items-center justify-center p-4 sm:p-6"
              : "max-w-7xl mx-auto px-4 sm:px-6 md:px-8 xl:px-10 pt-16 sm:pt-20 lg:pt-24 pb-10 sm:pb-16"
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
