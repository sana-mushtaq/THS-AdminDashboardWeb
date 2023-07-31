import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {

  public currentAppointmentSubject: BehaviorSubject<any>;
  public selectedAppointment: Observable<any>;

  public currentProviderStaffSubject: BehaviorSubject<any>;
  public selectedProviderStaff: Observable<any>;

  constructor() {
    this.currentAppointmentSubject = new BehaviorSubject<any>(null);
    this.selectedAppointment = this.currentAppointmentSubject.asObservable();

    this.currentProviderStaffSubject = new BehaviorSubject<any>(null);
    this.selectedProviderStaff = this.currentProviderStaffSubject.asObservable();
  }
}
