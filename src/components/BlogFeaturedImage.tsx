interface Props {
  category: string;
  title: string;
  className?: string;
}

const CATEGORY_CONFIG: Record<string, { icon: string; bg: string; pattern: string }> = {
  Tutoriais: {
    icon: "M9 17h6M9 13h6M9 9h6M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z",
    bg: "from-blue-900/40 to-blue-950",
    pattern: "code",
  },
  LGPD: {
    icon: "M12 2L4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z",
    bg: "from-emerald-900/40 to-emerald-950",
    pattern: "shield",
  },
  Conceitos: {
    icon: "M9.663 17h4.673M12 3v1M3 12H2M21 12h-1M5.6 5.6l.7.7M18.4 5.6l-.7.7M12 17a4 4 0 100-8 4 4 0 000 8z",
    bg: "from-amber-900/40 to-amber-950",
    pattern: "lightbulb",
  },
  Comparativos: {
    icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM21 16c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z",
    bg: "from-purple-900/40 to-purple-950",
    pattern: "chart",
  },
};

export default function BlogFeaturedImage({ category, title, className = "" }: Props) {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.Tutoriais;
  // Truncate title to fit
  const display = title.length > 64 ? title.slice(0, 61) + "..." : title;

  return (
    <div
      className={`relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-border bg-gradient-to-br ${config.bg} ${className}`}
      role="img"
      aria-label={title}
    >
      {/* Brand corner mark */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
            <path d="M12 2c0 5-3 6-3 10a3 3 0 006 0c0-4-3-5-3-10z" />
          </svg>
        </div>
        <span className="text-xs font-bold tracking-wider text-foreground/80">FAKEFORGE BR</span>
      </div>

      {/* Category pill */}
      <div className="absolute top-4 right-4">
        <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-[10px] font-semibold uppercase tracking-wider text-primary">
          {category}
        </span>
      </div>

      {/* Decorative pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id={`grid-${category}`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${category})`} />
      </svg>

      {/* Big icon */}
      <div className="absolute right-8 sm:right-12 top-1/2 -translate-y-1/2 opacity-20">
        <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
          <path d={config.icon} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Title */}
      <div className="absolute bottom-6 left-6 right-6 sm:right-32">
        <p className="text-base sm:text-xl font-bold text-foreground leading-tight">
          {display}
        </p>
      </div>
    </div>
  );
}
