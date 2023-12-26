import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as moment from "moment";
import { Subject } from "rxjs";
import { Appointment } from "src/model/appointments/appointment.model";
import { Patient } from "src/model/common/patient.model";
import { Sector } from "src/model/common/sector.model";
import { AppDataService } from "src/service/app-data.service";
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { AlertType, APIResponse, AppointmentTriggerSource } from "src/utils/app-constants";
import { LoaderService } from "../../utils/loader.service";
import { PatientsService } from "src/service/patient.service";
import Swal from "sweetalert2";
import { HttpClient } from '@angular/common/http';

declare var $: any;
declare var checkList: any;
declare var items: any;

@Component({
  selector: "app-appointments",
  templateUrl: "./appointments.component.html",
  styleUrls: ["./appointments.component.css"],
})
export class AppointmentsComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;

  appointmentList: Array<Appointment> = [];
  actualAppointmentList: Array<Appointment> = [];

  sectorList: Sector[] = [];

  selectedDateType = 1;
  filterStartDate;
  filterEndDate;
  selectedSectorId: number;
  opennewView = true;
  userRoles: any = {}

  jsonData: any;
  loaded: boolean = false;
  constructor(
    private patientService : PatientsService,
    private _appService: AppService,
    private _appUtil: UtilService,
    private router: Router,
    private _appDataService: AppDataService,
    private loaderService: LoaderService,
    private http: HttpClient
  ) {
    this._unsubscribeAll = new Subject();
    this.getSectors();
  }

  ngOnInit(): void {

    this.userRoles = JSON.parse(localStorage.getItem("SessionDetails"));
    
    this.http.get('assets/userRoles.json').subscribe((data: any) => {
     
      let role = this.userRoles['role']
      this.jsonData = data[role];
      this.loaded = true;
    });


    this.getServiceProviderAppointmentList("1");
    $(".onlyadmin").removeClass("dclass");
    $('.onlyservicerequests').show();
    $(".nav-link").click(function () {
      $(".nav-link").removeClass("active");
      $(this).addClass("active");
    });
    $(".dropdown-check-list").hover(function () {
      $("#items").toggle();
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 2500);
  }

  getServiceProviderAppointmentList(serviceProviderId: string) {
    let data = {
      sp: this.userRoles['sp']
    }
    this._appService.getServiceProviderAppointmentList(this.userRoles['sp']).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.actualAppointmentList = Appointment.getAppointmentList(response.upcomingAppointmentList);
          console.log( this.actualAppointmentList[0] );
          let resultPublishedExcludedAppointments = this.actualAppointmentList.filter((appointment) => appointment.appointmentCurrentStatus <= 6);
          let statusFiveAppointments = resultPublishedExcludedAppointments.filter((appointment) => appointment.appointmentCurrentStatus == 5);
          let sampleCollectedAppointments = statusFiveAppointments.filter((appointment) => appointment.serviceSectorId == 1);
          let statusFiveExcludedAppointments = resultPublishedExcludedAppointments.filter((appointment) => appointment.appointmentCurrentStatus != 5);

          let activeAppointmentList = [...sampleCollectedAppointments, ...statusFiveExcludedAppointments];
          this.appointmentList = activeAppointmentList.sort((a, b) => +b.appointmentId - +a.appointmentId);
        } else {
          console.log("Unable to get appointments");
        }
      },
      (err) => {
        console.log(err)
        console.log("Unable to get appointments");
      }
    );
  }

  viewAppointmentDetails(appointment) {
    var selectedAppointment = appointment;
    selectedAppointment["appointmentTriggerSource"] = AppointmentTriggerSource.AppointmentList;
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

    // $("#items").hover(function () {
    //   $("#items").toggle();
    // });


    // $('#example').DataTable();
    $("#appointmentstable thead tr").clone(true).addClass("filters").appendTo("#appointmentstable thead");

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

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  activerequests() {
    this.opennewView = true;
    this.loaderService.isLoading.next(true);
    $("#appointmentstable").DataTable().destroy();
    let resultPublishedExcludedAppointments = this.actualAppointmentList.filter((appointment) => appointment.appointmentCurrentStatus <= 6);
    let statusFiveAppointments = resultPublishedExcludedAppointments.filter((appointment) => appointment.appointmentCurrentStatus == 5);
    let sampleCollectedAppointments = statusFiveAppointments.filter((appointment) => appointment.serviceSectorId == 1);
    let statusFiveExcludedAppointments = resultPublishedExcludedAppointments.filter((appointment) => appointment.appointmentCurrentStatus != 5);

    let activeAppointmentList = [...sampleCollectedAppointments, ...statusFiveExcludedAppointments];
    this.appointmentList = activeAppointmentList.sort((a, b) => +b.appointmentId - +a.appointmentId);
    
    setTimeout(() => {
      this.redrawTable();
      $('#new').addClass('active');
      this.loaderService.isLoading.next(false);
    }, 2500);
  }

  closedrequests() {
    this.opennewView = false;
    this.loaderService.isLoading.next(true);
    $("#appointmentstable").DataTable().destroy();
    let completedAppointments = this.actualAppointmentList.filter(
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

  newrequests() {
    $('#active').addClass('active');
    $('#new').addClass('active');
    this.loaderService.isLoading.next(true);
    $("#appointmentstable").DataTable().destroy();
    let resultPublishedExcludedAppointments = this.actualAppointmentList.filter((appointment) => appointment.appointmentCurrentStatus == 0);
    // let statusFiveAppointments = resultPublishedExcludedAppointments.filter((appointment) => appointment.appointmentCurrentStatus == 5);
    // let sampleCollectedAppointments = statusFiveAppointments.filter((appointment) => appointment.serviceSectorId == 1);
    // let statusFiveExcludedAppointments = resultPublishedExcludedAppointments.filter((appointment) => appointment.appointmentCurrentStatus != 5);

    let activeAppointmentList = [...resultPublishedExcludedAppointments];
    this.appointmentList = activeAppointmentList.sort((a, b) => +b.appointmentId - +a.appointmentId);
    setTimeout(() => {
      this.redrawTable();
      $('#open').removeClass('active');
      $('#new').addClass('active');
      this.loaderService.isLoading.next(false);
    }, 2500);
  }

  openrequests() {
    $('#active').addClass('active');
    
    this.loaderService.isLoading.next(true);
    $("#appointmentstable").DataTable().destroy();
    let resultPublishedExcludedAppointments = this.actualAppointmentList.filter((appointment) => appointment.appointmentCurrentStatus > 0 && appointment.appointmentCurrentStatus <= 6);
    let statusFiveAppointments = resultPublishedExcludedAppointments.filter((appointment) => appointment.appointmentCurrentStatus == 5);
    let sampleCollectedAppointments = statusFiveAppointments.filter((appointment) => appointment.serviceSectorId == 1);
    let statusFiveExcludedAppointments = resultPublishedExcludedAppointments.filter((appointment) => appointment.appointmentCurrentStatus != 5);

    let activeAppointmentList = [...sampleCollectedAppointments, ...statusFiveExcludedAppointments];
    this.appointmentList = activeAppointmentList.sort((a, b) => +b.appointmentId - +a.appointmentId);
    setTimeout(() => {
      this.redrawTable();
      $('#open').addClass('active');
      $('#new').removeClass('active');
      this.loaderService.isLoading.next(false);
    }, 2500);
  }

  StatuFilterAppoinmentList(e){
    
    var statnew = $('#statusnew').prop('checked');
    var inprogress = $('#statusinprogress').prop('checked');

    this.loaderService.isLoading.next(true);
    $("#appointmentstable").DataTable().destroy();

    let resultPublishedExcludedAppointments = this.actualAppointmentList.filter((appointment) => appointment.appointmentCurrentStatus <= 6);
    let statusFiveAppointments = resultPublishedExcludedAppointments.filter((appointment) => appointment.appointmentCurrentStatus == 5);
    let sampleCollectedAppointments = statusFiveAppointments.filter((appointment) => appointment.serviceSectorId == 1);
    let statusFiveExcludedAppointments = resultPublishedExcludedAppointments.filter((appointment) => appointment.appointmentCurrentStatus != 5);

    let activeAppointmentList = [...sampleCollectedAppointments, ...statusFiveExcludedAppointments];
    if(statnew == true && inprogress == false) {
      this.appointmentList = activeAppointmentList.filter((appointment) => appointment.appointmentCurrentStatus ==0)
    }
    else if(inprogress == true && statnew == false) {
      this.appointmentList = activeAppointmentList.filter((appointment) => appointment.appointmentCurrentStatus > 0 && appointment.appointmentCurrentStatus <= 6)
    }
    else {
      this.appointmentList = activeAppointmentList.sort((a, b) => +b.appointmentId - +a.appointmentId)
    }

    setTimeout(() => {
      this.redrawTable();
      $('#open').removeClass('active');
      $('#new').addClass('active');
      this.loaderService.isLoading.next(false);
    }, 2500);    
  }

  StatuFilterAppoinmentList2(e) {

    var completed = $('#statuscompleted').prop('checked');
    var cancelled = $('#statuscancelled').prop('checked');

    this.loaderService.isLoading.next(true);
    $("#appointmentstable").DataTable().destroy();

    let completedAppointments = this.actualAppointmentList.filter(
      (appointment) => appointment.appointmentCurrentStatus >= 5 && appointment.appointmentCurrentStatus != 6
    );

    console.log(completedAppointments);

    if(completed == true && cancelled == false) {
      this.appointmentList = completedAppointments.filter(
        (appointment) => (appointment.appointmentCurrentStatus == 5 && appointment.serviceSectorId != 1) || appointment.appointmentCurrentStatus == 7
      );
    }
    else if(cancelled == true && completed == false) {
      
      this.appointmentList = completedAppointments.filter(
        (appointment) => ((appointment.appointmentCurrentStatus == 5 && appointment.serviceSectorId != 1) || appointment.appointmentCurrentStatus == 7) && appointment.appointmentBookingStatus == 2 
      );
    }
    else {
      this.appointmentList = completedAppointments.filter(
        (appointment) => (appointment.appointmentCurrentStatus == 5 && appointment.serviceSectorId != 1) || appointment.appointmentCurrentStatus == 7
      );
    }

    setTimeout(() => {
      this.redrawTable();
      $('#open').removeClass('active');
      $('#new').addClass('active');
      this.loaderService.isLoading.next(false);
    }, 2500);   

  }


  /**
   * VERIFY PAYMENT
   */
  verifyPayment( appointment : Appointment ){

    this.patientService.verifyPayment( { id : appointment.appointmentId } ).subscribe({
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
            this.createPayment( appointment );
          }
        }); 
      }
    });
  }

  verifyManualPayment( appointment : Appointment, index : any ){
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to mark this payment as paid & verified?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.patientService.approveManualPayment( { id : appointment.appointmentId } ).subscribe({
          next  : ( res : any ) => { 
            Swal.fire( 'Success', res.message, 'success' );
            this.appointmentList[index].paymentStatus= 'CAPTURED';
            this.appointmentList[index].appointmentStage= 'Scheduled';
          },
          error : ( err : any ) => {  Swal.fire( 'Error', err.error.message, 'error' ); }
        });
      }
    })
  }

  createPayment( appointment : Appointment ){
    let data : any = {};
    data.appointmentId = appointment.appointmentId;
    data.patient = { 
      mobileNumber : '', 
      emailId : appointment.patientEmail, 
      lastName : appointment.primaryPatientLastName, 
      firstName: appointment.primaryPatientFirstName
    };
    data.service = { name : appointment.serviceName };
    data.price   = appointment.servicePrice
    
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

  sendSMS( appointment : any ){
    if( !appointment.patientMobile || appointment.patientMobile == '' ){
      Swal.fire('Error', 'Patient mobile number does not exist', 'error');
      return;
    }

    this.patientService.sendSMS( { phone : appointment.patientMobile, url : appointment.paymentUrl } ).subscribe({
      next : ( res : any ) => { 
        Swal.fire('Success', res.message, 'success' );
      },
      error: ( err : any ) => { 
        Swal.fire('Error', err.message, 'error'); 
      }
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

  downloadAppointmentData() {
    if(this.appointmentList.length >0) {
        var csvFileData = [];
        //define the heading for each row of the data  
        var csv = 'SNo, Appointment ID, Transaction/Booking Date & Time, Patient Name, Mobile, Email ID, Slot Date & Time, Booking Status, Status, Payment Reference, Payment Method, Patient Source, Appointment Source, Collected Amount\n'
        
        this.appointmentList.forEach( ( row : Appointment, index : number ) => {
          let srNo = (index + 1);
          let appointmentId = row.appointmentDisplayId;
          let bookingDate = row.appointmentBookingDate;
          let patientName = row.primaryPatientFirstName +' '+ row.primaryPatientLastName;
          let mobile = row.patientMobile;
          let emailId = row.patientEmail;
          let slotDateTime = row.appointmentDate +' '+ row.appointmentTime;
          let bookingStatus = row.appointmentStatusMessage;
          let stage = row.appointmentStage;
          let paymentStatus = row.paymentStatus;
          let paymentMethod = row.paymentMethod;
          let patientSource = row.patientSource;
          let appointmentSource = row.refSourceName;
          let amount = parseFloat( row.servicePrice ).toFixed(2);
          let tmpArray = [srNo, appointmentId, bookingDate, patientName, mobile, emailId, slotDateTime, bookingStatus, stage, paymentStatus, paymentMethod, patientSource, appointmentSource, amount]
          csvFileData.push(tmpArray)
       });
        
       //merge the data with CSV  
        csvFileData.forEach(function(row) {  
            csv += row.join(',') 
            csv += "\n"
    
        })
        
        var hiddenElement = document.createElement('a');  
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);  
        hiddenElement.target = '_blank';  
        
        //provide the name for the CSV file to be downloaded  
        hiddenElement.download = 'Apponitments.csv';  
        hiddenElement.click();   

    } else {
      Swal.fire('Error', 'No data to download', 'error');
    }
  }
}
