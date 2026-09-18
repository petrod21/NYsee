import { cn } from "@/lib/utils";
import { lineColor, type LineColor } from "@/data/attractions";

const BG: Record<LineColor, string> = {
  red: "bg-line-red text-line-white",
  blue: "bg-line-blue text-line-white",
  yellow: "bg-line-yellow text-line-ink",
  green: "bg-line-green text-line-white",
  orange: "bg-line-orange text-line-white",
  purple: "bg-line-purple text-line-white",
  lime: "bg-line-lime text-line-white",
  brown: "bg-line-brown text-line-white",
  gray: "bg-line-gray text-line-ink",
  ink: "bg-primary text-primary-foreground",
};

interface Props {
  label: string;
  /** Force a trunk color; otherwise inferred from the label */
  color?: LineColor;
  /** Raw hex colors coming from live directions data */
  hex?: { bg: string; text: string };
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE = {
  sm: "h-5 w-5 text-[10px]",
  md: "h-7 w-7 text-xs",
  lg: "h-10 w-10 text-base",
};

export function SubwayBullet({ label, color, hex, size = "md", className }: Props) {
  const tone = color ?? lineColor(label);
  const isSubwayLetter = /^[A-Z0-9]$/.test(label.toUpperCase()) || tone !== "ink";
  const useHex = hex && !isSubwayLetter;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-black leading-none",
        SIZE[size],
        label.length > 2 && "w-auto rounded-full px-2",
        !useHex && BG[tone],
        className,
      )}
      style={useHex ? { backgroundColor: hex.bg, color: hex.text } : undefined}
      aria-label={`${label} line`}
    >
      {label}
    </span>
  );
}
