import Link from "next/link";
import Image from "next/image";

interface Props {
  variant?: "horizontal" | "icon" | "circle";
  size?: "sm" | "md" | "lg";
  href?: string;
  priority?: boolean;
}

const DIMENSIONS = {
  horizontal: {
    sm: { w: 120, h: 30 },
    md: { w: 160, h: 40 },
    lg: { w: 240, h: 60 },
  },
  icon: {
    sm: { w: 28, h: 28 },
    md: { w: 40, h: 40 },
    lg: { w: 64, h: 64 },
  },
  circle: {
    sm: { w: 64, h: 64 },
    md: { w: 96, h: 96 },
    lg: { w: 160, h: 160 },
  },
};

export default function Logo({
  variant = "horizontal",
  size = "sm",
  href = "/",
  priority = false,
}: Props) {
  const { w, h } = DIMENSIONS[variant][size];
  const src = `/logo-${variant}.png`;
  const alt = "FakeForge - Gerador de dados brasileiros";

  const img = (
    <Image
      src={src}
      alt={alt}
      width={w}
      height={h}
      priority={priority}
      className="h-auto w-auto"
      style={{ maxHeight: h, maxWidth: w }}
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center" aria-label="FakeForge — ir para página inicial">
        {img}
      </Link>
    );
  }
  return img;
}

export function LogoIcon({ size = 28 }: { size?: number }) {
  return (
    <Image
      src="/logo-icon.png"
      alt="FakeForge"
      width={size}
      height={size}
      priority
    />
  );
}