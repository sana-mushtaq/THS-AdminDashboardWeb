import { Component, OnInit } from '@angular/core';
import { Appointment } from 'src/model/appointments/appointment.model';
import { Patient } from 'src/model/common/patient.model';
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { AlertType, APIResponse, FileUploadType, AppointmentTriggerSource } from "src/utils/app-constants";
import { Router } from "@angular/router";
import { AppDataService } from "src/service/app-data.service";
import { Subject, takeUntil } from "rxjs";
import * as moment from "moment";
import Swal from 'sweetalert2';
import { LoaderService } from "../../utils/loader.service";

declare var $: any;
@Component({
  selector: 'app-view-patient',
  templateUrl: './view-patient.component.html',
  styleUrls: ['./view-patient.component.css']
})
export class ViewPatientComponent implements OnInit {

  private _unsubscribeAll: Subject<any>;
  
  constructor(
    private _appService: AppService, 
    private _appUtil: UtilService,
    private router: Router,
    private _appDataService: AppDataService,
    private loaderService: LoaderService
  ) { 
        this._unsubscribeAll = new Subject();
        this._appDataService.selectedAppointment.pipe(takeUntil(this._unsubscribeAll)).subscribe((patientId) => {
          if (patientId != null) {
            debugger;            
            var patient = patientId.patientId;
            this.getPatientDetails(patient);
          }
        });
    }

  patientDetails;
  patientAppointmentDetails;
  patientDependents;
  dependentGenderSelect;
  appointmentList;

  ngOnInit(): void {
    $("#appointmentstable thead tr").clone(true).addClass("filters").appendTo("#appointmentstable thead");
    $('.onlyemployee').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');
    $(".nav-link").click(function () {
      $(".nav-link").removeClass("active");
      $(this).addClass("active");
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.redrawTable();
    }, 2500);
  }

  redrawTable() {
    var filterIndexes = [1, 2, 3, 4, 5, 6, 8, 9];

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

  activerequests() {
    this.loaderService.isLoading.next(true);
    $("#appointmentstable").DataTable().destroy();
    let resultPublishedExcludedAppointments = this.patientAppointmentDetails.filter((appointment) => appointment.appointmentCurrentStatus <= 6);
    let statusFiveAppointments = resultPublishedExcludedAppointments.filter((appointment) => appointment.appointmentCurrentStatus == 5);
    let sampleCollectedAppointments = statusFiveAppointments.filter((appointment) => appointment.serviceSectorId == 1);
    let statusFiveExcludedAppointments = resultPublishedExcludedAppointments.filter((appointment) => appointment.appointmentCurrentStatus != 5);

    let activeAppointmentList = [...sampleCollectedAppointments, ...statusFiveExcludedAppointments];
    this.appointmentList = activeAppointmentList.sort((a, b) => +b.appointmentId - +a.appointmentId);
    setTimeout(() => {
      this.redrawTable();
      this.loaderService.isLoading.next(false);
    }, 2500);
  }

  closedrequests() {
    this.loaderService.isLoading.next(true);
    $("#appointmentstable").DataTable().destroy();
    let completedAppointments = this.patientAppointmentDetails.filter(
      (appointment) => appointment.appointmentCurrentStatus >= 5 && appointment.appointmentCurrentStatus != 6
    );
    this.appointmentList = completedAppointments.filter(
      (appointment) => (appointment.appointmentCurrentStatus == 5 && appointment.serviceSectorId != 1) || appointment.appointmentCurrentStatus == 7
    );
    // this.appointmentList = activeAppointments.filter((appointment) => appointment.appointmentCurrentStatus != 6 && appointment.serviceSectorId != 1);
    setTimeout(() => {
      this.redrawTable();
      this.loaderService.isLoading.next(false);
    }, 2500);
  }
  getPatientDetails(patient) {
    let params = {
      patientId : patient
    }
    this._appService.getPatientSummary(params).subscribe(
      (response: any) => {
        debugger;
        if (response.status == APIResponse.Success) {
          this.patientDetails = Patient.getPatientsDetail(response);
          this.patientDependents = Patient.getPatientDependent(response);
          this.patientAppointmentDetails = Appointment.getAppointmentList(response.appointmentHistory);

          let resultPublishedExcludedAppointments = this.patientAppointmentDetails.filter((appointment) => appointment.appointmentCurrentStatus <= 6);
          let statusFiveAppointments = resultPublishedExcludedAppointments.filter((appointment) => appointment.appointmentCurrentStatus == 5);
          let sampleCollectedAppointments = statusFiveAppointments.filter((appointment) => appointment.serviceSectorId == 1);
          let statusFiveExcludedAppointments = resultPublishedExcludedAppointments.filter((appointment) => appointment.appointmentCurrentStatus != 5);

          let activeAppointmentList = [...sampleCollectedAppointments, ...statusFiveExcludedAppointments];
          this.appointmentList = activeAppointmentList.sort((a, b) => +b.appointmentId - +a.appointmentId);
        } else {
          console.log("Unable to get service packages");
        }
      },
      (err) => {
        console.log("Unable to get Patient Details");
      }
    );
  }

  viewAppointmentDetails(appointment) {
    var selectedAppointment = appointment;
    selectedAppointment["appointmentTriggerSource"] = AppointmentTriggerSource.AppointmentList;
    this._appDataService.currentAppointmentSubject.next(selectedAppointment);
    this.router.navigate(["/not-scheduled"]);
  }
  postNewDependent() {
    let params = {
        "primaryPatientId":this.patientDetails[0].patientId,
        "firstName":$('#patientFirstName').val(),
        "lastName":$('#patientLastName').val(),
        "mobile":"",
        "email":$('#patientEmail').val(),
        "dob":$('#patientDob').val(),
        "gender":this.dependentGenderSelect,
        "nationality":"0",
        "nationalId":$('#patientNationalId').val()
    }
    this._appService.addPatientDependent(params).subscribe({
      next : (response: any) => {
        console.log( response );
        if (response.status == APIResponse.Success) {
          this.close();
          Swal.fire("Success.", "Dependent has been Added successfully..!", "success");
          this.getPatientDetails(this.patientDetails[0].patientId);
        } else {
          Swal.fire("Error.", "Something Went Wrong", "error");
        }
      },
      error : ( err ) => {
        Swal.fire("Error.", err.error.message, "error");
      }
    });

  }
  
  showNewDependentView() {
    $("#newDependentModal").show();
  }

  close() {
    $("#newDependentModal").hide();
  }

  DependentgenderSelected(e) {
    this.dependentGenderSelect = e.value;
  }
}
