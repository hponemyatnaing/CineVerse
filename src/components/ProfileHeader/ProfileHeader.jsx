// import "./ProfileHeader.css";

// import { useState } from "react";

// import {
//     updateUserProfile
// } from "../../services/userService";


// function ProfileHeader({ user }) {


//     const [edit, setEdit] = useState(false);


//     const [name, setName] = useState(
//         user.name
//     );



//     async function saveProfile() {


//         await updateUserProfile(
//             user.uid,
//             {
//                 name: name
//             }
//         );


//         setEdit(false);


//         window.location.reload();


//     }



//     return (

//         <div className="profile-header">


//             <img

//                 src={
//                     user.avatar ||
//                     "https://i.pravatar.cc/150"
//                 }

//             />



//             <div>


//                 {
//                     edit ? (

//                         <input

//                             value={name}

//                             onChange={
//                                 (e) => setName(e.target.value)
//                             }

//                         />

//                     )

//                         :

//                         (

//                             <h2>
//                                 {name}
//                             </h2>

//                         )

//                 }



//                 <p>
//                     {user.email}
//                 </p>


//                 <span>
//                     {user.role}
//                 </span>



//                 <br />


//                 <button

//                     onClick={() => {

//                         edit ? saveProfile() : setEdit(true)

//                     }}

//                 >

//                     {
//                         edit ?

//                             "Save"

//                             :

//                             "Edit Profile"

//                     }


//                 </button>



//             </div>


//         </div>

//     )

// }


// export default ProfileHeader;

import "./ProfileHeader.css";

import { useNavigate } from "react-router-dom";

import {
    logoutUser
} from "../../services/userService";



function ProfileHeader({

    user,

    openEdit

}) {


    const navigate = useNavigate();





    function handleLogout() {


        const confirmLogout =
            window.confirm(
                "Are you sure you want to logout?"
            );



        if (confirmLogout) {


            logoutUser();



            navigate(
                "/login"
            );


        }


    }





    return (


        <div className="profile-header">





            <div className="profile-avatar">


                {

                    user.avatar ?


                        <img

                            src={user.avatar}

                            alt={user.name}

                        />


                        :


                        <div className="avatar-default">


                            {
                                user.name
                                    ?
                                    user.name.charAt(0)
                                    :
                                    "U"
                            }


                        </div>


                }


            </div>








            <div className="profile-info">


                <h1>

                    {user.name}

                </h1>



                <p>

                    📧 {user.email}

                </p>



                <span className="role-badge">

                    {user.role || "USER"}

                </span>





                {

                    user.createdAt &&


                    <small>

                        Joined:

                        {" "}

                        {
                            new Date(
                                user.createdAt
                            )
                                .toLocaleDateString()
                        }


                    </small>


                }




                <div className="profile-actions">


                    <button

                        className="edit-btn"

                        onClick={openEdit}

                    >

                        ✏️ Edit Profile

                    </button>





                    <button

                        className="logout-btn"

                        onClick={handleLogout}

                    >

                        🚪 Logout

                    </button>


                </div>





            </div>





        </div>


    )


}


export default ProfileHeader;