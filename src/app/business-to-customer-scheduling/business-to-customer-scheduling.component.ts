// THS-25
import { Component, OnInit } from '@angular/core';
import { BusinessToCustomerSchedulingService } from 'src/service/business-to-customer-scheduling.service';
import { APIResponse } from 'src/utils/app-enum'
import Swal from 'sweetalert2';
@Component({
  selector: 'app-business-to-customer-scheduling',
  templateUrl: './business-to-customer-scheduling.component.html',
  styleUrls: ['./business-to-customer-scheduling.component.css']
})
export class BusinessToCustomerSchedulingComponent implements OnInit {

  zoom: number = 15
  centerLat: number = 0; 
  centerLng: number = 0;
  selectedLat: number;
  selectedLng: number;


  constructor(private _b2c: BusinessToCustomerSchedulingService,) { }

  ngOnInit(): void {

    // Request the user's location
    this.getUserLocation();

  }

  getUserLocation() {

    if (navigator.geolocation) {
    
      navigator.geolocation.getCurrentPosition( ( position ) => {
    
        // Set the center of the map to the user's current location
        this.centerLat = position.coords.latitude
        this.centerLng = position.coords.longitude

        // Set the marker's initial position to the user's current location
        this.selectedLat = position.coords.latitude
        this.selectedLng = position.coords.longitude
    
      })
    
    }
     else {
    
      console.error("Geolocation is not supported by this browser.");
    
    }
  
  }

  onMapClick(event) {
    this.selectedLat = event.coords.lat;
    this.selectedLng = event.coords.lng;
  }
  onMarkerDragEnd(event) {
    this.selectedLat = event.coords.lat;
    this.selectedLng = event.coords.lng;
  }

  //the following function will get nearby barnches based on users location
  getNearbyBranches() {

    let data = {

      user_latitude: this.selectedLat,
      user_longitude: this.selectedLng,
      id_number: '12345678'

    }

    this._b2c.businessToCustomerRequest(data).subscribe({
  
      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success) {
          
          //after assiging service to a service provider we will reset the data
          console.log(res.data)

        } else {

          //if it is unable to get branch data it will return an error
          Swal.fire(res.message)

        }
        
      },
      error: ( err: any ) => {

        console.log(err)

      }
    
    })


  }

}
