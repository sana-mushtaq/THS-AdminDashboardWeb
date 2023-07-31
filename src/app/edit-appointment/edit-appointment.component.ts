import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.component.html',
  styleUrls: ['./edit-appointment.component.css']
})
export class EditAppointmentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $('#nav_settings').addClass('active');
  }
  ngAfterViewInit() {
    $('.onlysetting').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');
    setTimeout(() => {
      this.drawPage();
    }, 500)
  }

  drawPage() {
    $('#nav_settings').addClass('active');
  }
}
