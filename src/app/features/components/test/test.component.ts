import { Component, OnInit, AfterViewInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const gsap: any;
declare const ScrollTrigger: any;

@Component({
  selector: 'app-test',
  standalone: false,
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {
 isMobileMenuOpen = false;

  constructor() {}

  ngOnInit(): void {
    // Ensure GSAP is available
    if (typeof gsap !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  ngAfterViewInit(): void {
    // Don't run initial animations immediately
    // this.runInitialAnimations();
    this.setupScrollAnimations();
    
    // Refresh ScrollTrigger after view initialization
    if (typeof ScrollTrigger !== 'undefined') {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    // Clean up ScrollTrigger instances
    // if (typeof ScrollTrigger !== 'undefined') {
    //   ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    // }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  toggleMobileNav(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  private runInitialAnimations(): void {
    if (typeof gsap === 'undefined') return;

    const onLoadTl = gsap.timeline({ defaults: { ease: "power2.out" } });

    onLoadTl
      .to("header", {
        "--border-width": "100%",
        duration: 3,
      }, 0)
      .from(".desktop-nav a, .social-sidebar a", {
        y: -100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      }, 0)
      .to(".social-sidebar", {
        "--border-height": "100%",
        duration: 10,
      }, 0)
      .to(".hero-content h1", {
        opacity: 1,
        duration: 1,
      }, 0)
      .to(".hero-content h1", {
        delay: 0.5,
        duration: 1.2,
        color: "#b1560e",
        "-webkit-text-stroke": "0px #b1560e",
      }, 0)
      .from(".hero-content .line", {
        x: 100,
        delay: 1,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      }, 0)
      .to(".hero-bottle-wrapper", {
        opacity: 1,
        scale: 1,
        delay: 1.5,
        duration: 1.3,
        ease: "power3.out",
      }, 0)
      .to(".hero-stamp", {
        opacity: 1,
        scale: 1,
        delay: 2,
        duration: 0.2,
        ease: "back.out(3)",
      }, 0)
      .to(".hero-stamp", {
        y: "+=5",
        x: "-=3",
        repeat: 2,
        yoyo: true,
        duration: 0.05,
        ease: "power1.inOut",
      }, 0);
  }

  private setupScrollAnimations(): void {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const header = document.querySelector("header");
    if (!header) return;

    const headerOffset = header.clientHeight - 1;

    // Wait for the test component's vintage hero section to become visible
    const testHero = document.querySelector('.vintage-hero');
    if (!testHero) return;

    // Create a ScrollTrigger to detect when test component hero becomes visible
    ScrollTrigger.create({
      trigger: testHero,
      start: "top 80%", // Start when test hero is 80% from top of viewport
      once: true, // Only trigger once
      onEnter: () => {
        // Run initial animations when test component becomes visible
        this.runInitialAnimations();
      }
    });

    // Use matchMedia for responsive behavior
    ScrollTrigger.matchMedia({
      // Desktop scroll animations
      "(min-width: 769px)": () => {
        // 1. Bottle animates from hero to intro
        this.pinAndAnimate({
          trigger: ".vintage-hero",
          endTrigger: ".section-intro",
          pin: ".hero-bottle-wrapper",
          animations: [
            { target: ".hero-bottle", vars: { rotate: 0, scale: 0.8 } }
          ],
          headerOffset,
        });

        // 2. Bottle shifts right during intro
        this.pinAndAnimate({
          trigger: ".section-intro",
          endTrigger: ".timeline-entry:nth-child(even)",
          pin: ".hero-bottle-wrapper",
          animations: [
            { target: ".hero-bottle", vars: { rotate: 10, scale: 0.7 } },
            { target: ".hero-bottle-wrapper", vars: { x: "30%" } }
          ],
          headerOffset,
        });

        // 3. Bottle shifts left during timeline
        this.pinAndAnimate({
          trigger: ".timeline-entry:nth-child(even)",
          endTrigger: ".timeline-entry:nth-child(odd)",
          pin: ".hero-bottle-wrapper",
          animations: [
            { target: ".hero-bottle", vars: { rotate: -10, scale: 0.7 } },
            { target: ".hero-bottle-wrapper", vars: { x: "-25%" } }
          ],
          headerOffset,
        });
      },

      // Mobile fallback
      "(max-width: 768px)": () => {
        ScrollTrigger.create({
          trigger: testHero,
          start: "bottom top",
          once: true,
          onEnter: () => {
            gsap.to(".hero-bottle-wrapper", {
              opacity: 1,
              duration: 1,
              delay: 0.5,
            });
          }
        });
      }
    });
  }

  private pinAndAnimate(config: {
    trigger: string;
    endTrigger: string;
    pin: string;
    animations: Array<{ target: string; vars: any }>;
    headerOffset: number;
    markers?: boolean;
  }): void {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: config.trigger,
        start: `top top+=${config.headerOffset}`,
        endTrigger: config.endTrigger,
        end: `top top+=${config.headerOffset}`,
        scrub: true,
        pin: config.pin,
        pinSpacing: false,
        markers: config.markers || false,
        invalidateOnRefresh: true,
      },
    });

    config.animations.forEach(({ target, vars }) => {
      tl.to(target, vars);
    });
  }
}