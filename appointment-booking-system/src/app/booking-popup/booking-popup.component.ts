import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-popup',
  templateUrl: './booking-popup.component.html',
  styleUrls: ['./booking-popup.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class BookingPopupComponent implements OnChanges {
  @Input() isVisible: boolean = false;
  @Input() selectedDate: string = '';
  @Input() availableTimeSlots: string[] = [];
  
  @Output() bookingSubmitted = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  
  booking: any = {
    title: '',
    date: '',
    time: '',
    service: ''
  };
  
  ngOnChanges(changes: SimpleChanges): void {
    // Update the booking date when selectedDate changes
    if (changes['selectedDate'] && this.selectedDate) {
      this.booking.date = this.selectedDate;
    }
  }
  
  onSubmit() {
    this.bookingSubmitted.emit(this.booking);
    this.resetForm();
  }
  
  onCancel() {
    this.cancel.emit();
    this.resetForm();
  }
  
  private resetForm() {
    this.booking = {
      title: '',
      date: '',
      time: '',
      service: ''
    };
  }
}