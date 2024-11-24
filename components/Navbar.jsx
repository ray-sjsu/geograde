"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SearchBox from "./SearchBox"; // Import your custom SearchBox component
import ClientAuthMenu from "./ClientAuthMenu";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [coordinates, setCoordinates] = useState(""); // For storing lat/long
  const router = useRouter();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.push(
      `/search?searchQuery=${encodeURIComponent(searchQuery)}&coordinates=${encodeURIComponent(coordinates)}`
    );
  };

  return (
    <div className="navbar bg-base-300 sticky top-0 h-20 shadow-md z-10">
      <div className="flex justify-between items-center container mx-auto px-4 h-full">
        {/* Logo */}
        <div className="flex items-center">
        {/* MAKE SURE TO CHANGE IT BACK TO THE HOMEPAGE, I'M USING THIS FOR TESTING ONLY */}
          <Link href="/search">
            <button className="text-lg font-bold">Logo</button>
          </Link>
        </div>

        {/* Centered Search Fields */}
        <div className="flex flex-grow justify-center items-center space-x-4">
          {/* Search Query Field */}
          <form onSubmit={handleSearchSubmit} className="w-full max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-sm bg-white text-gray-700 placeholder-gray-400"
                style={{ 
                  height: "36px",
                  borderRadius:"4px",
                }}

              />
            </div>
          </form>

          {/* Coordinates Field */}
          <div className="w-full max-w-md">
            <SearchBox setCoordinates={setCoordinates} />
          </div>
              
        </div>

        {/* Client Auth Menu */}
        <div className="flex items-center">
          <ClientAuthMenu />
        </div>
      </div>
    </div>
  );
};

export default Navbar;