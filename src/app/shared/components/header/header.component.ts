import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { AuthService } from 'src/app/auth/auth.service';
import { TranslationService } from 'src/app/translation.service';
import { UserRole } from 'src/graphql/generated';
import { APP_CONTEXT } from '../../enums/app-context.enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  context: APP_CONTEXT = APP_CONTEXT.Default;
  AppContext = APP_CONTEXT;

  headerPosition: string = '';
  scrollPosition: number = 0;

  navLinks: any[] = [
    {
      label: 'Accueil',
      url: 'home',
    },
    {
      label: 'Démarches administratives',
      url: 'administrative-procedures',
    },
    {
      label: 'Nos services',
      url: 'our-services',
    },
    {
      label: 'Actualités',
      url: 'news',
    },
    {
      label: 'Qu’est ce que Sénégal Service',
      url: 'about-us',
    },
    {
      label: 'Support',
      url: 'support',
    },
  ];

  constructor(
    private authService: AuthService,
    private appService: AppService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.appService.contextAsync.subscribe((ctx) => {
      this.context = ctx;
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

  chooseLang(lang: string) {
    this.translationService.chooseLangue(lang);
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    const scrollY = window.scrollY;
    const direction = scrollY > this.scrollPosition ? 'down' : 'up';

    if (direction === 'down' && scrollY > 107) {
      this.headerPosition = 'is-hide';
      // console.log('down');
    } else if (direction === 'up' && scrollY > 107) {
      this.headerPosition = 'is-fixed';
    } else {
      this.headerPosition = '';
    }
    this.scrollPosition = scrollY;
  }
}
