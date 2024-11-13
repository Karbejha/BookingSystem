import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMenuOpen = false;
  isAuthenticated$: Observable<boolean>;
  isAdmin$: Observable<boolean>;

  constructor(public authService: AuthService,private router: Router) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.isAdmin$ = this.authService.isAdmin$;
  }

  logout() {
    this.authService.logout();
  }

  Dashboard() {
    this.router.navigate(['./user-dashboard'])
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
}
