import { Component, Input, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-card-dashboard',
  templateUrl: './card-dashboard.component.html',
  styleUrl: './card-dashboard.component.scss',
})
export class CardDashboardComponent {
  @Input() set data(v: {
    title?: string;
    path?: string;
    style?: string;
    value?: number;
  }) {
    console.log(v);
    this.counterFunc();
    this.data = v;
  }
  @Input('duration') duration!: number;

  counterSignal: WritableSignal<number> = signal(0);

  counterFunc() {
    let start = 0;
    let end = this.data?.value ?? 0;

    if (start === end) {
      return;
    }

    // find duration per increment
    let totalMilSecDur = this.duration;
    let incrementTime = (totalMilSecDur / end) * 1000;

    let timer = setInterval(() => {
      start += 1;
      this.counterSignal.set(start);
      //this.counter = String(start) + this.number.toString().substring(3);
      if (start === end) {
        clearInterval(timer);
      }
    }, incrementTime);
  }
}
