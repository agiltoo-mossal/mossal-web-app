import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent {
  @ViewChild('videoPlayer', { static: false }) videoPlayer: ElementRef;
  isPlaying = false;

  @Input() src: string;
  constructor() {}

  ngOnInit() {
    // console.log('vide input ' + this.src);
  }

  togglePlay() {
    if (this.isPlaying) {
      this.videoPlayer.nativeElement.pause();
    } else {
      this.videoPlayer.nativeElement.play();
    }
    this.isPlaying = !this.isPlaying;
  }
}
