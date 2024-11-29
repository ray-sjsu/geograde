import React from 'react'

const Review = () => {
  return (
    <div key={id} className="card bg-neutral shadow-2xl w-full">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title text-xl font-bold text-neutral-content">
                User: {userEmail || "Anonymous"}
              </h2>
              <p className="text-yellow-500">
                {Array(rating).fill("⭐️").join(" ")}
              </p>
            </div>
            <p className="text-neutral-content mt-2">{textContent}</p>
            <p className="text-neutral-content mt-2">Noise Level: {noiseLevel}/5</p>
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
  )
}

export default Review