// components/context/navigation/navbar/Navbar.jsx
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"; // ShadCN dropdown

const Navbar = ({ toggle }) => {
  return (
    <nav className="w-full bg-emerald-800 sticky top-0 z-10 shadow-md">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">

        {/* Navigation Links */}
        <ul className="hidden md:flex gap-x-6 text-white">
          <li>
            <Link href="/" className="hover:text-gray-300">Home</Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-gray-300">Contact Us</Link>
          </li>
          <li>
            <Link href="/sign-up" className="hover:text-gray-300">Register</Link>
          </li>
        </ul>

        {/* Sign In / Dropdown Menu */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white">
                Sign In
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/sign-in">Sign In</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/sign-up">Register</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
