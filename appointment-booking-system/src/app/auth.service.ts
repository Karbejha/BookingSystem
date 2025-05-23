import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, BehaviorSubject, Observable } from 'rxjs';
import { Member } from './models/member';
import { isPlatformBrowser } from '@angular/common';


const url = 'https://localhost:7231/api/Account';
const loginUrl = `${url}/Login`;
const signupUrl = `${url}/Signup`;

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
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  private isAdminSubject: BehaviorSubject<boolean>;
  public isAuthenticated$: Observable<boolean>;
  public isAdmin$: Observable<boolean>;
  private isBrowser: boolean;

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.getStoredAuthState());
    this.isAdminSubject = new BehaviorSubject<boolean>(this.getStoredAdminState());
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
    this.isAdmin$ = this.isAdminSubject.asObservable();
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      // Call the backend login API
      const response: any = await lastValueFrom(
        this.http.post(loginUrl, { userName: username, password: password })
      );
        
      // Check if the login was successful based on backend response
      if (response && response.statusCode === 200) {
        const isAdmin = response.type === 1; // Adjust based on your backend type field
        this.setAuthState(true, isAdmin);
        
        // Store user session details
        this.setInStorage('userSession', JSON.stringify({
          username: response.userName,
          fullName: response.fullName,
          isAuthenticated: true,
          isAdmin: isAdmin,
          userId: response.userID,
          email: response.email,
          type: response.type
        }));
        
        return isAdmin;
      } else {
        // Handle different status codes
        if (response.statusCode === 401) {
          throw new InvalidUserError(response.message);
        } else if (response.statusCode === 403) {
          throw new Error(response.message);
        } else {
          throw new Error('Login failed');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      if (error instanceof InvalidUserError || error instanceof InvalidPasswordError) {
        throw error;
      }
      throw new Error('Login failed: ' + (error as Error).message);
    }
  }
  // Similarly, you can implement a signup method if needed
  async signup(username: string,FullName:string, email: string, password: string): Promise<boolean> {
    try {
      const response: any = await lastValueFrom(
      this.http.post(signupUrl, { userName: username,FullName:FullName, email: email, password: password })
      );
      if (response && response.statusCode === 200 || response.statusCode === 201) {
        return response.message === 'User created successfully';
      } else {
        throw new Error('Signup failed');
      }
    }catch(error: any) {
      if (error.status === 409) {  // Assuming 409 is for conflict (e.g., username already exists)
        throw new Error('Username or email already exists');
      } else {
        throw new Error('Signup failed');
      }
    }
  }

  logout(): void {
    this.setAuthState(false, false);
    this.removeFromStorage('userSession');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  isUserAdmin(): boolean {
    return this.isAdminSubject.value;
  }

  private setAuthState(isAuthenticated: boolean, isAdmin: boolean): void {
    this.setInStorage('userSession', JSON.stringify({ isAuthenticated, isAdmin }));
    this.isAuthenticatedSubject.next(isAuthenticated);
    this.isAdminSubject.next(isAdmin);
  }

  getStoredAuthState(): boolean {
    const storedSession = this.getFromStorage('userSession');
    return storedSession ? JSON.parse(storedSession).isAuthenticated : false;
  }

  private getStoredAdminState(): boolean {
    const storedSession = this.getFromStorage('userSession');
    return storedSession ? JSON.parse(storedSession).isAdmin : false;
  }

  public setInStorage(key: string, value: string): void {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
    }
  }

  public getFromStorage(key: string): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private removeFromStorage(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
  }

  getStoredUsername(): string {
    const userSession = this.getFromStorage('userSession');
    return userSession ? JSON.parse(userSession).username : '';
  }

  getStoredFullName(): string {
    const userSession = this.getFromStorage('userSession');
    return userSession ? JSON.parse(userSession).fullName : '';
  }

  getStoredUserID(): number {
    const userSession = this.getFromStorage('userSession');
    return userSession ? JSON.parse(userSession).userId:0
  }
  // Fetch user data based on username
  async getUserData(UserID: number): Promise<Member> {
    try {
      if (UserID > 0) {
        const userUrl = `${url}/GetUserDetails?UserID=${UserID}`;  
        const response: any = await lastValueFrom(
          this.http.get(userUrl)
        );
        const oUser = new Member(response.userID, response.userName, '', response.fullName,response.email,response.address,response.phone); 
        return oUser;
      } else {
        return Promise.reject('user id is 0');
      }
     
    } catch (err) {
      return Promise.reject(err);
    }
 
  }
  async updateUserProfile(userUpdate: {
    name: string, 
    email: string, 
    phone: string, 
    address: string
  }): Promise<boolean> {
    try {
      const UserID = this.getStoredUserID();
      const updateUrl = `${url}/UpdateUserProfile?UserID=${UserID}`;
      
      const response: any = await lastValueFrom(
        this.http.put(updateUrl, {
          FullName: userUpdate.name,
          Email: userUpdate.email,
          Phone: userUpdate.phone,
          Address: userUpdate.address
        })
      );
  
      if (response && response.statusCode === 200) {
        // Update local storage with new user details
        const currentSession = JSON.parse(this.getFromStorage('userSession') || '{}');
        const updatedSession = {
          ...currentSession,
          username: response.userName,
          email: response.email
        };
        this.setInStorage('userSession', JSON.stringify(updatedSession));
  
        return true;
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  }

  // Add this method to your AuthService class
async resetPassword(email: string, newPassword: string): Promise<boolean> {
  const resetPasswordUrl = `${url}/ResetPassword`;
  try {
    const response: any = await lastValueFrom(
      this.http.post(resetPasswordUrl, { Email: email, NewPassword: newPassword })
    );
    if (response && response.statusCode === 200) {
      return true; // Password reset successful
    } else {
      throw new Error(response.message || 'Password reset failed');
    }
  } catch (error) {
    console.error('Password reset failed:', error);
    throw error;
  }
}
}