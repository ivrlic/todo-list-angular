import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css'],
})
export class RegistrationFormComponent {
  @Output() showRegModalEvent = new EventEmitter<boolean>();
  @Output() showLoginModalEvent = new EventEmitter<boolean>();

  registrationForm: FormGroup;
  showRegistration: boolean = true;
  hidePassLetters: boolean = true;
  showWarningModal: boolean = false;
  warningMsg: string = '';
  isError: boolean = false;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.registrationForm = this.fb.group({
      username: [
        '',
        [Validators.required, Validators.maxLength(15), Validators.min(3)],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          this.emailFormatValidator,
          Validators.min(6),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // validator that controls if there is "." (a dot)
  // and after the dot at least two characters in the e-mail
  emailFormatValidator(control: any) {
    if (control.value && !/\.[A-Za-z]{2,}$/.test(control.value)) {
      return { invalidEmail: true };
    }
    return null;
  }

  // close warning modal and if user was successfully created close register modal and open login
  handleWarningBtn() {
    if (!this.isError) {
      this.handleShowLogin();
    }
    this.showWarningModal = false;
  }

  // close register modal and open login
  handleShowLogin() {
    this.showLoginModalEvent.emit(true);
    this.showRegModalEvent.emit(false);
  }

  // close register form
  handleCancelBtn() {
    this.showRegModalEvent.emit(false);
  }

  // create new user, and message for warning modal
  handleConfirmBtn(): void {
    if (this.registrationForm.valid) {
      const newUser = JSON.stringify({
        username: this.registrationForm.get('username')?.value,
        email: this.registrationForm.get('email')?.value,
        password: this.registrationForm.get('password')?.value,
      });

      this.apiService.createUser(newUser).subscribe({
        next: (res) => {
          this.showWarningModal = true;
          this.isError = false;
          this.warningMsg = `You have successfully created a new account. Now you can log in.`;
        },
        error: (err) => {
          this.isError = true;
          this.warningMsg = `${err.toString()}. Please try again.`;
          this.showWarningModal = true;
          console.log('Error fetching todos: ', err);
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
