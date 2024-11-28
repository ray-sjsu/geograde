"use client";
import ImageKitImage from "@/components/image-kit/ImageKitImage";
import UploadImage from "@/components/image-kit/UploadImage";
import React, { useState } from "react";



const ImageKitPage = () => {
  const handleUploadSuccess = (fileName) => {
    console.log("Uploaded file:", fileName);
    console.log("Store fileName within reviews in Firestore. To retrieve this specific image, use ImageKitImage. Set path to path={fileName} to retrieve the uploaded image.");
  };

  return (
    <div className="bg-white text-black">
      <div>
        <h1>ImageKit Next.js quick start</h1>
        <ImageKitImage
          path="test.jpg"
          width={500}
          height={500}
          alt="Alt text"
        />
      </div>
      <div>
        <h1>Upload images</h1>
        <UploadImage locationId={123456} onUploadSuccess={handleUploadSuccess} />
      </div>
    </div>
  );
};

export default ImageKitPage;
