"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, firestore } from "@/app/firebase/config";
import Image from "next/image";

const UserPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user-submitted photos
  useEffect(() => {
    const fetchPhotos = async () => {
      const user = auth.currentUser;

      if (!user) {
        setError("You need to be logged in to view your photos.");
        setLoading(false);
        return;
      }

      try {
        const photosCollection = collection(firestore, `users/${user.uid}/photos`);
        const photosSnapshot = await getDocs(photosCollection);
        const photosData = photosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPhotos(photosData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching photos:", error);
        setError("Failed to fetch photos. Please try again later.");
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  // Handle photo deletion
  const handleDeletePhoto = async (photoId, locationId) => {
    const user = auth.currentUser;
  
    if (!user) {
      alert("You need to be logged in to delete a photo.");
      return;
    }
  
    try {
      // Delete from user's photos subcollection
      const userPhotoRef = doc(firestore, `users/${user.uid}/photos/${photoId}`);
      await deleteDoc(userPhotoRef);
  
      // Delete from location's photos subcollection
      if (locationId) {
        const locationPhotoRef = doc(firestore, `locations/${locationId}/photos/${photoId}`);
        await deleteDoc(locationPhotoRef);
      }
  
      // Update local state
      setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.photoId !== photoId));
    } catch (error) {
      console.error("Error deleting photo:", error);
      alert("Failed to delete photo. Please try again.");
    }
  };
  
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p>Loading photos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center">
        <p>No photos uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div key={photo.id} className="relative group">
          {/* Image */}
          <Image
            src={photo.url}
            alt={`Photo`}
            height={200}
            width={300}
            className="rounded-md w-full"
          />
          {/* Delete Button */}
          <button
            onClick={() => handleDeletePhoto(photo.id, photo.locationId)}
            className="absolute top-2 right-2 btn btn-sm btn-square btn-outline btn-error text-sm px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserPhotos;
