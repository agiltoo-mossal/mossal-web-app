import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-scrol-top',
  templateUrl: './scrol-top.component.html',
  styleUrls: ['./scrol-top.component.scss'],
})
export class ScrolTopComponent {
  scrollHeight = 300;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const button = document.querySelector('.scroll-top-button') as HTMLElement;

    if (window.scrollY >= this.scrollHeight) {
      button.classList.remove('hidden');
    } else {
      button.classList.add('hidden');
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
