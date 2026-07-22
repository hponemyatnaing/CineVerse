import "./MovieDetails.css";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { FaArrowLeft, FaHeart, FaStar } from "react-icons/fa";

import {
  getMovieDetails,
  getMovieVideos,
  getSimilarMovies,
} from "../../services/tmdbService";

import {
  saveWatchHistory,
  getMovieById,
  increaseMovieView,
} from "../../services/movieService";

import MovieCard from "../../components/MovieCard/MovieCard";

import Trailer from "../../components/Trailer/Trailer";

import ReviewForm from "../../components/ReviewForm/ReviewForm";

import ReviewList from "../../components/ReviewList/ReviewList";

import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

function MovieDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);

  const [loading, setLoading] = useState(true);

  const [videos, setVideos] = useState([]);

  const [similarMovies, setSimilarMovies] = useState([]);

  const [refreshReviews, setRefreshReviews] = useState(0);

  // Favorite အတွက် State
  const [favourite, setFavourite] = useState(false);

  useEffect(() => {
    loadMovie();
  }, [id]);

  async function loadMovie() {
    try {
      setLoading(true);

      console.log("CURRENT MOVIE ID:", id);

      if (!isNaN(id)) {
        const movieData = await getMovieDetails(id);

        const videoData = await getMovieVideos(id);

        const similarData = await getSimilarMovies(id);

        console.log("VIDEOS:", videoData);

        console.log("SIMILAR:", similarData);

        setMovie(movieData);

        setVideos(videoData || []);

        setSimilarMovies(similarData || []);

        saveWatchHistory({
          id: movieData.id,

          title: movieData.title,

          image: movieData.poster_path
            ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
            : "/default-placeholder.jpg",

          rating: movieData.vote_average,
        });
      } else {
        const firebaseMovie = await getMovieById(id);

        console.log("FIREBASE MOVIE:", firebaseMovie);

        if (firebaseMovie) {
          await increaseMovieView(firebaseMovie.id);

          saveWatchHistory(firebaseMovie);
        }

        setMovie(firebaseMovie);

        setVideos([]);

        setSimilarMovies([]);
      }
    } catch (error) {
      console.log("Movie Details Error:", error);
    } finally {
      setLoading(false);
    }
  }

  // သင်ပေးထားသော Favorite Function ကို ဤနေရာတွင် ထည့်သွင်းထားပါသည်
  const favFunc = async (item) => {
    try {
      setFavourite(!favourite);

      // အကယ်၍ toggleFavourite API သုံးထားလျှင် ဤနေရာတွင် ချိတ်ဆက်နိုင်သည်
      // const res = await toggleFavourite({ id: item.id, type, typename: typeName, isFavourite: favourite }).unwrap();

      // setTimeout(() => {
      //     Toast.show(res.message, ToastOption);
      // }, 0);

    } catch (err) {
      setFavourite(!favourite);
      // Toast.show(err?.data?.message || "An error occurred", ToastOption);
    }
  };

  if (loading) {
    return <div className="details-loading"><LoadingSpinner text="Loading Movie..." /></div>;
  }

  if (!movie) {
    return <div className="details-loading">Movie Not Found</div>;
  }

  return (
    <section className="movie-details">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft />

        <span>Back</span>
      </button>

      {/* Favorite ခလုတ်ကို ဤနေရာတွင် ထည့်သွင်းအသုံးပြုနိုင်ပါသည် */}
      <button
        className={`details-fav-btn ${favourite ? "active" : ""}`}
        onClick={() => favFunc(movie)}
        style={{ float: "right", padding: "10px 15px", cursor: "pointer", background: "transparent", border: "1px solid #fff", color: "#fff", borderRadius: "5px" }}
      >
        <FaHeart style={{ color: favourite ? "red" : "#fff" }} /> {favourite ? "Favorited" : "Add to Favorite"}
      </button>

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

              .map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={{
                    id: movie.id,

                    title: movie.title,

                    image: movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/default-placeholder.jpg",

                    rating: movie.vote_average,
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