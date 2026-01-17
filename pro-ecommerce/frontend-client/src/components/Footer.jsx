import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (   
    <footer className="pt-6 pb-24 mt-auto bg-slate-900 text-slate-400 md:py-6">
      <div className="container mx-auto text-center">
        <p className="text-xs font-medium md:text-sm">
          ProShop &copy; {currentYear} by Erniel Caalim.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
