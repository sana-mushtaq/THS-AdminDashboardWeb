import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AdminDashboard } from 'src/model/dashboard/admin-dashboard.model';
import { AppDataService } from 'src/service/app-data.service';
import { AppService } from 'src/service/app.service';
import { UtilService } from 'src/service/util.service';
import { APIResponse } from 'src/utils/app-constants';
import * as moment from 'moment';
declare let zingchart: any;
declare let CanvasJS: any;
declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  private _unsubscribeAll: Subject<any>;

  adminDashboard: AdminDashboard;
  todayAppointmentCount = 0;
  totalAppointmentsCount = 0;
  totalPatientsCount = 0;
  totalStaffsCount = 0;
  latestAppointments = [];
  filterStartDate;
  filterEndDate;
  filterYear;
  filterType = 1;

  totalCollection= 0;
  mobileApp = 0;
  adminPortal = 0;

  actualGraphDataResponse;

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
    this._appService.getAdminDashboard().subscribe((response: any) => {
      if (response.status == APIResponse.Success) {
        this.adminDashboard = AdminDashboard.getAdminDashboard(response);
        this.todayAppointmentCount = this.adminDashboard.todayAppointmentCount;
        this.totalAppointmentsCount = this.adminDashboard.totalAppointmentsCount;
        this.totalPatientsCount = this.adminDashboard.totalPatientsCount;
        this.totalStaffsCount = this.adminDashboard.totalStaffsCount;
        this.latestAppointments = this.adminDashboard.latestAppointments;
      } else {
        console.log("Unable to get appointments");
      }
    }, err => {
      console.log("Unable to get appointments");
    });
  }

  ngOnInit(): void {

    $('.onlyadmin').removeClass('dclass');

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

    // zingchart.render({
    //   id: 'myChart',
    //   data: myConfig,
    //   height: "100%",
    //   width: "100%"
    // });

    var myConfig2 = {
      "type": "bar",
      "plot": {
        "value-box": {
          "text": "%v"
        },
        "tooltip": {
          "text": "%v"
        }
      },
      // "legend": {
      //   "toggle-action": "hide",
      //   "header": {
      //     "text": "Legend Header"
      //   },
      //   "item": {
      //     "cursor": "pointer"
      //   },
      //   "draggable": true,
      //   "drag-handler": "icon"
      // },
      "scale-x": {
        "values": [
          "Mon",
          "Wed",
          "Fri"
        ]
      },
      "series": [
        {
          "values": [3,6,9],
          "text": "apples"
        },
        {
          "values": [1,4,3],
          "text": "oranges"
        }
      ]
    };

    // zingchart.render({
    //   id: 'myChart2',
    //   data: myConfig2,
    //   height: "100%",
    //   width: "100%"
    // });

    var myConfig3 = {
      type: 'bar',
      plot: {
        styles: [ "red", "orange", "yellow", "green", "blue", "purple", "brown", "black" ] /* Bar Fill by Node */
      },
      series: [
        {
          values: [20,40,25,50,15,45,33,34]
        }
      ],
      scaleX: {
        values: [],
      }
    }

    // zingchart.render({
    //   id: 'myChart3',
    //   data: myConfig3,
    //   height: "100%",
    //   width: "100%"
    // });

    var chart = new CanvasJS.Chart("chartContainer", {
      title:{
        text: "My First Chart in CanvasJS"              
      },
      data: [              
      {
        // Change type to "doughnut", "line", "splineArea", etc.
        type: "column",
        dataPoints: [
          { label: "apple",  y: 10  },
          { label: "orange", y: 15  },
          { label: "banana", y: 25  },
          { label: "mango",  y: 30  },
          { label: "grape",  y: 28  }
        ]
      }
      ]
    });
    chart.render();


    //$('#inactive').hide();
    //  $('.toggle-menu').click(function(){
    //   console.log("Working");
    //   // $('.side-menu').toggle();
    //   $('.side-menu').css("left","0px");
    // })
  }
  ngAfterViewInit() {

  }
  

  startDateChanged(event) {
    this.filterStartDate = event.target.value;
  }

  endDateChanged(event) {
    this.filterEndDate = event.target.value;
  }
  yearChanged(event){
    this.filterYear = event.target.value;
  }
  dateTypeClicked(value) {
    setTimeout(() => {
      $('#yearSelect').datepicker({
        changeYear: true,
        showButtonPanel: true,
        dateFormat: 'yy',
        onClose: function(dateText, inst) { 
            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
            $(this).datepicker('setDate', new Date(year, 1));
        }
      });
      $(".date-picker-year").focus(function () {
          $(".ui-datepicker-month").hide();
      });
    }, 500);
    this.filterType = value;
  }
  filterButtonClicked() {
    var params;
    var filterType = this.filterType;

    if(filterType == 1) {
      params={
        "reportType": 1,
        "startDate": this.filterStartDate,
        "endDate": this.filterEndDate
      }
    }
    if(filterType == 2) {
      params={
        "reportType": 2,
        "year": parseInt(moment($("#bookingStartDateWeekly").val(),"YYYY-MM").format("YYYY")).toFixed(0),
        "month": parseInt(moment($("#bookingStartDateWeekly").val(),"YYYY-MM").format("MM")).toFixed(0),
      }
    }
    if(filterType == 3) {
      params={
        "reportType":3,
        "year":$('#yearSelect').val()
      }
    }
    console.log(params);
    this._appService.getServiceSectorStats(params).subscribe((response: any) => {
      if (response.status == APIResponse.Success) {
        this.actualGraphDataResponse = response;
        this.totalCollection = response.collectionSummary.totalCollection
    this.mobileApp = response.collectionSummary.mobileApp
    this.adminPortal = response.collectionSummary.adminPortal
    var dateWiseStatsData = response.dateWiseStats;
    var moneyStatsData = response.moneyStats;
    var careGiverStatsData = response.careGiverStats;
    var departmentWiseStats = response.departmentWiseStats;

    var dateWiseStatsLabel = [];
    var dateWiseStatsValue = [];
    var moneyStatsLabel = [];
    var moneyStatsValue = [];
    var careGiverStatsLabel = [];
    var careGiverStatsValue = [];
    var departmentWiseStatsLabel = [];
    var departmentWiseStatsValue = [];

    dateWiseStatsData.forEach(element => {
      dateWiseStatsLabel.push(element.attributeName);
      dateWiseStatsValue.push(element.attributeValue);
    });

    moneyStatsData.forEach(element => {
      moneyStatsLabel.push(element.attributeName);
      moneyStatsValue.push(element.attributeValue);
    });

    careGiverStatsData.forEach(element => {
      careGiverStatsLabel.push(element.attributeName);
      careGiverStatsValue.push(element.attributeValue);
    });

    departmentWiseStats.forEach(element => {
      departmentWiseStatsLabel.push(element.attributeName);
      departmentWiseStatsValue.push(element.attributeValue);
    });

    var dateWiseGraphData = this.getChartConfig(dateWiseStatsLabel,dateWiseStatsValue);
    var moneyGraphData = this.getChartConfig(moneyStatsLabel,moneyStatsValue)
    var caregiverGraphData = this.getChartConfig(careGiverStatsLabel,careGiverStatsValue)
    var departmentGraphData = this.getChartConfig(departmentWiseStatsLabel,departmentWiseStatsValue)

    zingchart.render({
      id: 'myChart1',
      data: dateWiseGraphData,
      height: "100%",
      width: "100%"
    });
    zingchart.render({
      id: 'myChart2',
      data: moneyGraphData,
      height: "100%",
      width: "100%"
    });
    zingchart.render({
      id: 'myChart3',
      data: caregiverGraphData,
      height: "100%",
      width: "100%"
    });
    zingchart.render({
      id: 'myChart4',
      data: departmentGraphData,
      height: "100%",
      width: "100%"
    });
      } else {
        console.log("Unable to get appointments");
      }
    }, err => {
      console.log("Unable to get appointments");
    });

    var response = {
      "status": 0,
      "message": "Dashboard stats fetched successfully",
      "collectionSummary": {
        "totalCollection": 5000.50,
        "mobileApp": 3000.50,
        "adminPortal": 2000
      },
      "dateWiseStats": [
        {
          "attributeName": "2023-01-10",
          "attributeValue": 20
        },
        {
          "attributeName": "2023-01-11",
          "attributeValue": 30
        },
        {
          "attributeName": "2023-01-12",
          "attributeValue": 10
        }
      ],
      "moneyStats": [
        {
          "attributeName": "2023-01-10",
          "attributeValue": 3500
        },
        {
          "attributeName": "2023-01-11",
          "attributeValue": 5000.50
        },
        {
          "attributeName": "2023-01-12",
          "attributeValue": 1250
        }
      ],
      "careGiverStats": [
        {
          "attributeName": "Alhssain",
          "attributeValue": 15
        },
        {
          "attributeName": "Saleem",
          "attributeValue": 10
        },
        {
          "attributeName": "Unassigned",
          "attributeValue": 20
        }
      ],
      "departmentWiseStats": [
        {
          "attributeName": "Physio",
          "attributeValue": 15
        },
        {
          "attributeName": "XRay",
          "attributeValue": 5
        },
        {
          "attributeName": "Home Nurse",
          "attributeValue": 25
        }
      ]
    };

    // this.totalCollection = response.collectionSummary.totalCollection
    // this.mobileApp = response.collectionSummary.mobileApp
    // this.adminPortal = response.collectionSummary.adminPortal
    // var dateWiseStatsData = response.dateWiseStats;
    // var moneyStatsData = response.moneyStats;
    // var careGiverStatsData = response.careGiverStats;
    // var departmentWiseStats = response.departmentWiseStats;

    // var dateWiseStatsLabel = [];
    // var dateWiseStatsValue = [];
    // var moneyStatsLabel = [];
    // var moneyStatsValue = [];
    // var careGiverStatsLabel = [];
    // var careGiverStatsValue = [];
    // var departmentWiseStatsLabel = [];
    // var departmentWiseStatsValue = [];

    // dateWiseStatsData.forEach(element => {
    //   dateWiseStatsLabel.push(element.attributeName);
    //   dateWiseStatsValue.push(element.attributeValue);
    // });

    // moneyStatsData.forEach(element => {
    //   moneyStatsLabel.push(element.attributeName);
    //   moneyStatsValue.push(element.attributeValue);
    // });

    // careGiverStatsData.forEach(element => {
    //   careGiverStatsLabel.push(element.attributeName);
    //   careGiverStatsValue.push(element.attributeValue);
    // });

    // departmentWiseStats.forEach(element => {
    //   departmentWiseStatsLabel.push(element.attributeName);
    //   departmentWiseStatsValue.push(element.attributeValue);
    // });

    // var dateWiseGraphData = this.getChartConfig(dateWiseStatsLabel,dateWiseStatsValue);
    // var moneyGraphData = this.getChartConfig(moneyStatsLabel,moneyStatsValue)
    // var caregiverGraphData = this.getChartConfig(careGiverStatsLabel,careGiverStatsValue)
    // var departmentGraphData = this.getChartConfig(departmentWiseStatsLabel,departmentWiseStatsValue)

    // zingchart.render({
    //   id: 'myChart1',
    //   data: dateWiseGraphData,
    //   height: "100%",
    //   width: "100%"
    // });
    // zingchart.render({
    //   id: 'myChart2',
    //   data: moneyGraphData,
    //   height: "100%",
    //   width: "100%"
    // });
    // zingchart.render({
    //   id: 'myChart3',
    //   data: caregiverGraphData,
    //   height: "100%",
    //   width: "100%"
    // });
    // zingchart.render({
    //   id: 'myChart4',
    //   data: departmentGraphData,
    //   height: "100%",
    //   width: "100%"
    // });
    
  }

  getChartConfig(labels, values) {
    var goals = [];
    values.forEach(element => {
      goals.push(element.toFixed(2));
    });
    // var myConfig = {
    //   // type: 'bar',      
    //   // plot: {
    //   //   scrollStepMultiplier: 2,
    //   //   // styles: [ "red", "orange", "yellow", "green", "blue", "purple", "brown", "black" ] /* Bar Fill by Node */,
    //   // },
    //   // series: [
    //   //   {
    //   //     values: values,
    //   //   }
    //   // ],
    //   // scaleX: {
    //   //   values: labels,
    //   // },
    //   type: "bar",
    //   fillAngle: 45,
    //   maxWidth: 100,
    //   wrapText: true,
    //   "scale-x": {
    //     labels: labels,
    //     zooming: true,
    //     zoomTo: [0, 14],
    //     item: {
    //       fontAngle: -48,
    //       fontSize: "10px",
    //       offsetX: "5px",
    //       wrapText: true,
    //     },
    //     "max-width": "20px",
    //     itemsOverlap: true,
    //     wrapText: true,
    //     "items-overlap": true,
    //   },
    //   scrollX: {},
    //   "scale-y": {
    //     format: "%v%",
    //   },
    //   plot: {
    //     fillType: "none",
    //     // tooltip: {
    //     //   text: "%v",
    //     // },
    //     scrollStepMultiplier: 2,
    //     hoverstate: {
    //       visible: true,
    //     },
    //     barWidth: 40,
    //     "value-box": {
    //       text: "%v%",
    //     },
    //   },
    //   series: [
    //     {
    //       values: goals,
    //     },
    //   ],
    // }

    var myConfig = {
      "type": "line",
      "series": [{
        "values": values,
        'line-color': "#01327f",
      },],      
      fillAngle: 45,
      maxWidth: 100,
      wrapText: true,
      "scale-x": {
        labels: labels,
        zooming: true,
        zoomTo: [0, 14],
        item: {
          fontAngle: -48,
          fontSize: "10px",
          offsetX: "5px",
          wrapText: true,
        },
        "max-width": "20px",
        itemsOverlap: true,
         wrapText: true,
        "items-overlap": true,
      },
      scrollX: {},
      // "scale-y": {
      //   format: "%v%",
      // },
      plot: {
        fillType: "none",
        // tooltip: {
        //   text: "%v",
        // },
        scrollStepMultiplier: 2,
        hoverstate: {
          visible: true,
        },
        "value-box": {
          short:true
          // text: "%v%",
        },
      },
    };

    return myConfig;
  }
  clearFilterClicked() {

  }

  toggleChart(type,renderID) {
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

    // var myConfigthree = {
    // //   type: "line",
    // //   utc: true,
    // //   title: {
    // //     text: "",
    // //     "font-size": "24px",
    // //     "adjust-layout": true,
    // //   },
    // //   plotarea: {
    // //     margin: "0 30 50 dynamic",
    // //   },
    // //   legend: {
    // //     layout: "float",
    // //     visible: false,
    // //     "background-color": "none",
    // //     "border-width": 0,
    // //     shadow: 0,
    // //     align: "center",
    // //     "adjust-layout": true,
    // //     "toggle-action": "remove",
    // //     item: {
    // //       padding: 7,
    // //       marginRight: 17,
    // //       cursor: "hand",
    // //     },
    // //   },
    // //   "scale-x": {
    // //     "min-value": 100,
    // //     shadow: 0,
    // //     step: 10,
    // //     labels: surveyDateArray,
    // //     label: {
    // //       visible: true,
    // //     },
    // //     "minor-ticks": 0,
    // //   },
    // //   "scale-y": {
    // //     "line-color": "#f6f7f8",
    // //     format: "%v% ",
    // //     shadow: 0,
    // //     guide: {
    // //       "line-style": "dashed",
    // //     },
    // //     label: {
    // //       text: "",
    // //     },
    // //     "minor-ticks": 0,
    // //     "thousands-separator": ",",
    // //   },
    // //   "crosshair-x": {
    // //     "line-color": "#efefef",
    // //     "plot-label": {
    // //       "border-radius": "5px",
    // //       "border-width": "1px",
    // //       "border-color": "#f6f7f8",
    // //       padding: "10px",
    // //       "font-weight": "bold",
    // //     },
    // //     "scale-label": {
    // //       "font-color": "#000",
    // //       "background-color": "#f6f7f8",
    // //       "border-radius": "5px",
    // //     },
    // //   },
    // //   tooltip: {
    // //     visible: true,
    // //   },
    // //   plot: {
    // //     highlight: true,
    // //     "tooltip-text": "%t views: %v<br>%k",
    // //     shadow: 0,
    // //     "line-width": "4px",
    // //     marker: {
    // //       type: "circle",
    // //       size: 5,
    // //     },
    // //     "value-box": {
    // //       text: "%v%",
    // //     },
    // //     "highlight-state": {
    // //       "line-width": 3,
    // //     },
    // //     animation: {
    // //       effect: 1,
    // //       sequence: 2,
    // //       speed: 100,
    // //     },
    // //   },
    // //   series: [
    // //     {
    // //       values: [+this.orgOverallStats.overallOrganisationScore.toFixed(2)],
    // //       text: "",
    // //       "line-color": "#5db476",
    // //       "legend-item": {
    // //         "background-color": "#5db476",
    // //         borderRadius: 5,
    // //         "font-color": "white",
    // //       },
    // //       "legend-marker": {
    // //         visible: false,
    // //       },
    // //       marker: {
    // //         "background-color": "#fff",
    // //         "border-width": 1,
    // //         shadow: 0,
    // //         "border-color": "#5db476",
    // //       },
    // //       "highlight-marker": {
    // //         size: 6,
    // //         "background-color": "#fff",
    // //       },
    // //     },
    // //   ],
    // // };

  }

}
