import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { Appointment } from 'src/model/appointments/appointment.model';
import { Sector } from 'src/model/common/sector.model';
import { AppDataService } from 'src/service/app-data.service';
import { AppService } from 'src/service/app.service';
import { UtilService } from 'src/service/util.service';
import { Employeer  } from 'src/model/common/employeer-modal';
import { AlertType, APIResponse, AppointmentStatus, AppointmentTriggerSource} from 'src/utils/app-constants';
declare var $: any;
@Component({
  selector: 'app-service-requests',
  templateUrl: './service-requests.component.html',
  styleUrls: ['./service-requests.component.css']
})
export class ServiceRequestsComponent implements OnInit {
    private _unsubscribeAll: Subject<any>;

  appointmentList: Array<Appointment> = [];
  actualAppointmentList: Array<Appointment> = [];
  activeList;
  inactiveList;
  actualactiveList;
  actualinactiveList;

  sectorList: Sector[] = [];

  selectedDateType = 1;
  filterStartDate;
  filterEndDate;
  selectedSectorId: number;
  selectedLabId: number;
  EmployeerList: Employeer[] = [];
  LabLists;

  constructor(
    private _appService: AppService,
    private _appUtil: UtilService,
    private router: Router,
    private _appDataService: AppDataService
  ) {
    this._unsubscribeAll = new Subject();
    this.getEmployeerList();
    this.getLabListData();
    this.getOpenCorpAppointments(0);
    this.getCorpAppointmentHistory(0);
  }
  activerequests() {
    $('.in_ac_cards').hide();  
    $('.active_card_space').show();  
  }
  closedrequests() {
    $('.in_ac_cards').hide();  
    $('.inactive_card_space').show();  
  }

  ngOnInit(): void {

    $('.onlyemployer').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');
    $('.active-servicerequest').addClass('active');

    $('.nav-link').click(function() {
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
    })

    $('#servicerequeststable thead tr')
        .clone(true)
        .addClass('filters')
        .appendTo('#servicerequeststable thead');
        
    $('#closedservicerequeststable thead tr')
    .clone(true)
    .addClass('filters')
    .appendTo('#closedservicerequeststable thead');
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.redrawTable1();
    }, 2500);
    // setTimeout(() => {
    //     this.redrawTable2();
    //   }, 6500);
  }
  redrawTable1() {

        // $('#closedservicerequeststable thead tr')
        // .clone(true)
        // .addClass('filters')
        // .appendTo('#closedservicerequeststable thead');


        var filterIndexes = [0, 1, 2, 3, 4, 5, 6];

        var table = $('#servicerequeststable').DataTable({
            orderCellsTop: true,
            fixedHeader: true,
            initComplete: function () {
                var api = this.api();

                // For each column
                api
                    .columns()
                    .eq(0)
                    .each(function (colIdx) {

                        if ($.inArray(colIdx, filterIndexes) != -1) {
                            // Set the header cell to contain the input element
                            var cell = $('.filters th').eq(
                                $(api.column(colIdx).header()).index()
                            );
                            var title = $(cell).text();
                            $(cell).html('<input type="search" class="form-control form-control-sm" placeholder="" />');

                            // On every keypress in this input
                            $(
                                'input',
                                $('.filters th').eq($(api.column(colIdx).header()).index())
                            )
                                .off('keyup change')
                                .on('keyup change', function (e) {
                                    e.stopPropagation();

                                    // Get the search value
                                    $(this).attr('title', $(this).val());
                                    var regexr = '({search})'; //$(this).parents('th').find('select').val();

                                    var cursorPosition = this.selectionStart;
                                    // Search the column for that value
                                    api
                                        .column(colIdx)
                                        .search(
                                            this.value != ''
                                                ? regexr.replace('{search}', '(((' + this.value + ')))')
                                                : '',
                                            this.value != '',
                                            this.value == ''
                                        )
                                        .draw();

                                    $(this)
                                        .focus()[0]
                                        .setSelectionRange(cursorPosition, cursorPosition);
                                });

                        }
                        else {
                            var cell = $('.filters th').eq(
                                $(api.column(colIdx).header()).index()
                            );
                            var title = $(cell).text();
                            $(cell).html('<input type="hidden" />');
                        }
                    });
            },
        });
  }

  redrawTable2() {


    var filterIndexes = [0, 1, 2, 3, 4, 5, 6];

    var table = $('#closedservicerequeststable').DataTable({
    orderCellsTop: true,
    fixedHeader: true,
    initComplete: function () {
        var api = this.api();

        // For each column
        api
            .columns()
            .eq(0)
            .each(function (colIdx) {

                if ($.inArray(colIdx, filterIndexes) != -1) {
                    // Set the header cell to contain the input element
                    var cell = $('.filters th').eq(
                        $(api.column(colIdx).header()).index()
                    );
                    var title = $(cell).text();
                    $(cell).html('<input type="search" class="form-control form-control-sm" placeholder="" />');

                    // On every keypress in this input
                    $(
                        'input',
                        $('.filters th').eq($(api.column(colIdx).header()).index())
                    )
                        .off('keyup change')
                        .on('keyup change', function (e) {
                            e.stopPropagation();

                            // Get the search value
                            $(this).attr('title', $(this).val());
                            var regexr = '({search})'; //$(this).parents('th').find('select').val();

                            var cursorPosition = this.selectionStart;
                            // Search the column for that value
                            api
                                .column(colIdx)
                                .search(
                                    this.value != ''
                                        ? regexr.replace('{search}', '(((' + this.value + ')))')
                                        : '',
                                    this.value != '',
                                    this.value == ''
                                )
                                .draw();

                            $(this)
                                .focus()[0]
                                .setSelectionRange(cursorPosition, cursorPosition);
                        });

                }
                else {
                    var cell = $('.filters th').eq(
                        $(api.column(colIdx).header()).index()
                    );
                    var title = $(cell).text();
                    $(cell).html('<input type="hidden" />');
                }
            });
    },
    });
}


  viewAppointmentDetails(appointment) {
    // this._appDataService.currentAppointmentSubject.next(appointment);
    var selectedAppointment = appointment;
    selectedAppointment["appointmentTriggerSource"] = AppointmentTriggerSource.AppointmentList;
    this._appDataService.currentAppointmentSubject.next(selectedAppointment);
    this.router.navigate(['/request-non-schedule']);
  }

    getOpenCorpAppointments(corpId) {
        let params = {
            "corpId": Number(corpId),
            "appointmentType": AppointmentStatus.Completed
        };
        this._appService.getOpenCorpAppointments(params).subscribe((response: any) => {
            //debugger;
            if (response.status == APIResponse.Success) {
                this.activeList = Appointment.getServiceAppointmentList(response.appointmentList);
                this.actualactiveList = Appointment.getServiceAppointmentList(response.appointmentList);
            } else {
                console.log("Unable to get appointments");
            }
        }, err => {
            console.log("Unable to get appointments");
        });   
    }
    getCorpAppointmentHistory(corpId) {
        let params = {
            "corpId": Number(corpId),
            "appointmentType": AppointmentStatus.Cancelled
        };
        this._appService.getCorpAppointmentHistory(params).subscribe((response: any) => {
            if (response.status == APIResponse.Success) {
                this.inactiveList = Appointment.getServiceAppointmentList(response.appointmentList);
                this.actualinactiveList = Appointment.getServiceAppointmentList(response.appointmentList);
            } else {
                console.log("Unable to get appointments");
            }
        }, err => {
            console.log("Unable to get appointments");
        });   
    }
    getEmployeerList() {
        this._appService.getEmployeerList().subscribe((response: any) => {
            //debugger;
            if (response.status == APIResponse.Success) {
                this.EmployeerList = Employeer.getEmployeerList(response);                
            } else {
                console.log("Unable to get appointments");
            }
        }, err => {
            console.log("Unable to get appointments");
        });   
    }
    changeEmployeerId(event) {
        this.selectedSectorId = event.target.value;
    }

    changeLabId(event) {
        this.selectedLabId = event.target.value;
    }
    filterButtonClicked() {
        $("#servicerequeststable").DataTable().destroy();
        $("#closedservicerequeststable").DataTable().destroy();

        // var filteredActiveAppointments = [...this.actualactiveList];
        // var filteredInactiveAppointments = [...this.actualinactiveList];
    
        // if (this.selectedSectorId != null) {
        //   filteredActiveAppointments = filteredActiveAppointments.filter((appointment) => appointment.employeerId == this.selectedSectorId);
        //   filteredInactiveAppointments = filteredInactiveAppointments.filter((appointment) => appointment.employeerId == this.selectedSectorId);
        // }
    
        // setTimeout(() => {
        //   this.activeList = filteredActiveAppointments;
        //   this.inactiveList = filteredInactiveAppointments;
        // }, 100);

        this.getOpenCorpAppointments(this.selectedSectorId);
        this.getCorpAppointmentHistory(this.selectedSectorId);

    }
    // employeelistchange(event){
    //     this.selectedSectorId = event.target.value;
    // }
    getLabListData() {
        this._appService.getServiceProviderList().subscribe((response: any) => {
            if (response.status == APIResponse.Success) {
                this.LabLists = response.serviceProviderList;
            } else {
                console.log("Unable to get appointments");
            }
        }, err => {
            console.log("Unable to get appointments");
        });   
    }

}

