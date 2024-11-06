import React from "react";
import Link from "next/link";
import ClientAuthMenu from "@/components/ClientAuthMenu";

const Navbar = () => {
  return (
    <div className="navbar bg-base-300 sticky top-0 h-20 shadow-md">
      <div className="flex justify-between container mx-auto px-4 h-full">
        {/* Logo redirects to Home */}
        <div className="flex items-center">
          <Link href="/">
            <button className="text-lg font-bold">Logo</button> {/* Replace with Logo component if available */}
          </Link>
        </div>

        {/* Centered Search Bars */}
        <div className="flex space-x-4">
          {/* Search Bar for Places */}
          <div className="form-control">
            <input
              type="text"
              placeholder="Search places"
              className="input input-bordered w-24 md:w-auto text-base-content"
            />
          </div>

          {/* Search Bar for Location/ZIP Code */}
          <div className="form-control">
            <input
              type="text"
              placeholder="ZIP Code"
              className="input input-bordered w-24 md:w-auto text-base-content"
            />
          </div>
        </div>

        {/* Avatar and Dropdown Menu (always on the right) */}
        <ClientAuthMenu />
      </div>
    </div>
  );
};

export default Navbar;
