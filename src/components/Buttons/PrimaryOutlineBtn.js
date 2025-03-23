import React from "react";
import Link from "next/link";

function PrimaryOutlineBtn({ url, text = "Button", onClick }) {
  const commonClasses =
    "px-4 py-2 border border-primary cursor-pointer text-primary rounded-lg font-bold transition duration-300 hover:outline-1 hover:outline-primary";

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

export default PrimaryOutlineBtn;
