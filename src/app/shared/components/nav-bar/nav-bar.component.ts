import { Component, EventEmitter, Input, Output, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as AOS from 'aos';

@Component({
  selector: 'app-nav-bar',
  standalone: false,
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
@Input() isScrolled: boolean = false;
  @Input() isMobileMenuOpen: boolean = false;
  @Output() mobileMenuToggle = new EventEmitter<void>();
  @Output() navigationClick = new EventEmitter<string>();

  isBrowser: boolean;
  private aosInitialized = false;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.initializeAOS();
    }
  }

  private initializeAOS() {
    if (!this.isBrowser || this.aosInitialized) {
      return;
    }

    AOS.init({
      disable: false,
      startEvent: 'DOMContentLoaded',
      initClassName: 'aos-init',
      animatedClassName: 'aos-animate',
      useClassNames: false,
      disableMutationObserver: false,
      debounceDelay: 50,
      throttleDelay: 99,
      offset: 120,
      delay: 0,
      duration: 800,
      easing: 'ease-in-out-cubic',
      once: true,
      mirror: false,
      anchorPlacement: 'top-bottom',
    });

    this.aosInitialized = true;
  }

  toggleMobileMenu() {
    this.mobileMenuToggle.emit();
  }

  navigateToSection(section: string) {
    this.navigationClick.emit(section);
  }
}
