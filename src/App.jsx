import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home/Home";
import Movies from "./pages/Movies/Movies";
import About from "./pages/About/About";
import Favorites from "./pages/Favorites/Favorites";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import MovieDetails from "./pages/MovieDetails/MovieDetails";
import NotFound from "./pages/NotFound/NotFound";
import Search from "./pages/Search/Search";
import Contact from "./pages/Contact/Contact";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminMovies from "./pages/Admin/AdminMovies";
import AddMovieForm from "./components/AddMovieForm/AddMovieForm";
import AdminRoute from "./routes/AdminRoute";
import AdminRedirectRoute from "./routes/AdminRedirectRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import AdminUsers from "./pages/AdminUsers/AdminUsers";
import AdminReviews from "./pages/AdminReviews/AdminReviews";
import AdminFavorites from "./pages/AdminFavorites/AdminFavorites";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <AdminRedirectRoute>
              <MainLayout />
            </AdminRedirectRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="movies" element={<Movies />} />
          <Route path="about" element={<About />} />
          <Route path="search" element={<Search />} />
          <Route path="contact" element={<Contact />} />
          <Route path="movie/:id" element={<MovieDetails />} />

          <Route
            path="login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route
            path="favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="movies" element={<AdminMovies />} />
          <Route path="add-movie" element={<AddMovieForm />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="favorites" element={<AdminFavorites />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
