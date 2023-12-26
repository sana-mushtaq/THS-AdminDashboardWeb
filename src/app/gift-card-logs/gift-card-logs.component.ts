import { Component, OnInit } from '@angular/core';
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
  selector: 'app-gift-card-logs',
  templateUrl: './gift-card-logs.component.html',
  styleUrls: ['./gift-card-logs.component.css']
})
export class GiftCardLogsComponent implements OnInit {

  userRoles: any = {}

  jsonData: any;
  loaded: boolean = false;

    giftDetails;

    constructor(private _appService: AppService, private _appUtil: UtilService, private _appDataService: AppDataService,private http: HttpClient) { 
        this.getGiftLog();
    }

  ngOnInit(): void {

    this.userRoles = JSON.parse(localStorage.getItem("SessionDetails"));
    
    this.http.get('assets/userRoles.json').subscribe((data: any) => {
     
      let role = this.userRoles['role']
      this.jsonData = data[role];
      this.loaded = true;
    });
    
    $('.onlygift').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');

    $("#files_department").on('change', function (e) {
      $('.pip').html('');
      var files = e.target.files;
      var file = files[0]
      var fileReader = new FileReader();
      fileReader.onload = function (e) {
        var file = e.target;
        $('<span class="pip">' + '<img class="imageThumb" src="' + e.target.result + '" />' + '<br/><span class="remove">Remove image</span>' + "</span>"
        ).insertAfter("#beforefilepreview");
        $(".remove").click(function () {
          $(this).parent(".pip").remove();
        });
      };
      fileReader.readAsDataURL(file);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 1500);
  }

  drawPage() {
    $('#gift-logs-table thead tr')
        .clone(true)
        .addClass('filters')
        .appendTo('#gift-logs-table thead');


    var filterIndexes = [0, 1, 2, 3, 4, 5, 6];

    var table = $('#gift-logs-table').DataTable({
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

  getGiftLog() {
    this._appService.getGiftLog().subscribe(
        (response: any) => {
            debugger;
          if (response.status == APIResponse.Success) {
            this.giftDetails = response.giftDetails;
          }
        },
        (err) => {
          Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
        }
      );
  }

}
