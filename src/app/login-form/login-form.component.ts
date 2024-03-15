import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent {
  @Output() showLoginModalEvent = new EventEmitter<boolean>();
  @Output() showRegModalEvent = new EventEmitter<boolean>();

  loginForm: FormGroup;
  hidePassLetters: boolean = true;
  showWarningModal: boolean = false;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.loginForm = this.fb.group({
      username: [
        '',
        [Validators.required, Validators.maxLength(15), Validators.min(3)],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // opening registration modal (form)
  handleShowReg() {
    this.showLoginModalEvent.emit(false);
    this.showRegModalEvent.emit(true);
  }

  // close todo form and open todo list
  handleCancelBtn() {
    this.showLoginModalEvent.emit(false);
  }

  // create new or edit todo, close todo form and open todo list
  handleConfirmBtn(): void {
    if (this.loginForm.valid) {
      const logUser = JSON.stringify({
        identifier: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value,
      });

      this.apiService.loginUser(logUser).subscribe({
        next: (response: any) => {
          const username = response.user.username;
          const jwt = response.jwt;

          // save token and username into local storage
          localStorage.setItem('token', jwt);
          localStorage.setItem('username', username);

          this.apiService.setToken(jwt);
          this.apiService.setUsername(username);

          this.showLoginModalEvent.emit(false);
          // refreshing the whole page
          window.location.reload();
        },
        error: (error) => {
          if (
            error.toString().slice(7, 10) === '400' ||
            error.toString().slice(7, 10) === '401'
          ) {
            this.showWarningModal = true;
          }
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }

  // opening warning modal with message
  handleWarningBtn() {
    this.showWarningModal = false;
  }
}
