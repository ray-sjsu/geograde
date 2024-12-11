import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore, auth } from "@/app/firebase/config";
import FavoritesList from "@/components/Favorites/FavoritesList"; 
import UserReviews from "@/components/reviews/UserReviews"; 
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import AccountInformation from "./AccountInformation";
import UserPhotos from "./UserPhotos";
import Image from "next/image";

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
    return (
      <div className="text-lg text-center mt-10">Please sign in to access your profile.</div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-neutral select-none">
      {/* Sidebar Navigation */}
      <div className="md:w-1/4 w-full bg-base-100 text-base-content p-6">
        <div className="flex justify-center mb-6">
          <Image
            alt="User Avatar"
            src={user.photoURL || "/images/default.png"} // Use default avatar if none
            className="rounded-full w-32 h-32"
            width={500}
            height={500}
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
          <li
            className={`btn ${activeSection === "photos" ? "btn-secondary" : "btn-primary"}`}
            onClick={() => setActiveSection("photos")}
          >
            Photos
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 text-base-content bg-base-300">
        {!loading && activeSection === "account" && <AccountInformation />}
        {!loading && activeSection === "favorites" && <FavoritesList favorites={favorites} />}
        {!loading && activeSection === "reviews" && (
          <div>
            <UserReviews userId={user.uid} />
          </div>
        )}
        {!loading && activeSection === "photos" && (
          <div>
            <UserPhotos />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
