"use client";

import React, { useState } from "react";
import { ImageKitProvider, IKUpload } from "imagekitio-next";
import ImageKitImage from "@/components/image-kit/ImageKitImage";
import { setDoc, doc } from "firebase/firestore";
import { firestore } from "@/app/firebase/config";

const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

const authenticator = async () => {
  try {
    const res = await fetch(`/api/auth/upload-auth`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Authentication failed! " + res.statusText);
    }
    const data = await res.json();
    return {
      token: data.token,
      signature: data.signature,
      expire: data.expire,
    };
  } catch (err) {
    throw new Error("Authentication failed!");
  }
};

const UploadPhotoModal = ({ locationId, userId, isOpen, onClose, onUploadSuccess }) => {
  const [fileName, setFileName] = useState(null); // Temporary file path
  const [previewUrl, setPreviewUrl] = useState(null); // Preview image URL
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const availableCategories = ["Outlets", "Vibe", "Seating", "Menu", "Food and Drink", "Exterior"];

  const toggleCategory = (category) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleUploadSuccess = (res) => {
    setFileName(res.filePath); // Store file path temporarily
    setPreviewUrl(`${urlEndpoint}/${res.filePath}`); // Show preview
  };

  const handleSubmit = async () => {
    if (!fileName) {
      setError("Please upload a file before submitting.");
      return;
    }
    try {
      setLoading(true);
      const photoData = {
        url: `${urlEndpoint}/${fileName}`,
        categories,
        userId,
        timestamp: new Date(),
      };

      const photoId = fileName.replace(/\//g, "_"); // Replace slashes for valid Firestore ID

      // Save photo to location's photos collection
      const locationPhotoRef = doc(firestore, `locations-${locationId}-photos/${photoId}`);
      await setDoc(locationPhotoRef, photoData);

      // Save photo to user's photos collection
      if (userId) {
        const userPhotoRef = doc(firestore, `users-${userId}-photos/${photoId}`);
        await setDoc(userPhotoRef, { ...photoData, locationId });
      }

      onUploadSuccess(photoData); // Notify parent of successful upload
      setFileName(null); // Reset state
      setPreviewUrl(null);
      setCategories([]);
      setLoading(false);
      onClose(); // Close modal
    } catch (err) {
      setError("Failed to save photo to Firestore.");
      console.error(err);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-300 text-base-content rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-2xl font-bold mb-4">Upload a Photo</h2>

        {/* Categories */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg">Select Categories</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {availableCategories.map((category) => (
              <label key={category} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={category}
                  checked={categories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="form-checkbox"
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* File Upload */}
        <ImageKitProvider
          publicKey={publicKey}
          urlEndpoint={urlEndpoint}
          authenticator={authenticator}
        >
          <IKUpload
            onSuccess={handleUploadSuccess} // Set preview on success
            onError={() => setError("Failed to upload image.")}
            folder={`locations_${locationId}`} // Use underscores for valid folder paths
            useUniqueFileName
            className="w-full"
          />
        </ImageKitProvider>

        {/* Image Preview */}
        {previewUrl && (
          <div className="carousel rounded-box w-full mt-4">
            <div className="carousel-item w-full">
              <ImageKitImage
                src={previewUrl}
                alt="Image Preview"
                className="rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className={`w-full py-2 px-4 mt-4 rounded-lg font-semibold shadow ${
            loading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Photo"}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-4 text-center text-red-500">
            {error}
          </div>
        )}

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 px-4 bg-red-500 text-white font-semibold rounded hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UploadPhotoModal;
