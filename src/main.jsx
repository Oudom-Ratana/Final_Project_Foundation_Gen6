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
import AboutUsPage from './pages/AboutUsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/about',
        element: <AboutUsPage />,
      },
    ],
  },
  {
    path: '*',
    element: (
      <div className="py-20 text-center text-white">
        <h1 className="text-4xl font-black text-[#B90101]">404</h1>
        <p className="text-neutral-400 mt-2">Page Not Found</p>
      </div>
    ),
  },
]);

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
  <StrictMode>
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
  </StrictMode>
);
