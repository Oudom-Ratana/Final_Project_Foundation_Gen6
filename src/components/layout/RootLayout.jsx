import { Outlet } from 'react-router';
import { useSelector } from 'react-redux';
import { selectTheme } from '../../redux/slices/uiSlice';
import Navbar from './Navbar';
import Footer from './Footer';

export default function RootLayout() {
  const theme = useSelector(selectTheme);
  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-300 selection:bg-[#B90101] selection:text-white ${
        isDark ? 'text-white' : 'text-neutral-900'
      }`}
      style={{
        backgroundColor: isDark ? 'transparent' : '#F6F7F9',
        background: isDark
          ? 'radial-gradient(ellipse at left, rgba(109, 8, 8, 0.7) 0%, #0d0304 100%), #000000'
          : '#F6F7F9',
        minHeight: '100vh',
      }}
    >
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
