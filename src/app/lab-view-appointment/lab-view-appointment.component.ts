import { Component, OnInit } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { AppointmentDetails } from "src/model/appointments/appointment-details.model";
import { AppointmentStatusLog } from "src/model/appointments/appointment-status-log.model";
import { Appointment } from "src/model/appointments/appointment.model";
import { PractiseUser } from "src/model/common/practise-user.model";
import { AppDataService } from "src/service/app-data.service";
import { AppService } from "src/service/app.service";
import { BusinessToCustomerSchedulingService } from "src/service/business-to-customer-scheduling.service";
import { UtilService } from "src/service/util.service";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

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
  selector: "app-lab-view-appointment",
  templateUrl: "./lab-view-appointment.component.html",
  styleUrls: ["./lab-view-appointment.component.css"],
})
export class LabViewAppointmentComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  practiseUsers: PractiseUser[] = [];
  selectedAppointment: Appointment;
  selectedStaffId: string;
  appointmentDetails: AppointmentDetails = new AppointmentDetails();

  appointmentStatusHistory: AppointmentStatusLog[] = [];

  appointmentStatusOpen: AppointmentStatusLog[] = [];
  appointmentStatusCompleted: AppointmentStatusLog[] = [];
  appointmentStatusInProgress: AppointmentStatusLog;
  stepTest = 5;
  docFileList: File[];

  reviewToggle: boolean = false
  questionnaireForm: FormGroup;

  stars: boolean[][] = [];


  appReview: any = {}
  appReviewSp: any = {}

  constructor(private _appService: AppService, private _appUtil: UtilService, private _appDataService: AppDataService, private fb : FormBuilder, private _b2c: BusinessToCustomerSchedulingService,) {
    this._unsubscribeAll = new Subject();

    this._appDataService.selectedAppointment.pipe(takeUntil(this._unsubscribeAll)).subscribe((appointment) => {
      if (appointment != null) {
        debugger;
        this.selectedAppointment = appointment;
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
    $('.onlylabmenu').removeClass('dclass');
    this.drawUI();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 500);
  }

  drawPage() {
    $("#files").on("change", function (e) {
      var files = e.target.files,
        filesLength = files.length;
      for (var i = 0; i < filesLength; i++) {
        var f = files[i];
        var fileReader = new FileReader();
        fileReader.onload = function (e) {
          var file = e.target;
          $(
            '<span class="pip">' + '<img class="imageThumb" src="' + e.target.result + '" />' + '<br/><span class="remove">Remove image</span>' + "</span>"
          ).insertAfter("#beforefilepreview");
          $(".remove").click(function () {
            $(this).parent(".pip").remove();
          });
        };
        fileReader.readAsDataURL(f);
      }
      console.log(files);
    });

    $("#nav_appointment").addClass("active");
  }

  assignStaffForAppointment() {
    this.confirmStaffForAppointment(this.selectedStaffId, this.selectedAppointment.appointmentId);
  }

  staffSelected(event) {
    this.selectedStaffId = event.target.value;
  }

  getAppointmentDetails(appointmentId: string) {
    debugger;
    this._appService.getLabAppointmentDetails(appointmentId).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {

          if(response.appointmentDetails.review === "") {

            this.appReview = {};
  
          } else {
  
            this.appReview = JSON.parse(response.appointmentDetails.review) || {};
  
          }
  
          if(response.appointmentDetails.provider_review === "") {
  
            this.appReviewSp = {};
  
          } else {
  
            this.appReviewSp = JSON.parse(response.appointmentDetails.provider_review) || {};
  
          }

          this.appointmentDetails = AppointmentDetails.initalizeAppointmentDetails(response);
          this.updateAppointmentHistory();
        } else {
          Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
        }
      },
      (err) => {
        Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
      }
    );
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

  confirmStaffForAppointment(staffId: string, appointmentId: string) {
    this._appService.assignCareGiverForLabAppointment(staffId, appointmentId).subscribe(
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

  getPractiseUserList(roleId: string) {
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
        this.docFileList.push(file);
      }
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
            if (successfileUpload == this.docFileList.length) {
              this.closeAppointment();
            }
          } else {
            Swal.fire("Error.", "Error in uploading test result. Please try again later..!", "error");
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

  cancelAppointment() {
    Swal.fire({
      title: "Are you sure you want to cancel this appointment?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
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
  get questions(): FormArray {
    return this.questionnaireForm.get('questions') as FormArray;
  }

  addQuestion(questionText: string): void {
    const questionGroup = this.fb.group({
      text: questionText,
      rating: [null, Validators.required],
    });

    this.questions.push(questionGroup);
    this.stars.push(Array(5).fill(false));
  }

  onSubmit(): void {
  
    if (this.questionnaireForm.valid) {
  
      let data = {

        appointment_data: JSON.stringify(this.questionnaireForm.value),
        appointment_id: this.appointmentDetails.appointmentId
  
      }

      console.log(data)
  
      //now we will cancel user appointment
      this._b2c.appointmentReviewSp(data).subscribe({
                
        next : ( ress : any ) => {
  
          //in case of success the api returns 0 as a status code
          if( ress.status === APIResponse.Success) {
            
            this.appReviewSp = this.questionnaireForm.value
            
          }
          
        },
        error: ( err: any ) => {
          
          console.log(err)
          
        }
    
      }) 
  
    } else {
  
      // Mark the form and controls as dirty to trigger error messages
      this.questionnaireForm.markAllAsTouched();
  
    }
  
  }

  rate(questionIndex: number, starIndex: number): void {
    const ratingControl = this.questions.at(questionIndex).get('rating') as FormControl;
    ratingControl.setValue(starIndex + 1);

    // Update stars array to reflect the selected rating
    this.stars[questionIndex] = Array(5).fill(false).map((_, i) => i <= starIndex);
  }

  openReview() {

    this.reviewToggle = true
  
  }
  closeReviewPopup() {

    this.reviewToggle = false

  }
}
