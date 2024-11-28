"use client";
import React from "react";

const Review = ({ rating, noiseLevel, textContent, userEmail, date, additionalFeedback }) => {
  return (
    <div className="card bg-neutral shadow-lg w-full">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <h2 className="card-title text-xl font-bold text-neutral-content">
            {userEmail || "Anonymous"}
          </h2>
          <p className="text-yellow-500 ml-5">
            {Array(rating).fill("⭐️").join(" ")}
          </p>
        </div>
        <p className="text-neutral-content mt-2">{textContent}</p>
        <p className="text-neutral-content mt-2">Noise Level: {noiseLevel}/5</p>
        <div className="mt-4">
          {additionalFeedback &&
            Object.keys(additionalFeedback).map((key) =>
              additionalFeedback[key] ? (
                <p key={key} className="text-neutral-content">
                  ✅ {key.replace(/([A-Z])/g, " $1")}
                </p>
              ) : null
            )}
        </div>
        <div className="text-sm text-neutral-content text-right">
          Posted on:{" "}
          {date
            ? new Date(date.seconds * 1000).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "N/A"}
        </div>
      </div>
    </div>
  );
};

export default Review;
