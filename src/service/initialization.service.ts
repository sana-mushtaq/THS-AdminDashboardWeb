import { Injectable } from '@angular/core';
import { Observable, Subject, defer, from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { WebsiteDataService } from './website-data.service';

@Injectable({
  providedIn: 'root'
})
export class InitializationService {

  centerLat: number = 0
  centerLng: number = 0
  selectedLat: number
  selectedLng: number

  private initializationSubject = new Subject<void>()

  constructor(private dataService: WebsiteDataService) {}

  initializeApp(): Observable<any> {
    return new Observable(observer => {
        this.getUserLocation(); // Assuming getUserLocation is asynchronous

        // Assuming getUserLocation eventually sets this.centerLat and this.centerLng
        let data = {
            user_latitude: this.centerLat,
            user_longitude: this.centerLng
        };

        this.initializationSubject.pipe(
            switchMap(async () => this.dataService.getData(data)),
            catchError(error => {
                console.error('Error initializing app:', error);
                observer.error(error);
                throw error;
            })
        ).subscribe(() => {
            observer.next(); // Signal completion
            observer.complete();
        });
    });
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