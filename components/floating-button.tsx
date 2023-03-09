import Link from "next/link";
import React from "react";

interface FloatingButtonProps {
  href: string;
  children: React.ReactNode;
}

const FloatingButton = ({ href, children }: FloatingButtonProps) => {
  return (
    <Link href={href}>
      <button className="fixed hover:bg-orange-500 transition-colors cursor-pointer bottom-24 right-5 shadow-xl bg-orange-400 rounded-full p-4 text-white">
        {children}
      </button>
    </Link>
  );
};

export default FloatingButton;
