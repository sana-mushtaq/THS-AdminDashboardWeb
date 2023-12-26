import { Component, OnInit } from '@angular/core';
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { Router } from "@angular/router";
import { AdminDashboard } from "src/model/dashboard/admin-dashboard.model";
import { Sector } from "src/model/common/sector.model";
import { InsuranceList } from 'src/model/common/insurance.modal';
import { AppDataService } from "src/service/app-data.service";
import { Appointment } from "src/model/appointments/appointment.model";
import { AlertType, APIResponse, AppointmentTriggerSource } from "src/utils/app-constants";
import * as moment from "moment";
import Swal from "sweetalert2";
import { HttpClient } from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'app-escort-requests',
  templateUrl: './escort-requests.component.html',
  styleUrls: ['./escort-requests.component.css']
})
export class EscortRequestsComponent implements OnInit {











  


  insuranceList;
  appointmentList = [];
  actualAppointmentList = [];
  newAppointmentList = [];
  activeAppointmentList = [];
  closedAppointmentList = []
  sectorList: Sector[] = [];
  selectedAppointmentId;
  selectedServiceProvider;

  userRoles: any = {}

  jsonData: any;
  loaded: boolean = false;

  constructor(private _appService: AppService, private _appUtil: UtilService, private router: Router,
    private _appDataService: AppDataService, private http: HttpClient) {
    this.getInsuranceProviderList();
    this.getSectors();
    this.getAppointmentLists();
  }

  ngOnInit(): void {

    
    this.userRoles = JSON.parse(localStorage.getItem("SessionDetails"));
    
    this.http.get('assets/userRoles.json').subscribe((data: any) => {
     
      let role = this.userRoles['role']
      this.jsonData = data[role];
      this.loaded = true;
    });
    
    $('.onlyservicerequests').show();
    $(".onlyadmin").removeClass("dclass");
    $(".appoint-programs").addClass("active");
    $("#appointmentslabtable thead tr").clone(true).addClass("filters").appendTo("#appointmentstable thead");
    $('.nav-link').click(function() {
      $('.nav-link').removeClass('active');
      $(this).addClass('active');
    })     
  }
  ngAfterViewInit() {
    setTimeout(() => {
      $("#nav_appointment").addClass("active");

      this.redrawTable();
    }, 2500)
  }

  setServiceProvider(e){
    this.selectedServiceProvider = e.value;
  }
  

  modalClick(id) {
    this.selectedAppointmentId = id;
    $('#assign_lab').show();
  }
  close() {
    $('#assign_lab').hide();
  }
  BookToAnotherLab() {
    let params= {
      serviceProviderId:this.selectedServiceProvider,
      appointmentId:this.selectedAppointmentId
    }
    this._appService.assignServiceProviderForAppointment(params).subscribe(
      (response: any) => {
        $('#assign_lab').hide();
        if (response.status == APIResponse.Success) {
          this.getAppointmentLists();
          Swal.fire("Success.", response.message, "success");
        } else {
          Swal.fire("Error.", response.message, "error");
          console.log("Unable to get sectors");
        }
      },
      (err) => {
        console.log("Unable to get sectors");
      }
    );
  }

  getInsuranceProviderList() {
    this._appService.getInsuranceProviderList().subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.insuranceList = InsuranceList.getInsuranceList(response);
        } else {
          console.log("server error");
        }
      },
      (err) => {
        console.log("server error");
      }
    );
  }
  getSectors() {
    this._appService.getSectorList().subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.sectorList = Sector.getSectorList(response);
        } else {
          console.log("Unable to get sectors");
        }
      },
      (err) => {
        console.log("Unable to get sectors");
      }
    );
  }
  getAppointmentLists() {
    this._appService.getEscortServiceRequestList().subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          // this.sectorList = Sector.getSectorList(response);
          this.actualAppointmentList = Appointment.getAppointmentList(response.upcomingAppointmentList);
          // this.appointmentList = response.upcomingAppointmentList;
          this.newAppointmentList = this.actualAppointmentList.filter((appointment) => appointment.appointmentCurrentStatus == 0);
          this.activeAppointmentList = this.actualAppointmentList.filter((appointment) => appointment.appointmentCurrentStatus >= 1 && appointment.appointmentCurrentStatus < 5);
          this.closedAppointmentList = this.actualAppointmentList.filter((appointment) => appointment.appointmentCurrentStatus >= 5);
        } else {
          console.log("Unable to get sectors");
        }
      },
      (err) => {
        console.log("Unable to get sectors");
      }
    );
  }

  redrawTable() {
    
    var filterIndexes = [1, 2, 3, 4, 5, 6, 8, 9];

    var table = $("#EscortNew").DataTable({
      orderCellsTop: true,
      fixedHeader: true,
      bDestroy: true,
      initComplete: function () {
        var api = this.api();

        api
          .columns()
          .eq(0)
          .each(function (colIdx) {
            if ($.inArray(colIdx, filterIndexes) != -1) {
              var cell = $(".filters th").eq($(api.column(colIdx).header()).index());
              var title = $(cell).text();
              $(cell).html('<input type="search" class="form-control form-control-sm" placeholder="" />');

              // On every keypress in this input
              $("input", $(".filters th").eq($(api.column(colIdx).header()).index()))
                .off("keyup change")
                .on("keyup change", function (e) {
                  e.stopPropagation();
                  $(this).attr("title", $(this).val());
                  var regexr = "({search})";

                  var cursorPosition = this.selectionStart;
                  api
                    .column(colIdx)
                    .search(this.value != "" ? regexr.replace("{search}", "(((" + this.value + ")))") : "", this.value != "", this.value == "")
                    .draw();

                  $(this).focus()[0].setSelectionRange(cursorPosition, cursorPosition);
                });
            } else {
              var cell = $(".filters th").eq($(api.column(colIdx).header()).index());
              var title = $(cell).text();
              $(cell).html('<input type="hidden" />');
            }
          });
      },
    });

    var table = $("#EscortActive").DataTable({
      orderCellsTop: true,
      fixedHeader: true,
      bDestroy: true,
      initComplete: function () {
        var api = this.api();

        api
          .columns()
          .eq(0)
          .each(function (colIdx) {
            if ($.inArray(colIdx, filterIndexes) != -1) {
              var cell = $(".filters th").eq($(api.column(colIdx).header()).index());
              var title = $(cell).text();
              $(cell).html('<input type="search" class="form-control form-control-sm" placeholder="" />');

              // On every keypress in this input
              $("input", $(".filters th").eq($(api.column(colIdx).header()).index()))
                .off("keyup change")
                .on("keyup change", function (e) {
                  e.stopPropagation();
                  $(this).attr("title", $(this).val());
                  var regexr = "({search})";

                  var cursorPosition = this.selectionStart;
                  api
                    .column(colIdx)
                    .search(this.value != "" ? regexr.replace("{search}", "(((" + this.value + ")))") : "", this.value != "", this.value == "")
                    .draw();

                  $(this).focus()[0].setSelectionRange(cursorPosition, cursorPosition);
                });
            } else {
              var cell = $(".filters th").eq($(api.column(colIdx).header()).index());
              var title = $(cell).text();
              $(cell).html('<input type="hidden" />');
            }
          });
      },
    });

    var table = $("#EscortClosed").DataTable({
      orderCellsTop: true,
      fixedHeader: true,
      bDestroy: true,
      initComplete: function () {
        var api = this.api();

        api
          .columns()
          .eq(0)
          .each(function (colIdx) {
            if ($.inArray(colIdx, filterIndexes) != -1) {
              var cell = $(".filters th").eq($(api.column(colIdx).header()).index());
              var title = $(cell).text();
              $(cell).html('<input type="search" class="form-control form-control-sm" placeholder="" />');

              // On every keypress in this input
              $("input", $(".filters th").eq($(api.column(colIdx).header()).index()))
                .off("keyup change")
                .on("keyup change", function (e) {
                  e.stopPropagation();
                  $(this).attr("title", $(this).val());
                  var regexr = "({search})";

                  var cursorPosition = this.selectionStart;
                  api
                    .column(colIdx)
                    .search(this.value != "" ? regexr.replace("{search}", "(((" + this.value + ")))") : "", this.value != "", this.value == "")
                    .draw();

                  $(this).focus()[0].setSelectionRange(cursorPosition, cursorPosition);
                });
            } else {
              var cell = $(".filters th").eq($(api.column(colIdx).header()).index());
              var title = $(cell).text();
              $(cell).html('<input type="hidden" />');
            }
          });
      },
    });
  }
  
  TestCounter(){
    
  }
  NewRequests() {
    $('.in_ac_cards').hide();
    $('.new_card_space').show();
  }
  ActiveRequests() {
    $('.in_ac_cards').hide();  
    $('.active_card_space').show();  
  }
  ClosedRequests() {
    $('.in_ac_cards').hide();  
    $('.inactive_card_space').show();  
  }

  viewAppointmentDetails(appointment) {
    var selectedAppointment = appointment;
    selectedAppointment["appointmentTriggerSource"] = AppointmentTriggerSource.LabAppointmentList;
    this._appDataService.currentAppointmentSubject.next(selectedAppointment);
    this.router.navigate(["/escort-not-scheduled"]);
  }

  labChangeFilter(e) {
    var serviceProviderId = e.value
    if(serviceProviderId != 0) {
      this.newAppointmentList = this.actualAppointmentList.filter((appointment) => appointment.appointmentCurrentStatus == 0 && appointment.insuranceProviderId == serviceProviderId);
      this.activeAppointmentList = this.actualAppointmentList.filter((appointment) => appointment.appointmentCurrentStatus > 1 && appointment.appointmentCurrentStatus < 5 && appointment.insuranceProviderId == serviceProviderId);
      this.closedAppointmentList = this.actualAppointmentList.filter((appointment) => appointment.appointmentCurrentStatus >= 5 && appointment.insuranceProviderId == serviceProviderId);
    }
    else {
      this.newAppointmentList = this.actualAppointmentList.filter((appointment) => appointment.appointmentCurrentStatus == 0);
      this.activeAppointmentList = this.actualAppointmentList.filter((appointment) => appointment.appointmentCurrentStatus > 1 && appointment.appointmentCurrentStatus < 5);
      this.closedAppointmentList = this.actualAppointmentList.filter((appointment) => appointment.appointmentCurrentStatus >= 5);
    }

  }


}
