import React from "react";

interface TitleProps {
  className?: string;
  children: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({ className, children }) => {
  return <p className={`text-2xl font-bold ${className}`}>{children}</p>;
};

export default Title;