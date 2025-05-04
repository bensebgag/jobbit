import { RefObject } from "react";

interface Props {
  children?: React.ReactNode;
  styleElement?: string;
  ref?: RefObject<HTMLDivElement | null>;
}

export default function Container({ children, styleElement, ref }: Props) {
  return (
    <div
      ref={ref}
      className={`w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 ${styleElement}`}
    >
      {children}
    </div>
  );
}
