import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PractiseUser } from 'src/model/common/practise-user.model';
import { AppDataService } from 'src/service/app-data.service';

@Component({
  selector: 'app-view-physician',
  templateUrl: './view-physician.component.html',
  styleUrls: ['./view-physician.component.css']
})
export class ViewPhysicianComponent implements OnInit {

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
  }

}
