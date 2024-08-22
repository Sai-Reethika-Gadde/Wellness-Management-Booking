// appointment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private baseUrl = 'http://localhost:8080'; // Replace with your backend API base URL

  constructor(private http: HttpClient) { }

  getAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/appointments`);
  }

  createAppointment(appointment: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/appointments`, appointment);
  }

  updateAppointment(appointmentId: number, appointment: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/appointments/${appointmentId}`, appointment);
  }

  deleteAppointment(appointmentId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/appointments/${appointmentId}`);
  }
}
