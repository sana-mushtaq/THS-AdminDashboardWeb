import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AppService } from 'src/service/app.service';
import { APIResponse } from 'src/utils/app-enum';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  userRoles: any = {}

  jsonData: any;
  loaded: boolean = false;

  cancelHour: number = 0;
  rescheduleHour: number = 0;


  constructor(private http: HttpClient, private _appService: AppService) { }

  ngOnInit(): void {

    this.fetchHours();
    this.userRoles = JSON.parse(localStorage.getItem("SessionDetails"));
    
    this.http.get('assets/userRoles.json').subscribe((data: any) => {
    
      let role = this.userRoles['role']
      this.jsonData = data[role];
      this.loaded = true;
    });
    
    $('#nav_settings').addClass('active');
    $('.onlysetting').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 500)
  }

  drawPage() {
    $('#nav_settings').addClass('active');
  }


  fetchHours() {

    let data = { 
      "post": "post"
    }
      //now we will get a list of branches from the backend
      this._appService.fetchAppHours(data).subscribe({
  
        next : ( res : any ) => {
          console.log(res);
          //in case of success the api returns 0 as a status code
          if( res.status === APIResponse.Success) {
            
            this.cancelHour = res.data[0].cancel
            this.rescheduleHour = res.data[0].reschdule
  
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

  saveHours() {

    if(this.cancelHour < this.rescheduleHour) {
      Swal.fire("Cancling hours can not be less than rescheduling hours");
    } else {

        let data =  {

          'reschdule': this.rescheduleHour,
          'cancel': this.cancelHour

      }

        //now we will get a list of branches from the backend
        this._appService.updateAppHours(data).subscribe({

          next : ( res : any ) => {
            
            //in case of success the api returns 0 as a status code
            if( res.status === APIResponse.Success) {
              
              Swal.fire("Appointment hours are updated succesfully");
    
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

}
