import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-confirm-password-reset',
  templateUrl: './confirm-password-reset.component.html',
  styleUrl: './confirm-password-reset.component.scss'
})
export class ConfirmPasswordResetComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: ActivatedRoute,
    private http: HttpClient
  ) { }

  success: boolean = false;
  message: string = '';

  ngOnInit() {
    const token = this.router.snapshot.queryParamMap.get('token');

    this.http
      .get<{ success: boolean; message: string }>(
        `${environment.API_URI}auth/confirm-forgot-password`,
        { params: { token } }
      )
      .subscribe({
        next: (res) => {
          this.success = res.success;
          this.message = res.message;
        },
        error: () => {
          this.success = false;
          this.message = 'Lien invalide ou expiré';
        },
      });
  }


}
