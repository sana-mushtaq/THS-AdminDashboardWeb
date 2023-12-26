import { Component, OnInit } from "@angular/core";
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { APIResponse } from "src/utils/app-constants";
import { AdminDashboard } from "src/model/dashboard/admin-dashboard.model";
import { Sector } from "src/model/common/sector.model";
import * as moment from "moment";
import { HttpClient } from '@angular/common/http';

declare var $: any;

@Component({
  selector: "app-accounts",
  templateUrl: "./accounts.component.html",
  styleUrls: ["./accounts.component.css"],
})
export class AccountsComponent implements OnInit {
  LabLists;
  LabDashboardDetails;
  todayAppointmentCount = 0;
  totalAppointmentsCount = 0;
  totalStaffsCount = 0;
  appointmentList = [];
  actualAppointmentList = [];

  sectorList: Sector[] = [];

  selectedDateType = 1;
  filterStartDate;
  filterEndDate;
  selectedSectorId: number;

  userRoles: any = {}

  jsonData: any;
  loaded: boolean = false;

  constructor(private _appService: AppService, private _appUtil: UtilService, private http: HttpClient) {
    this.getLabListData();
    this.getSectors();
  }

  ngOnInit(): void {

    this.userRoles = JSON.parse(localStorage.getItem("SessionDetails"));
    
    this.http.get('assets/userRoles.json').subscribe((data: any) => {
     
      let role = this.userRoles['role']
      this.jsonData = data[role];
      this.loaded = true;
    });


    
    $(".onlylab").removeClass("dclass");
    $(".onlyadmin").removeClass("dclass");
    $(".active-labs").addClass("active");
    $("#lab_dash_appointmentstable thead tr").clone(true).addClass("filters").appendTo("#lab_dash_appointmentstable thead");
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.redrawTable();
    }, 2500)
  }

  getDashboardData(e) {
    debugger;
    var serviceid = {
      serviceProviderId: e.target.value,
    };
    this._appService.getAdminLabDashboard(serviceid).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.LabDashboardDetails = AdminDashboard.getAdminLabDashboard(response);
          this.todayAppointmentCount = this.LabDashboardDetails.todayAppointmentCount;
          this.totalAppointmentsCount = this.LabDashboardDetails.totalAppointmentsCount;
          this.totalStaffsCount = this.LabDashboardDetails.totalStaffsCount;
          this.appointmentList = this.LabDashboardDetails.appointmentList;
          this.actualAppointmentList = this.LabDashboardDetails.appointmentList;
          $("#lab_dash_appointmentstable").DataTable().destroy();
          setTimeout(() => {
            this.redrawTable();
          }, 700);
        } else {
          console.log("Unable to get appointments");
        }
      },
      (err) => {
        console.log("Unable to get appointments");
      }
    );
  }

  getLabListData() {
    this._appService.getServiceProviderList().subscribe(
      (response: any) => {
        console.log(response);
        if (response.status == APIResponse.Success) {
          this.LabLists = response.serviceProviderList;
        } else {
          console.log("Unable to get appointments");
        }
      },
      (err) => {
        console.log("Unable to get appointments");
      }
    );
  }

  dateTypeClicked(selectedDateType) {
    this.selectedDateType = selectedDateType;
  }

  startDateChanged(event) {
    this.filterStartDate = event.target.value;
  }

  endDateChanged(event) {
    this.filterEndDate = event.target.value;
  }

  sectorSelected(event) {
    debugger;
    // let selectedSec = event.value;
    this.selectedSectorId = event.value;
  }

  filterButtonClicked() {
    var noOfStatusSelected = $("#items").val();
    this.appointmentList = [];

    var startDate;
    var endDate;
    var bookingDate;
    var appointmentDate;

    var filteredAppointments = [...this.actualAppointmentList];

    if (this.selectedSectorId != null) {
      filteredAppointments = filteredAppointments.filter((appointment) => appointment.serviceSectorId == this.selectedSectorId);
    }

    if (this.filterStartDate != null) {
      startDate = moment(this.filterStartDate, "YYYY-MM-DD");
    }

    if (this.filterEndDate != null) {
      endDate = moment(this.filterEndDate, "YYYY-MM-DD");
    }

    if (this.selectedDateType == 1) {
      if (startDate != null && endDate != null) {
        filteredAppointments = filteredAppointments.filter(
          (appointment) =>
            moment(appointment.appointmentBookingDate, "DD-MM-YYYY").isSameOrAfter(startDate) &&
            moment(appointment.appointmentBookingDate, "DD-MM-YYYY").isSameOrBefore(endDate)
        );
      } else if (startDate != null) {
        filteredAppointments = filteredAppointments.filter((appointment) => moment(appointment.appointmentBookingDate, "DD-MM-YYYY").isSameOrAfter(startDate));
      } else if (endDate != null) {
        filteredAppointments = filteredAppointments.filter((appointment) => moment(appointment.appointmentBookingDate, "DD-MM-YYYY").isSameOrBefore(endDate));
      }
    } else {
      if (startDate != null && endDate != null) {
        filteredAppointments = filteredAppointments.filter(
          (appointment) =>
            moment(appointment.appointmentDate, "DD-MM-YYYY").isSameOrAfter(startDate) &&
            moment(appointment.appointmentDate, "DD-MM-YYYY").isSameOrBefore(endDate)
        );
      } else if (startDate != null) {
        filteredAppointments = filteredAppointments.filter((appointment) => moment(appointment.appointmentDate, "DD-MM-YYYY").isSameOrAfter(startDate));
      } else if (endDate != null) {
        filteredAppointments = filteredAppointments.filter((appointment) => moment(appointment.appointmentDate, "DD-MM-YYYY").isSameOrBefore(endDate));
      }
    }
    this.appointmentList = [];

    $("#lab_dash_appointmentstable").DataTable().destroy();
    setTimeout(() => {
      this.appointmentList = filteredAppointments;
    }, 500);

    setTimeout(() => {
      this.redrawTable();
    }, 700);
  }

  clearFilterClicked() {
    $("#lab_dash_appointmentstable").DataTable().destroy();

    setTimeout(() => {
      this.appointmentList = [...this.actualAppointmentList];
    }, 500);

    $("#slotStartDate").val("");
    $("#slotEndDate").val("");
    $("#bookingStartDate").val("");
    $("#bookingEndDate").val("");
    this.filterStartDate = null;
    this.filterEndDate = null;

    setTimeout(() => {
      this.redrawTable();
    }, 700);
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

  redrawTable() {
    
    var filterIndexes = [1, 2, 3, 4, 5, 6, 8, 9];

    var table = $("#lab_dash_appointmentstable").DataTable({
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
}
