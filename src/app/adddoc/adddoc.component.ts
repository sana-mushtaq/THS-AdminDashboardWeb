import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-adddoc',
  templateUrl: './adddoc.component.html',
  styleUrls: ['./adddoc.component.css']
})
export class AdddocComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $("#nav_patientlist").addClass('active');
    $('.onlypatient').removeClass('dclass');
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 5000)
  }

  drawPage() {
    $('#nav_patientlist').addClass('active');
    $('.onlyadmin').removeClass('dclass');
  }
}
