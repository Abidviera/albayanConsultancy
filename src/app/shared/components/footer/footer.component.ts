import { Component, EventEmitter, Input, Output, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as AOS from 'aos';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
@Input() showScrollTop: boolean = false;
  @Output() navigationClick = new EventEmitter<string>();
  @Output() scrollTopClick = new EventEmitter<void>();

  isBrowser: boolean;
  private aosInitialized = false;

  COMPANY_TRADEMARK = {
    english: 'AL BAYAN TYPING SERVICES',
    arabic: 'البيان لخدمات الطباعة',
  };

  COMPANY_LICENSE_DETAILS = {
    licenseNumber: '70510',
    registerNumber: '71028',
    acciNumber: '80063',
  };

  COMPANY_ADDRESS = {
    shop: 'Shop No. 6, Rashideya 2',
    city: 'Ajman',
    emirate: 'United Arab Emirates'
  };

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

  navigateToSection(section: string) {
    this.navigationClick.emit(section);
  }

  handleScrollTop() {
    this.scrollTopClick.emit();
  }
}
