import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PractiseUser } from 'src/model/common/practise-user.model';
import { AppDataService } from 'src/service/app-data.service';
declare let $: any;

@Component({
  selector: 'app-view-nurse',
  templateUrl: './view-nurse.component.html',
  styleUrls: ['./view-nurse.component.css']
})


export class ViewNurseComponent implements OnInit {
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
    // $('#nav_users').addClass('active');
    var element = document.getElementById("nav_users");
    element.classList.add("active");
    $('.onlyemployee').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 1000)
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  drawPage() {
    $('#nav_users').addClass('active');
  }

}
