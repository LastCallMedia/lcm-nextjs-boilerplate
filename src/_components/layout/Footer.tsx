"use client";
import React from "react";
import { useIntl } from "react-intl";

const Footer = () => {
  const intl = useIntl();
  return (
    <footer className="text-muted-foreground bg-card w-full border-t py-4 text-center text-sm">
      <span>
        &copy; {new Date().getFullYear()}{" "}
        {intl.formatMessage({ id: "footer.text" })}
      </span>
    </footer>
  );
};

export default Footer;
