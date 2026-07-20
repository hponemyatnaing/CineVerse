import { getMovies } from "./movieService";
import { getTrendingMovies } from "./tmdbService";


// =================================
// NETFLIX STYLE TOP 10 RANKING
// =================================

export const getTop10Ranking = async () => {

  try {

    // Firebase Admin Movies
    const firebaseMovies = await getMovies();


    // TMDB Trending Movies
    const tmdbMovies = await getTrendingMovies();



    // Combine Movies

    const allMovies = [

      ...firebaseMovies,

      ...tmdbMovies

    ];



    // Remove duplicate movies

    const uniqueMovies =
      allMovies.filter(
        (movie,index,self)=>

        index ===
        self.findIndex(
          item=>item.id === movie.id
        )

      );



    // Calculate Ranking Score

    const rankingMovies =
      uniqueMovies.map(movie=>{


        const views =
        Number(movie.views) || 0;



        const rating =
        Number(
          movie.rating ||
          movie.vote_average
        ) || 0;



        const popularity =
        Number(
          movie.popularity
        ) || 0;



        const score =

        (views * 0.6)

        +

        (rating * 10 * 0.3)

        +

        (popularity * 0.1);



        return{

          ...movie,

          score

        };


      });



    return rankingMovies

    .sort(
      (a,b)=>
      b.score-a.score
    )

    .slice(0,10);



  }

  catch(error){

    console.log(
      "Ranking Error:",
      error
    );


    return [];

  }


};