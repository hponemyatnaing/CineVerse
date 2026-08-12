import { useEffect, useState } from "react";
import "./AdminMovies.css";

import AddMovieForm from "../../components/AddMovieForm/AddMovieForm";

import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

import { getMovies, deleteMovie } from "../../services/movieService";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  async function loadMovies() {
    try {
      setLoading(true);

      const data = await getMovies();

      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setMovies(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const ok = window.confirm("Delete this movie?");

    if (!ok) return;

    const result = await deleteMovie(id);

    if (result.success) {
      loadMovies();
    } else {
      alert(result.message);
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading Movies..." />;
  }

  const filteredMovies = movies.filter((movie) =>
    movie.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingMovie ? "Edit Movie" : "Add Movie"}</h2>

              <button
                className="close-btn"
                onClick={() => {
                  setEditingMovie(null);
                  setShowModal(false);
                }}
              >
                ✕
              </button>
            </div>

            <AddMovieForm
              movie={editingMovie}
              onClose={() => {
                setEditingMovie(null);
                setShowModal(false);
              }}
              onSuccess={loadMovies}
            />
          </div>
        </div>
      )}

      <div className="admin-header">
        <h1>Manage Movies</h1>

        <button
          className="add-btn"
          onClick={() => {
            setEditingMovie(null);
            setShowModal(true);
          }}
        >
          <FaPlus />
          Add Movie
        </button>
      </div>

      <input
        className="search-box"
        placeholder="Search movie..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading Movies...</p>
      ) : (
        <table className="movie-table">
          <thead>
            <tr>
              <th>Poster</th>

              <th>Title</th>

              <th>Genre</th>

              <th>Year</th>

              <th>Rating</th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredMovies.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No Movies Found
                </td>
              </tr>
            ) : (
              filteredMovies.map((movie) => (
                <tr key={movie.id}>
                  <td>
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="movie-thumb"
                    />
                  </td>

                  <td>{movie.title}</td>

                  <td>{movie.genre}</td>

                  <td>{movie.year}</td>

                  <td>{movie.rating}</td>

                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setEditingMovie(movie);
                        setShowModal(true);
                      }}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(movie.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </>
  );
}

export default AdminMovies;
