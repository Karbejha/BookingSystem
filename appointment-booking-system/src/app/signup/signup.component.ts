import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username: string = '';
  FullName: string = '';
  email: string = '';
  password: string = '';
  errorMessage: any;
  showSuccessMessage: boolean = false;
  isSubmitting: boolean = false;

  constructor(private authService: AuthService, private http:HttpClient) { }
  onInputChange(event: Event, field: string): void {
    const inputElement = event.target as HTMLInputElement;
    switch (field) {
      case 'username':
        this.username = inputElement.value;
        break;
      case 'fullname':
        this.FullName = inputElement.value;
        break;
      case 'email':
        this.email = inputElement.value;
        break;
      case 'password':
        this.password = inputElement.value;
        break;
    }
  }

  showPassword: boolean = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  
signup(): void {
  this.isSubmitting = true;
  this.authService.signup(this.username, this.FullName, this.email, this.password).then(
    (response) => {
      console.log('Signup successful:');
      this.isSubmitting = false;
      this.showSuccessMessage = true; // Show success message
      
      // Hide the message after a few seconds (optional)
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 9000);
    },
  ).catch(
    (error) => {
      console.error('Signup failed:', error);
      this.errorMessage = 'Signup failed. Please try again.';
      this.isSubmitting = false;
    }
  );
}

  
}

