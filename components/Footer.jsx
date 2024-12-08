import React from "react";

const Footer = () => {
  return (
    <footer className="footer bg-neutral text-neutral-content items-center p-4">
      <aside className="grid-flow-col items-center">
        <img
          src="/images/logo.png" // Corrected path
          alt="Team Fyra Logo"
          className="h-12 w-auto" // Optional styling
        />
        <p>Team Fyra © {new Date().getFullYear()} - All rights reserved</p>
      </aside>
    </footer>
  );
};

export default Footer;
