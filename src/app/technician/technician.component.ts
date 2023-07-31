import { Component, OnInit } from '@angular/core';
import { PractiseUser } from 'src/model/common/practise-user.model';
import { AppService } from 'src/service/app.service';
import { UtilService } from 'src/service/util.service';
import { AlertType, APIResponse, PractiseUserRoles } from 'src/utils/app-constants';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-technician',
  templateUrl: './technician.component.html',
  styleUrls: ['./technician.component.css']
})
export class TechnicianComponent implements OnInit {

  practiseUsers: PractiseUser[] = [];
  modalTitle: string;

  constructor(
    private _appService: AppService,
    private _appUtil: UtilService,
    private router: Router
  ) {
    this.getPractiseUserList(PractiseUserRoles.LabTech);
  }


  getPractiseUserList(sectorId) {
    this._appService.getPractiseUserForSector(sectorId).subscribe((response: any) => {
      if (response.status == APIResponse.Success) {
        this.practiseUsers = PractiseUser.getPracticeUserList(response.userList);
        // console.log(this.practiseUsers);
      } else {
        console.log("server error");
      }
    }, err => {
      console.log("server error");
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 2500)
  }

  ngOnInit(): void {
    $('.onlyemployee').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');
    $('.active-technician').addClass('active');
  }

  drawPage() {
    $('#nav_users').addClass('active');

    $('#el-table__expanded-cell').hide();
    $('#expanded').click(function () {
      $('#el-table__expanded-cell').toggle();
    })


    $('#techniciantable thead tr')
      .clone(true)
      .addClass('filters')
      .appendTo('#techniciantable thead');


    var filterIndexes = [0, 1, 2, 3];

    var table = $('#techniciantable').DataTable({
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
              var cell = $('.filters th').eq(
                $(api.column(colIdx).header()).index()
              );
              var title = $(cell).text();
              $(cell).html('<input type="search" class="form-control form-control-sm" placeholder="" />');
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

  technicianEdit(userId) {

  }

}
