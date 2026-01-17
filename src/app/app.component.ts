import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
 constructor(private router: Router) {}

  ngOnInit() {
    // Listen for route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Reset animation state on route change if needed
      localStorage.removeItem('animations-run');
      
      // Small delay for DOM to update
      setTimeout(() => {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      }, 300);
    });
  }
}
