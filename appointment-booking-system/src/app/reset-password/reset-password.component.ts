import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  email: string = '';
  newPassword: string = '';
  error: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  resetPassword() {
    this.http.post('/api/Account/ResetPassword', { email: this.email, newPassword: this.newPassword })
      .subscribe(
        () => {
          Swal.fire('Success', 'Password reset successfully', 'success');
          this.router.navigate(['/login']);
        },
        (error) => {
          this.error = 'Password reset failed';
        }
      );
  }
}
