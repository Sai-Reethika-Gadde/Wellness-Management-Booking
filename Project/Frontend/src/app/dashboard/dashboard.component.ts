import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentService } from '../appointment.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  appointments: any[] = [];
  timeSlots: string[] = ['09:00', '10:00', '11:00', '12:00', '13:00'];
  wellnessServices: string[] = ['Yoga Classes', 'Nutritional Counselling', 'Group Fitness', 'Mental Health Counselling', 'Massage Therapy'];
  displayedColumns: string[] = ['id', 'fullName', 'appointmentDate', 'timeSlot', 'wellnessService', 'actions'];
  appointmentForm: FormGroup;
  editForm: FormGroup;
  isEditing: boolean = false;
  editingAppointmentId: number | null = null;
  currentUser: any = { id: 1 };

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private appointmentService: AppointmentService,
    private datePipe: DatePipe,
    private router: Router
  ) {
    this.appointmentForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      timeSlot: ['', Validators.required],
      wellnessService: ['', Validators.required]
    });

    this.editForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      timeSlot: ['', Validators.required],
      wellnessService: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments(): void {
    this.appointmentService.getAppointments().subscribe(
      (appointments) => {
        this.appointments = appointments;
      },
      (error) => {
        this.snackBar.open('Error fetching appointments', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  onSubmit(): void {
    const formData = this.isEditing ? this.editForm.value : this.appointmentForm.value;
    formData.appointmentDate = this.datePipe.transform(formData.appointmentDate, 'yyyy-MM-dd') || '';

    if (this.isEditing && this.editingAppointmentId !== null) {
      this.updateAppointment(this.editingAppointmentId, formData);
    } else {
      this.createAppointment(formData);
    }
  }

  createAppointment(formData: any): void {
    const { appointmentDate, timeSlot, wellnessService } = formData;

    const isConflict = this.isConflictWithOtherAppointments(appointmentDate, timeSlot, wellnessService, null);

    if (isConflict) {
      this.snackBar.open('Error: Time slot is already taken. Please choose another time slot.', 'Close', {
        duration: 3000,
      });
    } else {
      this.appointmentService.createAppointment(formData).subscribe(
        () => {
          this.snackBar.open('Appointment created successfully', 'Close', {
            duration: 3000,
          });
          this.resetForm();
          this.fetchAppointments();
        },
        (error) => {
          this.snackBar.open('Error creating appointment', 'Close', {
            duration: 3000,
          });
        }
      );
    }
  }

  updateAppointment(appointmentId: number, formData: any): void {
    const appointmentDate = formData.appointmentDate;
    const timeSlot = formData.timeSlot;
    const wellnessService = formData.wellnessService;

    const existingAppointment = this.appointments.find(app => app.id === appointmentId);

    if (!existingAppointment) {
      this.snackBar.open('Error: Appointment not found', 'Close', {
        duration: 3000,
      });
      return;
    }

    const isTimeSlotChanged = existingAppointment.timeSlot !== timeSlot || existingAppointment.appointmentDate !== appointmentDate;

    if (isTimeSlotChanged) {
      const isConflict = this.isConflictWithOtherAppointments(appointmentDate, timeSlot, wellnessService, appointmentId);

      if (isConflict) {
        this.snackBar.open('Error: Time slot is already taken. Please choose another time slot.', 'Close', {
          duration: 3000,
        });
        return;
      }
    }

    this.appointmentService.updateAppointment(appointmentId, formData).subscribe(
      () => {
        this.snackBar.open('Appointment updated successfully', 'Close', {
          duration: 3000,
        });
        this.resetEditForm();
        this.fetchAppointments();
      },
      (error) => {
        this.snackBar.open('Error updating appointment', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  isConflictWithOtherAppointments(
    appointmentDate: string,
    timeSlot: string,
    wellnessService: string,
    appointmentId: number | null
  ): boolean {
    return this.appointments.some(appointment =>
      appointment.appointmentDate === appointmentDate &&
      appointment.timeSlot === timeSlot &&
      appointment.wellnessService === wellnessService &&
      appointment.id !== appointmentId
    );
  }

  editAppointment(appointment: any): void {
    this.isEditing = true;
    this.editingAppointmentId = appointment.id;
    this.editForm.patchValue({
      fullName: appointment.fullName,
      appointmentDate: appointment.appointmentDate,
      timeSlot: appointment.timeSlot,
      wellnessService: appointment.wellnessService
    });
  }

  deleteAppointment(appointmentId: number): void {
    this.appointmentService.deleteAppointment(appointmentId).subscribe(
      () => {
        this.snackBar.open('Appointment deleted successfully', 'Close', {
          duration: 3000,
        });
        this.fetchAppointments();
      },
      (error) => {
        this.snackBar.open('Error deleting appointment', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  resetForm(): void {
    this.appointmentForm.reset();
    this.formDirective.resetForm();
  }

  resetEditForm(): void {
    this.editForm.reset();
    this.formDirective.resetForm();
    this.isEditing = false;
    this.editingAppointmentId = null;
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
