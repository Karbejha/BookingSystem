import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AuthService,
  InvalidPasswordError,
  InvalidUserError,
} from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  saveSession: boolean = false;
  constructor(private auth: AuthService, private router: Router) {}

  username: string = '';
  password: string = '';
  error: string = '';

  async login() {
    this.error = '';

    try {
      const isAdmin = await this.auth.login(this.username, this.password);

      if (isAdmin) {
        this.router.navigate(['/admin-dashboard']);
      } else {
        this.router.navigate(['/user-dashboard']);
      }
    } catch (error) {
      if (error instanceof InvalidPasswordError) {
        this.error = 'Invalid Password';
      } else if (error instanceof InvalidUserError) {
        this.error = 'Invalid User';
      } else {
        this.error = 'Unknown Error';
      }
    }
  }
}