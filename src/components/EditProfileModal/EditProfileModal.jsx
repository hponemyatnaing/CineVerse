import "./EditProfileModal.css";

import {
    useState
} from "react";


import {
    updateUserProfile
} from "../../services/userService";



function EditProfileModal({
    user,
    closeModal,
    refreshUser
}) {


    const [name, setName] = useState(
        user.name || ""
    );


    const [avatar, setAvatar] = useState(
        user.avatar || ""
    );



    async function handleSave() {


        const success =
            await updateUserProfile(

                user.uid,

                {

                    name,

                    avatar

                }

            );



        if (success) {


            refreshUser();


            closeModal();


        }



    }





    return (


        <div className="modal-overlay">


            <div className="edit-modal">


                <h2>
                    Edit Profile
                </h2>



                <label>
                    Name
                </label>


                <input

                    value={name}

                    onChange={
                        e => setName(e.target.value)
                    }

                />



                <label>
                    Avatar URL
                </label>


                <input

                    value={avatar}

                    onChange={
                        e => setAvatar(e.target.value)
                    }

                />



                <div className="modal-buttons">


                    <button
                        onClick={handleSave}
                    >

                        Save

                    </button>



                    <button
                        onClick={closeModal}
                    >

                        Cancel

                    </button>


                </div>


            </div>


        </div>


    )


}


export default EditProfileModal;