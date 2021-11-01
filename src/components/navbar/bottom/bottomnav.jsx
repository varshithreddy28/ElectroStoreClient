import React from "react";

import "./bottomnav.css";

export default function Bottomnav() {
  const d = new Date();
  let year = d.getFullYear();
  return (
    <div className="btmNav">
      <nav className=" text-center bottomnav">
        <div className="navtxt">© {year} Electro Store All rights reserved</div>
      </nav>
    </div>
  );
}
