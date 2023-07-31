import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PractiseUser } from 'src/model/common/practise-user.model';
import { AppDataService } from 'src/service/app-data.service';

@Component({
  selector: 'app-view-physiotherapist',
  templateUrl: './view-physiotherapist.component.html',
  styleUrls: ['./view-physiotherapist.component.css']
})
export class ViewPhysiotherapistComponent implements OnInit {

  private _unsubscribeAll: Subject<any>;
  selectedPracticeUser: PractiseUser;
  constructor(
    private _appDataService: AppDataService
  ) {
    this._unsubscribeAll = new Subject();
    this._appDataService.selectedProviderStaff.pipe(takeUntil(this._unsubscribeAll)).subscribe(staff => {
      if (staff != null) {
        this.selectedPracticeUser = staff;
      }
    });
  }


  ngOnInit(): void {

    $('.onlyemployee').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');

    $('#tab-0').css("color", "#fff");
    $('#tab-0').css("background-color", "#2652f3");
    $('#tab-0').css("border", "1px solid #2652f3");

    $('#tab-0').click(function () {
      $('#pane-0').show();
      $('#tab-0').css("color", "#fff");
      $('#tab-0').css("background-color", "#2652f3");
      $('#tab-0').css("border", "1px solid #2652f3");

      $('#tab-1').css("color", "#909399");
      $('#tab-1').css("background-color", "#fff");
      $('#tab-1').css("border", "1px solid #aeb6c8");

      $('#pane-1').css("display", "none");
    })
    $('#tab-1').click(function () {
      $('#pane-1').show();
      $('#tab-1').css("color", "#fff");
      $('#tab-1').css("background-color", "#2652f3");
      $('#tab-1').css("border", "1px solid #2652f3");

      $('#tab-0').css("color", "#909399");
      $('#tab-0').css("background-color", "#fff");
      $('#tab-0').css("border", "1px solid #aeb6c8");
      $('#pane-0').css("display", "none");
    })
  }

}
