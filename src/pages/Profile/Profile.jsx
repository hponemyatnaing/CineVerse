import "./Profile.css";

import { useEffect, useState } from "react";

import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import UserStats from "../../components/UserStats/UserStats";
import UserReviews from "../../components/UserReviews/UserReviews";
import UserFavorites from "../../components/UserFavorites/UserFavorites";

import EditProfileModal from "../../components/EditProfileModal/EditProfileModal";

import { getUserProfile } from "../../services/userService";

function Profile() {
  const [user, setUser] = useState(null);

  // NEW FEATURE
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));

    if (data?.uid) {
      loadUser(data.uid);
    }
  }, []);

  async function loadUser(uid) {
    const result = await getUserProfile(uid);

    setUser(result);
  }

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="profile-page">
      {/* NEW FEATURE : EDIT PROFILE BUTTON */}

      <ProfileHeader

        user={user}

        openEdit={
          () => setShowEdit(true)
        }

      />

      <UserStats user={user} />

      {/* ORIGINAL CODE */}

      <UserReviews userId={user.uid} />

      {/* ORIGINAL CODE */}

      <UserFavorites userId={user.uid} />

      {/* NEW FEATURE */}

      {showEdit && (
        <EditProfileModal
          user={user}
          closeModal={() => setShowEdit(false)}
          refreshUser={() => loadUser(user.uid)}
        />
      )}
    </div>
  );
}

export default Profile;
