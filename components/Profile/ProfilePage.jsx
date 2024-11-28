import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore, auth } from "@/app/firebase/config";
import FavoritesList from "@/components/Favorites/FavoritesList"; // Adjust path as needed
import UserReviews from "@/components/UserReviews"; // Import the UserReviews component
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState("account");
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user favorites
  useEffect(() => {
    const fetchUserData = async (currentUser) => {
      try {
        const favoritesRef = collection(firestore, `users/${currentUser.uid}/favorites`);
        const favoritesSnapshot = await getDocs(favoritesRef);
        const fetchedFavorites = favoritesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFavorites(fetchedFavorites);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserData(currentUser);
      } else {
        setUser(null);
        setFavorites([]);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return <p className="text-center mt-10 text-lg">Please sign in to access your profile.</p>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-neutral select-none">
      {/* Sidebar Navigation */}
      <div className="md:w-1/4 w-full bg-base-100 text-base-content p-6">
        <div className="flex justify-center mb-6">
          <img
            alt="User Avatar"
            src={user.photoURL || "/default-avatar.png"} // Use default avatar if none
            className="rounded-full w-32 h-32"
          />
        </div>
        <h2 className="text-xl text-center font-semibold mb-4">Profile</h2>
        <ul className="flex flex-col space-y-4">
          <li
            className={`btn ${activeSection === "account" ? "btn-secondary" : "btn-primary"}`}
            onClick={() => setActiveSection("account")}
          >
            Account Information
          </li>
          <li
            className={`btn ${activeSection === "favorites" ? "btn-secondary" : "btn-primary"}`}
            onClick={() => setActiveSection("favorites")}
          >
            Favorites
          </li>
          <li
            className={`btn ${activeSection === "reviews" ? "btn-secondary" : "btn-primary"}`}
            onClick={() => setActiveSection("reviews")}
          >
            Reviews
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 text-base-content bg-base-300">
        {loading && (
          <div className="flex justify-center items-center h-full">
            <DotLottieReact
              src="https://lottie.host/d7b40a97-71fd-440e-b8e0-27d70c412526/pyLG2GiGIs.lottie"
              loop
              autoplay
            />
          </div>
        )}
        {!loading && activeSection === "favorites" && <FavoritesList favorites={favorites} />}
        {!loading && activeSection === "reviews" && (
          <div>
            {/* Use the UserReviews component */}
            <UserReviews userId={user.uid} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
