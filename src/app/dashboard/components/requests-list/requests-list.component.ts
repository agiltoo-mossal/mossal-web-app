import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss'],
})
export class RequestsListComponent {
  requests = [{}, {}, {}, {}, {}, {}];

  @ViewChild('dropdownContent') dropdownContent: ElementRef;

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.dropdownContent.nativeElement.contains(event.target)) {
      this.dropdownContent.nativeElement.classList.toggle('show');
    }
  }
}
