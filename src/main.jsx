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
import MyTicketsPage from "./pages/MyTicketsPage";

import AdminLayout from "./layout/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminMovieLibraryPage from "./pages/admin/AdminMovieLibraryPage";
import AdminUserAnalyticsPage from "./pages/admin/AdminUserAnalyticsPage";

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
        path: "/movies/:id",
        element: <MovieDetailPage />,
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
    element: (
      <div className="py-20 text-center text-white font-sans">
        <h1 className="text-4xl font-black text-[#B90101]">404</h1>
        <p className="text-neutral-400 mt-2">Page Not Found</p>
      </div>
    ),
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
