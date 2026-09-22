import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class ScrollEngine {
  public lenis: Lenis | null = null;
  private tickerFn: ((time: number) => void) | null = null;

  public init() {
    if (typeof window === 'undefined') return;

    this.lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.2,
    });

    // Synchronize Lenis with ScrollTrigger
    this.lenis.on('scroll', ScrollTrigger.update);

    this.tickerFn = (time: number) => {
      this.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(this.tickerFn);
    gsap.ticker.lagSmoothing(0);
  }

  public scrollTo(
    target: string | HTMLElement,
    options?: { offset?: number; duration?: number; onComplete?: () => void }
  ) {
    if (this.lenis) {
      this.lenis.scrollTo(target, options);
    } else if (typeof target === 'string') {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: 'smooth' });
      if (options?.onComplete) setTimeout(options.onComplete, 800);
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
      if (options?.onComplete) setTimeout(options.onComplete, 800);
    }
  }

  public scrollToProgress(fraction: number) {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = maxScroll * Math.min(1, Math.max(0, fraction));
    if (this.lenis) {
      this.lenis.scrollTo(targetY, { duration: 1.8 });
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  }

  public destroy() {
    if (this.tickerFn) {
      gsap.ticker.remove(this.tickerFn);
    }
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }
  }
}

export const scrollEngine = new ScrollEngine();
