import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PractiseUser } from 'src/model/common/practise-user.model';
import { AppDataService } from 'src/service/app-data.service';
import { AppService } from 'src/service/app.service';
import { UtilService } from 'src/service/util.service';
import { AlertType, APIResponse, PractiseUserRoles } from 'src/utils/app-constants';
declare var $: any;

@Component({
  selector: 'app-generalphysician',
  templateUrl: './generalphysician.component.html',
  styleUrls: ['./generalphysician.component.css']
})
export class GeneralphysicianComponent implements OnInit {

  practiseUsers: PractiseUser[] = [];
  constructor(
    private _appService: AppService,
    private _appUtil: UtilService,
    private _appDataService: AppDataService,
    private router: Router
  ) {
    this.getPractiseUserList(PractiseUserRoles.GeneralPhysician);
  }

  getPractiseUserList(userRole) {
    this._appService.getPractiseUserForSector(userRole).subscribe((response: any) => {
      if (response.status == APIResponse.Success) {
        this.practiseUsers = PractiseUser.getPracticeUserList(response.userList);
      } else {
        console.log("Unable to get practice users");
      }
    }, err => {
      console.log("Unable to get practice users");
    });
  }

  ngOnInit(): void {
    $('.onlyemployee').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');
    $('.active-physician').addClass('active');

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 2500)
  }

  careProviderStaffClicked(careProviderStaff) {
    this._appDataService.currentProviderStaffSubject.next(careProviderStaff);
    this.router.navigate(['../view-physician']);
  }

  drawPage() {

    $('#nav_users').addClass('active');

    $('#el-table__expanded-cell').hide();
    $('#expanded').click(function () {
      $('#el-table__expanded-cell').toggle();
    })

    $('#generalPhysicianTable thead tr')
      .clone(true)
      .addClass('filters')
      .appendTo('#generalPhysicianTable thead');


    var filterIndexes = [0, 1, 2, 3];

    var table = $('#generalPhysicianTable').DataTable({
      orderCellsTop: true,
      fixedHeader: true,
      initComplete: function () {
        var api = this.api();
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

                  $(this).attr('title', $(this).val());
                  var regexr = '({search})';
                  var cursorPosition = this.selectionStart;
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

}
