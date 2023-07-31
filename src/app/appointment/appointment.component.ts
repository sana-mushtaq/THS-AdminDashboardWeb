import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $('#nav_settings').addClass('active');
    $('.onlysetting').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 500)
  }

  drawPage() {
    $('#nav_settings').addClass('active');
  }
}
