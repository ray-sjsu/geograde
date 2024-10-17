import React from "react";
import Link from "next/link";
import Logo from "./Logo";
import Button from "./Button";

const Navbar = ({ toggle }) => {
  return (
    <>
      <div className="w-full h-20 bg-emerald-800 sticky top-0">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <Logo />

            <button
              type="button"
              className="inline-flex items-center md:hidden"
              onClick={toggle}
            >
            </button>

            <ul className="hidden md:flex gap-x-6 text-white">
              <li>
                <Link href="/">
                  <p>Home</p>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <p>Contact Us</p>
                </Link>
              </li>
              <li>
                <Link href="/sign-up">
                  <p>Register</p>
                </Link>
              </li>
            </ul>
            
            <div className="hidden md:block">
              <Button />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
