import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { AuthService, AuthConstant } from '../auth.service';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss']
})
export class OtpVerificationComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  invalidOtp = false;
  isVerifying = false;
  isResending = false;
  timer = 60;
  userEmail = '';
  private timerSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Vérifier si l'utilisateur vient de la page de login
    this.userEmail = sessionStorage.getItem(AuthConstant.otpEmailLocalName) || '';
    const pendingAuth = sessionStorage.getItem(AuthConstant.pendingAuthLocalName);

    if (!this.userEmail || !pendingAuth) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.initForm();
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private initForm(): void {
    this.form = this.fb.group({
      otpCode: ['', [
        Validators.required,
        Validators.pattern(/^\d{6}$/),
        Validators.minLength(6),
        Validators.maxLength(6)
      ]]
    });
  }

  get otpCode() {
    return this.form.get('otpCode')!;
  }

  onOtpInput(event: any): void {
    const value = event.target.value;
    event.target.value = value.replace(/[^0-9]/g, '');
    this.form.patchValue({ otpCode: event.target.value });
    this.invalidOtp = false;
  }

  verifyOtp(): void {
    if (this.form.invalid || this.isVerifying) return;

    this.isVerifying = true;
    this.invalidOtp = false;

    const otpCode = this.form.value.otpCode;

    this.authService.verifyOtp(this.userEmail, otpCode)
      .finally(() => {
        this.isVerifying = false;
      })
      .catch(() => {
        this.invalidOtp = true;
        this.form.reset();
      });
  }


  resendOtp(): void {
    this.isResending = true;
    this.invalidOtp = false;

    this.authService.resendOtp(this.userEmail)
      .then(
        (result) => {
          this.isResending = false;
          this.timer = 60;
          this.startTimer();
          this.form.reset();
        },
        (error) => {
          this.isResending = false;
        }
      );
  }

  cancel(): void {
    this.stopTimer();
    sessionStorage.removeItem(AuthConstant.otpEmailLocalName);
    sessionStorage.removeItem(AuthConstant.pendingAuthLocalName);
    sessionStorage.removeItem('tempSession');
    this.router.navigate(['/auth/login']);
  }

  private startTimer(): void {
    this.stopTimer();
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.stopTimer();
      }
    });
  }

  private stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}