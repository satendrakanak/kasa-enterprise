import Container from "../container";

interface PageHeroProps {
  pageTitle: string;
  pageHeadline: string;
  pageDescription: string;
}

export function PageHero({
  pageTitle,
  pageHeadline,
  pageDescription,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden py-14 text-white dark:bg-[#101b2d] md:py-16">
      {/* LIGHT MODE - HERO BLUE THEME */}
      <div className="pointer-events-none absolute inset-0 dark:hidden">
        <div className="absolute inset-0 academy-hero-animated-bg-light" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.45),transparent_32%),radial-gradient(circle_at_85%_25%,rgba(37,99,235,0.38),transparent_36%),radial-gradient(circle_at_45%_85%,rgba(14,165,233,0.28),transparent_40%)]" />

        <div className="academy-glow-one absolute -left-40 -top-40 h-140 w-140 rounded-full bg-sky-400/25 blur-[120px]" />
        <div className="academy-glow-two absolute -right-55 top-20 h-140 w-140 rounded-full bg-blue-700/30 blur-[130px]" />
        <div className="academy-glow-three absolute -bottom-65 left-1/2 h-140 w-190 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[140px]" />

        <div className="academy-hero-shine absolute inset-0 opacity-45" />
        <div className="academy-hero-grid absolute inset-0 opacity-20" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(2,6,23,0.82),rgba(2,6,23,0.32),rgba(2,6,23,0.58))]" />
      </div>

      {/* DARK MODE */}
      <div className="pointer-events-none absolute inset-0 hidden dark:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(56,189,248,0.15),transparent_32%),radial-gradient(circle_at_88%_35%,rgba(99,102,241,0.14),transparent_36%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="dark-section-shine absolute inset-0 opacity-30" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-3xl">
          <span className="mb-4 inline-flex rounded-full border border-white/20 bg-white/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.26em] text-sky-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_28px_rgba(2,6,23,0.20)] backdrop-blur-md dark:border-rose-200/20 dark:bg-rose-200/10 dark:text-rose-200">
            {pageTitle}
          </span>

          <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl lg:text-[46px]">
            {pageHeadline}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/76 md:text-base">
            {pageDescription}
          </p>
        </div>
      </Container>
    </section>
  );
}
