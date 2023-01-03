import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IUser from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { EmailTaken } from '../validators/email-taken';
import { RegisterValidators } from '../validators/register-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  alertColor = 'blue';
  alertMsg = 'Please wait! Your account is being created';
  showAlert = false;

  registerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email], [this.emailTaken.validate]),
    age: new FormControl<number | null>(null, [Validators.required, Validators.min(16), Validators.max(120)]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)]),
    confirmPassword: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', [Validators.required, Validators.minLength(13), Validators.maxLength(13)])
  },
  [RegisterValidators.match('password', 'confirmPassword')]
  )

  inSubmission = false;

  constructor(private auth : AuthService, private emailTaken : EmailTaken) { }

  async register() {
    this.inSubmission = true;

    this.showAlert = true;
    this.alertMsg = 'Please wait! Your account is being created.';
    this.alertColor = 'blue';

    try {
      await this.auth.createUser(this.registerForm.value as IUser)
    } catch (e) { 
      console.error(e)

      this.alertMsg = 'An unexpected error occurred! Please try again later.';
      this.alertColor = 'red';
      this.inSubmission = false;
      return; //kills the function
    }

    this.alertMsg = 'Success! Your account has been created.'
    this.alertColor = 'limegreen'
  }
}
