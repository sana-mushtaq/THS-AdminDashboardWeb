import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { Appointment } from "src/model/appointments/appointment.model";
import { Sector } from "src/model/common/sector.model";
import { AppDataService } from "src/service/app-data.service";
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { APIResponse, AppointmentTriggerSource } from "src/utils/app-constants";
import { HttpClient } from '@angular/common/http';

declare var $: any;

@Component({
  selector: "app-result-reading",
  templateUrl: "./result-reading.component.html",
  styleUrls: ["./result-reading.component.css"],
})
export class ResultReadingComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;

  appointmentList: Array<Appointment> = [];
  actualAppointmentList: Array<Appointment> = [];

  openAppointmentList: Array<Appointment> = [];
  closedAppointmentList: Array<Appointment> = [];

  sectorList: Sector[] = [];

  selectedDateType = 1;
  filterStartDate;
  filterEndDate;
  selectedSectorId: number;

  userRoles: any = {}

  jsonData: any;
  loaded: boolean = false;

  constructor(private _appService: AppService, private _appUtil: UtilService, private router: Router, private _appDataService: AppDataService,  private http: HttpClient) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    
    this.userRoles = JSON.parse(localStorage.getItem("SessionDetails"));
    
    this.http.get('assets/userRoles.json').subscribe((data: any) => {
     
      let role = this.userRoles['role']
      this.jsonData = data[role];
      this.loaded = true;
    });
    
    this.getResultReadingRequestList();
    // this.drawPage();
    $('.nav-link').click(function() {
      $('.nav-link').removeClass('active');
      $(this).addClass('active');
    })
    $("#rr_servicerequeststable thead tr").clone(true).addClass("filters").appendTo("#rr_servicerequeststable thead");
    $(".onlyadmin").removeClass("dclass");
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 2500);
  }

  getResultReadingRequestList() {
    let params = {};
    this._appService.getResultReadingRequestList(params).subscribe(
      (response: any) => {
        debugger;
        if (response.status == APIResponse.Success) {
          this.actualAppointmentList = response;
          this.appointmentList = Appointment.getAppointmentList(response.openAppointmentList);
          this.openAppointmentList = Appointment.getAppointmentList(response.openAppointmentList);
          this.closedAppointmentList = Appointment.getAppointmentList(response.closedAppointmentList);
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
    var selectedAppointment = appointment;
    selectedAppointment["appointmentTriggerSource"] = AppointmentTriggerSource.ResultReadingList;
    this._appDataService.currentAppointmentSubject.next(selectedAppointment);
    this.router.navigate(["/not-scheduled"]);
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


    var filterIndexes = [1, 2, 3, 4, 5, 6, 9];

    var table = $("#rr_servicerequeststable").DataTable({
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

    // $("#rr_closedservicerequeststable thead tr").clone(true).addClass("filters").appendTo("#rr_closedservicerequeststable thead");

    var filterIndexes2 = [1, 2, 3, 4, 5, 6, 9];

    // var table2 = $("#rr_closedservicerequeststable").DataTable({
    //   orderCellsTop: true,
    //   fixedHeader: true,
    //   bDestroy: true,
    //   initComplete: function () {
    //     var api = this.api();

    //     api
    //       .columns()
    //       .eq(0)
    //       .each(function (colIdx) {
    //         if ($.inArray(colIdx, filterIndexes2) != -1) {
    //           var cell = $(".filters th").eq($(api.column(colIdx).header()).index());
    //           var title = $(cell).text();
    //           $(cell).html('<input type="search" class="form-control form-control-sm" placeholder="" />');

    //           // On every keypress in this input
    //           $("input", $(".filters th").eq($(api.column(colIdx).header()).index()))
    //             .off("keyup change")
    //             .on("keyup change", function (e) {
    //               e.stopPropagation();
    //               $(this).attr("title", $(this).val());
    //               var regexr = "({search})";

    //               var cursorPosition = this.selectionStart;
    //               api
    //                 .column(colIdx)
    //                 .search(this.value != "" ? regexr.replace("{search}", "(((" + this.value + ")))") : "", this.value != "", this.value == "")
    //                 .draw();

    //               $(this).focus()[0].setSelectionRange(cursorPosition, cursorPosition);
    //             });
    //         } else {
    //           var cell = $(".filters th").eq($(api.column(colIdx).header()).index());
    //           var title = $(cell).text();
    //           $(cell).html('<input type="hidden" />');
    //         }
    //       });
    //   },
    // });
    
  }

  activerequests() {
    $('#rr_servicerequeststable').DataTable().destroy();
    this.appointmentList = this.openAppointmentList;
    setTimeout(() => {
      this.drawPage();
    }, 2500);
  }
  closedrequests() {
    $('#rr_servicerequeststable').DataTable().destroy();
    this.appointmentList = this.closedAppointmentList;
    setTimeout(() => {
      this.drawPage();
    }, 2500);
  }

    // ngOnInit(): void {
    //   $('.onlyadmin').removeClass('dclass');
    //   $('.nav-link').click(function() {
    //     $('.nav-link').removeClass('active');
    //     $(this).addClass('active');
    //   })

      
    // }
}
