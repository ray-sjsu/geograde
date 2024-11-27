"use client";
import { IKUpload, ImageKitProvider } from "imagekitio-next";
import React, { useRef, useState } from "react";
import ImageKitImage from "./ImageKitImage";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
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

const UploadImage = () => {
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const ikUploadRef = useRef(null);

  const onError = (err) => {
    console.log("Error", err);
  };

  const onSuccess = (res) => {
    console.log("Success", res);
    setUploadedFileName(res.filePath);
  };

  const onUploadProgress = (progress) => {
    console.log("Progress", progress);
  };

  const onUploadStart = (evt) => {
    console.log("Start", evt);
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        isPrivateFile={false}
        useUniqueFileName={true}
        onError={onError}
        onSuccess={onSuccess}
        onUploadProgress={onUploadProgress}
        onUploadStart={onUploadStart}
        style={{ display: "none" }}
        ref={ikUploadRef}
      />
      <button
        onClick={() => ikUploadRef.current.click()}
        className="p-2 bg-green-500 text-white"
      >
        Custom upload button
      </button>
      {uploadedFileName && (
        <div className="mt-4">
          <h3 className="text-lg font-medium">Uploaded Image Preview:</h3>
          <ImageKitImage
            path={uploadedFileName}
            width={500}
            height={500}
            alt="Alt text"
          />
        </div>
      )}
    </ImageKitProvider>
  );
};

export default UploadImage;
