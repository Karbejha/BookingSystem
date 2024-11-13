import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminDashboardComponent {
  activeTab: string = 'overview';
  totalUsers: number = 1254;
  totalAppointments: number = 789;
  monthlyGrowth: number = 15;


  constructor(private authService: AuthService) {} // Add AuthService to the constructor
  
  
  users: any[] = [
    { name: 'John Doe', email: 'john@example.com', joinedDate: '2024-01-15' },
    { name: 'Jane Smith', email: 'jane@example.com', joinedDate: '2024-02-20' },
    { name: 'Bob Johnson', email: 'bob@example.com', joinedDate: '2024-03-10' },
  ];

  appointments: any[] = [
    { date: '2024-07-21', time: '10:00 AM', user: 'John Doe', service: 'Haircut', status: 'Confirmed' },
    { date: '2024-07-22', time: '2:00 PM', user: 'Jane Smith', service: 'Massage', status: 'Pending' },
    { date: '2024-07-23', time: '11:30 AM', user: 'Bob Johnson', service: 'Consultation', status: 'Cancelled' },
  ];

  settings: any = {
    siteName: 'My Booking App',
    siteEmail: 'admin@mybookingapp.com',
    timezone: 'UTC'
  };

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  logout() {
    // Implement logout logic here
    this.authService.logout(); // Call the logout method from AuthService
  }

  saveSettings() {
    // Implement save settings logic here
    console.log('Saving settings:', this.settings);
  }
  
}