import "./About.css";

function About() {
  return (
    <section className="about-page">
      <div className="about-container">
        <h1>🎬 About CineVerse</h1>

        <p className="about-description">
          CineVerse is a Movie Review and Rating Website built using React.js.
          Users can browse trending movies, search movies, save favorites, and
          explore detailed movie information.
        </p>

        <div className="about-grid">
          <div className="about-card">
            <h3>🎥 Movie Features</h3>

            <ul>
              <li>Trending Movies</li>
              <li>Movie Details</li>
              <li>Trailer</li>
              <li>Favorites</li>
              <li>Search</li>
            </ul>
          </div>

          <div className="about-card">
            <h3>🛠 Technologies</h3>

            <ul>
              <li>React.js</li>
              <li>React Router</li>
              <li>TMDB API</li>
              <li>Firebase</li>
              <li>CSS3</li>
            </ul>
          </div>

          <div className="about-card">
            <h3>👨‍💻 Developer</h3>

            <p>
              Internship Final Project developed to demonstrate frontend
              development skills using modern React.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
