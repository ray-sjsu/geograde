"use client";

import React from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import Logo from "./Logo";
import Button from "./Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { URL_SIGN_IN } from "@/lib/CONSTANTS";

const Navbar = ({ toggle }) => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const handleProfileClick = () => {
    router.push("/profile"); // Redirect to the profile page
  };

  return (
    <>
      <div className="w-full h-20 bg-emerald-800 sticky top-0">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <Logo />

            {/* Hamburger Menu Button for Mobile */}
            <button
              type="button"
              className="inline-flex items-center md:hidden"
              onClick={toggle}
            >
              <span className="text-white">Menu</span>
            </button>

            {/* Navigation Links */}
            <ul className="hidden md:flex gap-x-6 text-white">
              <li>
                <Link href="/search">
                  <p>Browse</p>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <p>Contact Us</p>
                </Link>
              </li>
            </ul>

            {/* Profile or Sign In Button */}
            <div className="hidden md:flex items-center">
              {user ? (
                // Show Profile Picture if Signed In
                <div
                  className="w-10 h-10 rounded-full overflow-hidden cursor-pointer border-2 border-white"
                  onClick={handleProfileClick}
                >
                  <Image
                    src={user.photoURL || "/images/Logo.png"}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
              ) : (
                <Button />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
