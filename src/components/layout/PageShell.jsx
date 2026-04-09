import React from "react";

import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";

const backgroundClasses = {
  slate: "bg-slate-50 text-slate-900",
  white: "bg-white text-slate-900",
};

export default function PageShell({
  children,
  className = "",
  contentClassName = "",
  paddingClassName = "pt-28 pb-16",
  background = "slate",
  withNavbar = true,
  navbarProps = null,
  withFooter = false,
  footerProps = null,
  scrollRef = null,
}) {
  return (
    <div
      ref={scrollRef}
      className={`min-h-screen ${backgroundClasses[background] ?? backgroundClasses.slate} ${className}`}
    >
      {withNavbar && <Navbar {...(navbarProps ?? {})} />}

      <main className={`${paddingClassName} ${contentClassName}`}>{children}</main>

      {withFooter && <Footer {...(footerProps ?? {})} />}
    </div>
  );
}
