import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MirthService } from 'src/service/mirth.service';
import { HttpClient } from '@angular/common/http';

import Swal from "sweetalert2";

@Component({
  selector: 'app-third-party-request-view',
  templateUrl: './third-party-request-view.component.html',
  styleUrls: ['./third-party-request-view.component.css']
})
export class ThirdPartyRequestViewComponent implements OnInit {
  public request_id : number = 0;
  public appointmentRequest : any = {};

  userRoles: any = {}

  jsonData: any;
  loaded: boolean = false;

  constructor( private route : ActivatedRoute, private mirthServices : MirthService,  private http: HttpClient) {
    
    this.route.params.subscribe({
      next : ( params : any) => {
        this.request_id = params?.id || null;
        this.getRequest(this.request_id);
      }
    });
  }

  ngOnInit() {

    this.userRoles = JSON.parse(localStorage.getItem("SessionDetails"));
    
    this.http.get('assets/userRoles.json').subscribe((data: any) => {
     
      let role = this.userRoles['role']
      this.jsonData = data[role];
      this.loaded = true;
    });
    
    $(".onlyadmin").removeClass("dclass");
    $('.onlyservicerequests').show();
    $(".nav-link").click(function () {
      $(".nav-link").removeClass("active");
      $(this).addClass("active");
    });
    $(".dropdown-check-list").hover(function () {
      $("#items").toggle();
    });
  }

  getRequest( id : any ){
    this.mirthServices.getSingleRequest( id ).subscribe({
      next : ( res : any ) => {
        if( res.request.length > 0 ){
          this.appointmentRequest = res.request[0];
          this.appointmentRequest.speciality = JSON.parse( this.appointmentRequest.speciality );
        }
      },
      error: ( err : any ) => { Swal.fire('Error', err.error.message, 'error' ); }
    });
  }

}
