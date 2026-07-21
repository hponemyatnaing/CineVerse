import "./Hero.css";
import { FaPlay, FaInfoCircle } from "react-icons/fa";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>

      <div className="hero-content container">
        <h1>Avengers: Endgame</h1>

        <p>
          After the devastating events of Infinity War, the Avengers assemble
          once more to reverse Thanos' actions and restore balance.
        </p>

        <div className="hero-buttons">
          <button className="btn primary">
            <FaPlay /> Watch
          </button>

          <button className="btn secondary">
            <FaInfoCircle /> More Info
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
