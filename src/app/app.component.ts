import { Component, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONTEXT } from './shared/enums/app-context.enum';
import { ProgressBarService } from './shared/services/progress-bar.service';
import { TranslationService } from './translation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  showProgressBar = false;
  AppContext = APP_CONTEXT;
  title = 'mossal-web-app';

  constructor(
    private progressBarService: ProgressBarService,

    // private translationService: TranslationService
  ) {
    // this.translationService.loadTranslations('en');
  }

  count = signal(0);
  val = 0;
  ngOnInit(): void {
    this.progressBarService.showProgressBar$.subscribe((show) => {
      this.showProgressBar = show;
    });
  }

  incremente() {
    this.val++;
    this.count.update((val) => val + 1);
  }
}
