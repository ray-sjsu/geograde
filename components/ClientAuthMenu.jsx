// components/ClientAuthMenu.jsx
"use client";

import React from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "/app/firebase/config";
import { signOut } from "firebase/auth";

const ClientAuthMenu = () => {
  const [user] = useAuthState(auth);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          {user ? (
            <img
              alt="User Avatar"
              src={user.photoURL || "/default-avatar.png"} // Use default avatar if none
            />
          ) : (
            <div className="bg-gray-300 w-full h-full rounded-full" />
          )}
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow text-base-content"
      >
        {user ? (
          <>
            <li>
              <Link href="/profile">Profile</Link>
            </li>
            <li>
              <Link href="/settings">Settings</Link>
            </li>
            <li>
              <Link href="/favorites">Favorites</Link>
            </li>
            <li>
              <Link href="/reviews">Reviews</Link>
            </li>
            <li>
              <a onClick={handleLogout} className="text-red-500">
                Logout
              </a>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/sign-in">Sign In</Link>
            </li>
            <li>
              <Link href="/sign-up">Register</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default ClientAuthMenu;
