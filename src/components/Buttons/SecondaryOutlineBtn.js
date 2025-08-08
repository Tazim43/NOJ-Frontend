import React from "react";
import Link from "next/link";

function SecondaryOutlineBtn({ url, text = "Button", onClick }) {
  const commonClasses =
    "px-3 py-2 sm:px-4 sm:py-2 md:px-4 md:py-2 border border-secondary cursor-pointer text-secondary rounded-lg text-sm sm:text-base font-bold transition duration-300 hover:outline-1 hover:outline-secondary";

  return url ? (
    <Link href={url} className={commonClasses}>
      {text}
    </Link>
  ) : (
    <button onClick={onClick} className={commonClasses}>
      {text}
    </button>
  );
}

export default SecondaryOutlineBtn;
