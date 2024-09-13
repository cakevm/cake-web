import React, { ReactNode } from 'react';

interface ErrorTextProps {
  styleClass?: string;
  children: ReactNode;
}

const ErrorText: React.FC<ErrorTextProps> = ({ styleClass, children }) => {
  return <p className={`text-center text-error ${styleClass}`}>{children}</p>;
}

export default ErrorText;