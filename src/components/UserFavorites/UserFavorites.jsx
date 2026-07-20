import "./UserFavorites.css";

import { useEffect, useState } from "react";



function UserFavorites({ userId }) {


    const [favorites, setFavorites] = useState([]);



    useEffect(() => {


        if (userId) {

            loadFavorites();

        }


    }, [userId]);





    function loadFavorites() {


        const data =
            localStorage.getItem(
                `favorites_${userId}`
            );



        if (data) {

            setFavorites(
                JSON.parse(data)
            );

        }


    }





    return (

        <div className="user-favorites">


            <h2>
                ❤️ My Favorites
            </h2>



            {
                favorites.length === 0 ?


                    (

                        <div className="empty-favorite">

                            No Favorite Movies Yet

                        </div>

                    )


                    :


                    (

                        <div className="favorite-grid">


                            {
                                favorites.map((movie) => (


                                    <div
                                        className="favorite-card"
                                        key={movie.id}
                                    >


                                        <img
                                            src={
                                                movie.poster ||
                                                movie.poster_path
                                            }
                                        />


                                        <h3>
                                            {
                                                movie.title
                                            }
                                        </h3>


                                    </div>


                                ))
                            }


                        </div>

                    )


            }



        </div>

    );


}


export default UserFavorites;