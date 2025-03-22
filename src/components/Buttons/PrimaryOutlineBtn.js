import React from "react";
import Link from "next/link";

function PrimaryOutlineBtn({ url = "#", text = "Button" }) {
  return (
    <Link
      href={url}
      className="px-4 py-1 border border-primary text-primary rounded-lg font-medium transition duration-300  hover:outline-1 hover:outline-primary"
    >
      {text}
    </Link>
  );
}

export default PrimaryOutlineBtn;
