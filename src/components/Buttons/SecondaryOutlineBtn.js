import React from "react";
import Link from "next/link";

function SecondaryOutlineBtn({ url = "#", text = "Button" }) {
  return (
    <Link
      href={url}
      className="px-4 py-2 border border-secondary text-secondary rounded-lg font-bold transition duration-300  hover:outline-1 hover:outline-secondary"
    >
      {text}
    </Link>
  );
}

export default SecondaryOutlineBtn;
