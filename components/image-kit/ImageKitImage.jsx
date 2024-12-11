"use client";
import Image from "next/image";
import React from "react";

const ImageKitImage = ({ src, alt, ...props }) => {
  const fallbackImage = "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <Image
      src={src || fallbackImage}
      alt={alt || "Image"}
      {...props} // Pass transformation or styling props
      className={`${props.className || ""} object-cover`} // Ensure object-fit styling
      height={500}
      width={500}
    />
  );
};

export default ImageKitImage;
