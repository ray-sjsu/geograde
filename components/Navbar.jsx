"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SearchBox from "./SearchBox"; // Your custom Mapbox Geocoder component
import ClientAuthMenu from "./ClientAuthMenu";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const router = useRouter();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.push(
      `/search?searchQuery=${encodeURIComponent(searchQuery)}${
        coordinates
          ? `&latitude=${encodeURIComponent(coordinates.latitude)}&longitude=${encodeURIComponent(coordinates.longitude)}`
          : ""
      }`
    );
  };

  return (
    <div className="navbar bg-accent sticky top-0 shadow-md z-10">
      {/* Navbar Start - Logo */}
      <div className="navbar-start">
        <Link href="/">
          <div className="btn btn-ghost text-lg font-bold text-white">
            Logo
          </div>
        </Link>
      </div>

      {/* Navbar Center - Search Bars */}
      <div className="navbar-center">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center space-x-2 bg-accent rounded px-2 py-1">
          {/* Keyword Input */}
          <input
            type="text"
            placeholder="Keyword"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input focus:input-primary h-10 w-72 text-gray-700 placeholder-gray-400 rounded-lg"
          />
          {/* Mapbox Geocoder */}
          <div className="flex-grow">
            <SearchBox setCoordinates={setCoordinates} />
          </div>
          {/* Search Button */}
          <button type="submit" className="btn btn-primary btn-sm text-white">
            Search
          </button>
        </form>
      </div>

      {/* Navbar End - Auth Menu */}
      <div className="navbar-end">
        <ClientAuthMenu />
      </div>
    </div>
  );
};

export default Navbar;
