import { Component, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { OnInit } from '@angular/core';
import { BookingPopupComponent } from '../booking-popup/booking-popup.component';
import { isPlatformBrowser } from '@angular/common'; // Import isPlatformBrowser

interface Appointment {
  date: string;
  service: string;
}

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule, BookingPopupComponent]
})
export class UserDashboardComponent implements AfterViewInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  activeTab: string = 'book';
  user = {
    name: '',
    email: '',
    phone: '', 
    address: ''
  };
  editMode: boolean = false; 
  editedUser = { ...this.user }; 
  
  appointments: Appointment[] = [];
  newAppointment: Appointment = {
    date: '',
    service: ''
  };

  isPopupVisible: boolean = false;
  selectedDate: string = '';

  isBrowser: boolean; // Add this variable

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this),
    events: [],
    eventColor: '#378006',
    eventBackgroundColor: '#378006',
    eventBorderColor: '#378006',
    eventTextColor: '#ffffff',
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true
  };

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId); // Check if running in the browser
  }
  
  ngOnInit(): void {
    const currentUserid = this.authService.getStoredUserID();

    if (currentUserid > 0) {
      this.authService.getUserData(currentUserid).then(userData => {
        if (userData) {
          this.user = {
            name: userData.Username ?? '',
            email: userData.Email ?? '',
            phone: userData.phone ?? '',
            address: userData.address ?? ''
          };
          this.editedUser = { ...this.user };
        } else {
          console.error('User data is undefined or null.');
        }
      });
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) { // Only initialize FullCalendar in the browser
      this.updateCalendarEvents();
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;

    if (tab === 'book' && this.isBrowser) { // Only update calendar in the browser
      this.updateCalendarEvents();
    }
  }

  logout(): void {
    this.authService.logout();
  }

  editProfile(): void {
    this.editMode = true;
  }

  cancelEdit(): void {
    this.editedUser = { ...this.user };
    this.editMode = false;
  }

  cancelAppointment(appointment: Appointment): void {
    this.appointments = this.appointments.filter(app => app !== appointment);
    this.updateCalendarEvents();
  }

  bookAppointment(): void {
    if (this.newAppointment.date && this.newAppointment.service) {
      this.appointments.push({...this.newAppointment});
      this.newAppointment = { date: '', service: '' };
      this.updateCalendarEvents();
    } else {
      console.log('Please select both date and service');
    }
  }
  
  saveProfile(): void {
    this.authService.updateUserProfile({
      name: this.editedUser.name,
      email: this.editedUser.email,
      phone: this.editedUser.phone,
      address: this.editedUser.address
    }).then(success => {
      if (success) {
        this.user = { ...this.editedUser };
        this.editMode = false;
        alert('Profile updated successfully');
      }
    }).catch(error => {
      alert('Failed to update profile: ' + error.message);
      this.editedUser = { ...this.user };
    });
  }

  handleDateClick(arg: DateClickArg): void {
    this.selectedDate = arg.dateStr;
    this.isPopupVisible = true;
  }

  onBookingSubmitted(booking: any): void {
    const dateTime = `${booking.date}T${booking.time}`;
    this.newAppointment.date = dateTime;
    this.newAppointment.service = booking.title;
    this.bookAppointment();
    this.isPopupVisible = false;
  }

  onPopupCancel(): void {
    this.isPopupVisible = false;
  }

  updateCalendarEvents(): void {
    if (this.isBrowser && this.calendarComponent && this.calendarComponent.getApi()) { // Check if browser
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.removeAllEvents();
      calendarApi.addEventSource(this.appointments.map(app => ({
        title: app.service,
        date: app.date
      })));
    }
  }
}