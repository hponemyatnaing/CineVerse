import "./MovieDetails.css";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { FaArrowLeft, FaHeart } from "react-icons/fa";

import {
  saveWatchHistory,
  getMovieById,
  increaseMovieView,
  getSimilarFirebaseMovies,
} from "../../services/movieService";

import {
  getMovieDetails,
  getMovieVideos,
  getSimilarMovies,
} from "../../services/tmdbService";

import MovieCard from "../../components/MovieCard/MovieCard";

import Trailer from "../../components/Trailer/Trailer";

import ReviewForm from "../../components/ReviewForm/ReviewForm";

import ReviewList from "../../components/ReviewList/ReviewList";

import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

import { useFavorites } from "../../context/FavoritesContext";

function MovieDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);

  const [loading, setLoading] = useState(true);

  const [videos, setVideos] = useState([]);

  const [similarMovies, setSimilarMovies] = useState([]);

  const [refreshReviews, setRefreshReviews] = useState(0);

  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  const movieId = String(movie?.id || id);

  const favoriteItem = favorites.find(
    (item) => String(item.movieId) === movieId,
  );

  const isFavorite = Boolean(favoriteItem);

  useEffect(() => {
    loadMovie();
  }, [id]);

  const loadMovie = async () => {
    try {
      setLoading(true);

      /*
        First:
        Check Firebase Movie

        If found:
        Load Firebase

        If not:
        Load TMDB API
      */

      const firebaseMovie = await getMovieById(id);

      if (firebaseMovie) {
        await increaseMovieView(firebaseMovie.id);

        saveWatchHistory(firebaseMovie);

        const similar = await getSimilarFirebaseMovies(firebaseMovie);

        setMovie(firebaseMovie);

        setSimilarMovies(similar || []);

        setVideos([]);

        return;
      }

      // TMDB API MOVIE

      const movieData = await getMovieDetails(id);

      const videoData = await getMovieVideos(id);

      const similarData = await getSimilarMovies(id);

      setMovie(movieData);

      setVideos(videoData || []);

      setSimilarMovies(similarData || []);

      saveWatchHistory({
        id: movieData.id,

        title: movieData.title,

        image: movieData.poster_path
          ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
          : "/default-placeholder.jpg",

        rating: movieData.vote_average || 0,
      });
    } catch (error) {
      console.log("Movie Details Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!movie) return;

    const currentId = String(movie.id);

    if (isFavorite) {
      await removeFromFavorites(currentId);
    } else {
      await addToFavorites({
        id: movie.id,

        movieId: currentId,

        title: movie.title,

        image: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : movie.image || "",

        rating: movie.vote_average || movie.rating || 0,
      });
    }
  };

  if (loading) {
    return (
      <div className="details-loading">
        <LoadingSpinner text="Loading Movie..." />
      </div>
    );
  }

  if (!movie) {
    return <div className="details-loading">Movie Not Found</div>;
  }

  return (
    <section className="movie-details">
      <div className="details-top-bar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
          Back
        </button>

        <button
          className={`details-fav-btn ${isFavorite ? "active" : ""}`}
          onClick={handleFavorite}
        >
          <FaHeart />

          <span>{isFavorite ? "Remove Favorite" : "Add Favorite"}</span>
        </button>
      </div>

      <div className="details-container">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : movie.image
          }
          alt={movie.title}
        />

        <div className="details-info">
          <h1>{movie.title}</h1>

          <p>⭐{movie.vote_average || movie.rating || 0}</p>

          <p>
            📅
            {movie.release_date || movie.year}
          </p>

          {movie.runtime && <p>⏰ {movie.runtime} mins</p>}

          <div className="genres">
            {movie.genres ? (
              movie.genres.map((genre) => (
                <span key={genre.id}>{genre.name}</span>
              ))
            ) : (
              <span>{movie.genre}</span>
            )}
          </div>

          <h3>Overview</h3>

          <p>{movie.overview || movie.description}</p>

          <Trailer
            videos={videos}
            trailerUrl={movie.trailerUrl}
            movieTitle={movie.title}
          />

          <ReviewForm
            movieId={movie.id}
            movieTitle={movie.title}
            onReviewAdded={() => setRefreshReviews((prev) => prev + 1)}
          />

          <ReviewList movieId={movie.id} refresh={refreshReviews} />
        </div>
      </div>

      {similarMovies.length > 0 && (
        <>
          <hr />

          <h2>You May Also Like</h2>

          <div className="similar-grid">
            {similarMovies

              .slice(0, 8)

              .map((item) => (
                <MovieCard
                  key={item.id}
                  movie={{
                    ...item,

                    id: item.id,

                    movieId: item.id,

                    image:
                      item.image ||
                      (item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : "/default-placeholder.jpg"),

                    rating: item.rating || item.vote_average || 0,
                  }}
                />
              ))}
          </div>
        </>
      )}
    </section>
  );
}

export default MovieDetails;
