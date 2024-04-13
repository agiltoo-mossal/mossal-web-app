import { Component } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-menu-hamburger',
  standalone: true,
  imports: [],
  templateUrl: './menu-hamburger.component.html',
  styleUrl: './menu-hamburger.component.scss',
})
export class MenuHamburgerComponent {
  isActive!: boolean;

  constructor(private sidebarService: SidebarService) {
    this.sidebarService.isSidebarOpen().subscribe((resp) => {
      this.isActive = resp;
    });
  }

  toggleMenuHamburger() {
    this.isActive = !this.isActive;
    this.sidebarService.toggleSidebar(this.isActive);
  }
}
