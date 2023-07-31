import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-application',
  templateUrl: './edit-application.component.html',
  styleUrls: ['./edit-application.component.css']
})
export class EditApplicationComponent implements OnInit {

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
