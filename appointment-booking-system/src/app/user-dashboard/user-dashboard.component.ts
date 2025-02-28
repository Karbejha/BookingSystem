import { Component, ViewChild, AfterViewInit, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../auth.service';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput, EventSourceInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { BookingPopupComponent } from '../booking-popup/booking-popup.component';

interface Appointment {
  id?: string;
  date: string;
  service: string;
  status?: 'confirmed' | 'pending' | 'cancelled';
}

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule, BookingPopupComponent]
})
export class UserDashboardComponent implements OnInit, AfterViewInit {
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
    service: '',
    status: 'pending'
  };

  isPopupVisible: boolean = false;
  selectedDate: string = '';
  isBrowser: boolean;
  
  // Time slots for appointments (8 AM to 6 PM)
  availableTimeSlots: string[] = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];
  
  // Services with colors
  serviceColors: {[key: string]: string} = {
    'Haircut': '#4CAF50',      // Green
    'Massage': '#2196F3',      // Blue
    'Consultation': '#FF9800'  // Orange
  };

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    dateClick: this.handleDateClick.bind(this),
    events: [] as EventInput[],
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: 'short'
    },
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
      startTime: '08:00',
      endTime: '18:00',
    },
    slotMinTime: '08:00',
    slotMaxTime: '18:00',
    height: 'auto',
    aspectRatio: 1.35,
    nowIndicator: true,
    navLinks: true,
    slotDuration: '01:00:00', // 1 hour slots
    allDaySlot: false,
    fixedWeekCount: false,
    showNonCurrentDates: false,
    validRange: {
      start: new Date().toISOString().split('T')[0] // Disable past dates
    }
  };

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    // Generate a few sample appointments for testing
    if (this.isBrowser) {
      this.generateSampleAppointments();
    }
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
      
      // Fetch user appointments from service (replace with actual implementation)
      this.fetchUserAppointments(currentUserid);
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      setTimeout(() => {
        this.updateCalendarEvents();
      }, 0);
    }
  }

  // Fetch user appointments from service (replace with actual implementation)
  fetchUserAppointments(userId: number): void {
    // In a real application, you would call your service to get appointments
    // For now, we'll just use the sample appointments
    this.updateCalendarEvents();
  }

  // Generate sample appointments for testing
  generateSampleAppointments(): void {
    const today = new Date();
    const services = ['Haircut', 'Massage', 'Consultation'];
    
    // Add a few appointments in the next 7 days
    for (let i = 1; i <= 5; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      
      // Random hour between 8-17 (8 AM - 5 PM)
      const hour = Math.floor(Math.random() * 10) + 8;
      futureDate.setHours(hour, 0, 0);
      
      const service = services[Math.floor(Math.random() * services.length)];
      
      this.appointments.push({
        id: `sample-${i}`,
        date: futureDate.toISOString(),
        service: service,
        status: 'confirmed'
      });
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;

    if (tab === 'book' && this.isBrowser) {
      setTimeout(() => {
        this.updateCalendarEvents();
      }, 0);
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
    // In a real app, you would call a service to cancel the appointment
    appointment.status = 'cancelled';
    // Remove from the displayed appointments
    this.appointments = this.appointments.filter(app => app !== appointment);
    this.updateCalendarEvents();
  }

  bookAppointment(): void {
    if (this.newAppointment.date && this.newAppointment.service) {
      const newAppointment: Appointment = {
        id: `appt-${Date.now()}`,
        date: this.newAppointment.date,
        service: this.newAppointment.service,
        status: 'confirmed'
      };
      
      this.appointments.push(newAppointment);
      this.newAppointment = { date: '', service: '', status: 'pending' };
      this.updateCalendarEvents();
      
      // Show success message
      alert(`Appointment for ${newAppointment.service} booked successfully!`);
    } else {
      alert('Please select both date and service');
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
    // Check if the clicked date is in the past
    const clickedDate = new Date(arg.dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (clickedDate < today) {
      alert("Cannot book appointments in the past!");
      return;
    }
    
    this.selectedDate = arg.dateStr;
    this.isPopupVisible = true;
  }

  onBookingSubmitted(booking: any): void {
    const dateTime = `${booking.date}T${booking.time}`;
    this.newAppointment.date = dateTime;
    this.newAppointment.service = booking.service;
    this.bookAppointment();
    this.isPopupVisible = false;
  }

  onPopupCancel(): void {
    this.isPopupVisible = false;
  }

  updateCalendarEvents(): void {
    if (!this.isBrowser || !this.calendarComponent || !this.calendarComponent.getApi()) {
      return;
    }
    
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.removeAllEvents();
    
    // Map appointments to FullCalendar events
    const events: EventInput[] = this.appointments.map(app => {
      const date = new Date(app.date);
      return {
        id: app.id,
        title: app.service,
        start: app.date,
        end: new Date(date.getTime() + 60 * 60 * 1000).toISOString(), // 1 hour duration
        backgroundColor: this.serviceColors[app.service] || '#3788d8',
        borderColor: this.serviceColors[app.service] || '#3788d8',
        textColor: '#ffffff',
        extendedProps: {
          status: app.status
        }
      };
    });
    
    calendarApi.addEventSource(events);
    
    // Force calendar to re-render
    calendarApi.render();
  }
  
  // Get formatted date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Get color for service
  getServiceColor(service: string): string {
    return this.serviceColors[service] || '#3788d8';
  }
}