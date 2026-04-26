import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollVideo from './ScrollVideo';
import ScrollText from './ScrollText';

gsap.registerPlugin(ScrollTrigger);

interface Cta {
  label: string;
  href: string;
}

interface ScrollHeroProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  stats?: { value: string; label: string }[];
  videoSrc?: string;
  posterSrc?: string;
}

export default function ScrollHero({
  title,
  subtitle,
  eyebrow,
  primaryCta,
  secondaryCta,
  stats,
  videoSrc = '/videos/hero.mp4',
  posterSrc = '/videos/hero-poster.jpg',
}: ScrollHeroProps) {
  // Outer 300vh scroll spacer — both ScrollVideo and ScrollText use it as their trigger
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    /*
      300vh scroll spacer. Everything visual lives inside the sticky inner panel,
      which pins to the top of the viewport while the spacer scrolls past, then
      naturally unsticks once the spacer exits — so sections below render cleanly.
    */
    <div ref={containerRef} className="relative" style={{ height: '300vh' }}>
      {/* Sticky inner panel — fills the viewport while the spacer is in view */}
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Video — z-0, absolute to the sticky panel */}
        <ScrollVideo
          src={videoSrc}
          poster={posterSrc}
          containerRef={containerRef}
        />

        {/*
          Navy gradient overlay — matches existing HeroSection treatment.
          z-10 sits between the video (z-0) and the text (z-20).
        */}
        <div
          className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-navy/70 via-navy/30 to-transparent"
          aria-hidden="true"
        />

        {/* Text / CTA layer — z-20 */}
        <ScrollText
          title={title}
          subtitle={subtitle}
          eyebrow={eyebrow}
          primaryCta={primaryCta}
          secondaryCta={secondaryCta}
          stats={stats}
          containerRef={containerRef}
        />
      </div>
    </div>
  );
}
