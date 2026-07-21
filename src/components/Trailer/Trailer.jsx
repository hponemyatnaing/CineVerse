import "./Trailer.css";

function Trailer({ videos = [], movieTitle, trailerUrl }) {

  if (trailerUrl) {
    return (
      <div className="trailer-section">
        <h2>Official Trailer</h2>

        <iframe
          className="trailer-video"
          src={trailerUrl.replace("watch?v=", "embed/")}
          title={movieTitle}
          frameBorder="0"
          allow="
          accelerometer;
          autoplay;
          clipboard-write;
          encrypted-media;
          gyroscope;
          picture-in-picture
          "
          allowFullScreen
        />
      </div>
    );
  }

  const trailer =
    videos.find(
      (video) => video.site === "YouTube" && video.type === "Trailer",
    ) || videos.find((video) => video.site === "YouTube");

  return (
    <div className="trailer-section">
      <h2>Official Trailer</h2>

      {trailer ? (
        <iframe
          className="trailer-video"
          src={`https://www.youtube.com/embed/${trailer.key}`}
          title={movieTitle}
          frameBorder="0"
          allow="
            accelerometer;
            autoplay;
            clipboard-write;
            encrypted-media;
            gyroscope;
            picture-in-picture
            "
          allowFullScreen
        />
      ) : (
        <p className="no-trailer">No Trailer Available.</p>
      )}
    </div>
  );
}

export default Trailer;
