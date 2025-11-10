import { Component, OnDestroy } from '@angular/core';
 import { filter, Subscription } from 'rxjs';
import { ROUTE_PATHS } from './app.paths';
import { SidebarService } from './features/shared/services/sidebar.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: false,
})
export class AppComponent implements OnDestroy {
  shouldShowSidebar = false;
  isSidebarOpen = true;
  currentRoute: string = '';
  hiddenRoutes = [ROUTE_PATHS.login, ROUTE_PATHS.register, ROUTE_PATHS.home];

  private routerSubscription: Subscription;
  private sidebarSubscription: Subscription;

  constructor(
    private router: Router,
    private sidebarService: SidebarService,
  ) {
    this.routerSubscription = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.currentRoute = this.router.url;
      this.shouldShowSidebar = !this.hiddenRoutes.some(route => this.currentRoute.includes(route));
    });

    this.sidebarSubscription = this.sidebarService.isOpen$.subscribe(isOpen => (this.isSidebarOpen = isOpen));
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    this.sidebarSubscription.unsubscribe();
  }
}
 