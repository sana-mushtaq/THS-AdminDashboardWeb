import { Component, OnInit } from "@angular/core";
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { APIResponse } from "src/utils/app-constants";
import { AdminDashboard } from "src/model/dashboard/admin-dashboard.model";
import { Sector } from "src/model/common/sector.model";
import * as moment from "moment";
import { Appointment } from "src/model/appointments/appointment.model";
import { HttpClient } from '@angular/common/http';


declare var $: any;
@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.css"],
})
export class ReportsComponent implements OnInit {
  LabLists;
  sectorList;
  selectedSectorId;
  selectedLabId;
  filterStartDate;
  filterEndDate;
  reportDetailList;
  totReportListAppoint = 0;
  ReportListCollectedAmount;

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
    this.ReportListCollectedAmount = "0";

    //$("#appointmentstable thead tr").clone(true).addClass("filters").appendTo("#appointmentstable thead");
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.redrawTable();
    }, 2500);
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

  sectorSelected(event) {
    this.selectedSectorId = event.value;
  }

  labSelected(event) {
    this.selectedLabId = event.value;
  }

  startDateChanged(event) {
    debugger;
    this.filterStartDate = event.target.value;

    // this.filterStartDate = moment(event.target.value, "yyyy/mm/dd");
  }

  endDateChanged(event) {
    debugger;
    this.filterEndDate = event.target.value;

    // this.filterEndDate = moment(event.target.value, "yyyy/mm/dd");
  }

  filterButtonClicked() {
    $("#reportDetailList").DataTable().destroy();
    let params = {
      dateType: 1,
      serviceProviderId: this.selectedLabId,
      serviceSectorId: this.selectedSectorId,
      fromDate: this.filterStartDate,
      toDate: this.filterEndDate,
    };
    this._appService.getAppointmentsReport(params).subscribe(
      (response: any) => {
        debugger;
        console.log(response);
        if (response.status == APIResponse.Success) {
          this.reportDetailList = Appointment.getReportDetailList(response.appointmentList);
          this.totReportListAppoint = this.reportDetailList.length;
          var sum = 0;
          this.reportDetailList.forEach((element) => {
            sum = sum + element.totalServiceCost;
          });
          this.ReportListCollectedAmount = sum.toFixed(2);
          setTimeout(() => {
            this.redrawTable();
          }, 2500);
        } else {
          console.log("Unable to get appointments");
        }
      },
      (err) => {
        console.log("Unable to get appointments");
      }
    );
  }

  clearButtonClicked() {
    $("#reportDetailList").DataTable().destroy();
    this.reportDetailList = [];
    this.totReportListAppoint = 0;
    this.ReportListCollectedAmount = 0;
    setTimeout(() => {
      this.redrawTable();
    }, 1000);
  }

  redrawTable() {
    var filterIndexes = [1, 2, 3, 4, 5, 6, 8, 9];

    var table = $("#reportDetailList").DataTable({
      dom: "Bfrtip",
      buttons: ["copy", "csv", "excel", "print"],
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
