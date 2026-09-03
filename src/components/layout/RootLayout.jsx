import { Outlet } from 'react-router';
import Navbar from './Navbar';
import Footer from './Footer';
import MovieTrailerModal from '../movies/MovieTrailerModal';

export default function RootLayout() {
  return (
    <div
      className="min-h-screen flex flex-col text-white font-sans antialiased selection:bg-[#B90101] selection:text-white"
      style={{
        background: 'radial-gradient(ellipse at left, rgba(109, 8, 8, 0.7) 0%, #0d0304 100%), #000000',
        minHeight: '100vh',
      }}
    >
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <Outlet />
      </main>
      <Footer />
      <MovieTrailerModal />
    </div>
  );
}
