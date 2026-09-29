import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from './firebase';
import { setUser } from './redux/slices/authSlice';
import AppRoutes from './routes/AppRoutes';
import FavouriteMovieCard from './components/favourite/FavouriteMovieCard';
import { auth } from './firebase/config';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        dispatch(
          setUser({
            uid: fbUser.uid,
            name: fbUser.displayName,
            email: fbUser.email,
            photo: fbUser.photoURL,
          })
        );
      } else {
        dispatch(setUser(null));
      }
    });
    return unsub;
  }, [dispatch]);

  return (
    <>
      <AppRoutes />
      <FavouriteMovieCard />
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
    </>
  );
}

export default App;