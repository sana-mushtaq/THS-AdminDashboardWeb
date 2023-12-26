import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from "rxjs";
import { AppointmentDetails } from "src/model/appointments/appointment-details.model";
import { AppointmentStatusLog } from "src/model/appointments/appointment-status-log.model";
import { Appointment } from "src/model/appointments/appointment.model";
import { PractiseUser } from "src/model/common/practise-user.model";
import { AppDataService } from "src/service/app-data.service";
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { HttpClient } from '@angular/common/http';

import {
  AlertType,
  APIResponse,
  AppointmentLogStatus,
  AppointmentStages,
  FileUploadType,
  MaxFileSize,
  PractiseUserRoles,
  ServiceSectors,
} from "src/utils/app-constants";
import Swal from "sweetalert2";
import * as moment from "moment";
declare var $: any;

@Component({
  selector: 'app-escort-not-scheduled',
  templateUrl: './escort-not-scheduled.component.html',
  styleUrls: ['./escort-not-scheduled.component.css']
})
export class EscortNotScheduledComponent implements OnInit {

  private _unsubscribeAll: Subject<any>;
  practiseUsers: PractiseUser[] = [];
  selectedAppointment: Appointment;
  selectedStaffId: string;
  selectedReaderId: string;
  appointmentDetails: AppointmentDetails = new AppointmentDetails();

  appointmentStatusHistory: AppointmentStatusLog[] = [];

  appointmentStatusOpen: AppointmentStatusLog[] = [];
  appointmentStatusCompleted: AppointmentStatusLog[] = [];
  appointmentStatusInProgress: AppointmentStatusLog;
  appointmentTriggerSource: string;
  stepTest = 5;
  docFileList: File[];
  LabResultInput;
  LabResultSubmit;
  adminNotesValue;
  rescheduleNotesValue;
  selectedTime: string;
  selectedDate : string;

  collectedAmount;
  paymentReference;

  userRoles: any = {}

  jsonData: any;
  loaded: boolean = false;

  constructor(private _appService: AppService, private _appUtil: UtilService, private _appDataService: AppDataService, private http: HttpClient) {
    this._unsubscribeAll = new Subject();

    this._appDataService.selectedAppointment.pipe(takeUntil(this._unsubscribeAll)).subscribe((appointment) => {
      if (appointment != null) {
        debugger;
        this.selectedAppointment = appointment;
        this.appointmentTriggerSource = appointment.appointmentTriggerSource;
        this.populateAppoitmentStatusHistoryData();

        this.getAppointmentDetails(this.selectedAppointment.appointmentId);

        switch (this.selectedAppointment.serviceSectorId) {
          case ServiceSectors.LabTech:
            this.getPractiseUserList(PractiseUserRoles.LabTech.toString());
            break;
          case ServiceSectors.Nurse:
            this.getPractiseUserList(PractiseUserRoles.Nurse.toString());
            break;
          case ServiceSectors.Physiotherapist:
            this.getPractiseUserList(PractiseUserRoles.Physiotherapist.toString());
            break;
          case ServiceSectors.GeneralPhysician:
            this.getPractiseUserList(PractiseUserRoles.GeneralPhysician.toString());
            break;
          default:
            this.getPractiseUserList(this.selectedAppointment.serviceSectorId.toString());
            break;
        }
      }
    });
  }

  ngOnInit(): void {
    this.userRoles = JSON.parse(localStorage.getItem("SessionDetails"));
    
    this.http.get('assets/userRoles.json').subscribe((data: any) => {
     
      let role = this.userRoles['role']
      this.jsonData = data[role];
      this.loaded = true;
    });
    this.drawUI();
    $(".onlyadmin").removeClass("dclass");
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 500);
  }

  drawPage() {
    // $("#files").on("change", function (e) {

    // });

    $("#nav_appointment").addClass("active");
  }

  assignStaffForAppointment() {
    this.confirmStaffForAppointment(this.selectedStaffId, this.selectedAppointment.appointmentId, this.adminNotesValue);
  }

  staffSelected(event) {
    this.selectedStaffId = event.target.value;
  }
  readerSelected(event) {
    this.selectedReaderId = event.target.value;
  }

  getAppointmentDetails(appointmentId: string) {
    
    this._appService.getEscortServiceRequestDetails(appointmentId).subscribe(
      (response: any) => {
        debugger;
        if (response.status == APIResponse.Success) {
          this.appointmentDetails = AppointmentDetails.initalizeAppointmentDetails(response);
          this.updateAppointmentHistory();
          this.updateDisableBtns();
        } else {
          Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
        }
      },
      (err) => {
        Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
      }
    );
  }

  updateDisableBtns() {
    if (this.appointmentTriggerSource == "1" && this.appointmentDetails.appointmentCurrentStatus >= 6) {
      this.LabResultInput = true;
      this.LabResultSubmit = true;
    } else {
      this.LabResultInput = false;
      this.LabResultSubmit = false;
    }
  }

  populateAppoitmentStatusHistoryData() {
    if (this.selectedAppointment.serviceSectorId == 1 || this.selectedAppointment.serviceSectorId == 31) {
      for (let index = 0; index < 8; index++) {
        let log = new AppointmentStatusLog();
        log.logStatus = AppointmentLogStatus.Open;
        switch (index) {
          case AppointmentStages.Scheduled:
            log.currentStatus = 0;
            log.statusText = "Scheduled";
            break;
          case AppointmentStages.Accpeted:
            log.currentStatus = 1;
            log.statusText = "Accepted";
            break;
          case AppointmentStages.OnTheWay:
            log.currentStatus = 2;
            log.statusText = "On the way";
            break;
          case AppointmentStages.ArrivedDesination:
            log.currentStatus = 3;
            log.statusText = "Arrived destination";
            break;
          case AppointmentStages.ServiceInProgress:
            log.currentStatus = 4;
            log.statusText = "Sample collection";
            break;
          case AppointmentStages.ServiceCompleted:
            log.currentStatus = 5;
            log.statusText = "Sample collection completed";
            break;
          case AppointmentStages.SampleSubmittedToLab:
            log.currentStatus = 6;
            log.statusText = "Sample submitted";
            break;
          case AppointmentStages.ResultPublished:
            log.currentStatus = 7;
            log.statusText = "Result published";
            break;
          default:
            break;
        }
        this.appointmentStatusHistory.push(log);
      }
    } else {
      for (let index = 0; index < 6; index++) {
        let log = new AppointmentStatusLog();
        log.logStatus = AppointmentLogStatus.Open;
        switch (index) {
          case AppointmentStages.Scheduled:
            log.currentStatus = 0;
            log.statusText = "Scheduled";
            break;
          case AppointmentStages.Accpeted:
            log.currentStatus = 1;
            log.statusText = "Accepted";
            break;
          case AppointmentStages.OnTheWay:
            log.currentStatus = 2;
            log.statusText = "On the way";
            break;
          case AppointmentStages.ArrivedDesination:
            log.currentStatus = 3;
            log.statusText = "Arrived destination";
            break;
          case AppointmentStages.ServiceInProgress:
            log.currentStatus = 4;
            log.statusText = "Service in progress";
            break;
          case AppointmentStages.ServiceCompleted:
            log.currentStatus = 5;
            log.statusText = "Service completed";
            break;
          default:
            break;
        }
        this.appointmentStatusHistory.push(log);
      }
    }
  }

  updateAppointmentHistory() {
    debugger;
    this.appointmentDetails.statusHistory.sort((a, b) => a.currentStatus - b.currentStatus);
    this.appointmentDetails.statusHistory[this.appointmentDetails.statusHistory.length - 1].logStatus = AppointmentLogStatus.InProgress;

    this.appointmentDetails.statusHistory.forEach((statusLog) => {
      let log = this.appointmentStatusHistory.find((history) => history.currentStatus == statusLog.currentStatus);
      if (log) {
        log.updateDate = statusLog.updateDate;
        log.updateTime = statusLog.updateTime;
        log.latitude = statusLog.latitude;
        log.longitude = statusLog.longitude;
        log.address = statusLog.address;
        log.logStatus = statusLog.logStatus;
      }
    });
    this.appointmentStatusCompleted = this.appointmentStatusHistory.filter((history) => history.logStatus == AppointmentLogStatus.Completed);
    this.appointmentStatusOpen = this.appointmentStatusHistory.filter((history) => history.logStatus == AppointmentLogStatus.Open);
    this.appointmentStatusInProgress = this.appointmentStatusHistory.find((history) => history.logStatus == AppointmentLogStatus.InProgress);
  }

  confirmStaffForAppointment(staffId: string, appointmentId: string, adminNotesValue: string) {
    this._appService.assignStaffForAppointment(staffId, appointmentId, adminNotesValue).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          Swal.fire("Congratulations.", "Staff has been assigned successfully..!", "success");
          $("#schedule_modal").hide();
          this.getAppointmentDetails(this.selectedAppointment.appointmentId);
        } else {
          Swal.fire("Error.", "Unable to assign staff. Please try again later..!", "error");
        }
      },
      (err) => {
        Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
      }
    );
  }

  assignReaderForAppointment() {
    this._appService.assignCareGiverForResultReding(this.selectedReaderId, this.selectedAppointment.appointmentId).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          Swal.fire("Congratulations.", "Staff has been assigned successfully..!", "success");
          $("#reader_schedule_modal").hide();
          this.getAppointmentDetails(this.selectedAppointment.appointmentId);
        } else {
          Swal.fire("Error.", "Unable to assign staff. Please try again later..!", "error");
        }
      },
      (err) => {
        Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
      }
    );
  }

  getPractiseUserList(roleId: string) {
    this._appService.getPractiseUserForSector(roleId).subscribe(
      (response: any) => {
        debugger;
        if (response.status == APIResponse.Success) {
          this.practiseUsers = PractiseUser.getPracticeUserList(response.userList);
        } else {
          console.log("server error");
        }
      },
      (err) => {
        console.log("server error");
      }
    );
  }

  handleFileInput(event) {
    let files = event.target.files;

    if (UtilService.checkMaxFileSize(files, MaxFileSize.TWENTYMB)) {
      if (this.docFileList == null) {
        this.docFileList = [];
      }

      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        file.formatedSize = UtilService.formatSizeUnits(file.size);
        if (file.type != "application/pdf") {
          Swal.fire("Error.", "Please Upload PDF File Only..!", "error");
          return;
        }
        this.docFileList.push(file);
      }

      var filesLength = files.length;
      for (var i = 0; i < filesLength; i++) {
        var f = files[i];
        var fileReader = new FileReader();
        fileReader.onload = function (e) {
          var file = e.target;
          $(
            '<span class="pip">' +
              '<img class="imageThumb" src="../../assets/images/dummy_pdf_img.png" />' +
              '<br/><span class="remove">Remove PDF</span>' +
              "</span>"
          ).insertAfter("#beforefilepreview");
          $(".remove").click(function () {
            $(this).parent(".pip").remove();
          });
        };
        fileReader.readAsDataURL(f);
      }
      console.log(files);
    } else {
      Swal.fire("Error.", "Max file size allowed is 5 MB..!", "error");
    }
  }

  submitAppointmentResult() {
    if (this.docFileList.length > 0) {
      this.postAppointmentResult(this.selectedAppointment.appointmentId);
    }
  }

  postAppointmentResult(appointmentId) {
    let successfileUpload = 0;
    this.docFileList.forEach((file) => {
      this._appService.uploadfileToServer(file, FileUploadType.AppointmentResult, appointmentId).subscribe(
        (response: any) => {
          if (response.status == APIResponse.Success) {
            successfileUpload = successfileUpload + 1;
            this.getAppointmentDetails(this.selectedAppointment.appointmentId);
            $(".remove").click();
            if (successfileUpload == this.docFileList.length) {
              this.closeAppointment();
            }
          } else {
            //Swal.fire("Error.", "Error in uploading test result. Please try again later..!", "error");
          }
        },
        (err) => {
          Swal.fire("Error.", "Error in uploading test result. Please try again later..!", "error");
        }
      );
    });
  }

  openTestResult(fileUrl) {
    var strWindowFeatures = "location=yes,height=570,width=520,scrollbars=yes,status=yes";
    window.open(fileUrl, "_blank", "");
    // window.open(fileUrl, "_blank", strWindowFeatures);
  }

  // cancelAppointment() {
  //   Swal.fire({
  //     title: "Are you sure you want to cancel this appointment?",
  //     showDenyButton: true,
  //     confirmButtonText: "Yes",
  //     denyButtonText: "No",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.confirmAppointmentCancellation(this.selectedAppointment.appointmentId);
  //     }
  //   });
  // }

  cancelAppointment() {
    Swal.fire({
      title: "Are you sure you want to cancel this appointment?",
      text: "Enter Note for Cancellation",
      input: "textarea",
      inputAttributes: {
        oninput: "this.value = this.value.toUpperCase()",
      },
      showCancelButton: true,
    }).then((result) => {
      var text = result.value;
      if (text) {
          Swal.fire("Congratulations.", "Appoinment Cancelled", "success");
          this.confirmAppointmentCancellation(this.selectedAppointment.appointmentId);
      }
    });
  }

  confirmAppointmentCancellation(appointmentId: string) {
    this._appService.cancelAppointment(appointmentId).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          let refundAmount = response.refund;
          Swal.fire(
            "Success.",
            "Appointment has been cancelled successfully successfully. SAR " + refundAmount + " has been refunded to user wallet.",
            "success"
          );
          this.getAppointmentDetails(this.selectedAppointment.appointmentId);
        } else {
          Swal.fire("Error.", "Error in cancelling appointment. Please try again later..!", "error");
        }
      },
      (err) => {
        Swal.fire("Error.", "Error in cancelling appointment. Please try again later..!", "error");
      }
    );
  }

  closeAppointment() {
    let params = {
      userId: 1,
      appointmentStatus: 7,
      appointmentId: this.selectedAppointment.appointmentId,
      lat: "15.000001",
      lng: "15.000001",
      address: "Taib Admin",
    };
    this._appService.updateAppointmentStatus(params).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          Swal.fire("Congratulations.", "Test result has been posted successfully..!", "success");
        } else {
          Swal.fire("Error.", "Error in uploading test result. Please try again later..!", "error");
        }
      },
      (err) => {
        Swal.fire("Error.", "Error in uploading test result. Please try again later..!", "error");
      }
    );
  }

  openStaffSelectionWindow() {
    $("#schedule_modal").show();
  }

  openRescheduleWindow() {
    $("#reschedule_modal").show();
  }

  openReaderSelectionWindow() {
    $("#reader_schedule_modal").show();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  drawUI() {
    $("#schedule").click(function () {
      //console.log("Working");
      $("#schedule_modal").show();
    });
    $(".close").click(function () {
      $("#schedule_modal").hide();
      $("#reader_schedule_modal").hide();
      $("#reschedule_modal").hide();
    });

    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function () {
        this.classList.toggle("actives");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    }
  }
  deleteAppointment(resultid) {
    Swal.fire({
      title: "Are you Sure Want to Delete the Result?",
      text: "Enter the Secret Key to Delete",
      input: "text",
      inputAttributes: {
        oninput: "this.value = this.value.toUpperCase()",
      },
      showCancelButton: true,
    }).then((result) => {
      var text = result.value;
      if (text) {
        if (text == "DELETE") {
          Swal.fire("Congratulations.", "Lab Result Deleted", "success");
          this.deleteLabResult(resultid);
        } else {
          Swal.fire("Error.", "Invalid confirmation code. Please enter a valid confirmation code to delete the file.", "error");
        }
      }
    });
  }

  deleteLabResult(resultid) {
    let params = {
      resultId: resultid,
      appointmentId: this.selectedAppointment.appointmentId,
    };
    this._appService.deleteLabResultFile(params).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.getAppointmentDetails(this.selectedAppointment.appointmentId);
        }
      },
      (err) => {
        Swal.fire("Error.", "Error in Deleting Lab result. Please try again later..!", "error");
      }
    );
  }

  adminNotes(e) {
    // alert(e.value);
    this.adminNotesValue = e.value;
  }
  RescheduleNotes(e) {
    // alert(e.value);
    this.rescheduleNotesValue = e.value;
  }

  SetTime(event) {
    this.selectedTime = event.target.value;
  }
  SetDate(event) {
    console.log(moment(event.target.value).format('DD/MM/YYYY'));
    this.selectedDate = moment(event.target.value).format('DD/MM/YYYY');
  }

  rescheduleForAppointment() {
    let params= {
      "appointmentId":this.selectedAppointment.appointmentId,
      "serviceDate": this.selectedDate,
      "serviceTime": this.selectedTime,
      "collectedAmount": this.collectedAmount,
      "paymentRefernce": this.paymentReference,
      "rescheduleNote": this.rescheduleNotesValue
    };
    this._appService.rescheduleAppointment(params).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          Swal.fire("Congratulations.", "Appointment Rescheduled Successfully..!", "success");
          $("#reschedule_modal").hide();
          this.getAppointmentDetails(this.selectedAppointment.appointmentId);
        } else {
          Swal.fire("Error.", "Unable to Rescheduled Appointment. Please try again later..!", "error");
        }
      },
      (err) => {
        Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
      }
    );
  }

  verifyInsurance() {
    let params= {
      "insuranceVerificationStatus":1,
      "insuranceRecordId":this.appointmentDetails.patientInsuraceDetails[0].insuranceRecordId
    };

    this._appService.updatePatientInsuranceStatus(params).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          Swal.fire("Congratulations.", "Verification Successfull..!", "success");
          $("#reschedule_modal").hide();
          this.getAppointmentDetails(this.selectedAppointment.appointmentId);
        } else {
          Swal.fire("Error.", "Unable to Verify Isurance. Please try again later..!", "error");
        }
      },
      (err) => {
        Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
      }
    );
  }

  setCollectedAmount(e) {
    this.collectedAmount = e.value;
  }

  setPaymentReference(e) {
    this.paymentReference = e.value;
  }


}
