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
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function ScrollText({
  title,
  subtitle,
  eyebrow,
  primaryCta,
  secondaryCta,
  containerRef,
}: ScrollTextProps) {
  const textRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!containerRef.current || !textRef.current) return;

    // Fade out and drift down as user scrolls through first 60% of the hero
    const tween = gsap.fromTo(
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
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [containerRef, prefersReducedMotion]);

  return (
    /*
      absolute inset-0 z-20: sits above video (z-0) and gradient overlay (z-10)
      within the sticky panel. pointer-events-none lets scroll pass through,
      except the CTA buttons which restore pointer-events.
    */
    <div className="absolute inset-0 z-20 flex flex-col justify-center pointer-events-none">
      {/* Mirror Container.astro width="wide" — px-6 on mobile, px-12 on desktop */}
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
                    /* size lg — same as Button.astro size="lg" */
                    'h-14 px-7 text-base',
                    /* primary variant */
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
                    /* size lg */
                    'h-14 px-7 text-base',
                    /* outline variant — white on dark */
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
  );
}
