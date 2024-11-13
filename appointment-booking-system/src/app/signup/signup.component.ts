import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  onInputChange(event: Event, field: string): void {
    const inputElement = event.target as HTMLInputElement;
    switch (field) {
      case 'username':
        this.username = inputElement.value;
        break;
      case 'email':
        this.email = inputElement.value;
        break;
      case 'password':
        this.password = inputElement.value;
        break;
    }
  }

  signup(): void {
    // Implement the sign-up logic here
    console.log('User signed up with:', this.username, this.email, this.password);
  }
}
