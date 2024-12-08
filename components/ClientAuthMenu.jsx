// components/ClientAuthMenu.jsx
"use client";

import React from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "/app/firebase/config";
import { signOut } from "firebase/auth";
import { usePathname } from "next/navigation";

const ClientAuthMenu = () => {
  const [user] = useAuthState(auth);
  const pathname = usePathname(); 
  const currentPath = encodeURIComponent(pathname);
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
              src={user.photoURL || "/images/default.png"}
            />
          ) : (
            <div className="bg-black w-full h-full rounded-full" />
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
              <a onClick={handleLogout} className="text-red-500">
                Logout
              </a>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href={`/sign-in?redirect=${currentPath}`}>Sign In</Link>
            </li>
            <li>
              <Link href={`/sign-up?redirect=${currentPath}`}>Register</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default ClientAuthMenu;
