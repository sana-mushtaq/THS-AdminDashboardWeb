import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as moment from "moment";
import { Subject } from "rxjs";
import { Appointment } from "src/model/appointments/appointment.model";
import { Sector } from "src/model/common/sector.model";
import { AppDataService } from "src/service/app-data.service";
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { AlertType, APIResponse } from "src/utils/app-constants";

declare var $: any;
declare var checkList: any;
declare var items: any;

@Component({
  selector: "app-lab-appointments",
  templateUrl: "./lab-appointments.component.html",
  styleUrls: ["./lab-appointments.component.css"],
})
export class LabAppointmentsComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;

  appointmentList: Array<Appointment> = [];
  actualAppointmentList: Array<Appointment> = [];

  sectorList: Sector[] = [];

  selectedDateType = 1;
  filterStartDate;
  filterEndDate;
  selectedSectorId: number;

  constructor(private _appService: AppService, private _appUtil: UtilService, private router: Router, private _appDataService: AppDataService) {
    this._unsubscribeAll = new Subject();
    this.getSectors();
    this.getLabAppointmentList();
  }

  ngOnInit(): void {
    $('.onlylabmenu').removeClass('dclass');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 2500);
  }

 

  getLabAppointmentList(){
    this._appService.getLabAppointmentList().subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.actualAppointmentList = Appointment.getAppointmentList(response.upcomingAppointmentList);
          this.appointmentList = [...this.actualAppointmentList];
        } else {
          console.log("Unable to get appointments");
        }
      },
      (err) => {
        console.log("Unable to get appointments");
      }
    );
  }

  viewAppointmentDetails(appointment) {
    this._appDataService.currentAppointmentSubject.next(appointment);
    this.router.navigate(["/lab-view-appointment"]);
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

    $("#appointmentstable").DataTable().destroy();
    setTimeout(() => {
      this.appointmentList = filteredAppointments;
    }, 500);

    setTimeout(() => {
      this.redrawTable();
    }, 700);
  }

  clearFilterClicked() {
    $("#appointmentstable").DataTable().destroy();

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

  drawPage() {
    $("#items").css("display", "none");
    $("#book_slot_show").css("display", "none");

    $("#book_date").click(function () {
      $("#book_date_show").show();
      $("#book_slot_show").css("display", "none");
    });

    $("#book_slot").click(function () {
      $("#book_slot_show").show();
      $("#book_date_show").css("display", "none");
    });

    $("#list1").click(function () {
      $("#items").toggle();
    });

    // $('#example').DataTable();
    $("#appointmentstable thead tr").clone(true).addClass("filters").appendTo("#appointmentstable thead");

    var filterIndexes = [1, 2, 3, 4, 5, 6, 9];

    var table = $("#appointmentstable").DataTable({
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

  redrawTable() {
    var filterIndexes = [1, 2, 3, 4, 5, 6, 9];

    var table = $("#appointmentstable").DataTable({
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

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
