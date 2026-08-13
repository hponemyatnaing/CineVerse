import "./About.css";
import { Link } from "react-router-dom";

function About() {
  return (
    <section className="about-page">
      <div className="about-hero">
        <div className="about-hero-overlay">
          <div className="about-hero-content">
            <span className="about-small-title">WELCOME TO</span>

            <h1>🎬 MoraView</h1>

            <p>Discover movies. Share opinions. Find your next story.</p>

            <Link to="/movies" className="about-explore-btn">
              Browse Movies
            </Link>
          </div>
        </div>
      </div>

      <div className="about-container">
        <div className="about-intro">
          <span>ABOUT US</span>

          <h2>More Than Just Movies</h2>

          <p>
            MoraView is a place for movie lovers to discover new stories,
            explore popular films, and share their opinions with others. Whether
            you are looking for something exciting to watch or simply want to
            find your next favorite movie, MoraView makes discovering movies
            simple and enjoyable.
          </p>
        </div>

        <div className="about-features">
          <div className="about-card">
            <div className="about-icon">🎥</div>

            <h3>Discover Movies</h3>

            <p>
              Explore trending, popular, and latest movies and discover new
              stories you may love.
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon">⭐</div>

            <h3>Rate & Review</h3>

            <p>
              Share your thoughts, give ratings, and see what other movie lovers
              think about their favorite films.
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon">❤️</div>

            <h3>Save Favorites</h3>

            <p>
              Keep your favorite movies together in one place so you can easily
              find and enjoy them again.
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon">🔥</div>

            <h3>Find What's Trending</h3>

            <p>
              Discover movies that are getting attention and find out what
              people are watching right now.
            </p>
          </div>
        </div>

        <div className="why-moraview">
          <div className="why-content">
            <span>WHY MORAVIEW?</span>

            <h2>Your Next Movie Is Waiting</h2>

            <p>
              Choosing a movie should be exciting, not difficult. MoraView
              brings movies, ratings, reviews, and favorites together in one
              simple place.
            </p>

            <p>
              From discovering a new release to finding an old favorite,
              MoraView helps you spend less time searching and more time
              enjoying great stories.
            </p>

            <Link to="/movies" className="about-secondary-btn">
              Browse Movies
            </Link>
          </div>
        </div>

        <div className="about-goal">
          <div className="goal-content">
            <span>OUR GOAL</span>

            <h2>Making Movie Discovery Better</h2>

            <p>
              "Making it easier for movie lovers to discover, explore, and enjoy
              great stories."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
