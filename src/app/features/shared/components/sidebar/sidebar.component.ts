import { Component, Input, HostListener, ChangeDetectorRef } from '@angular/core';
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
    public readonly sidebarService: SidebarService, // Mudei para public para debug
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
 
    
    this.sidebarService.isOpen$.subscribe(open => {
 
      this.isOpen = open;
      this.cdr.detectChanges(); // Força detecção de mudanças
     });

    this.userName = this.authService.getUserName();
   }

  toggleSidebar() {
     this.sidebarService.toggle();
  }

  // Handle clicks inside the sidebar
  handleSidebarClick(event: Event) {
    // Prevent event from bubbling to document click handler
    event.stopPropagation();
  }

  // Close sidebar when clicking outside on mobile
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.isOpen && window.innerWidth <= 768) {
      const target = event.target as HTMLElement;
      const sidebar = document.querySelector('.sidebar');
      
      if (sidebar && !sidebar.contains(target)) {
        this.sidebarService.close();
      }
    }
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
