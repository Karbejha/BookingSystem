import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService, InvalidPasswordError, InvalidUserError } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  saveSession: boolean = false;
  showPassword: boolean = false;
  showSuccessMessage: boolean = false; // New variable for success message

  constructor(private auth: AuthService, private router: Router) { }

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

      // Show success message if login is successful
      this.showSuccessMessage = true;

      // Show SweetAlert2 success message
      Swal.fire({
        title: 'Login successful!',
        text: 'You have logged in successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });

    } catch (error) {
      if (error instanceof InvalidPasswordError) {
        this.error = 'Invalid Password';
      } else if (error instanceof InvalidUserError) {
        this.error = 'Username or password incorrect';
      } else {
        this.error = 'Unknown Error';
      }
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
