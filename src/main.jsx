import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from './redux/store';
import './index.css';

// Layout & Pages
import RootLayout from './components/layout/RootLayout';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import StreamWatchPage from './pages/StreamWatchPage';
import SeatSelectionPage from './pages/booking/SeatSelectionPage';
import CheckoutPage from './pages/booking/CheckoutPage';
import BookingSuccessPage from './pages/booking/BookingSuccessPage';
import MyTicketsPage from './pages/user/MyTicketsPage';
import WatchlistPage from './pages/user/WatchlistPage';
import NotFoundPage from './pages/NotFoundPage';

const router = createBrowserRouter([
  // Main Cinema & Streaming Layout
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/movies',
        element: <MoviesPage />,
      },
      {
        path: '/movies/:id',
        element: <MovieDetailPage />,
      },
      // Free Movie Streaming
      {
        path: '/stream',
        element: <StreamWatchPage />,
      },
      {
        path: '/stream/:id',
        element: <StreamWatchPage />,
      },
      // Cinema Ticket Booking Flow
      {
        path: '/booking/seats',
        element: <SeatSelectionPage />,
      },
      {
        path: '/booking/checkout',
        element: <CheckoutPage />,
      },
      {
        path: '/booking/success',
        element: <BookingSuccessPage />,
      },
      // User Tickets & Watchlist
      {
        path: '/my-tickets',
        element: <MyTicketsPage />,
      },
      {
        path: '/watchlist',
        element: <WatchlistPage />,
      },
    ],
  },
  // 404 Not Found Page
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(

    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Provider>
    
);
