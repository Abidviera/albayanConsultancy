import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as AOS from 'aos';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    // Initialize AOS globally
    AOS.init({
      duration: 800,
      easing: 'ease-in-out-cubic',
      once: true,
    });

    // Listen for route changes to refresh AOS
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Small delay for DOM to update
      setTimeout(() => {
        AOS.refresh();
      }, 300);
    });

    // Refresh AOS on window resize
    window.addEventListener('resize', () => {
      AOS.refresh();
    });
  }
}
