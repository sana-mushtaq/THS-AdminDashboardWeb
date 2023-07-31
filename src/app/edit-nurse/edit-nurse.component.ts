import { Component, OnInit } from '@angular/core';
declare let $:any;
@Component({
  selector: 'app-edit-nurse',
  templateUrl: './edit-nurse.component.html',
  styleUrls: ['./edit-nurse.component.css']
})
export class EditNurseComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    var element = document.getElementById("nav_users");
    element.classList.add("active");
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 1000)
  }

  drawPage() {
    $('#nav_users').addClass('active');
    $('.onlyadmin').removeClass('dclass');
  }
}
