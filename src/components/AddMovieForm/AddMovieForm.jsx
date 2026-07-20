import "./AddMovieForm.css";

import { useState, useEffect } from "react";

import { addMovie, updateMovie } from "../../services/movieService";

function AddMovieForm({ movie, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    genre: "Action",
    year: "",
    rating: "",
    description: "",
    trailerUrl: "",
    category: "latest",
  });

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
        category: movie.category || "latest",
      });
    } else {
      setFormData({
        title: "",
        image: "",
        genre: "Action",
        year: "",
        rating: "",
        description: "",
        category: "latest",
      });
    }
  }, [movie]);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      let result;

      if (movie) {
        result = await updateMovie(movie.id, formData);
      } else {
        result = await addMovie(formData);
      }

      if (result.success) {
        alert(movie ? "Movie Updated!" : "Movie Added!");

        if (onSuccess) {
          onSuccess();
        }

        if (onClose) {
          onClose();
        }

        setFormData({
          title: "",
          image: "",
          genre: "Action",
          year: "",
          rating: "",
          description: "",
        });
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="movie-form" onSubmit={handleSubmit}>
      <h2>{movie ? "Edit Movie" : "Add New Movie"}</h2>

      <div className="form-group">
        <label>Movie Category</label>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="trending">Trending Movies</option>

          <option value="latest">Latest Movies</option>

          <option value="hot">Hot Today Movies</option>
        </select>
      </div>

      <div className="form-group">
        <label>Movie Title</label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Poster Image URL</label>

        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
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

        <input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleChange}
          required
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
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>

        <textarea
          rows="5"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Trailer YouTube URL"
          value={formData.trailerUrl}
          onChange={(e) =>
            setFormData({
              ...formData,
              trailerUrl: e.target.value,
            })
          }
        />
        <button type="button" className="cancel-btn" onClick={onClose}>
          Cancel
        </button>

        <button type="submit" className="save-btn" disabled={loading}>
          {loading ? "Saving..." : movie ? "Update Movie" : "Add Movie"}
        </button>
      </div>
    </form>
  );
}

export default AddMovieForm;
