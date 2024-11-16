"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "./Button";

const Logo = () => {
  const [width, setWidth] = useState(1024);
  const [showButton, setShowButton] = useState(false);
  const [isClient, setIsClient] = useState(false); //ran into some hydra errors earlier, now checking client side rendering

  const updateWidth = () => {
    if (typeof window !== "undefined") {
      setWidth(window.innerWidth);
    }
  };

  const changeNavButton = () => {
    if (typeof window !== "undefined") {
      setShowButton(window.scrollY >= 400 && window.innerWidth < 768);
    }
  };

  useEffect(() => {
    setIsClient(true);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    window.addEventListener("scroll", changeNavButton);

    return () => {
      window.removeEventListener("resize", updateWidth);
      window.removeEventListener("scroll", changeNavButton);
    };
  }, []);

  if (!isClient) {
    return null; //if cant render client side, return loading 
  }

  return (
    <>
      <Link href="/" style={{ display: showButton ? "none" : "block" }}>
        <Image
          src="/images/Logo.png"
          alt="Logo"
          width={width < 1024 ? 75 : 150}
          height={width < 1024 ? 75 : 150}
          className="relative mt-4" //i added margin on top but lmk if u guys dont see it
        />
      </Link>
      <div style={{ display: showButton ? "block" : "none" }}>
        <Button />
      </div>
    </>
  );
};

export default Logo;
