import "./AddMovieForm.css";

import { useEffect, useState } from "react";

import { addMovie, updateMovie } from "../../services/movieService";

function AddMovieForm({ movie, onClose, onSuccess }) {
  const initialState = {
    title: "",
    image: "",
    genre: "Action",
    releaseDate: "",
    rating: "",
    description: "",
    trailerUrl: "",
    category: "latest",
  };

  const [formData, setFormData] = useState(initialState);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || "",

        image: movie.image || "",

        genre: movie.genre || "Action",

        year: movie.year || "",

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let result;

      if (movie) {
        result = await updateMovie(
          movie.id,

          formData,
        );
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
    } catch (error) {
      console.log(error);

      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="movie-form" onSubmit={handleSubmit}>
      <div className="form-title">
        <h2>{movie ? "Edit Movie" : "Add New Movie"}</h2>

        <p>Manage movie information</p>
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
          <label>Genre</label>

          <select name="genre" value={formData.genre} onChange={handleChange}>
            <option>Action</option>

            <option>Adventure</option>

            <option>Animation</option>

            <option>Comedy</option>

            <option>Crime</option>

            <option>Drama</option>

            <option>Fantasy</option>

            <option>Horror</option>

            <option>Romance</option>

            <option>Sci-Fi</option>

            <option>Thriller</option>
          </select>
        </div>

        <div className="form-group">
          <label>Release Year</label>

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
