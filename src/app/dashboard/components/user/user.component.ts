import { Component } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  password: boolean = true;
  newPassword: boolean = true;
  ConfirmPassword: boolean = true;
  toggleMailActivation: boolean = false;
}
