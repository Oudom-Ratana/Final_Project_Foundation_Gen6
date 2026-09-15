import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./redux/store";
import "./index.css";

// Layout & Pages

import AboutUsPage from "./pages/AboutUsPage";
import ForgotPassword from "./components/auth/ForgotPassword";
import SignUpComponent from "./components/auth/SignUpComponent";
import LoginComponent from "./components/auth/LoginComponent";
import RootLayout from "./layout/RootLayout";
import HomePage from "./pages/HomePage";
import StreamPage from "./pages/StreamPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import StreamMovieDetailPage from "./pages/StreamMovieDetailPage";
import PromotionPage from "./pages/promotions/PromotionPage";
import DetailPage from "./pages/promotions/DetailPage";
import SeatSelectionPage from "./pages/booking/SeatSelectionPage";
import BookingDetailsPage from "./pages/booking/BookingDetailsPage";
import BookingConfirmedPage from "./pages/booking/BookingConfirmedPage";
import MyTicketsPage from "./pages/MyTicketsPage";
import ProfilePage from "./pages/ProfilePage";

import AdminLayout from "./layout/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminMovieLibraryPage from "./pages/admin/AdminMovieLibraryPage";
import AdminUserAnalyticsPage from "./pages/admin/AdminUserAnalyticsPage";
import FavouritePage from "./pages/FavouritePage";
import NotFoundPage from "./pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginComponent />,
      },
      {
        path: "/signup",
        element: <SignUpComponent />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/about",
        element: <AboutUsPage />,
      },
      {
        path: "/stream",
        element: <StreamPage />,
      },
      {
        path: "/favourite",
        element: <FavouritePage />,
      },
      {
        path: "/movies/:id",
        element: <MovieDetailPage />,
      },
      {
        path: "/stream/:id",
        element: <StreamMovieDetailPage />,
      },
      {
        path: "/booking/seats",
        element: <SeatSelectionPage />,
      },
      {
        path: "/booking/details",
        element: <BookingDetailsPage />,
      },
      {
        path: "/booking/confirmed",
        element: <BookingConfirmedPage />,
      },
      {
        path: "/promo",
        element: <PromotionPage />,
        children: [
          {
            path: ":id",
            element: <DetailPage />,
          },
        ],
      },
      {
        path: "/my-tickets",
        element: <MyTicketsPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
      {
        path: "dashboard",
        element: <AdminDashboardPage />,
      },
      {
        path: "movies",
        element: <AdminMovieLibraryPage />,
      },
      {
        path: "analytics",
        element: <AdminUserAnalyticsPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

const root = document.getElementById("root");

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
  </Provider>,
);
