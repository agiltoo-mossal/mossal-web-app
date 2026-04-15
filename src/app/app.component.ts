import { AfterViewInit, ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONTEXT } from './shared/enums/app-context.enum';
import { ProgressBarService } from './shared/services/progress-bar.service';
import { TranslationService } from './translation.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnInit {
  showProgressBar = false;
  AppContext = APP_CONTEXT;
  title = 'mossal-web-app';

  constructor(
    private progressBarService: ProgressBarService, // private translationService: TranslationService
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {
    // this.translationService.loadTranslations('en');
  }

  ngOnInit(): void {
    if (this.authService.isLogedIn()) {
      this.authService.scheduleAutoLogout();
    }
  }

  count = signal(0);
  val = 0;
  ngAfterViewInit(): void {
    this.progressBarService.showProgressBar$.subscribe((show) => {
      this.showProgressBar = show;
      this.cdr.detectChanges();
    });
  }

  incremente() {
    this.val++;
    this.count.update((val) => val + 1);
  }
}
