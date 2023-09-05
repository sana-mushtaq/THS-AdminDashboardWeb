import { Component, OnInit } from "@angular/core";
import { BusinessToCustomerSchedulingService } from "src/service/business-to-customer-scheduling.service";
import { APIResponse } from "src/utils/app-enum";
import Swal from "sweetalert2";

declare var $: any;
declare var checkList: any;
declare var items: any;
@Component({
  selector: 'app-business-to-business-appointments',
  templateUrl: './business-to-business-appointments.component.html',
  styleUrls: ['./business-to-business-appointments.component.css']
})
export class BusinessToBusinessAppointmentsComponent implements OnInit {

  b2bList: any = []

  constructor(
    private _b2c: BusinessToCustomerSchedulingService,
  ) {
   
  }

  ngOnInit(): void {
    
    $(".onlyadmin").removeClass("dclass");
    $('.onlyservicerequests').show();
    $(".nav-link").click(function () {
      $(".nav-link").removeClass("active");
      $(this).addClass("active");
    });
    $(".dropdown-check-list").hover(function () {
      $("#items").toggle();
    });

    let data =  {

      service_provider: 1

    }

    //now we will get a list of categories from the backend
    this._b2c.getB2B(data).subscribe({
    
      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success) {

          this.b2bList = res.data
          
          this.b2bList.forEach(el => {

            el['b2bUserData'] = JSON.parse(el['b2bUserData'])
            
          });

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