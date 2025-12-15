import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 mt-auto bg-slate-900 text-slate-400">
      <div className="container mx-auto text-center">
        <p>ProShop &copy; {currentYear} by Erniel Caalim.</p>
      </div>
    </footer>
  );
};

export default Footer;
