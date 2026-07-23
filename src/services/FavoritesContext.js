import { query, collection, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";

useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      const q = query(
        collection(db, "favorites"),
        where("userId", "==", user.uid),
      );

      return onSnapshot(q, (snapshot) => {
        const favList = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setFavorites(favList);
      });
    } else {
      setFavorites([]);
    }
  });

  return () => unsubscribe();
}, []);
