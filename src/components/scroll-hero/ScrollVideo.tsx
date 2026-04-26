/*
  ScrollVideo — scrubs an MP4 forward/backward based on scroll position.

  Smooth scrubbing requires short keyframe intervals. If playback stutters,
  re-encode with: ffmpeg -i in.mp4 -g 15 -keyint_min 15 -c:v libx264 -crf 23 out.mp4
  (that places a keyframe every 0.5 s at 30 fps)
*/
import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ScrollVideoProps {
  src: string;
  poster?: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function ScrollVideo({ src, poster, containerRef }: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!src) {
      console.warn('[ScrollVideo] No src — drop hero.mp4 at public/videos/hero.mp4');
    }
  }, [src]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!containerRef.current) return;

    const video = videoRef.current;
    if (!video) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        if (!video.duration || isNaN(video.duration)) return;
        const target = self.progress * video.duration;
        if (!video.seeking) video.currentTime = target;
      },
    });

    return () => {
      trigger.kill();
    };
  }, [containerRef, prefersReducedMotion]);

  // Reduced-motion: static poster or plain navy background
  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden">
        {poster ? (
          <img
            src={poster}
            alt=""
            className="h-full w-full object-cover"
            aria-hidden="true"
          />
        ) : (
          <div className="h-full w-full bg-navy" aria-hidden="true" />
        )}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        className="h-full w-full object-cover"
        aria-hidden="true"
      />
    </div>
  );
}
