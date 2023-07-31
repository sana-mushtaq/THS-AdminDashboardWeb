import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PractiseUser } from 'src/model/common/practise-user.model';
import { AppDataService } from 'src/service/app-data.service';
import { AppService } from 'src/service/app.service';
import { UtilService } from 'src/service/util.service';
import { AlertType, APIResponse, PractiseUserRoles } from 'src/utils/app-constants';
declare var $: any;

@Component({
  selector: 'app-nurse',
  templateUrl: './nurse.component.html',
  styleUrls: ['./nurse.component.css']
})
export class NurseComponent implements OnInit {

  practiseUsers: PractiseUser[] = [];
  constructor(
    private _appService: AppService,
    private _appDataService: AppDataService,
    private router: Router,
    private _appUtil: UtilService
  ) {
    this.getPractiseUserList(PractiseUserRoles.Nurse);
  }


  getPractiseUserList(userRole) {
    this._appService.getPractiseUserForSector(userRole).subscribe((response: any) => {
      if (response.status == APIResponse.Success) {
        this.practiseUsers = PractiseUser.getPracticeUserList(response.userList);
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
    $('.onlyadmin').removeClass('dclass');
    $('.onlyemployee').removeClass('dclass');
    $('.active-nurse').addClass('active');
  }

  careProviderStaffClicked(careProviderStaff) {
    this._appDataService.currentProviderStaffSubject.next(careProviderStaff);
    this.router.navigate(['../view-nurse']);
  }

  drawPage() {
    $('#nav_users').addClass('active');
    
    $('#el-table__expanded-cell').hide();
    $('#expanded').click(function () {
      //console.log("Working");
      $('#el-table__expanded-cell').toggle();
    })


    // $('#example').DataTable();

    $('#nursetable thead tr')
      .clone(true)
      .addClass('filters')
      .appendTo('#nursetable thead');


    var filterIndexes = [0, 1, 2, 3];

    var table = $('#nursetable').DataTable({
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
