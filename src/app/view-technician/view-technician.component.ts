import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-technician',
  templateUrl: './view-technician.component.html',
  styleUrls: ['./view-technician.component.css']
})
export class ViewTechnicianComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // $('#nav_users').addClass('active');
    $('.onlyemployee').removeClass('dclass');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 1000)
  }

  drawPage() {
    $('#nav_users').addClass('active');
  }

}
