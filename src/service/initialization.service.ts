import { Injectable } from '@angular/core';
import { Observable, Subject, from } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { WebsiteDataService } from './website-data.service';

@Injectable({
  providedIn: 'root'
})
export class InitializationService {

  centerLat: number = 24.7136
  centerLng: number = 46.6753
  selectedLat: number
  selectedLng: number

  private initializationSubject = new Subject<void>()

  constructor(private dataService: WebsiteDataService) {}

  initializeApp(): Observable<any> {

    this.getUserLocation()

    let data = {

      user_latitude: this.centerLat,
      user_longitude: this.centerLng
    
    }

    return this.initializationSubject.pipe(

      switchMap(async () => this.dataService.getData(data)),
      
      catchError(error => {
      
        console.error('Error initializing app:', error)
      
        throw error
      
      })
    
    )
  
  }

  private getUserLocation() {
  
    if (navigator.geolocation) {
  
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
  
      navigator.geolocation.getCurrentPosition(
        position => {

          this.centerLat = position.coords.latitude
          this.centerLng = position.coords.longitude
          this.selectedLat = position.coords.latitude
          this.selectedLng = position.coords.longitude
          
          // Emit a signal that user location is ready
          this.initializationSubject.next() // No argument needed here
        },
        error => {

          console.error('Error getting location:', error);
          // Still emit a signal to allow API call even if location retrieval fails
          this.initializationSubject.next() // No argument needed here

        }, options )

    } else {

      console.error('Geolocation is not supported by this browser.')
      this.initializationSubject.next() // No argument needed here

    }

  }
  
}