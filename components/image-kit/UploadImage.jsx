"use client";
import { IKUpload, ImageKitProvider } from "imagekitio-next";
import React, { useRef, useState } from "react";
import ImageKitImage from "./ImageKitImage";

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

const UploadImage = ({ locationId = 111111, onUploadSuccess }) => {
  const [data, setData] = useState({
    loading: false,
    error: false,
    uploadedFileName: null,
  });
  const ikUploadRef = useRef(null);

  const generateUniqueFileName = (locationId) => {
    const randomNumber = Math.floor(Math.random() * 1_000_000_000); // Generate a random number
    return `review-${locationId}-${randomNumber}`;
  };

  const onError = (err) => {
    console.log("Error", err);
    setData({
      error: true,
      loading: false,
      uploadedFileName: null,
    });
  };

  const onSuccess = (res) => {
    console.log("Success", res);
    const uploadedFileName = res.filePath;
    setData((prev) => ({
      ...prev,
      loading: false,
      uploadedFileName,
    }));
    onUploadSuccess(uploadedFileName);
  };

  const onUploadProgress = (progress) => {
    console.log("Progress", progress);
    setData((prev) => ({
      ...prev,
      loading: true,
    }));
  };

  const onUploadStart = (evt) => {
    console.log("Start", evt);
    setData((prev) => ({
      ...prev,
      loading: true,
    }));
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        isPrivateFile={false}
        useUniqueFileName={false}
        fileName={generateUniqueFileName(locationId)}
        onError={onError}
        onSuccess={onSuccess}
        onUploadProgress={onUploadProgress}
        onUploadStart={onUploadStart}
        style={{ display: "none" }}
        ref={ikUploadRef}
      />

      <button
        onClick={() => ikUploadRef.current.click()}
        className={`w-full py-2 px-4 rounded-lg font-semibold shadow ${
          data.loading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-green-500 text-white hover:bg-green-600"
        }`}
        disabled={data.loading}
      >
        {data.loading ? "Uploading..." : "Choose an Image to Upload"}
      </button>

      {data.uploadedFileName && !data.error && !data.loading && (
        <div className="mt-6 text-center">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Uploaded Image Preview:
          </h3>
          <ImageKitImage
            path={data.uploadedFileName}
            width={500}
            height={500}
            alt="Uploaded Image"
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {data.error && !data.loading && (
        <div className="mt-6 text-center">
          <h3 className="text-lg font-medium text-red-500">
            Failed to upload image. Please try again.
          </h3>
        </div>
      )}

      {data.loading && (
        <div className="mt-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-green-500 border-opacity-75 mx-auto"></div>
          <p className="mt-2 text-gray-500">Uploading, please wait...</p>
        </div>
      )}
    </ImageKitProvider>
  );
};

export default UploadImage;
