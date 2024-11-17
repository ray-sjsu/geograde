// Navbar.jsx
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
      `/browse?searchQuery=${encodeURIComponent(searchQuery)}&coordinates=${encodeURIComponent(coordinates)}`
    );
  };

  return (
    <div className="navbar bg-base-300 sticky top-0 h-20 shadow-md z-10">
      <div className="flex justify-between container mx-auto px-4 h-full">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <button className="text-lg font-bold">Logo</button>
          </Link>
        </div>

        {/* Search Query Field */}
        <form onSubmit={handleSearchSubmit} className="form-control">
          <input
            type="text"
            placeholder="Search places"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full md:w-auto"
          />
        </form>

        {/* Coordinates Field */}
        <SearchBox setCoordinates={setCoordinates} /> {/* Custom component */}

        {/* Client Auth Menu */}
        <ClientAuthMenu />
      </div>
    </div>
  );
};

export default Navbar;
