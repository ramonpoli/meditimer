import type { FC, PropsWithChildren } from "react";
import { Button, type buttonVariants } from "./ui/button";

type Props = {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: typeof buttonVariants;
};

const RoundButton: FC<PropsWithChildren<Props>> = ({
  onClick,
  children,
  className,
}) => {
  return (
    <Button
      onClick={onClick}
      className={`${className} w-20 h-20 rounded-full text-[var(--color-background)] border-2 border-[var(--color-background)] transition-all duration-600 hover:scale-110 backdrop-blur-sm cursor-pointer`}
      asChild
    >
      {children}
    </Button>
  );
};

export default RoundButton;
