import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from "rxjs";
import { AppointmentDetails } from "src/model/appointments/appointment-details.model";
import { AppointmentStatusLog } from "src/model/appointments/appointment-status-log.model";
import { Appointment } from "src/model/appointments/appointment.model";
import { PractiseUser } from "src/model/common/practise-user.model";
import { AppDataService } from "src/service/app-data.service";
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import * as moment from "moment";
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
declare var $: any;

@Component({
  selector: 'app-lab-request-non-schedule',
  templateUrl: './lab-request-non-schedule.component.html',
  styleUrls: ['./lab-request-non-schedule.component.css']
})
export class LabRequestNonScheduleComponent implements OnInit {

  private _unsubscribeAll: Subject<any>;
  practiseUsers: PractiseUser[] = [];
  selectedAppointment: Appointment;
  selectedStaffId: string;
  selectedReaderId: string;
  selectedTime: string;
  selectedDate : string;
  appointmentDetails: AppointmentDetails = new AppointmentDetails();

  appointmentStatusHistory: AppointmentStatusLog[] = [];

  appointmentStatusOpen: AppointmentStatusLog[] = [];
  appointmentStatusCompleted: AppointmentStatusLog[] = [];
  appointmentStatusInProgress: AppointmentStatusLog;
  stepTest = 5;
  docFileList: File[];
  LabResultInput;
  LabResultSubmit;
  employerNotes;
  careGiverNotes;

  constructor(private _appService: AppService, private _appUtil: UtilService, private _appDataService: AppDataService) {
    this._unsubscribeAll = new Subject();
    this.getPractiseUserList();
    this._appDataService.selectedAppointment.pipe(takeUntil(this._unsubscribeAll)).subscribe((appointment) => {
      if (appointment != null) {
        debugger;
        this.selectedAppointment = appointment;
        this.populateAppoitmentStatusHistoryData();

        this.getAppointmentDetails(this.selectedAppointment.appointmentId);

        // switch (this.selectedAppointment.serviceSectorId) {
        //   case ServiceSectors.LabTech:
        //     this.getPractiseUserList(PractiseUserRoles.LabTech.toString());
        //     break;
        //   case ServiceSectors.Nurse:
        //     this.getPractiseUserList(PractiseUserRoles.Nurse.toString());
        //     break;
        //   case ServiceSectors.Physiotherapist:
        //     this.getPractiseUserList(PractiseUserRoles.Physiotherapist.toString());
        //     break;
        //   case ServiceSectors.GeneralPhysician:
        //     this.getPractiseUserList(PractiseUserRoles.GeneralPhysician.toString());
        //     break;
        //   default:
        //     this.getPractiseUserList(this.selectedAppointment.serviceSectorId.toString());
        //     break;
        // }
      }
    });
    
  }

  ngOnInit(): void {
    this.drawUI();
    $('.onlylabmenu').removeClass('dclass');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 500);
  }

  drawPage() {
    // $("#files").on("change", function (e) {
    //   var files = e.target.files,
    //     filesLength = files.length;
    //   for (var i = 0; i < filesLength; i++) {
    //     var f = files[i];
    //     var fileReader = new FileReader();
    //     fileReader.onload = function (e) {
    //       var file = e.target;
    //       $(
    //         '<span class="pip">' + '<img class="imageThumb" src="' + e.target.result + '" />' + '<br/><span class="remove">Remove image</span>' + "</span>"
    //       ).insertAfter("#beforefilepreview");
    //       $(".remove").click(function () {
    //         $(this).parent(".pip").remove();
    //       });
    //     };
    //     fileReader.readAsDataURL(f);
    //   }
    //   console.log(files);
    // });

    // $("#nav_appointment").addClass("active");
  }

  assignStaffForAppointment() {
    // this.confirmStaffForAppointment(this.selectedStaffId, this.selectedAppointment.appointmentId, this.selectedDate, this.selectedTime);
    this.confirmStaffForAppointment(this.selectedStaffId, this.selectedAppointment.appointmentId, this.selectedDate, this.selectedTime, this.employerNotes, this.careGiverNotes);
  }

  staffSelected(event) {
    this.selectedStaffId = event.target.value;
  }
  SetTime(event) {
    this.selectedTime = event.target.value;
  }
  SetDate(event) {
    console.log(moment(event.target.value).format('DD/MM/YYYY'));
    this.selectedDate = moment(event.target.value).format('DD/MM/YYYY');
  }

  getAppointmentDetails(appointmentId: string) {
    this._appService.getBusinessAppointmentDetailsForLab(appointmentId).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          debugger;
          this.appointmentDetails = AppointmentDetails.initalizeEmployeeAppointmentDetails(response);
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
  updateDisableBtns(){
    if(this.appointmentDetails.appointmentCurrentStatus >= 6) {
      this.LabResultInput = true;
      this.LabResultSubmit = true;
    }
    else {
      this.LabResultInput = false;
      this.LabResultSubmit = false;
    }
  }

  populateAppoitmentStatusHistoryData() {
    if (this.selectedAppointment.serviceSectorId == 1) {
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

  confirmStaffForAppointment(staffId: string, appointmentId: string, serviceDate: string, serviceTime: string,employerNotes: string, careGiverNotes: string) {
    this._appService.confirmLabBusinessAppoinmentSchedule(staffId, appointmentId, serviceDate, serviceTime, employerNotes, careGiverNotes).subscribe(
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
  
  getPractiseUserList() {
    this._appService.getServiceProviderStaffList().subscribe(
      (response: any) => {
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
    

    if (UtilService.checkMaxFileSize(files, MaxFileSize.FIVEMB)) {
      if (this.docFileList == null) {
        this.docFileList = [];
      }

      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        file.formatedSize = UtilService.formatSizeUnits(file.size);
        if(file.type != 'application/pdf'){
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
            '<span class="pip">' + '<img class="imageThumb" src="../../assets/images/dummy_pdf_img.png" />' + '<br/><span class="remove">Remove PDF</span>' + "</span>"
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
      this._appService.uploadfileToServer(file, FileUploadType.EmployeeAppointmentResult, appointmentId).subscribe(
        (response: any) => {
          if (response.status == APIResponse.Success) {
            successfileUpload = successfileUpload + 1;
            this.getAppointmentDetails(this.selectedAppointment.appointmentId);
            $('.remove').click();
            if (successfileUpload == this.docFileList.length) {
              this.closeAppointment();
            }
          } else {
            // Swal.fire("Error.", "Error in uploading test result. Please try again later..!", "error");
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

  assignReaderForAppointment() {
    this._appService.assignCareGiverForResultReding(this.selectedReaderId, this.selectedAppointment.appointmentId).subscribe(
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

  openReaderSelectionWindow(){
    $('#reader_schedule_modal').show();
  }
  readerSelected(event){
    this.selectedReaderId = event.target.value;
  }
  EmployeerNotes(e) {
    // alert(e.value);
    this.employerNotes = e.value;
  }

  CaregiverNotes(e) {
    // alert(e.value);
    this.careGiverNotes = e.value;
  }

}
