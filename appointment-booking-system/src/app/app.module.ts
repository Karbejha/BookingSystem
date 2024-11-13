import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, map } from 'rxjs';
import { Member } from './models/member';

const url = 'https://localhost:7231/api/Account';
//const loginUrl = 'https://localhost:7231/api/Account/Login';

export class InvalidPasswordError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, InvalidPasswordError.prototype);
  }
}

export class InvalidUserError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, InvalidUserError.prototype);
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private isAdmin = false;

  constructor(private router: Router, private http: HttpClient) {}

  async login(username: string, password: string): Promise<boolean> {
    const members = await this.getMembers();

    for (let i of members) {
      if (i.username === username) {
        if (i.password === password) {
          this.isAuthenticated = true;
          if (i.username == 'admin') {
            this.isAdmin = true;
          }
          return this.isAdmin;
        } else {
          throw new InvalidPasswordError('Invalid Password');
        }
      }
    }

    throw new InvalidUserError('Invalid Username');
  }

  logout(): void {
    // Clear user authentication
    this.isAuthenticated = false;
    this.isAdmin = false;

    // Clear local storage or session storage as per the application's session management strategy
    localStorage.removeItem('userSession');
    // Alternatively, if using localStorage:
    // localStorage.removeItem('userSession');

    // Navigate to the login page
    this.router.navigate(['/login']);
  }

  private async getMembers(): Promise<Member[]> {
    return await lastValueFrom(
      this.http
        .get(url)
        .pipe(map((a) => (<[]>a).map(i => new Member(i['id'], i['username'], i['password']))))
    );
  }
}