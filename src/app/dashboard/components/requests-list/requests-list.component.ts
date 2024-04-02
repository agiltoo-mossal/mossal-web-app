import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss'],
})
export class RequestsListComponent {
  requests = [{}, {}, {}, {}, {}, {}];

  @ViewChild('dropdownContent') dropdownContent: ElementRef;
  @ViewChild('dropdown') dropdown: ElementRef;

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.dropdown.nativeElement.contains(event.target)) {
      this.dropdownContent.nativeElement.classList.remove('show');
    } else {
      this.dropdownContent.nativeElement.classList.add('show');
    }
  }
}
