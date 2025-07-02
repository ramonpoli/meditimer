import type { FC, PropsWithChildren } from "react";
import { Button, buttonVariants } from "./ui/button";

type Props = {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: typeof buttonVariants;
};

const RoundButton: FC<PropsWithChildren<Props>> = ({ onClick, children }) => {
  return (
    <Button
      onClick={onClick}
      className="w-20 h-20 rounded-full text-[var(--color-background)] border-2 border-[var(--color-background)] transition-all duration-300 hover:scale-110 backdrop-blur-sm cursor-pointer"
    >
      {children}
    </Button>
  );
};

export default RoundButton;
