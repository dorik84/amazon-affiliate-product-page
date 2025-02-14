import { type LucideProps } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

export function RedirectIcon(props: LucideProps = {}) {
  const { size = 20, strokeWidth = 2, className = "", ...restProps } = props;

  return (
    <ArrowUpRight
      size={size}
      strokeWidth={strokeWidth}
      className={`transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${className}`}
      {...restProps}
    />
  );
}
