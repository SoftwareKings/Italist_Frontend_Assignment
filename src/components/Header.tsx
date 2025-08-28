import React from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function Header({ title}: HeaderProps) {
  return (
    <header>
      <h1 className="text-[32px] sm:text-[64px] font-bold">{title}</h1>
    </header>
  );
}
