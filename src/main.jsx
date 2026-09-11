import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./redux/store";
import "./index.css";

// Layout & Pages
import RootLayout from "./components/layout/RootLayout";
import HomePage from "./pages/HomePage";
import StreamPage from "./pages/StreamPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import StreamMovieDetailPage from "./pages/StreamMovieDetailPage";
import AboutUsPage from "./pages/AboutUsPage";
import PromotionPage from "./pages/promotions/PromotionPage";
import DetailPage from "./pages/promotions/DetailPage";
import SeatSelectionPage from "./pages/booking/SeatSelectionPage";

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
        path: "/stream/:id",
        element: <StreamMovieDetailPage />,
      },
      {
        path: "/booking/seats",
        element: <SeatSelectionPage />,
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
    ],
    // path: "/admin",
    // element: <RootLayout />,
    // children: [
    //   {
    //     index: true,
    //     element: <HomePage />,
    //   },
    //   {
    //     path: "/about",
    //     element: <AboutUsPage />,
    //   },
    //   {
    //     path: "/stream",
    //     element: <StreamPage />,
    //   },
    //   {
    //     path: "/movies/:id",
    //     element: <MovieDetailPage />,
    //   },
    //   {
    //     path: "/stream/:id",
    //     element: <StreamMovieDetailPage />,
    //   },
    //   {
    //     path: "/booking/seats",
    //     element: <SeatSelectionPage />,
    //   },
    //   {
    //     path: "/promo",
    //     element: <PromotionPage />,
    //     children: [
    //       {
    //         path: ":id",
    //         element: <DetailPage />,
    //       },
    //     ],
    //   },
    // ],
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
