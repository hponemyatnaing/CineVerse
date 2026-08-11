import "./AddMovieForm.css";

import { useEffect, useState } from "react";
import * as Yup from "yup";

import { addMovie, updateMovie } from "../../services/movieService";

function AddMovieForm({ movie, onClose, onSuccess }) {
  const initialState = {
    title: "",
    image: "",
    genre: [],
    releaseDate: "",
    rating: "",
    description: "",
    trailerUrl: "",
    category: "latest",
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availableGenres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Drama",
    "Fantasy",
    "Horror",
    "Romance",
    "Sci-Fi",
    "Thriller",
  ];

  const movieSchema = Yup.object({
    title: Yup.string().trim().required("Movie title is required"),
    image: Yup.string().trim().required("Poster image URL is required"),
    genre: Yup.array()
      .min(1, "Please select at least one genre")
      .required("Genre is required"),
    releaseDate: Yup.string().required("Release date is required"),
    rating: Yup.number()
      .typeError("Rating must be a number")
      .min(0, "Rating must be at least 0")
      .max(10, "Rating cannot exceed 10")
      .required("Rating is required"),
    description: Yup.string().trim().required("Description is required"),
    trailerUrl: Yup.string().optional(),
    category: Yup.string().required("Category is required"),
  });

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || "",
        image: movie.image || "",
        genre: Array.isArray(movie.genre)
          ? movie.genre
          : movie.genre
            ? [movie.genre]
            : [],
        releaseDate: movie.releaseDate || movie.year || "",
        rating: movie.rating || "",
        description: movie.description || "",
        trailerUrl: movie.trailerUrl || "",
        category: movie.category || "latest",
      });
    } else {
      setFormData(initialState);
    }
  }, [movie]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updatedGenres = checked
        ? [...prev.genre, value]
        : prev.genre.filter((item) => item !== value);
      return { ...prev, genre: updatedGenres };
    });

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await movieSchema.validate(formData, { abortEarly: true });

      setLoading(true);

      let result;

      if (movie) {
        result = await updateMovie(movie.id, formData);
      } else {
        result = await addMovie(formData);
      }

      if (result.success) {
        alert(
          movie ? "Movie Updated Successfully" : "Movie Added Successfully",
        );

        if (onSuccess) {
          onSuccess();
        }

        if (onClose) {
          onClose();
        }

        setFormData(initialState);
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.log(err);

      if (err.name === "ValidationError") {
        setError(err.message);
        alert(err.message);
        return;
      }

      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="movie-form" onSubmit={handleSubmit}>
      <div className="form-title">
        <h2>{movie ? "Edit Movie" : "Add New Movie"}</h2>
        {/* <p>Manage movie information</p> */}
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Movie Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter movie title"
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="latest">Latest Movies</option>
            <option value="trending">Trending Movies</option>
            <option value="hot">Hot Movies</option>
          </select>
        </div>

        <div className="form-group">
          <label>Poster Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Image URL"
            required
          />
        </div>

        <div className="form-group">
          <label>Release Date</label>
          <input
            type="date"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Rating</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            placeholder="8.5"
            required
          />
        </div>
      </div>

      <div className="form-group full">
        <label>Genres (Select multiple)</label>
        <div
          className="genre-checkbox-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: "10px",
            marginTop: "8px",
          }}
        >
          {availableGenres.map((g) => (
            <label
              key={g}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                color: "inherit",
              }}
            >
              <input
                type="checkbox"
                name="genre"
                value={g}
                checked={formData.genre.includes(g)}
                onChange={handleGenreChange}
              />
              {g}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group full">
        <label>Trailer URL</label>
        <input
          type="text"
          name="trailerUrl"
          value={formData.trailerUrl}
          onChange={handleChange}
          placeholder="YouTube Trailer URL"
        />
      </div>

      <div className="form-group full">
        <label>Description</label>
        <textarea
          rows="6"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Movie description..."
          required
        />
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onClose}>
          Cancel
        </button>

        <button className="save-btn" disabled={loading}>
          {loading ? "Saving..." : movie ? "Update Movie" : "Add Movie"}
        </button>
      </div>
    </form>
  );
}

export default AddMovieForm;
