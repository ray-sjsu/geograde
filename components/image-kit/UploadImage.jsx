"use client";

import React, { useState, useRef } from "react";
import { IKUpload, ImageKitProvider } from "imagekitio-next";

const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

const authenticator = async () => {
  try {
    const res = await fetch(`/api/auth/upload-auth`, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Authentication failed! " + res.statusText);
    }

    const data = await res.json();
    const { token, signature, expire } = data;
    return {
      token,
      signature,
      expire,
    };
  } catch (err) {
    throw new Error("Authentication failed!");
  }
};

const UploadPhotoModal = ({ locationId, userId, isOpen, onClose, onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const ikUploadRef = useRef(null);

  const categories = ["Outlets", "Vibe", "Seating", "Menu", "Food and Drink"];

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const generateUniqueFileName = (locationId, userId) => {
    const randomNumber = Math.floor(Math.random() * 1_000_000_000);
    return `placephoto-${locationId}-${userId}-${randomNumber}`;
  };

  const handleSuccess = (res) => {
    const uploadedFileName = res.filePath;
    const photoData = {
      url: `${urlEndpoint}/${uploadedFileName}`,
      categories: selectedCategories,
      userId: userId,
      timestamp: new Date(),
    };
    onUploadSuccess(photoData);
    setUploadedFileName(uploadedFileName);
    setLoading(false);
    onClose(); // Close the modal after successful upload
  };

  const handleError = () => {
    setError(true);
    setLoading(false);
  };

  const handleStart = () => {
    setLoading(true);
    setError(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-300 text-base-content rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-2xl font-bold mb-4">Upload a Photo</h2>

        {/* Categories Selection */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg">Select Categories</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="form-checkbox"
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <ImageKitProvider
          publicKey={publicKey}
          urlEndpoint={urlEndpoint}
          authenticator={authenticator}
        >
          <IKUpload
            isPrivateFile={false}
            useUniqueFileName={false}
            fileName={generateUniqueFileName(locationId, userId)}
            onError={handleError}
            onSuccess={handleSuccess}
            onUploadStart={handleStart}
            style={{ display: "none" }}
            ref={ikUploadRef}
          />
        </ImageKitProvider>

        <button
          onClick={() => ikUploadRef.current.click()}
          className={`w-full py-2 px-4 rounded-lg font-semibold shadow ${
            loading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Choose an Image to Upload"}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-4 text-center text-red-500">
            Failed to upload. Please try again.
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
