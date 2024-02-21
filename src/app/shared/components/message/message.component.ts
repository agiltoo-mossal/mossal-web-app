import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  @ViewChild('replyControl') replyControl: ElementRef
  constructor() {}
  @Input() message: { content: string; votes: number; date: any; user: { firstName: string; lastName: string; avatar: "./assets/img/ous.png" }, replies: any[] };
  showReplyForm: boolean = false;
  currentUser: { firstName: string; avatar: string } = { firstName: "Ousmane", avatar: "./assets/img/ous.png" };
  triggerReplyForm(visibility: boolean) {
    this.showReplyForm = visibility;
    if(visibility) {
      setTimeout(() => {
        this.replyControl.nativeElement.focus();
      });
    }
  }
}
