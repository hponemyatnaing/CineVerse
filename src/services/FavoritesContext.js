import { query, collection, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";

// FavoritesContext.js ထဲက useEffect ထဲမှာ ဒီလိုပြင်ပါ
useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      // ဒီနေရာမှာ database ထဲက uid နဲ့ လက်ရှိ login ဝင်ထားတဲ့ user.uid ကို စစ်တာပါ
      const q = query(
        collection(db, "favorites"), 
        where("userId", "==", user.uid) 
      );

      return onSnapshot(q, (snapshot) => {
        const favList = snapshot.docs.map(doc => ({ 
           ...doc.data(), 
           id: doc.id 
        }));
        setFavorites(favList);
      });
    } else {
      setFavorites([]);
    }
  });

  return () => unsubscribe();
}, []);