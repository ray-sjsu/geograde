"use client";
import React from "react";

const ImageKitImage = ({ src, alt, ...props }) => {
  const fallbackImage = "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <img
      src={src || fallbackImage}
      alt={alt || "Image"}
      {...props} // Pass transformation or styling props
      className={`${props.className || ""} object-cover`} // Ensure object-fit styling
    />
  );
};

export default ImageKitImage;
