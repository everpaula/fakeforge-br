import Link from "next/link";

interface Props {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  showBadge?: boolean;
  href?: string;
}

export default function Logo({
  size = "sm",
  showText = true,
  showBadge = true,
  href = "/",
}: Props) {
  const iconSize = size === "sm" ? 28 : size === "md" ? 36 : 48;
  const textSize = size === "sm" ? "text-sm" : size === "md" ? "text-base" : "text-lg";

  const content = (
    <div className="flex items-center gap-2.5">
      <LogoIcon size={iconSize} />
      {showText && (
        <>
          <span className={`font-bold tracking-tight ${textSize}`}>
            <span className="text-foreground">Fake</span>
            <span className="text-accent">Forge</span>
          </span>
          {showBadge && (
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20">
              BR
            </span>
          )}
        </>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }
  return content;
}

export function LogoIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="FakeForge logo"
    >
      {/* Gear outer ring */}
      <g fill="currentColor" className="text-primary">
        <circle cx="32" cy="32" r="24" />
        <rect x="29" y="2" width="6" height="8" rx="1" />
        <rect x="29" y="54" width="6" height="8" rx="1" />
        <rect x="2" y="29" width="8" height="6" rx="1" />
        <rect x="54" y="29" width="8" height="6" rx="1" />
        <rect x="9" y="9" width="6" height="8" rx="1" transform="rotate(-45 12 13)" />
        <rect x="49" y="9" width="6" height="8" rx="1" transform="rotate(45 52 13)" />
        <rect x="9" y="47" width="6" height="8" rx="1" transform="rotate(45 12 51)" />
        <rect x="49" y="47" width="6" height="8" rx="1" transform="rotate(-45 52 51)" />
      </g>
      {/* Inner dark circle */}
      <circle cx="32" cy="32" r="18" fill="#0F3570" />
      {/* Outer flame (accent orange) */}
      <path
        d="M32 14 C34 20, 40 22, 40 30 C40 36, 36 40, 32 40 C28 40, 24 36, 24 30 C24 24, 28 24, 32 14 Z"
        className="fill-accent"
      />
      {/* Inner flame (lighter) */}
      <path
        d="M32 22 C33 25, 36 26, 36 30 C36 34, 34 36, 32 36 C30 36, 28 34, 28 30 C28 27, 30 27, 32 22 Z"
        fill="#FB923C"
      />
    </svg>
  );
}