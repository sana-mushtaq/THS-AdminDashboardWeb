import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AdminDashboard } from 'src/model/dashboard/admin-dashboard.model';
import { AppDataService } from 'src/service/app-data.service';
import { AppService } from 'src/service/app.service';
import { UtilService } from 'src/service/util.service';
import { APIResponse } from 'src/utils/app-constants';
declare let zingchart: any;
@Component({
  selector: 'app-lab-dashboard',
  templateUrl: './lab-dashboard.component.html',
  styleUrls: ['./lab-dashboard.component.css']
})
export class LabDashboardComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;

  // adminDashboard: AdminDashboard;
  todayAppointmentCount = 0;
  totalAppointmentsCount = 0;
  totalPatientsCount = 0;
  totalStaffsCount = 0;
  latestAppointments = [];

  constructor(
    private _appService: AppService,
    private _appUtil: UtilService,
    private router: Router,
    private _appDataService: AppDataService
  ) {
    this._unsubscribeAll = new Subject();
    this.getDashboardData();
  }

  getDashboardData() {
    this._appService.getServiceProviderDashboard().subscribe((response: any) => {
      if (response.status == APIResponse.Success) {
        var data = AdminDashboard.getAdminDashboard(response);
        this.todayAppointmentCount = data.todayAppointmentCount;
        this.totalAppointmentsCount = data.totalAppointmentsCount;
        this.totalPatientsCount = data.totalPatientsCount;
        this.totalStaffsCount = data.totalStaffsCount;
        this.latestAppointments = data.latestAppointments;
      } else {
        console.log("Unable to get appointments");
      }
    }, err => {
      console.log("Unable to get appointments");
    });
  }

  ngOnInit(): void {

    $('.onlylabmenu').removeClass('dclass');

    var myConfig = {
      "type": "line",
      "series": [{
        "values": [20, 40, 25, 50, 15, 45, 33, 34],
        'line-color': "#01327f",
      }, {
        "values": [5, 30, 21, 18, 59, 50, 28, 33],
        'line-color': "#ffff00",
      }, {
        "values": [30, 5, 18, 21, 33, 41, 29, 15],
        'line-color': "#ff5aa4",
      }, {
        "values": [30, 5, 18, 21, 33, 41, 29, 15],
        'line-color': "#0ce26a",
      }]
    };

    zingchart.render({
      id: 'myChart',
      data: myConfig,
      height: "100%",
      width: "100%"
    });

    var myConfig2 = {
      "type": "line",
      "series": [{
        "values": [20, 60, 25, 50, 15, 50, 33, 34],
        'line-color': "#fa86ba",
      }, {
        "values": [5, 40, 21, 18, 60, 50, 28, 33],
        'line-color': "#8b74e6",
      }]
    };

    zingchart.render({
      id: 'myChart2',
      data: myConfig2,
      height: "100%",
      width: "100%"
    });

    var myConfig3 = {
      "type": "line",
      "series": [{
        "values": [20, 30, 25, 40, 15, 45, 30, 34],
        'line-color': "#9ac6fa",
      }]
    };

    zingchart.render({
      id: 'myChart3',
      data: myConfig3,
      height: "100%",
      width: "100%"
    });


    //$('#inactive').hide();
    //  $('.toggle-menu').click(function(){
    //   console.log("Working");
    //   // $('.side-menu').toggle();
    //   $('.side-menu').css("left","0px");
    // })
  }

}
