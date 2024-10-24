// app/page.jsx
"use client";

import { Ratings } from "@/components/ui/ratings";

export default function HomePage() {
  return (
    <main className="flex-1 min-h-screen">
      {/* Hero Section */}
      <div
        className="h-96 bg-cover bg-center text-center flex items-center justify-center"
        style={{ backgroundImage: `url('/path-to-hero-image.jpg')` }}
      >
        <h1 className="text-4xl font-bold text-white">
          Find the perfect study spot to become an academic weapon
        </h1>
      </div>

      {/* Trending Spots */}
      <section className="py-10 bg-white text-black">
        <h2 className="text-center text-2xl text-gray-800 mb-8">Trending Spots</h2>
        <div className="flex justify-center space-x-6">
          <div className="bg-white rounded-lg shadow-lg w-72">
            <img
              src="/path-to-spot-image.jpg"
              alt="Cafe"
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold">7Leaves Cafe</h3>
              <p className="text-gray-500">Coffee & Tea</p>
              <div className="flex items-center mt-2">
                <Ratings rating={4} />
              </div>
              <p className="text-sm mt-2">
                "Ordered a Assam Black Tea, and it was pretty mid, but the environment was great..."
              </p>
              <a href="#" className="text-blue-500 mt-2 inline-block">Read More</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
