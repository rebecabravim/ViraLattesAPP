import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_PATHS } from '../../../../app.paths';  
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../../authentication/services/auth.service';
  

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Input() currentRoute: string = '';
  isOpen = false;
  protected userName: string | null = null;
  protected readonly ROUTE_PATHS = ROUTE_PATHS;

  constructor(
    private readonly sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.sidebarService.isOpen$.subscribe(open => {
      this.isOpen = open;
    });

    this.userName = this.authService.getUserName();
   }

  toggleSidebar() {
    this.sidebarService.toggle();
  }

  protected logout(): void {
    this.authService.logout();
    this.toggleSidebar();
    this.userName = null;
  }


  protected routeTo(route: string): void {
    this.router.navigate([route]);
    if (this.isOpen) {
      this.sidebarService.toggle();
    }
  }
 
}
