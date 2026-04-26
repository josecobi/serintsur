import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Cta {
  label: string;
  href: string;
}

interface ScrollTextProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  stats?: { value: string; label: string }[];
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function ScrollText({
  title,
  subtitle,
  eyebrow,
  primaryCta,
  secondaryCta,
  stats,
  containerRef,
}: ScrollTextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!containerRef.current || !textRef.current) return;

    const tweens: gsap.core.Tween[] = [];

    // Headline/subtitle/CTAs: fade out and drift down over first 60% of hero scroll
    tweens.push(
      gsap.fromTo(
        textRef.current,
        { opacity: 1, y: 0 },
        {
          opacity: 0,
          y: '30vh',
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '60% bottom',
            scrub: true,
          },
        },
      ),
    );

    // Stats: fade in after headline finishes leaving (62%→75%) — no temporal overlap
    if (statsRef.current) {
      tweens.push(
        gsap.fromTo(
          statsRef.current,
          { opacity: 0, y: '2vh' },
          {
            opacity: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: '62% bottom',
              end: '75% bottom',
              scrub: true,
            },
          },
        ),
      );

      // Stats: fade out before the hero ends (88%→100%).
      // Use fromTo (not to) so GSAP doesn't capture opacity:0 as the start state.
      tweens.push(
        gsap.fromTo(
          statsRef.current,
          { opacity: 1, y: 0 },
          {
            opacity: 0,
            y: '-2vh',
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: '88% bottom',
              end: 'bottom bottom',
              scrub: true,
            },
          },
        ),
      );
    }

    return () => {
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }, [containerRef, prefersReducedMotion]);

  const hasStats = stats && stats.length > 0;

  return (
    // absolute inset-0 z-20: sits above video (z-0) and gradient overlay (z-10)
    <div className="absolute inset-0 z-20 pointer-events-none">

      {/* Headline — vertically centered in the sticky frame */}
      <div className="absolute inset-0 flex flex-col justify-center">
        <div className="mx-auto w-full max-w-[80rem] px-6 md:px-12">
          <div ref={textRef} className="flex flex-col gap-5 md:max-w-2xl">
            {eyebrow && (
              <div className="flex items-center gap-3">
                <span className="h-[3px] w-10 rounded-sm bg-orange" aria-hidden="true" />
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-orange-light">
                  {eyebrow}
                </span>
              </div>
            )}

            <h1
              id="hero-title"
              className="font-display text-display font-bold text-white"
            >
              {title}
            </h1>

            {subtitle && (
              <p className="max-w-xl text-lg leading-relaxed text-white/80 md:text-xl">
                {subtitle}
              </p>
            )}

            {(primaryCta || secondaryCta) && (
              <div className="flex flex-wrap items-center gap-3 pointer-events-auto mt-2">
                {primaryCta && (
                  <a
                    href={primaryCta.href}
                    className={[
                      'inline-flex items-center justify-center gap-2',
                      'font-sans font-semibold rounded-md',
                      'transition-all duration-200 ease-out',
                      'focus-visible:outline-2 focus-visible:outline-offset-2',
                      'select-none whitespace-nowrap',
                      'h-14 px-7 text-base',
                      'bg-orange text-white',
                      'hover:bg-orange-dark hover:-translate-y-0.5 hover:shadow-md',
                      'active:translate-y-0 active:shadow-sm',
                      'focus-visible:outline-orange',
                    ].join(' ')}
                  >
                    {primaryCta.label}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </a>
                )}

                {secondaryCta && (
                  <a
                    href={secondaryCta.href}
                    className={[
                      'inline-flex items-center justify-center gap-2',
                      'font-sans font-semibold rounded-md',
                      'transition-all duration-200 ease-out',
                      'focus-visible:outline-2 focus-visible:outline-offset-2',
                      'select-none whitespace-nowrap',
                      'h-14 px-7 text-base',
                      'bg-transparent text-white',
                      'border-2 border-white/40',
                      'hover:bg-white hover:text-navy',
                      'focus-visible:outline-navy',
                    ].join(' ')}
                  >
                    {secondaryCta.label}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats — pinned to the bottom of the sticky frame, matching HeroSection layout */}
      {hasStats && (
        <div className="absolute bottom-12 left-0 right-0">
          <div className="mx-auto w-full max-w-[80rem] px-6 md:px-12">
            <div
              ref={statsRef}
              style={{ opacity: prefersReducedMotion ? 1 : 0 }}
            >
              <dl className="flex flex-wrap items-baseline gap-x-8 gap-y-4 border-t border-white/15 pt-6">
                {stats!.map((stat) => (
                  <div key={stat.label} className="flex items-baseline gap-2">
                    <dt className="font-display text-2xl font-bold text-orange-light">
                      {stat.value}
                    </dt>
                    <dd className="text-sm text-white/70">{stat.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
