import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  credentials = {
    email: '',
    password: ''
  }

  inSubmission = false;

  alertColor = 'blue';
  alertMsg = 'Please wait! We are logging you in.';
  showAlert = false;

  constructor(private auth: AuthService) { }

  async login() {
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! We are logging you in.';
    this.showAlert = true;
    this.inSubmission = true;

    try {
      await this.auth.login(this.credentials.email, this.credentials.password);
    } catch (e) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'User not found! make sure you inserted the correct credentials';
      return;
    }

    this.alertMsg = 'Success! You successfully logged in.'
    this.alertColor = 'limegreen'
  }
}
