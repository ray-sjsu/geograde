"use client";
import React, { useState, useEffect } from "react";
import { firestore, auth } from "/app/firebase/config";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";

const FavoriteButton = ({ locationId, locationName }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const checkFavorite = async () => {
        const favoriteDoc = doc(firestore, `users/${user.uid}/favorites/${locationId}`);
        const docSnap = await getDoc(favoriteDoc);
        setIsFavorite(docSnap.exists());
      };
      checkFavorite();
    }
  }, [user, locationId]);

  const toggleFavorite = async () => {
    if (!user) {
      alert("Please log in to favorite locations.");
      return;
    }
    const favoriteDoc = doc(firestore, `users/${user.uid}/favorites/${locationId}`);
    if (isFavorite) {
      await deleteDoc(favoriteDoc);
      setIsFavorite(false);
    } else {
      await setDoc(favoriteDoc, { locationId, locationName });
      setIsFavorite(true);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`btn btn-sm ml-5 ${isFavorite ? "btn-error" : "btn-primary"}`}
    >
      {isFavorite ? "Remove Favorite" : "Add to Favorites"}
    </button>
  );
};

export default FavoriteButton;
