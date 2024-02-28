import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { AuthService } from 'src/app/auth/auth.service';
import { TranslationService } from 'src/app/translation.service';
import { UserRole } from 'src/graphql/generated';
import { APP_CONTEXT } from '../../enums/app-context.enum';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  context: APP_CONTEXT = APP_CONTEXT.Default;
  AppContext = APP_CONTEXT;
  isSidebarOpened!: boolean;

  constructor(
    private authService: AuthService,
    private appService: AppService,
    private translationService: TranslationService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.appService.contextAsync.subscribe((ctx) => {
      this.context = ctx;
    });

    this.sidebarService.isSidebarOpen().subscribe((resp) => {
      this.isSidebarOpened = resp;
    });
  }

  get isLogedIn() {
    return this.authService.isLogedIn();
  }

  get user() {
    return this.authService.getCurrentUser() || { role: UserRole.Talent };
  }

  get userRole() {
    return this.user.role.toLowerCase();
  }

  get dashboardPrefix() {
    return this.user.role === UserRole.Admin ||
      this.user.role === UserRole.Instructor
      ? 'admin'
      : 'talent';
  }
}
