import { AfterViewInit, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgTerminal } from 'ng-terminal';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TerminalComponent {
  ssh_service = environment.SSH_SERVICE;
  constructor(private sanitizer: DomSanitizer) {

  }
  getSafePath(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
