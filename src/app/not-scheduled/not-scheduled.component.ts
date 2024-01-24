import { Component, OnInit } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { AppointmentDetails } from "src/model/appointments/appointment-details.model";
import { AppointmentStatusLog } from "src/model/appointments/appointment-status-log.model";
import { Appointment } from "src/model/appointments/appointment.model";
import { PractiseUser } from "src/model/common/practise-user.model";
import { AppDataService } from "src/service/app-data.service";
import { AppService } from "src/service/app.service";
import { PatientsService } from "src/service/patient.service";
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
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { BusinessToCustomerSchedulingService } from "src/service/business-to-customer-scheduling.service";
declare var $: any;
@Component({
  selector: "app-not-scheduled",
  templateUrl: "./not-scheduled.component.html",
  styleUrls: ["./not-scheduled.component.css"],
})
export class NotScheduledComponent implements OnInit {
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
  public paymentReferenceId : string = '';

  reviewToggle: boolean = false
  questionnaireForm: FormGroup;

  stars: boolean[][] = [];


  appReview: any = {}
  appReviewSp: any = {}
  userRoles: any = {}

  jsonData: any;
  loaded: boolean = false;

  calculatedHoursForReview:number=0;

  constructor(private patientService : PatientsService, private _b2c: BusinessToCustomerSchedulingService, private fb : FormBuilder, private _appService: AppService, private _appUtil: UtilService, private _appDataService: AppDataService,   private http: HttpClient) {
    this._unsubscribeAll = new Subject();

    this._appDataService.selectedAppointment.pipe(takeUntil(this._unsubscribeAll)).subscribe((appointment) => {
      if (appointment != null) {
        
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

     // Initialize the form
     this.questionnaireForm = this.fb.group({
      questions: this.fb.array([]),
      speedOfProvidingServer:  ['', Validators.required ],
      comments: ['', Validators.required ]
    });

    // Add questions based on language
    this.addQuestionsBasedOnLanguage();
  }

  private addQuestionsBasedOnLanguage(): void {
   
      this.addQuestion('تم تقديم الخدمة و جدولة الموعد خلال مدة زمنية مناسبة');
      this.addQuestion('مدة الموعد / موعد تقديم الخدمة');
      this.addQuestion('الأخصائي متمكن');
      this.addQuestion('تعامل الأخصائي');
   
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

    //now we will check if serverice provdier is availble at this time or not 
    let data ={
    serviceDate: this.appointmentDetails.serviceDate,
    serviceTime: this.appointmentDetails.serviceTime,
    serviceAssigneeId: this.selectedStaffId,
    appoinmentId: this.appointmentDetails.appointmentId
    }

    //now we will cancel user appointment
    this._b2c.checkSPAvailability(data).subscribe({
              
      next : ( ress : any ) => {
        console.log(ress)
        //in case of success the api returns 0 as a status code
        if( ress.status === APIResponse.Success) {
          
          if(ress.message.length>0) {
            Swal.fire("Error", "This service provider alerady has an appointment at selected date and time")
          }

        } else {

          Swal.fire("Error", "An error occurred. Try again")

        }
        
      },

      error: ( err: any ) => {
        
        console.log(err)
        
      }
  
    }) 

  }
  readerSelected(event) {
    this.selectedReaderId = event.target.value;
  }

  getAppointmentDetails(appointmentId: string) {
    this._appService.getAppoitmentDetails(appointmentId).subscribe(
      (response: any) => {

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
       
        if (response.status == APIResponse.Success) {
          this.paymentReferenceId = response.appointmentDetails.paymentReferenceId;
          this.appointmentDetails = AppointmentDetails.initalizeAppointmentDetails(response);

          console.log(this.appointmentDetails);

          this.populateAppoitmentStatusHistoryData();
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

  /**
   * VERIFY PAYMENT
   */
  verifyPayment(){
    this.patientService.verifyPayment( { id : this.appointmentDetails.appointmentId} ).subscribe({
      next : ( res : any ) => { 
        Swal.fire('Success', res.message, 'success' );
      },
      error: ( err : any ) => { 
        Swal.fire( {
          title: 'Error',
          icon: 'error',
          html: '<p>'+err.error.message+'</p>'+'<p>Do you want to generate new payment link?</p>',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Yes',
          denyButtonText: `Close`,
        }).then( (result : any) => {
          if (result.isConfirmed) {
            this.createPayment();
          }
        }); 
      }
    });
  }

  createPayment(){
    let data : any = {};
    data.appointmentId = this.appointmentDetails.appointmentId;
    data.patient = { 
      mobileNumber : this.appointmentDetails.mobileNumber, 
      emailId : this.appointmentDetails.email, 
      lastName : this.appointmentDetails.primaryPatientName, 
      firstName: this.appointmentDetails.lastName
    };
    data.service = { name : this.appointmentDetails.serviceDescription };
    data.price   = this.appointmentDetails.servicePrice
    
    this.patientService.createPayment( data ).subscribe({
      next  : ( res : any ) => { 
        Swal.fire( {
          title: 'Success',
          icon: 'success',
          html: '<p>'+res.message+'</p><br>'+'<input class="form-control" value="'+res.link+'"><br><p>You can share this link with patient to get it paid</p>',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Copy Link',
          denyButtonText: `Close`,
        }).then( (result : any) => {
          if (result.isConfirmed) {
            this.copyMessage( res.link );
          }
        });
      },
      error : ( err : any ) => { Swal.fire( 'Error', err.error.message, 'error' ); }
    });
  }

  // COPY TO CLIPBOARD
  copyMessage( val: string ){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    Swal.fire('Success', 'Copied to clipboard', 'success');
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

  isLabProgressBar(){
    let services : Array<any> = this.appointmentDetails?.requestedServices || [];
    if( services.length == 0 && ( this.selectedAppointment.serviceSectorId == 1 || this.selectedAppointment.serviceSectorId == 31 ) ){
      return true;
    }
    let doesLabExist : Array<any> = services.filter( ( service : any ) => {
      if( service.orgServiceSectorId == -1 && ( this.selectedAppointment.serviceSectorId == 1 || this.selectedAppointment.serviceSectorId == 31 ) ){
        return true;
      }
      else if( service.orgServiceSectorId == 1 ||  service.orgServiceSectorId == 31 ){
        return true;
      }else{
        return false;
      }
    });
    return ( doesLabExist.length > 0 ) ? true : false;
  }

  populateAppoitmentStatusHistoryData() {
    this.appointmentStatusHistory = [];
    if ( this.isLabProgressBar() ) {
      for (let index = 0; index < 8; index++) {
        let log = new AppointmentStatusLog();
        log.logStatus = AppointmentLogStatus.Open;
        switch (index) {
          case AppointmentStages.NotPaid:
            log.currentStatus = -1;
            log.statusText = "Not Scheduled";
            break;
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
        console.log(this.appointmentStatusHistory);
      }
    } else {
      for (let index = 0; index < 6; index++) {
        let log = new AppointmentStatusLog();
        log.logStatus = AppointmentLogStatus.Open;
        switch (index) {
          case AppointmentStages.NotPaid:
            log.currentStatus = -1;
            log.statusText = "Not Scheduled";
            break;
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
        console.log(this.appointmentStatusHistory);

      }
    }
  }

  updateAppointmentHistory() {
    
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

    if(this.appointmentStatusCompleted.length>0) {

      //calcluate the hours
    }
    console.log( this.appointmentDetails.statusHistory);
    let sh1 =  this.appointmentStatusHistory.find((history) => history.currentStatus == 3 && this.appointmentDetails.appointmentStatus===1) as any;
    let sh2 =  this.appointmentStatusHistory.find((history) => history.currentStatus == 4  && this.appointmentDetails.appointmentStatus===1) as any;
    let sh3 =  this.appointmentStatusHistory.find((history) => history.currentStatus == 5  && this.appointmentDetails.appointmentStatus===1) as any;

   console.log(sh1.updateTime)
    if(sh1 && sh2 && sh3) {

      //now we will calculate time the hours time 
       // Calculate total hours between sh1.updatedTime, sh2.updatedTime, and sh3.updatedTime
       let totalHours = this.calculateHoursDifference(sh1.updateTime, sh1.updateDate, sh3.updateTime, sh3.updateDate);

      // Now you have the total hours between sh1.updatedTime, sh2.updatedTime, and sh3.updatedTime
      console.log(`Total hours between sh1.updatedTime, sh2.updatedTime, and sh3.updatedTime: ${totalHours} hours`);

      this.calculatedHoursForReview = totalHours;

    }

  }

// Function to calculate the difference in hours between two timestamps
 calculateHoursDifference(time, date, time2, date2) {
  // Parse the timestamps into Date objects
  const start = this.parseTimestamp(time, date) as any;
  const end = this.parseTimestamp(time2, date2) as any;

  // Check if parsing was successful
  if (start && end) {
    // Calculate the time difference in milliseconds
    const timeDiff = end - start;

    // Convert milliseconds to hours
    const hours = timeDiff / (1000 * 60 * 60);

    return hours;
  } else {
    console.error('Invalid timestamp format');
    return null;
  }
}

// Function to parse timestamp into a Date object
 parseTimestamp(time, date) {
  // Split the date into day, month, and year
  const [day, month, year] = date.split('-');

  // Combine with the time to create a valid Date object
  const dateString = `${month}-${day}-${year} ${time}`;
  const parsedDate = new Date(dateString);

  // Check if parsing was successful
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate;
  } else {
    console.error('Invalid timestamp format');
    return null;
  }
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

  formatSelectedDate(selectedDate: Date) {
    console.log(selectedDate)
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  rescheduleAppointment1() {

    let userData = {
      user_id: this.appointmentDetails.patientId as any,
      gender: this.appointmentDetails.gender as any
    }
  
    let passUsersData = this.appointmentDetails.requestedServices.map(user => ({ ...user }));
  
    passUsersData.forEach(u => {
      u['user_id'] = u.patientId;
      u['id'] = u.patientId;
    });
  
    let allCurrentAppointmentData = this.appointmentDetails.requestedServices.map(app => ({ ...app }));
  
    allCurrentAppointmentData.forEach(app => {
      let getUser = passUsersData.filter(u => u['id'] === app.patientId);
      app['user'] = getUser[0];
    });
  
    // Split the date components
    let dateComponents = this.appointmentDetails.serviceDate.split("-");

    // Rearrange the components to the "YYYY-MM-DD" format
    let rearrangedDate = `${dateComponents[2]}-${dateComponents[1]}-${dateComponents[0]}`;

    let timeString = this.appointmentDetails.serviceTime;

    // Remove spaces from the time string
    let formattedTimeString = timeString.replace(/\s/g, '');

    
    let data = {
      appointment_id: this.appointmentDetails.appointmentId,
      preferredTime: formattedTimeString,
      preferredDate: rearrangedDate,
      allAppointmentData: [allCurrentAppointmentData],
      userData: passUsersData,
      branch_id: this.appointmentDetails.serviceProviderId,
      practice_user: this.appointmentDetails.parctiseUserId
    }

    //now we will cancel user appointment
    this._b2c.updateB2CAppointmentSp(data).subscribe({
              
      next : ( ress : any ) => {
        console.log(ress)
        //in case of success the api returns 0 as a status code
        if( ress.status === APIResponse.Success) {

          this.getAppointmentDetails(this.selectedAppointment.appointmentId);
          
          Swal.fire("Success", "Appointment is rescheuled")

        } else {

          Swal.fire("Error", "An error occurred. Try again")

        }
        
      },

      error: ( err: any ) => {
        
        console.log(err)
        
      }
  
    }) 

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
