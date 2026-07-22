import "./AddMovieForm.css";

import { useState, useEffect } from "react";

import { addMovie, updateMovie } from "../../services/movieService";

function AddMovieForm({ movie, onClose, onSuccess }) {
  const defaultForm = {
    title: "",
    image: "",
    genre: "Action",
    year: "",
    rating: "",
    description: "",
    trailerUrl: "",
    category: "latest",
  };

  const [formData, setFormData] = useState(defaultForm);

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
      setFormData(defaultForm);
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
        alert(movie ? "Movie Updated" : "Movie Added");

        if (onSuccess) onSuccess();

        if (onClose) onClose();

        setFormData(defaultForm);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);

      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="movie-form" onSubmit={handleSubmit}>
      <h2>{movie ? "Edit Movie" : "Add New Movie"}</h2>

      <label>Category</label>

      <select name="category" value={formData.category} onChange={handleChange}>
        <option value="trending">Trending Movies</option>

        <option value="latest">Latest Movies</option>

        <option value="hot">Hot Today</option>
      </select>

      <label>Title</label>

      <input name="title" value={formData.title} onChange={handleChange} />

      <label>Image URL</label>

      <input name="image" value={formData.image} onChange={handleChange} />

      <label>Genre</label>

      <input name="genre" value={formData.genre} onChange={handleChange} />

      <label>Year</label>

      <input
        type="number"
        name="year"
        value={formData.year}
        onChange={handleChange}
      />

      <label>Rating</label>

      <input
        type="number"
        step="0.1"
        name="rating"
        value={formData.rating}
        onChange={handleChange}
      />

      <label>Description</label>

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
      />

      <label>Trailer URL</label>

      <input
        name="trailerUrl"
        value={formData.trailerUrl}
        onChange={handleChange}
        placeholder="YouTube URL"
      />

      <div className="form-buttons">
        <button type="button" onClick={onClose}>
          Cancel
        </button>

        <button disabled={loading}>
          {loading ? "Saving..." : movie ? "Update Movie" : "Add Movie"}
        </button>
      </div>
    </form>
  );
}

export default AddMovieForm;
