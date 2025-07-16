import React from "react";

const Footer = () => {
  return (
    <footer className="text-muted-foreground bg-card w-full border-t py-4 text-center text-sm">
      <span>
        &copy; {new Date().getFullYear()} LCM Next.js Boilerplate &mdash; Fast,
        modern, and secure starter for your next project.
      </span>
    </footer>
  );
};

export default Footer;
