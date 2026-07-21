// .env API Key
const API_KEY =
  import.meta.env.VITE_TMDB_API_KEY || "fa2d3cdfc326919f9f6a7823d0bbc80f";

const BASE_URL = "https://api.themoviedb.org/3";

// ===============================
// TRENDING MOVIES
// ===============================

export const getTrendingMovies = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`,
    );

    const data = await response.json();

    return data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,

      image: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "/default-placeholder.jpg",

      rating: movie.vote_average,
    }));
  } catch (error) {
    console.log("Trending error:", error);
    return [];
  }
};

// ===============================
// HOT TODAY MOVIES
// Auto calculate by popularity + rating
// ===============================

export const getHotMovies = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}`,
    );

    const data = await response.json();

    return data.results

      .sort(
        (a, b) =>
          b.vote_average +
          b.popularity / 100 -
          (a.vote_average + a.popularity / 100),
      )

      .slice(0, 10)

      .map((movie) => ({
        id: movie.id,

        title: movie.title,

        image: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "/default-placeholder.jpg",

        rating: movie.vote_average,
      }));
  } catch (error) {
    console.log("Hot movies error:", error);

    return [];
  }
};

// ===============================
// SEARCH MOVIES
// ===============================

export const searchMovies = async (query) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`,
    );

    const data = await response.json();

    return data.results;
  } catch (error) {
    console.log(error);

    return [];
  }
};

// ===============================
// MOVIE DETAILS
// ===============================

export const getMovieDetails = async (id) => {
  const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);

  return await response.json();
};

// ===============================
// MOVIE VIDEOS
// ===============================

export const getMovieVideos = async (id) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`,
    );

    const data = await response.json();

    return data.results || [];
  } catch (error) {
    console.log(error);

    return [];
  }
};

// ===============================
// SIMILAR MOVIES
// ===============================

export const getSimilarMovies = async (id) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`,
    );

    const data = await response.json();

    return data.results || [];
  } catch (error) {
    console.log(error);

    return [];
  }
};
