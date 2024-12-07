"use client";

import React, { useEffect, useState } from "react";
import { firestore, auth } from "/app/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import Favorite from "./Favorite";

const FavoritesList = () => {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        const favoritesRef = collection(
          firestore,
          `users/${user.uid}/favorites`
        );
        const favoritesSnapshot = await getDocs(favoritesRef);
        const favoritesList = favoritesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFavorites(favoritesList);
      }
    };
    fetchFavorites();
  }, [user]);

  if (!user) {
    return <p>Please log in to view your favorites.</p>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-base-content text-2xl font-bold mb-4">Favorites</h2>
      {favorites.length === 0 ? (
        
        <div> 
          No favorites added yet.
        </div>
        
      ) : (
        <ul className="space-y-4">
          {favorites.map((favorite) => (
            <li
              key={favorite.id}
            >
              <Favorite 
                key={favorite.id} 
                location={favorite}       
                onRemove={(id) =>
                  setFavorites((prev) => prev.filter((item) => item.locationId !== id))
              } />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoritesList;
