import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf, ngFor, etc.

@Component({
  selector: 'app-booking-popup',
  templateUrl: './booking-popup.component.html',
  styleUrls: ['./booking-popup.component.css'],
  standalone: true, // Mark the component as standalone
  imports: [FormsModule, CommonModule] // Add FormsModule and CommonModule
})
export class BookingPopupComponent {
  @Input() isVisible: boolean = false;
  @Output() bookingSubmitted = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  booking: any = {
    title: '',
    date: '',
    time: ''
  };

  onSubmit() {
    this.bookingSubmitted.emit(this.booking);
    this.isVisible = false;
  }

  onCancel() {
    this.cancel.emit();
    this.isVisible = false;
  }
}