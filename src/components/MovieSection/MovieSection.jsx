import "./MovieSection.css";

import MovieCard from "../MovieCard/MovieCard";

import { Swiper, SwiperSlide } from "swiper/react";

import {
  Navigation,
  Autoplay,
  Pagination,
  Keyboard,
  Mousewheel,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function MovieSection({ title, movies = [] }) {
  if (!movies.length) return null;

  return (
    <section className="movie-section">
      <div className="section-header">
        <h2>{title}</h2>

        <button className="view-all-btn">View All →</button>
      </div>

      <Swiper
        modules={[Navigation, Autoplay, Pagination, Keyboard, Mousewheel]}
        navigation
        keyboard={{
          enabled: true,
        }}
        mousewheel={{
          forceToAxis: true,
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        loop={movies.length > 5}
        grabCursor={true}
        spaceBetween={20}
        breakpoints={{
          1400: {
            slidesPerView: 6,
          },

          1200: {
            slidesPerView: 5,
          },

          992: {
            slidesPerView: 4,
          },

          768: {
            slidesPerView: 3,
          },

          576: {
            slidesPerView: 2,
          },

          0: {
            slidesPerView: 1.3,
          },
        }}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <MovieCard movie={movie} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default MovieSection;
