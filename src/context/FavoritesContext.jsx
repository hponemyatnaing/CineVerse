import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { saveFavorite } from "../services/favoriteService";

const FavoritesContext = createContext();



export function FavoritesProvider({ children }) {


  const getUserId = () => {

    const user = JSON.parse(
      localStorage.getItem("user")
    );


    return user?.uid;

  };



  const [favorites, setFavorites] = useState(() => {


    const uid = getUserId();


    if (!uid) {

      return [];

    }



    const saved = localStorage.getItem(
      `favorites_${uid}`
    );



    return saved
      ? JSON.parse(saved)
      : [];


  });




  useEffect(() => {


    const uid = getUserId();



    if (uid) {


      localStorage.setItem(

        `favorites_${uid}`,

        JSON.stringify(favorites)

      );


    }


  }, [favorites]);





  const addToFavorites = async (movie) => {


    const success =
      await saveFavorite(movie);



    if (success) {


      setFavorites((prev) => {


        const exists =
          prev.find(
            item =>
              item.id === movie.id
          );


        if (exists)
          return prev;



        return [
          ...prev,
          movie
        ];


      });


    }


  };


  const removeFromFavorites = (id) => {


    setFavorites((prev) =>

      prev.filter(
        movie => movie.id !== id
      )

    );


  };





  return (

    <FavoritesContext.Provider

      value={{

        favorites,

        addToFavorites,

        removeFromFavorites,

      }}

    >

      {children}


    </FavoritesContext.Provider>


  );


}





export function useFavorites() {


  return useContext(
    FavoritesContext
  );


}